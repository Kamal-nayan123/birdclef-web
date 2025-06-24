// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   // Routes that can be accessed while signed out
//   publicRoutes: ["/", "/audio-search", "/image-search", "/birdpedia"],
//   // Routes that can always be accessed, and have
//   // no authentication information
//   ignoredRoutes: ["/api/webhook"],
// });

// export const config = {
//   // Protects all routes, including api/trpc.
//   // See https://clerk.com/docs/references/nextjs/auth-middleware
//   // for more information about configuring your Middleware
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// Temporary export to avoid middleware errors
export function middleware() {
  return;
}

export const config = {
  matcher: [],
}; 