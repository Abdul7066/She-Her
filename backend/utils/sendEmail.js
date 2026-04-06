const nodemailer = require('nodemailer');

// Create transporter lazily so it reads .env values at call time (not at require time)
const createTransporter = () => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your.gmail@gmail.com') {
    throw new Error('EMAIL_USER is not configured in .env');
  }
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here') {
    throw new Error('EMAIL_PASS is not configured in .env');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Test that the email transporter can connect.
 * Call this on server start to get an early warning in the console.
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email transporter ready:', process.env.EMAIL_USER);
  } catch (err) {
    console.warn('⚠️  Email transporter not ready:', err.message);
    console.warn('   → Set EMAIL_USER and EMAIL_PASS in .env to enable email verification');
  }
};

/**
 * Sends a styled HTML verification email.
 * @param {string} to    - Recipient email address
 * @param {string} name  - Recipient name
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (to, name, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { margin:0; padding:0; background:#faf8fc; font-family:'Inter',Arial,sans-serif; }
        .wrapper { max-width:580px; margin:40px auto; }
        .header { background:linear-gradient(135deg,#2c2a30 0%,#4a3060 60%,#8a5c7a 100%); padding:40px; text-align:center; border-radius:16px 16px 0 0; }
        .header h1 { color:#fff; font-size:28px; margin:0; letter-spacing:1px; }
        .header p { color:rgba(255,255,255,0.7); font-size:13px; margin:8px 0 0; letter-spacing:3px; text-transform:uppercase; }
        .body { background:#fff; padding:40px; border:1px solid #eee; border-top:none; }
        .body h2 { color:#2c2a30; font-size:22px; margin:0 0 12px; }
        .body p { color:#706d75; font-size:15px; line-height:1.7; margin:0 0 24px; }
        .btn { display:inline-block; background:linear-gradient(135deg,#c96b88,#bca0dc); color:#fff; text-decoration:none; padding:14px 36px; border-radius:30px; font-weight:600; font-size:14px; letter-spacing:1px; text-transform:uppercase; }
        .footer { background:#f5f3f8; padding:20px 40px; text-align:center; border-radius:0 0 16px 16px; border:1px solid #eee; border-top:none; }
        .footer p { color:#aaa; font-size:12px; margin:0; }
        .url { word-break:break-all; color:#9b7bb6; font-size:12px; margin-top:20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>She &amp; Her</h1>
          <p>Haute Couture · Verified Clientele</p>
        </div>
        <div class="body">
          <h2>Welcome, ${name} 🌸</h2>
          <p>Thank you for joining <strong>She &amp; Her</strong>. Please verify your email address by clicking the button below.</p>
          <p style="text-align:center;">
            <a href="${verifyUrl}" class="btn">Verify My Email</a>
          </p>
          <p>This link will expire in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.</p>
          <p class="url">Or copy this URL: ${verifyUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} She &amp; Her. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"She & Her" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✉️ Verify your She & Her account',
    html,
  });
};

/**
 * Sends a styled HTML password reset email.
 * @param {string} to    - Recipient email address
 * @param {string} name  - Recipient name
 * @param {string} token - Reset token
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { margin:0; padding:0; background:#f4f4f7; font-family:'Inter',Arial,sans-serif; }
        .wrapper { max-width:580px; margin:40px auto; }
        .header { background:#2c2a30; padding:30px; text-align:center; border-radius:12px 12px 0 0; }
        .header h1 { color:#fff; font-size:24px; margin:0; }
        .body { background:#fff; padding:40px; border:1px solid #eaeaeb; border-top:none; }
        .body h2 { color:#2c2a30; font-size:20px; margin-bottom:16px; }
        .body p { color:#51545e; font-size:16px; line-height:1.6; margin-bottom:24px; }
        .btn { display:inline-block; background:#bca0dc; color:#fff; text-decoration:none; padding:12px 30px; border-radius:6px; font-weight:600; }
        .footer { padding:20px; text-align:center; color:#85878e; font-size:12px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header"><h1>She &amp; Her</h1></div>
        <div class="body">
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset the password for your account. Click the button below to proceed. This link expires in 1 hour.</p>
          <p style="text-align:center;"><a href="${resetUrl}" class="btn">Reset My Password</a></p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer"><p>&copy; ${new Date().getFullYear()} She &amp; Her. All rights reserved.</p></div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"She & Her" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔐 Password Reset Request - She & Her',
    html,
  });
};

module.exports = { sendVerificationEmail, verifyEmailConfig, sendPasswordResetEmail };

