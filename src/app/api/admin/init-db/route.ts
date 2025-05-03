import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-db"


export async function POST() {
    try {
        const result = await initializeDatabase()

        console.log("result:", result);

        if (result.success) {
            return NextResponse.json({
                status: "success",
                message: "Database initialized successfully",
            })
        } else {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Failed to initialize database",
                    error: result.error,
                },
                { status: 500 },
            )
        }
    } catch (error) {
        console.error("Error initializing database:", error)
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to initialize database",
                error,
            },
            { status: 500 },
        )
    }
}
