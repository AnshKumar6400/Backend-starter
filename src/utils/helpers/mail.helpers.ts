import {transporter} from "@/config/nodemailer.config";
import config from "@/config/app.config";

export async function sendResetPasswordEmail(
  email: string,
  resetToken: string
) {
  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Starter App" <${config.SMTP.USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset Password</h2>
      <p>Click the button below to reset your password.</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>This link expires in 1 hour.</p>
    `,
  });
}