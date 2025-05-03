"use client"

import * as React from 'react';
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { BarChart4, ClipboardList, LogOut, Plus, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BASE_URL,
    DASHBOARD_ANALYTICS_URL,
    DASHBOARD_SETTINGS_URL,
    DASHBOARD_URL,
    PROFILE_URL
} from "@/constants/pageUrls";
import TaskDashboard from "@/components/pages/dashboardPage/sections/taskDashboard";
import {CreateTaskSheet} from "@/components/pages/dashboardPage/sections/createTaskSheet";
import UserNavbar from "@/components/widgets/userNavbar";
import {deleteTask, getTaskById} from "@/services/apiTasks";
import {toast} from "sonner";
import {TASK_STATUS} from "@/constants/status";


const DashboardPage = () => {
    const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState<boolean>(false);
    const [toggleCreated, setToggleCreated] = React.useState<boolean>(false);
    const [viewTaskID, setViewTaskID] = React.useState<string>("");

    return (
        <div className="flex min-h-screen flex-col">
            <UserNavbar />
            <div className="flex flex-1">
                <aside className="hidden w-[240px] border-r bg-muted/40 md:block">
                    <nav className="flex flex-col gap-2 p-4">
                        <Link href={DASHBOARD_URL}>
                            <Button variant="secondary" className="w-full justify-start" size="sm">
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Tasks
                            </Button>
                        </Link>
                        {/*<Link href={DASHBOARD_ANALYTICS_URL}>*/}
                        {/*    <Button variant="ghost" className="w-full justify-start" size="sm">*/}
                        {/*        <BarChart4 className="mr-2 h-4 w-4" />*/}
                        {/*        Analytics*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}
                        {/*<Link href={DASHBOARD_SETTINGS_URL}>*/}
                        {/*    <Button variant="ghost" className="w-full justify-start" size="sm">*/}
                        {/*        <Settings className="mr-2 h-4 w-4" />*/}
                        {/*        Settings*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}
                    </nav>
                </aside>
                <main className="flex flex-1 flex-col">
                    <div className="container max-w-6xl py-6">
                        <div className="mb-6 flex items-center justify-between px-[20px]">
                            <h1 className="text-2xl font-bold">Task Dashboard</h1>
                            <Button className="space-x-[10px] p-[15px] cursor-pointer" onClick={() => setIsCreateTaskOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Create Task
                            </Button>
                        </div>
                        <Tabs defaultValue={TASK_STATUS.pending.value} className="pl-[20px]">
                            <div className="flex items-center justify-between px-[20px]">
                                <TabsList>
                                    <TabsTrigger value={TASK_STATUS.pending.value} className="cursor-pointer">{TASK_STATUS.pending.title}</TabsTrigger>
                                    <TabsTrigger value={TASK_STATUS.approved.value} className="cursor-pointer">{TASK_STATUS.approved.title}</TabsTrigger>
                                    <TabsTrigger value={TASK_STATUS.rejected.value} className="cursor-pointer">{TASK_STATUS.rejected.title}</TabsTrigger>
                                </TabsList>
                            </div>
                            <Separator className="my-4" />
                            <TabsContent value={TASK_STATUS.pending.value} className="space-y-4">
                                <TaskDashboard status={TASK_STATUS.pending.value} toggle={toggleCreated} setViewID={setViewTaskID} />
                            </TabsContent>
                            <TabsContent value={TASK_STATUS.approved.value} className="space-y-4">
                                <TaskDashboard status={TASK_STATUS.approved.value} toggle={toggleCreated} setViewID={setViewTaskID} />
                            </TabsContent>
                            <TabsContent value={TASK_STATUS.rejected.value} className="space-y-4">
                                <TaskDashboard status={TASK_STATUS.rejected.value} toggle={toggleCreated} setViewID={setViewTaskID} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
            <CreateTaskSheet
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                toggle={toggleCreated}
                onToggleChange={setToggleCreated}
                viewTaskID={viewTaskID}
            />
        </div>
    );
}

export default DashboardPage;
