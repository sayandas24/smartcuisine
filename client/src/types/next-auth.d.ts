import "next-auth";
import { DefaultSession } from "next-auth";

// modifying next-auth package
declare module "next-auth" {
  interface User {
    // injecting some field to user located in /src/auth/options
    _id?: string;
    id?: string;
    verified?: boolean;
    username?: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Admin {
    id: string;
    password: string;
  }

  // add fields in session now
  interface Session {
    user: {
      _id?: string;
      id?: string;
      verified?: boolean;
      username?: string;
      name?: string;
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"]; // default session par user ayegi hi ayegi

    admin: {
      id: string;
      password: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    id?: string;
    verified?: boolean;
    username?: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
