import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        // Validate the request
        if (!body.name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        // Update the user
        const updatedUser = await db.updateUser(session.user.id, {
            name: body.name,
        })

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
