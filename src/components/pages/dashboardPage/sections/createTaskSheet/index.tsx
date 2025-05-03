"use client"

import * as React from "react";

import { useSession } from "next-auth/react"
import {CalendarIcon, FileEdit, PlusCircle} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea";
import {createTask, getSendEmail, getTaskById, updateTask} from "@/services/apiTasks";
import {toast} from "sonner";
import {Task} from "@/lib/models/task";

interface CreateTaskSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    toggle: boolean
    onToggleChange: (open: boolean) => void
    viewTaskID: string
}

export function CreateTaskSheet({ open, onOpenChange, toggle, onToggleChange, viewTaskID }: CreateTaskSheetProps) {
    const { data: session } = useSession()
    const [title, setTitle] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [assignee, setAssignee] = React.useState<string>("")
    const [dueDate, setDueDate] = React.useState<Date>()
    const [isCreating, setIsCreating] = React.useState(false)
    const [tasks, setTasks] = React.useState<Task | {}>({})
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
    const [updateState, setUpdateState] = React.useState<boolean>(false);

    const viewTaskHandler = async () => {
        try {
            const response = await getTaskById(viewTaskID);

            if (!response) {
                throw new Error("Failed to view task")
            }

            setTasks(response);
            setTitle(response.title);
            setDescription(response.description);
            setAssignee(response.assignee);
            setDueDate(new Date(response.dueDate));
            setUpdateState(true);

            onOpenChange(true);

        } catch (error) {
            console.error("Error in viewing task:", error)
            toast("Error", {
                description: "Failed to view task",
                action: {
                    label: "Ok"
                }
            })
        }
    }

    React.useEffect(() => {
        if(viewTaskID && viewTaskID.length > 0 && !open) {
            viewTaskHandler().then();
        }
    }, [viewTaskID]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!title || !description || !assignee || !dueDate) {
            toast({
                title: "Missing required fields",
                description: "Please fill in all the required fields.",
                variant: "destructive",
            })
            return
        }

        if(updateState) {
            setIsUpdating(true)

            try {
                // @ts-ignore
                const response = await updateTask(
                    tasks._id,
                    {
                        title: title,
                        description: description,
                        assignee: assignee,
                        dueDate: dueDate
                    });

                if (!response) {
                    throw new Error("Failed to create task")
                }

                toast("Task Updated successfully", {
                    description: "Task Details is updated.",
                    action: {
                        label: "Ok"
                    },
                });

                // Reset form
                setTasks({})
                setTitle("")
                setDescription("")
                setAssignee("")
                setDueDate(undefined)
                onOpenChange(false)

            } catch (error) {
                console.error("Error updating task:", error);
                toast("Error", {
                    description: "Failed to update task. Please try again.",
                    action: {
                        label: "Ok"
                    },
                });
            } finally {
                setIsUpdating(false);
                setUpdateState(false);
                onToggleChange(!toggle);
            }
        } else {
            setIsCreating(true)

            try {
                // @ts-ignore
                const responseCreate = await createTask({
                    title: title,
                    description: description,
                    assignee: assignee,
                    dueDate: dueDate
                });

                if (!responseCreate) {
                    throw new Error("Failed to create task")
                }

                try {
                    const responseSendEmail = await getSendEmail(responseCreate?.taskId);

                    if (!responseSendEmail) {
                        throw new Error("Failed to send email")
                    }

                    console.log("responseSendEmail:", responseSendEmail);

                } catch (error) {
                    console.error("Error sending task email:", error);
                    toast("Error", {
                        description: "Failed to send an email. Please try again.",
                        action: {
                            label: "Ok"
                        },
                    });
                }

                toast("Task created successfully", {
                    description: "Email notification has been sent to the assignee.",
                    action: {
                        label: "Ok"
                    },
                });

                // Reset form
                setTitle("")
                setDescription("")
                setAssignee("")
                setDueDate(undefined)
                onOpenChange(false)

            } catch (error) {
                console.error("Error creating task:", error);
                toast("Error", {
                    description: "Failed to create task. Please try again.",
                    action: {
                        label: "Ok"
                    },
                });
            } finally {
                setIsCreating(false);
                onToggleChange(!toggle);
            }
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md px-[20px]">
                <SheetHeader className="py-4 px-0">
                    <SheetTitle>Create New Task</SheetTitle>
                    <SheetDescription>Create a new task and send it to someone for approval.</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task details..."
                            className="min-h-[120px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assignee" className="text-right">
                            Assignee Email
                        </Label>
                        <Input
                            id="assignee"
                            type="email"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal" id="dueDate">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : "Select a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={isCreating || isUpdating} className="space-x-4 py-[15px] w-full">
                            {updateState ? (
                                isUpdating ? (
                                    "Updating..."
                                ) : (
                                    <>
                                        <FileEdit className="h-4 w-4" />
                                        Update Task
                                    </>
                                )
                            ) : (
                                isCreating ? (
                                    "Creating..."
                                ) : (
                                    <>
                                        <PlusCircle className="h-4 w-4" />
                                        Create Task
                                    </>
                                )
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
