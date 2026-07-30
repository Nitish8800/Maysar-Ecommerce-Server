export const getOTPEmailTemplate = (name: string, otp: string, purpose: string): { subject: string; html: string } => {
  const isSignup = purpose === "signup";
  const title = isSignup ? "Verify Your Account" : "Log In to Your Account";
  const recipientName = name || "Valued Customer";
  const subject = "Your Verification Code";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background: #111827; padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
    .body { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #111827; }
    .otp-box { background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px dashed #cbd5e1; }
    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 0; }
    .note { font-size: 14px; color: #6b7280; margin-top: 20px; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Maysar</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${recipientName},</div>
      <p>Your verification code for ${title.toLowerCase()} is:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p class="note">This OTP expires in <strong>5 minutes</strong>.</p>
      <p class="note">If you didn't request this, ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Maysar. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
};
