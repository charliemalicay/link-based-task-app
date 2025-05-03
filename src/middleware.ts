import { getToken } from "next-auth/jwt"
import { type NextRequest, NextResponse } from "next/server"

// Helper function to check if a path matches any pattern in an array
function matchesPattern(path: string, patterns: string[]): boolean {
    return patterns.some((pattern) => {
        if (pattern.endsWith("*")) {
            return path.startsWith(pattern.slice(0, -1))
        }
        return path === pattern
    })
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define paths that should bypass middleware completely
    const bypassPaths = [
        "/api/health",
        "/api/tasks/token/",
        "/api/auth/",
        "/favicon.ico",
        "/_next/",
        "/images/",
        "/public/",
    ]

    // Skip middleware execution for bypass paths
    if (bypassPaths.some((bp) => path.startsWith(bp))) {
        return NextResponse.next()
    }

    // Define public paths that don't require authentication
    const publicPaths = ["/", "/login", "/register", "/forgot-password", "/task/*"]

    const isPublicPath = matchesPattern(path, publicPaths)

    // Define protected API paths that require authentication
    const protectedApiPaths = ["/api/tasks", "/api/user/", "/api/admin/"]

    const isProtectedApiPath = matchesPattern(path, protectedApiPaths)

    // Define protected page paths
    const protectedPagePaths = ["/dashboard", "/profile"]

    const isProtectedPagePath = matchesPattern(path, protectedPagePaths)

    // Only check authentication for protected paths
    if (isProtectedApiPath || isProtectedPagePath) {
        // Get the user's token
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        // If trying to access a protected route without token
        if (!token) {
            // For API routes, return 401 Unauthorized
            if (isProtectedApiPath) {
                return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { "content-type": "application/json" },
                })
            }

            // For page routes, redirect to login
            const url = new URL("/login", request.url)
            url.searchParams.set("callbackUrl", encodeURI(request.url))
            return NextResponse.redirect(url)
        }
    }

    // If authenticated user tries to access login/register, redirect to dashboard
    if (
        (path === "/login" || path === "/register") &&
        (await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        }))
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

// Specify routes middleware should run on - more specific than before
export const config = {
    runtime: 'experimental-edge',
    matcher: [
        // Auth pages
        "/login",
        "/register",
        "/forgot-password",

        // Protected pages
        "/dashboard/:path*",
        "/profile/:path*",

        // Protected API routes
        "/api/tasks/:path*",
        "/api/user/:path*",
        "/api/admin/:path*",

        // Public task view
        "/task/:path*",

        // Home page
        "/",
    ],
}
