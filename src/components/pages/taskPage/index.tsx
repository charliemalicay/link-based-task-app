"use client"
import * as React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getTaskById, getTaskByToken, updateTask} from "@/services/apiTasks";
import {toast} from "sonner";
import {TASK_STATUS} from "@/constants/status";
import {useRouter} from "next/navigation";
import {DASHBOARD_URL, LOGIN_URL} from "@/constants/pageUrls";


export interface TaskDetailsTypes {
    _id: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    createdBy: string;
    assignedDate: string;
    createdAt: string;
    token: string;
    status: string;
}


const TaskPage = ({ taskToken }: { taskToken: string }) => {
    const router = useRouter()

    const [taskDetail, setTaskDetail] = React.useState<TaskDetailsTypes | null>(null);

    const handleGetTaskDetails = async (taskToken: string) => {
        try {
            const response = await getTaskByToken(taskToken);

            if (!response) {
                throw new Error("Getting Task Error")
            }

            // @ts-ignore
            setTaskDetail(response);

        } catch (error) {
            console.error("Getting Task error:", error);

            toast("Getting Task failed", {
                description: error instanceof Error ? error.message : "Please try again later",
                action: {
                    label: "OK"
                },
            });
        }
    }

    const handleUpdateStatus = async (taskID: string, status: string) => {
        try {
            // @ts-ignore
            const response = await updateTask(taskID, { status });

            if (!response) {
                throw new Error("Failed to update task status")
            }

            toast("Task Updated successfully", {
                description: "Task Details is updated.",
                action: {
                    label: "Ok"
                },
            });
        } catch (error) {
            console.error("Error updating task:", error);
            toast("Error", {
                description: "Failed to update task. Please try again.",
                action: {
                    label: "Ok"
                },
            });
        } finally {
            window.close();
            // router.push(LOGIN_URL);
        }
    }

    const renderTaskStatus = React.useCallback((paramsStatus: string) => {
        switch (paramsStatus) {
            case TASK_STATUS.pending.value:
                return (
                    <div className="flex flex-row gap-x-[10px] items-center p-[10px] rounded-md bg-gray-500 w-auto">
                        <p className="text-white">{TASK_STATUS.pending.title}</p>
                    </div>
                );

            case TASK_STATUS.approved.value:
                return (
                    <div className="flex flex-row gap-x-[10px] items-center p-[10px] rounded-md bg-green-500 w-auto">
                        <p className="text-white">{TASK_STATUS.approved.title}</p>
                    </div>
                );

            case TASK_STATUS.rejected.value:
                return (
                    <div className="flex flex-row gap-x-[10px] items-center p-[10px] rounded-md bg-gray-500 w-auto">
                        <p className="text-white">{TASK_STATUS.rejected.title}</p>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-row gap-x-[10px] items-center p-[10px] rounded-md bg-gray-500 w-auto">
                        <p className="text-white">{TASK_STATUS.pending.title}</p>
                    </div>
                );
        }
    }, [taskDetail]);

    React.useEffect(() => {
        handleGetTaskDetails(taskToken).then();
    }, [taskToken]);

    const handleTaskRender = () => {
        const status = taskDetail?.status;

        if(status !== TASK_STATUS.pending.value) {
            return (
                <p className="text-xl">{`Task already set to Approved or Rejected`}</p>
            );
        }

        return (
            <Card className="w-[500px] p-[20px]">
                <CardHeader>
                    <CardTitle className="text-base font-bold tracking-wide">{taskDetail?.title || ""}</CardTitle>
                    <CardDescription
                        className="text-base font-semibold tracking-wide">{taskDetail?.description || ""}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-[15px]">
                    {renderTaskStatus(taskDetail?.status || "")}
                    <form className="flex flex-row gap-x-[15px]">
                        <div className="flex flex-col gap-y-[5px]">
                            <p className="text-sm font-semibold tracking-wide">Assignee:</p>
                            <p className="text-sm font-semibold tracking-wide">Assigned Date:</p>
                            <p className="text-sm font-semibold tracking-wide">Due Date:</p>
                            <p className="text-sm font-semibold tracking-wide">Created By:</p>
                        </div>
                        <div className="flex flex-col gap-y-[5px]">
                            <p className="text-sm font-normal tracking-wide">{taskDetail?.assignee || ""}</p>
                            <p className="text-sm font-normal tracking-wide">{taskDetail?.assignedDate || ""}</p>
                            <p className="text-sm font-normal tracking-wide">{taskDetail?.dueDate || ""}</p>
                            <p className="text-sm font-normal tracking-wide">{taskDetail?.createdBy || ""}</p>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-row gap-x-[10px] justify-end">
                    <Button
                        className="p-[15px] rounded-sm bg-red-400 hover:bg-red-300 cursor-pointer w-[150px]"
                        onClick={() => handleUpdateStatus(taskDetail?._id || "", TASK_STATUS.rejected.value)}
                    >
                        Reject</Button>
                    <Button
                        className="p-[15px] rounded-sm cursor-pointer w-[150px]"
                        onClick={() => handleUpdateStatus(taskDetail?._id || "", TASK_STATUS.approved.value)}
                    >
                        Approve</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            { !taskDetail ? (
                <p className="text-lg font-bold tracking-wide">Getting Task Ready</p>
            ) : handleTaskRender()}
        </div>
    );
}

export default TaskPage;
