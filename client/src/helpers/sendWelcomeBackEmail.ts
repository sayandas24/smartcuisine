import { resend } from "@/lib/resend"; 
import { ApiResponse } from "@/types/ApiResponse"; 
import SendPassword from "../../emails/SendPassword";
import WelcomeBackEmail from "../../emails/WelcomeBackEmail";

export async function sendWelcomeBackEmail({
    name, 
    email
}: { 
    name: string,
    email: string
}): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Smart Cuisine - Welcome back!",
      // Render the email component with the name prop.
      react: WelcomeBackEmail({name}),  
    });

    return { success: true, message: "Welcome back email sent successfully" };
  } catch (error) {
    console.error("Error sending welcome back email", error);
    return { success: false, message: "Failed to send welcome back email" };
  }
}
