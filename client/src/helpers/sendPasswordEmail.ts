import { resend } from "@/lib/resend"; 
import { ApiResponse } from "@/types/ApiResponse"; 
import SendPassword from "../../emails/SendPassword";

export async function sendPasswordEmail({
    name,
    newPassword,
    email
}: {
    newPassword: string,
    name: string,
    email: string
}): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Smart Cuisine - Hello user!",
      // Render the email component with the name prop.
      react: SendPassword({name, newPassword}),  
    });

    return { success: true, message: "Password change notification sent successfully" };
  } catch (error) {
    console.error("Error sending password changed email", error);
    return { success: false, message: "Failed to send password changed email" };
  }
}
