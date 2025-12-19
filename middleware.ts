import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnChat = req.nextUrl.pathname.startsWith("/chat");
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");
  const isOnHome = req.nextUrl.pathname === "/";

  if (isOnChat && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((isOnLogin || isOnHome) && isLoggedIn) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
