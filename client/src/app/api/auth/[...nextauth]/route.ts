import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

// exporting handler as GET and POST
export { handler as GET, handler as POST };
