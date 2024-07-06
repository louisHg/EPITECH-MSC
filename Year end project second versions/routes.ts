/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/api/difficulty",
  "/api/hiking",
  "/dashboard",
];

/**
 * An array of routes that use for authentication
 * These routes will redirect logged users to /protected
 * @type {string[]}
 */
export const authRoutes = ["/auth/signin", "/auth/signup"];

/**
 * The prefix for API authentication routes
 * Routes that start with the prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
