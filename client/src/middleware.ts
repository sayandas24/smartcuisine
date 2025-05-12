import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"; // important to export
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  console.log("*****token***** from middleware:", token);

  // Admin route protection
  if (url.pathname.startsWith("/admin")) {
    // Allow access to login page regardless of auth status
    if (url.pathname === "/admin/login") {
      // If already logged in as admin, redirect to admin dashboard
      if (token?.isAdmin) {
        return NextResponse.redirect(new URL("/admin/orders", request.url));
      }
      return NextResponse.next();
    }
    
    // For all other admin routes, check authentication
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Check if user has admin privileges
    const isAdmin = token.isAdmin === 1;
    
    if (!isAdmin) {
      // If user is logged in but not an admin, redirect to user page with error message
      const userRedirectUrl = new URL("/user/p", request.url);
      userRedirectUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(userRedirectUrl);
    }
  }

  // If user is logged in and tries to access sign-in, sign-up, or verify pages
  if (
    token &&
    (url.pathname.startsWith("/user/sign-in") ||
      url.pathname.startsWith("/user/sign-up") ||
      url.pathname.startsWith("/user/verify"))
  ) {
    return NextResponse.redirect(new URL("/user/p", request.url));
  }
  
  // If user is logged in and accesses /user, redirect to /user/p
  if (token && url.pathname === "/user") {
    return NextResponse.redirect(new URL("/user/p", request.url));
  } 
  // If user is not logged in and tries to access protected routes
  if (!token && (url.pathname === "/user" || url.pathname.startsWith("/user/p") || url.pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/user/sign-in", request.url));
  }
  
  // Allow the request to proceed normally
  return NextResponse.next();
}

// config is kahan kahan pe middleware run kare
export const config = {
  // dashboard:path* -> any path starting with dashboard
  matcher: [ 
    "/user/:path*", 
    "/admin/:path*",
  ],
};
