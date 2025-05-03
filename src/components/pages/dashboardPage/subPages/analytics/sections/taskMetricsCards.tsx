"use client"

import * as React from 'react';
import { BarChart, CheckCircle2, Clock, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface TaskMetricsCardsProps {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    activeTasks: number
    approvalRate: number
    completionRate: number
    averageResponseTime: number
}

const TaskMetricsCards = (
    {
        totalTasks,
        completedTasks,
        pendingTasks,
        activeTasks,
        approvalRate,
        completionRate,
        averageResponseTime,
    }: TaskMetricsCardsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                    <p className="text-xs text-muted-foreground">
                        {completedTasks} completed, {pendingTasks} pending, {activeTasks} active
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${completionRate}%` }} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approvalRate}%</div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${approvalRate}%` }} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageResponseTime} hrs</div>
                    <p className="text-xs text-muted-foreground">Average time to complete tasks</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default TaskMetricsCards;
