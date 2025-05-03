"use client"

import * as React from 'react';
import { useSession } from "next-auth/react";
import { CheckCircle2, Clock, FileCheck, LineChart, PieChart } from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TaskMetricsCards from "@/components/pages/dashboardPage/subPages/analytics/sections/taskMetricsCards";

import { useToast } from "@/hooks/use-toast";
import { Task } from "@/lib/models/task";
import TaskStatusDistribution
    from "@/components/pages/dashboardPage/subPages/analytics/sections/taskStatusDistribution";
import TaskCompletionChart from "@/components/pages/dashboardPage/subPages/analytics/sections/taskCompletionChart";
import TasksOverTimeChart from "@/components/pages/dashboardPage/subPages/analytics/sections/taskOverTimeChart";
import TaskResponseTimeChart from "@/components/pages/dashboardPage/subPages/analytics/sections/taskResponseTimeChart";
import RecentActivityList from "@/components/pages/dashboardPage/subPages/analytics/sections/recentActivityList";


const AnalyticsPage = () => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [loading, setLoading] = React.useState(true)
    const [timeframe, setTimeframe] = React.useState<"week" | "month" | "year">("month")

    React.useEffect(() => {
        let isMounted = true;

        const fetchTasks = async () => {
            try {
                setLoading(true)
                const response = await fetch("/api/tasks")
                const data = await response.json()

                if (isMounted && data.tasks) {
                    setTasks(data.tasks)
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                if (isMounted) {
                    toast({
                        title: "Error",
                        description: "Failed to load analytics data. Please try again.",
                        variant: "destructive",
                    });
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchTasks().then();

        return () => {
            isMounted = false
        }
    }, [toast]);

    // Calculate metrics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const pendingTasks = tasks.filter((task) => task.status === "pending").length
    const activeTasks = tasks.filter((task) => task.status === "active").length
    const approvedTasks = tasks.filter((task) => task.status === "completed" && task.response?.approved).length
    const rejectedTasks = tasks.filter((task) => task.status === "completed" && !task.response?.approved).length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const approvalRate = completedTasks > 0 ? Math.round((approvedTasks / completedTasks) * 100) : 0

    // Calculate average response time (in hours)
    const responseTimes = tasks
        .filter((task) => task.status === "completed" && task.assignedDate && task.completedDate)
        .map((task) => {
            const assignedDate = new Date(task.assignedDate).getTime()
            const completedDate = new Date(task.completedDate!).getTime()
            return (completedDate - assignedDate) / (1000 * 60 * 60) // hours
        })

    const averageResponseTime =
        responseTimes.length > 0 ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) : 0

    if (loading) {
        return (
            <div className="container max-w-7xl py-10">
                <h1 className="mb-6 text-2xl font-bold">Analytics Dashboard</h1>
                <div className="flex items-center justify-center py-10">
                    <p className="text-muted-foreground">Loading analytics data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-7xl py-10">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <Tabs
                    value={timeframe}
                    onValueChange={(value) => {
                        if (value === "week" || value === "month" || value === "year") {
                            setTimeframe(value)
                        }
                    }}
                >
                    <TabsList>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Metrics Cards */}
            <TaskMetricsCards
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                pendingTasks={pendingTasks}
                activeTasks={activeTasks}
                approvalRate={approvalRate}
                completionRate={completionRate}
                averageResponseTime={averageResponseTime}
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Task Status Distribution */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Task Status Distribution</CardTitle>
                            <CardDescription>Breakdown of tasks by current status</CardDescription>
                        </div>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <TaskStatusDistribution active={activeTasks} pending={pendingTasks} completed={completedTasks} />
                    </CardContent>
                </Card>

                {/* Task Completion Rate */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Task Completion Rate</CardTitle>
                            <CardDescription>Approval vs. rejection ratio</CardDescription>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <TaskCompletionChart
                            approved={approvedTasks}
                            rejected={rejectedTasks}
                            pending={totalTasks - completedTasks}
                        />
                    </CardContent>
                </Card>

                {/* Tasks Over Time */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Tasks Over Time</CardTitle>
                            <CardDescription>Number of tasks created and completed</CardDescription>
                        </div>
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <TasksOverTimeChart tasks={tasks} timeframe={timeframe} />
                    </CardContent>
                </Card>

                {/* Response Time */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Response Time</CardTitle>
                            <CardDescription>Average time to respond to tasks</CardDescription>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <TaskResponseTimeChart tasks={tasks} timeframe={timeframe} />
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                            <CardDescription>Latest task updates and responses</CardDescription>
                        </div>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <RecentActivityList tasks={tasks} limit={5} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AnalyticsPage;
