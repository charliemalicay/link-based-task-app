import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const task = await db.getTaskById(params.id)

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        return NextResponse.json({ task })
    } catch (error) {
        console.error("Failed to fetch task:", error)
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
    }
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const updatedTask = await db.updateTask(params.id, body)

        if (!updatedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        return NextResponse.json({ task: updatedTask })
    } catch (error) {
        console.error("Failed to update task:", error)
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const success = await db.deleteTask(params.id)

        if (!success) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete task:", error)
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }
}
