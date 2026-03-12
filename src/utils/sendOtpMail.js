import transporter from "../config/mailer.js";

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Admin Login Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });
};