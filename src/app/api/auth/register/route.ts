import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import {registerUser} from "@/services/apiUsers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate the request
        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Validate password strength
        if (body.password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
        }

        let responseID = ""

        try {
            const data = await registerUser({
                name: body?.name || "",
                email: body?.email || "",
                password: body?.password || ""
            });

            console.log("User registered successfully:", data);

            responseID = data.userId;

        } catch (error) {
            console.error("Registration error:", error);
        }

        // Return the new user (without password)
        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: responseID,
                    name: body.name,
                    email: body.email,
                },
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error registering user:", error)
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }
}
