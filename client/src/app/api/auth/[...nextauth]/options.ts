import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

async function refreshAccessToken(token: any) {
  try {
    // Post with no payload; headers as third argument.
    const response = await axiosInstance.post("/users/auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });

    // Assuming your backend returns new tokens in response.data.
    return {
      ...token,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token ?? token.refreshToken,
    };
  } catch (error: any) {
    console.error("Failed to refresh token", error.message);
    return {
      ...token,
      error: "Failed to refresh token",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // User Login
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const existingUser = {
            email: credentials.email,
            password: credentials.password,
          };

          // Attempt login via your backend API.
          const response = await axiosInstance
            .post("/users/auth/login", existingUser)
            .then((res) => {
              // fix return id in backend when user/admin login
              console.log("Response:********************", res.data.user);
              return {
                _id: res.data.user.uid,
                id: res.data.user.id,
                username: res.data.user.username,
                name: res.data.user.name,
                email: res.data.user.email,
                verified: res.data.user.verified || false,
                role: 0,
                accessToken: res.data.user.access_token,
                refreshToken: res.data.user.refresh_token,
              };
            })
            .catch((err) => {
              throw new AxiosError("Email or password is incorrect");
            });

          if (response.verified) {
            return response;
          }
          throw new AxiosError(
            "User is not verified. Please verify your email."
          );
        } catch (error: any) {
          console.log("error in login", error.message);
          throw new AxiosError(error.message);
        }
      },
    }),
    // Admin login
    CredentialsProvider({
      id: "adminCredentials",
      name: "adminCredentials",
      credentials: {
        id: { label: "Id", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"id" | "password", string> | undefined
      ) {
        try {
          if (!credentials) {
            throw new Error("Missing credentials");
          }
          const response = await axiosInstance
            .post("/admin/auth/login", {
              email: credentials.id,
              password: credentials.password,
            })
            .then((res) => ({
              _id: res.data.user.uid,
              id: res.data.user.id,
              email: res.data.user.email,
              verified: true,
              isAdmin: res.data.user.isAdmin || 1,
              accessToken: res.data.user.access_token,
              refreshToken: res.data.user.refresh_token,
            }))
            .catch(() => {
              throw new AxiosError("Id or password is incorrect");
            });

          if (response.isAdmin) {
            return response as any; // Ensure it matches the expected User type
          }
          return null;
        } catch (error) {
          console.error("Admin authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Use a fixed password for Google users—ensure your backend logic supports this.
        const googleUserLogin = {
          email: user.email,
          password: "googlepassword",
        };

        const googleUser = {
          username: user.email?.trim().split("@")[0].replace(/\./g, ""),
          name: user.name,
          email: user.email,
          password: "googlepassword", // Fixed password for Google users
          profile_pic: user?.image ?? "",
          verified: 1,
          provider: 1,
        };

        let loginResponse;
        try {
          // First, attempt to log in the user.
          loginResponse = await axiosInstance.post(
            "/users/auth/login",
            googleUserLogin
          );
          console.log("User logged in:", loginResponse.data.user);
        } catch (loginError: any) {
          console.log(
            "User login failed, attempting registration:",
            loginError.message
          );
          try {
            // If login fails, register the user.
            const registerResponse = await axiosInstance.post(
              "/users/auth/signup",
              googleUser
            );
            console.log("User registered:", registerResponse.data);
            // After registration, log in again to get tokens.
            loginResponse = await axiosInstance.post(
              "/users/auth/login",
              googleUserLogin
            );
            console.log(
              "User logged in after registration:",
              loginResponse.data.user
            );
          } catch (regError: any) {
            console.error("Error during user registration:", regError.message);
            throw new Error("Failed to register user during Google sign-in.");
          }
        }
        // Attach tokens to the user object so they're available in the JWT callback.
        if (loginResponse?.data?.user) {
          user.accessToken = loginResponse.data.user.access_token;
          user.refreshToken = loginResponse.data.user.refresh_token;
        }
      }
      return true;
    },

    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user: any;
    }) {
      // If token already has an accessToken, decode it to get expiry.
      if (token?.accessToken) {
        const decodedToken = jwtDecode(token.accessToken as string);
        // token.accessTokenExpired = Date.now() + 10 * 60 * 1000;
        token.accessTokenExpired = decodedToken?.exp
          ? decodedToken.exp * 1000
          : null; 
        console.log("decodedToken********", token.accessTokenExpired);
      }

      // If coming from signIn (first sign in with either provider).
      if (account && user) {
        return {
          ...token,
          accessToken: user?.accessToken,
          refreshToken: user?.refreshToken,
          ...user,
        };
      }
      // If the access token hasn't expired, return it.
      if (token.accessTokenExpired && Date.now() < token.accessTokenExpired) {
        return token;
      }

      console.log("***Access token has expired, try to update it***");
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.id = token.id;
        session.user.verified = token.verified;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.refreshToken = token.refreshToken;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },

  // overwrite signin default route: (/auth/signin) to /sign-in
  pages: {
    signIn: "/user/sign-in",
    error: "/sign-in",
  },
  // session can be access from db(stored token) ot jwt
  session: {
    strategy: "jwt",
  },
  // secret key is important
  // this can be any key
  secret: process.env.NEXTAUTH_SECRET,
};
