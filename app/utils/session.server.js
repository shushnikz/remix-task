import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "session",
            secrets: [process.env.SESSION_SECRET], // Replace with your secret
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            httpOnly: true,
        },
    });
