"use client"

import * as React from "react";
import Link from "next/link"
import { Calendar, Clock, ExternalLink, Mail, MoreHorizontal, Trash2, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Task } from "@/lib/models/task"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {deleteTask, getSendEmail, getTasks} from "@/services/apiTasks";
import {toast} from "sonner";

interface TaskDashboardProps {
    status: "active" | "pending" | "completed";
    toggle: boolean;
    setViewID: React.Dispatch<React.SetStateAction<string>>;
}

const TaskDashboard = ({ status, toggle, setViewID }: TaskDashboardProps) => {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [loading, setLoading] = React.useState(true)
    const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    React.useEffect(() => {
        // Create an abort controller to cancel the fetch request if the component unmounts
        const abortController = new AbortController()
        const signal = abortController.signal

        const fetchTasks = async () => {
            try {
                setLoading(true)
                const taskList = await getTasks(status);
                if (taskList) {
                    setTasks(taskList);
                }
            } catch (error) {
                // Only show error if it's not due to an aborted request
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error fetching tasks:", error)
                    toast("Error",{
                        description: "Failed to load tasks. Please try again.",
                        action: {
                            label: "Ok"
                        },
                    })
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchTasks().then();

        // Cleanup function to abort the fetch request if the component unmounts
        return () => {
            abortController.abort()
        }
    }, [status, toggle]) // Only re-fetch when status changes

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const resendEmail = async (taskId: string) => {
        try {
            const responseSendEmail = await getSendEmail(taskId);

            if (!responseSendEmail) {
                throw new Error("Failed to resend email")
            }
        } catch (error) {
            console.error("Error resending email:", error)
            toast("Error", {
                description: "Failed to resend email. Please try again.",
                action: {
                    label: "Ok"
                }
            })
        }
    }

    const deleteTaskHandler = async () => {
        if (!taskToDelete) return

        setIsDeleting(true)
        try {
            // Delete task
            const response = await deleteTask(taskToDelete);

            if (!response) {
                throw new Error("Failed to delete task")
            }

            // Remove the task from the state
            setTasks((prevTasks) => prevTasks.filter((task) => (task._id?.toString() || task.id) !== taskToDelete))

            toast("Task deleted", {
                description: "The task has been deleted successfully.",
                action: {
                    label: "Ok"
                }
            })
        } catch (error) {
            console.error("Error deleting task:", error)
            toast("Error", {
                description: "Failed to delete task. Please try again.",
                action: {
                    label: "Ok"
                }
            })
        } finally {
            setIsDeleting(false)
            setTaskToDelete(null)
        }
    }

    const viewTaskHandler = async (taskID: string = "") => {
        if(!taskID || taskID === "")
            toast("Task View Error", {
                description: `Task ID ${taskID} is not found`,
                action: {
                    label: "Ok"
                }
            });

        setViewID(taskID);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Search tasks..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex h-[150px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <div className="text-muted-foreground">Loading tasks...</div>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex h-[150px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <div className="text-muted-foreground">No tasks found</div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                        <Card key={task._id?.toString() || task.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">{task.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 mt-1">{task.description}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Task menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => resendEmail(task._id?.toString() || task.id || "")}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Resend Email
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => viewTaskHandler(task._id?.toString() || task.id || "")}
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Update Task
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setTaskToDelete(task._id?.toString() || task.id || "")}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Task
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <User className="mr-1 h-4 w-4" />
                                        {task.assignee}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-1 h-4 w-4" />
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <Badge variant={status === "completed" ? "outline" : status === "active" ? "default" : "secondary"}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            {/* Delete Task Confirmation Dialog */}
            <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task and remove it from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteTaskHandler} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default TaskDashboard;
