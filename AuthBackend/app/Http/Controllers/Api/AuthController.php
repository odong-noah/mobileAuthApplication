<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\OTPMail;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Contract\Database;

class AuthController extends Controller
{
    protected $auth;
    protected $database;

    public function __construct()
    {
        $path = storage_path('app/private/firebase/serviceAccount.json');
        $json = json_decode(file_get_contents($path), true);
        $projectId = $json['project_id'];

        $factory = (new Factory)
            ->withServiceAccount($path)
            ->withProjectId($projectId) 
            ->withDatabaseUri(env('FIREBASE_DATABASE_URL'))
            ->withFirestoreClientConfig(['transport' => 'rest']);

        $this->auth = $factory->createAuth();
        $this->database = $factory->createDatabase();
    }

    /**
     * LOGIN LOGIC
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            $signInResult = $this->auth->signInWithEmailAndPassword($request->email, $request->password);
            $uid = $signInResult->firebaseUserId();
            $userData = $this->database->getReference('users/' . $uid)->getValue();

            if (!$userData) {
                return response()->json(['status' => 'error', 'message' => 'User profile not found.'], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful!',
                'data' => [
                    'uid'      => $uid,
                    'username' => $userData['username'],
                    'email'    => $userData['email'],
                    'token'    => $signInResult->idToken(),
                ]
            ], 200);

        } catch (\Kreait\Firebase\Exception\Auth\InvalidPassword $e) {
            return response()->json(['status' => 'error', 'message' => 'The password you entered is incorrect.'], 401);
        } catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
            return response()->json(['status' => 'error', 'message' => 'No account exists with this email address.'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Login failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * STEP 1: Generate OTP (Handles Register and Reset Password)
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'type'  => 'required|in:register,reset' // Added type validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $userExists = true;
            try {
                $this->auth->getUserByEmail($request->email);
            } catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
                $userExists = false;
            }

            // Logic Gate: Check if email state matches the request type
            if ($request->type === 'register' && $userExists) {
                return response()->json(['status' => 'error', 'message' => 'This email is already registered.'], 422);
            }

            if ($request->type === 'reset' && !$userExists) {
                return response()->json(['status' => 'error', 'message' => 'No account found with this email.'], 404);
            }

            $otp = random_int(1000, 9999);
            Cache::put('otp_' . $request->email, $otp, now()->addMinutes(15));
            Mail::to($request->email)->send(new OTPMail($otp));

            return response()->json([
                'status' => 'success',
                'message' => 'Verification code sent to ' . $request->email
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Mail Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * STEP 2: Verify code and Update Password
     */
    public function resetPassword(Request $request)
    {
        // Strict professional validation matching Register rules
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'otp'      => 'required|numeric|digits:4',
            'password' => [
                'required', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*?&]/'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // 1. Verify OTP from Cache
        $storedOtp = Cache::get('otp_' . $request->email);
        if (!$storedOtp || $storedOtp != $request->otp) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired verification code.'], 403);
        }

        try {
            // 2. Find User and Update in Firebase Auth
            $user = $this->auth->getUserByEmail($request->email);
            $this->auth->updateUser($user->uid, ['password' => $request->password]);

            // 3. Clear Cache
            Cache::forget('otp_' . $request->email);

            return response()->json(['status' => 'success', 'message' => 'Password reset successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Reset failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * STEP 2: Register Logic (Unchanged but ensuring it works with OTP)
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|alpha|min:4',
            'email'    => 'required|email',
            'otp'      => 'required|numeric|digits:4',
            'password' => ['required', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*?&]/'],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $storedOtp = Cache::get('otp_' . $request->email);
        if (!$storedOtp || $storedOtp != $request->otp) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired verification code.'], 403);
        }

        try {
            $userRecord = $this->auth->createUser([
                'email' => $request->email,
                'password' => $request->password,
                'displayName' => $request->username,
            ]);

            $this->database->getReference('users/' . $userRecord->uid)->set([
                'username'   => $request->username,
                'email'      => $request->email,
                'uid'        => $userRecord->uid,
                'created_at' => now()->toDateTimeString(),
                'status'     => 'online'
            ]);

            Cache::forget('otp_' . $request->email);
            return response()->json(['status' => 'success', 'message' => 'Account created!', 'uid' => $userRecord->uid], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Firebase Error: ' . $e->getMessage()], 500);
        }
    }
}