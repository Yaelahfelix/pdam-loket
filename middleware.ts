import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname === "/login" || pathname === "/register") &&
    request.cookies.has("token")
  )
    return NextResponse.redirect(new URL("/admin", request.url));
  else if (pathname.startsWith("/admin") && !request.cookies.has("token"))
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/", "/accounts", "/login", "/register"],
// };
