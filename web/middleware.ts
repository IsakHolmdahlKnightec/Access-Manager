import { NextResponse } from "next/server"
import { auth } from "@/auth"

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/api/auth"]

// Define admin routes that require admin role
const adminRoutes = ["/admin"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const pathname = nextUrl.pathname
  const session = req.auth

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if this is an admin route
  const isAdminRoute = adminRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check for static assets
  const isStaticAsset = 
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)

  // Allow static assets without authentication
  if (isStaticAsset) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
  }

  // Redirect authenticated users away from login page
  if (isLoggedIn && pathname === "/login") {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl")
    return NextResponse.redirect(new URL(callbackUrl || "/", nextUrl))
  }

  // Check admin access for admin routes
  if (isAdminRoute && isLoggedIn) {
    const isAdmin = session?.user?.role === "admin"
    if (!isAdmin) {
      // Redirect non-admins to access denied page
      return NextResponse.redirect(new URL("/access-denied", nextUrl))
    }
  }

  return NextResponse.next()
})

// Configure matcher to run on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
