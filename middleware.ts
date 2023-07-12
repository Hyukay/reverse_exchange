export { default } from "next-auth/middleware"


export const config = { 
  // These are all the pages that will be protected by the middleware (TO ACCESS THEM YOU NEED TO BE LOGGED IN)
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites"
  ]
};