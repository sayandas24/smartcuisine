import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Smart Cuisine - Verify your account",
      // react: component send (uname, otp as prop(method))
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification code send successfully" };
  } catch (error) {
    console.log("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
