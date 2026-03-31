<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Contract\Database;

class AuthController extends Controller
{
    protected $auth;
    protected $database;

   public function __construct()
    {
        // Path to your JSON file
        $path = storage_path('app/private/firebase/serviceAccount.json');
        
        // 1. Read the Project ID from your JSON file automatically
        $json = json_decode(file_get_contents($path), true);
        $projectId = $json['project_id'];

        // 2. Initialize the Factory with everything explicitly defined
        $factory = (new Factory)
            ->withServiceAccount($path)
            ->withProjectId($projectId) // Forces the SDK to use the correct project
            ->withDatabaseUri(env('FIREBASE_DATABASE_URL'));

        $this->auth = $factory->createAuth();
        $this->database = $factory->createDatabase();
    }
    public function register(Request $request)
    {
        // Professional Validation
        $validator = Validator::make($request->all(), [
            'username' => 'required|alpha|min:4',
            'email'    => 'required|email',
            'password' => [
                'required', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*?&]/'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // 1. Create User in Firebase Auth
            $userRecord = $this->auth->createUser([
                'email' => $request->email,
                'password' => $request->password,
                'displayName' => $request->username,
            ]);

            // 2. Store Meaningful Data in Realtime Database
            // This replaces Firestore and works perfectly on Windows
            $this->database->getReference('users/' . $userRecord->uid)->set([
                'username' => $request->username,
                'email' => $request->email,
                'uid' => $userRecord->uid,
                'created_at' => now()->toDateTimeString(),
                'status' => 'online'
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Account created successfully!',
                'uid' => $userRecord->uid
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration Error: ' . $e->getMessage()
            ], 500);
        }
    }
}