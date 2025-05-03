// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { sendEmail, generateTaskEmail } from "@/lib/email"
//
//
// export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const task = await db.getTaskById(params.id)
//
//         if (!task) {
//             return NextResponse.json({ error: "Task not found" }, { status: 404 })
//         }
//
//         // Send email notification
//         await sendEmail(
//             generateTaskEmail(task.id || task._id?.toString() || "", task.token, {
//                 title: task.title,
//                 description: task.description,
//                 dueDate: task.dueDate,
//                 requester: task.createdBy,
//             }),
//         )
//
//         return NextResponse.json({ success: true })
//     } catch (error) {
//         console.error("Failed to resend email:", error)
//         return NextResponse.json({ error: "Failed to resend email" }, { status: 500 })
//     }
// }
