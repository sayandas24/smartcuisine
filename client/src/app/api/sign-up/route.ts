// API Route (/api/sign-up.ts)
import { NextResponse } from "next/server";
import { signUpSchema } from "@/schemas/signUpSchema";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import axiosInstance from "@/lib/axios";

export async function POST(request: Request) {
  try {
    // Parse and validate input
    const body = await request.json();
    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Destructure validated data
    const { username, name, email, password } = validationResult.data;

    const newUser = {
      username,
      name,
      email,
      password,
      verified: 0,
      provider: 0,
    };

    try {
      // Call backend API
      const user = await axiosInstance
        .post("/users/auth/signup", newUser)
        .then((res) => { 
          return res.data;
        })
        .catch((err) => {
          console.log("error in creating user", err);
          throw new Error("Failed to create user");
        });

      if (user) {
        const verifyCode = await axiosInstance
          .post("/users/verify", { uid: user?.user?.response.uid })
          .then((res) => {
            return res.data.verification.code;
          })
          .catch((err) => {
            console.log("error in verification", err);
          }); 

        // Send verification email
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return NextResponse.json(
            {
              success: false,
              message:
                "User created but failed to send verification email. Please contact support.",
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Registration successful! Please check your email to verify your account.",
          user: user?.user?.response,
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Handle specific backend errors
      if (error.response?.status === 409) {
        return NextResponse.json(
          {
            success: false,
            message: "Email or username already exists",
          },
          { status: 409 }
        );
      }

      throw error; // Let the outer catch block handle other errors
    }
  } catch (error) {
    console.error("Error in sign-up API route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
