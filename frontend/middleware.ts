import { NextRequest, NextResponse } from "next/server";
import { getSessionData } from "./app/_actions/session-actions";

// 1. Specify protected and public routes
const protectedRoutes = ["/reports"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);

	// 3. Decrypt the session from the cookie
	const sessionData = await getSessionData();
	const isSignedIn = sessionData?.userId != null;

	// 5. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !isSignedIn) {
		const loginUrl = new URL("/login", req.url);
		// Add ?from=/incoming-url to the /login URL
		loginUrl.searchParams.set("from", req.nextUrl.pathname);
		// And redirect to the new URL
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};