import { resend } from "@/lib/resend"; 
import { ApiResponse } from "@/types/ApiResponse";
import PasswordUpdatedEmail from "../../emails/PasswordUpdateEmail";

export async function sendPasswordChangedEmail({
    email,
    username
}: {
    email: string,
    username: string
}): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Smart Cuisine - Password Changed",
      // Render the email component with the username prop.
      react: PasswordUpdatedEmail({ username }),
    });

    return { success: true, message: "Password change notification sent successfully" };
  } catch (error) {
    console.error("Error sending password changed email", error);
    return { success: false, message: "Failed to send password changed email" };
  }
}
