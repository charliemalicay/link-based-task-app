// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail, generateTaskEmail } from "@/lib/email"
//
// export async function GET(request: NextRequest) {
//     try {
//         // Get the status from the query parameters
//         const { searchParams } = new URL(request.url)
//         const status = searchParams.get("status")
//
//         // Fetch tasks based on status if provided
//         const tasks = status ? await db.getTasksByStatus(status as "active" | "pending" | "completed") : await db.getTasks()
//
//         return NextResponse.json({ tasks })
//     } catch (error) {
//         console.error("Failed to fetch tasks:", error)
//         return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
//     }
// }
//
// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json()
//
//         // Validate the request
//         if (!body.title || !body.description || !body.assignee || !body.dueDate) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//         }
//
//         // Create the task
//         const newTask = await db.createTask({
//             title: body.title,
//             description: body.description,
//             assignee: body.assignee,
//             dueDate: body.dueDate,
//             createdBy: body.createdBy || "system",
//             assignedDate: new Date().toISOString(),
//             status: "active",
//         })
//
//         // Send email notification
//         await sendEmail(
//             generateTaskEmail(newTask.id || newTask._id?.toString() || "", newTask.token, {
//                 title: newTask.title,
//                 description: newTask.description,
//                 dueDate: newTask.dueDate,
//                 requester: newTask.createdBy,
//             }),
//         )
//
//         return NextResponse.json({ task: newTask }, { status: 201 })
//     } catch (error) {
//         console.error("Failed to create task:", error)
//         return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
//     }
// }
