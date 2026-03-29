import { auth } from "@/app/_lib/auth";

export const proxy = auth;
export default auth;

export const config = {
  matcher: ["/account/:path*"],
};
