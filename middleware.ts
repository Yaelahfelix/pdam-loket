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
  else if (pathname.startsWith("/admin")) {
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie?.value;
    const settingsCookie = request.cookies.get("settings");
    const settings = settingsCookie?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (settings) {
      // const decodedSettings = jwt.verify(settings, SECRET_KEY!) as JwtPayload;
      // const sidebar: MenuGroup[] = decodedSettings as MenuGroup[];
      // const allowedLinks = sidebar.flatMap((group) =>
      //   group.menus.map((menu) => `/admin/${menu.link}`)
      // );
      // if (!allowedLinks.includes(pathname)) {
      //   return NextResponse.redirect(new URL("/admin", request.url));
      // }
    }
  }

  return NextResponse.next();
}
// export const config = {
//   matcher: ["/", "/accounts", "/login", "/register"],
// };
