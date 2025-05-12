import { generatePassword } from "@/helpers/generatePassword";
import { sendPasswordEmail } from "@/helpers/sendPasswordEmail";
import { sendWelcomeBackEmail } from "@/helpers/sendWelcomeBackEmail";
import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalPrice, customerDetails } = body;

    const email = customerDetails.email;
    const username = email.split("@")[0];
    const name = customerDetails.name;
    const password = generatePassword();

    let userExists = false;

    // Check if the user already exists in db
    console.log(email, "email");
    try {
      const userCheck = await axiosInstance.get(`/users/check?email=${email}`);

      // If we reach here without error, user exists
      if (userCheck.data.statusCode === 200) {
        userExists = true;
        console.log("User already exists");
        // Process the order for existing user with their ID
        await processOrder(items, totalPrice, email, userCheck.data.user.id);
        await sendWelcomeBackEmail({ name, email });

        return NextResponse.json({
          message: "Order placed successfully",
          existing_user: true,
        });
      }
    } catch (error: any) {
      console.log("User check failed, assuming new user:");
      userExists = false;
    }

    if (!userExists) {
      // mark Create new user
      // idea directly login the user when creating
      try {
        const newUser = await axiosInstance.post("/users/auth/signup", {
          email,
          username,
          name,
          password,
          verified: 1,
        });
        // mark Send the password to the customer via email
        await sendPasswordEmail({ email, name, newPassword: password });

        if (newUser) {
          await processOrder(items, totalPrice, email, newUser.data.user.response.id);
        }

        return NextResponse.json({
          message: "Order placed successfully",
          user_created: true,
        });
      } catch (signupError: any) {
        console.error(
          "Error creating user:",
          signupError?.message || "Unknown error"
        );
        return NextResponse.json(
          { message: "Error creating user account" },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error("Checkout error:", error?.message || "Unknown error");
    return NextResponse.json(
      { message: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

// Helper function to process order
async function processOrder(
  items: any[],
  totalPrice: number,
  userEmail: string,
  customer_id?: string
) {
  const orders = items.map((item) => ({
    customer_id: customer_id,
    item_id: item.id,
    quantity: item.quantity,
    order_status: "pending",
    payment_status: "pending",
    total_amount: item.price * item.quantity,
  }));

  try {
    // Ensure we're sending the orders array as the request body
    const orderResponse = await axiosInstance.post("/orders", JSON.stringify(orders), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (orderResponse) {
      return NextResponse.json(
        { message: "Order placed successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Failed to process checkout" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    throw error; // Propagate the error to be handled by the caller
  }
}
