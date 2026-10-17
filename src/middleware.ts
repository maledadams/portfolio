// Kept as middleware.ts (deprecated in Next 16) rather than proxy.ts on
// purpose: proxy.ts always runs on the Node.js runtime, which OpenNext for
// Cloudflare cannot deploy yet. middleware.ts still runs on Edge.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
