import nodemailer from "nodemailer";

export async function sendEmailOtp(email, otp) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email verification is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RoomBites" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your RoomBites email",
    text: `Your RoomBites email OTP is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif"><h2>RoomBites Verification</h2><p>Your email OTP is:</p><h1>${otp}</h1><p>This code expires in 10 minutes.</p></div>`,
  });
}
