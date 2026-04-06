<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #439acc; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px; text-align: center; color: #334155; }
        .content h2 { margin-bottom: 10px; font-size: 20px; }
        .content p { line-height: 1.6; font-size: 16px; color: #64748b; }
        .otp-box { background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; display: inline-block; padding: 20px 40px; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #439acc; letter-spacing: 8px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        .footer p { margin: 5px 0; }
        .expiry { color: #ef4444; font-weight: bold; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo/Header -->
        <div class="header">
            <h1>{{ config('app.name') }}</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h2>Verify Your Account</h2>
            <p>Hello,</p>
            <p>Thank you for choosing <strong>{{ config('app.name') }}</strong>. Use the following one-time password (OTP) to complete your request:</p>
            
            <div class="otp-box">
                <span class="otp-code">{{ $otp }}</span>
            </div>

            <p class="expiry">This code is valid for 15 minutes.</p>
            
            <p>If you did not request this code, you can safely ignore this email. Someone may have typed your email address by mistake.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>