import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
    try {
        // Attempt to connect to MongoDB
        const client = await clientPromise

        // Check if we can ping the database
        await client.db("admin").command({ ping: 1 })

        return NextResponse.json({
            status: "ok",
            mongodb: "connected",
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("MongoDB connection error:", error)
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to connect to MongoDB",
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        )
    }
}
