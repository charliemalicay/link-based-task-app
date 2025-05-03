import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import { LOGIN_URL, REGISTER_URL } from "@/constants/pageUrls";
import {loginUser} from "@/services/apiUsers";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        // @ts-ignore
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await db.getUserByEmail(credentials.email)

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user._id?.toString() || "",
                    name: user.name,
                    email: user.email,
                    image: user.image,
                }

                // if (!credentials?.email || !credentials?.password) {
                //     return null
                // }
                //
                // const email = credentials?.email || "";
                // const password = credentials?.password || "";
                // let token = ""
                //
                // try {
                //     const data = await loginUser({
                //         email,
                //         password
                //     });
                //     console.log("Received token:", data.token);
                //
                //     token = data.token;
                // } catch (error) {
                //     console.error("Login error:", error);
                // }
                //
                // if (token === "") {
                //     return null;
                // }
                //
                // return {
                //     id: "",
                //     name: "",
                //     email: credentials?.email || "",
                //     token: token,
                // }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: LOGIN_URL,
        // newUser: REGISTER_URL,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
}

// @ts-ignore
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
