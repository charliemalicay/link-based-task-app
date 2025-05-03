// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail, generateTaskResponseEmail } from "@/lib/email"
//
//
// export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
//     try {
//         const task = await db.getTaskByToken(params.token)
//
//         if (!task) {
//             return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 })
//         }
//
//         return NextResponse.json({ task })
//     } catch (error) {
//         console.error("Failed to fetch task:", error)
//         return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
//     }
// }
//
//
// export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
//     try {
//         const body = await request.json()
//
//         // Validate the request
//         if (body.approved === undefined) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//         }
//
//         // Get the task before updating
//         const task = await db.getTaskByToken(params.token)
//
//         if (!task) {
//             return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 })
//         }
//
//         // Update the task with the response
//         const updatedTask = await db.updateTaskByToken(params.token, {
//             approved: body.approved,
//             feedback: body.feedback,
//         })
//
//         if (!updatedTask) {
//             return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
//         }
//
//         // Send email notification to the task creator
//         await sendEmail(generateTaskResponseEmail(updatedTask, body.approved, body.feedback))
//
//         return NextResponse.json({ task: updatedTask })
//     } catch (error) {
//         console.error("Failed to update task:", error)
//         return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
//     }
// }
