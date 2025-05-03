"use client"

import * as React from 'react';
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import type { Task } from "@/lib/models/task"

interface RecentActivityListProps {
    tasks: Task[]
    limit?: number
}


const RecentActivityList = ({ tasks, limit = 5 }: RecentActivityListProps) => {
    // Sort tasks by most recent activity (completed date or created date)
    const sortedTasks = [...tasks]
        .sort((a, b) => {
            const dateA = a.completedDate ? new Date(a.completedDate).getTime() : new Date(a.createdAt).getTime()
            const dateB = b.completedDate ? new Date(b.completedDate).getTime() : new Date(b.createdAt).getTime()
            return dateB - dateA
        })
        .slice(0, limit)

    if (sortedTasks.length === 0) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {sortedTasks.map((task) => {
                const isCompleted = task.status === "completed"
                const isApproved = isCompleted && task.response?.approved

                return (
                    <div key={task._id?.toString()} className="flex items-start gap-4">
                        <div className="mt-1">
                            {isCompleted ? (
                                isApproved ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )
                            ) : (
                                <Clock className="h-5 w-5 text-blue-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {isCompleted
                                    ? `${isApproved ? "Approved" : "Rejected"} by ${task.assignee} on ${new Date(
                                        task.completedDate!,
                                    ).toLocaleDateString()}`
                                    : `Assigned to ${task.assignee} on ${new Date(task.assignedDate).toLocaleDateString()}`}
                            </p>
                            {isCompleted && task.response?.feedback && (
                                <p className="text-xs italic text-muted-foreground">"{task.response.feedback}"</p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecentActivityList;
