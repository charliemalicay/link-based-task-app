"use client"

import * as React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays, subMonths, subYears, eachDayOfInterval, eachMonthOfInterval } from "date-fns";

import type { Task } from "@/lib/models/task"

interface TaskResponseTimeChartProps {
    tasks: Task[]
    timeframe: "week" | "month" | "year"
}


const TaskResponseTimeChart = ({ tasks, timeframe }: TaskResponseTimeChartProps) => {
    const chartData = React.useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return []
        }

        // Only include completed tasks with response times
        const completedTasks = tasks.filter(
            (task) => task.status === "completed" && task.assignedDate && task.completedDate,
        )

        if (completedTasks.length === 0) {
            return []
        }

        const now = new Date()
        let startDate: Date
        let interval: Date[]
        let dateFormat: string

        // Determine the date range and format based on timeframe
        switch (timeframe) {
            case "week":
                startDate = subDays(now, 7)
                interval = eachDayOfInterval({ start: startDate, end: now })
                dateFormat = "MMM d"
                break
            case "month":
                startDate = subMonths(now, 1)
                interval = eachDayOfInterval({ start: startDate, end: now })
                dateFormat = "MMM d"
                break
            case "year":
                startDate = subYears(now, 1)
                interval = eachMonthOfInterval({ start: startDate, end: now })
                dateFormat = "MMM"
                break
            default:
                startDate = subMonths(now, 1)
                interval = eachDayOfInterval({ start: startDate, end: now })
                dateFormat = "MMM d"
        }

        // Create data points for each date in the interval
        return interval
            .map((date) => {
                // For each date, calculate average response time for tasks completed on that date
                const dateStr = format(date, "yyyy-MM-dd")
                const monthStr = format(date, "yyyy-MM")

                // Filter tasks based on timeframe
                const tasksCompletedOnDate = completedTasks.filter((task) => {
                    if (!task.completedDate) return false
                    const completedDate = new Date(task.completedDate)

                    if (timeframe === "year") {
                        return format(completedDate, "yyyy-MM") === monthStr
                    }
                    return format(completedDate, "yyyy-MM-dd") === dateStr
                })

                // Calculate average response time in hours
                let avgResponseTime = 0
                if (tasksCompletedOnDate.length > 0) {
                    const totalResponseTime = tasksCompletedOnDate.reduce((sum, task) => {
                        if (!task.assignedDate || !task.completedDate) return sum
                        const assignedDate = new Date(task.assignedDate).getTime()
                        const completedDate = new Date(task.completedDate).getTime()

                        return sum + (completedDate - assignedDate) / (1000 * 60 * 60) // hours
                    }, 0)
                    avgResponseTime = Math.round(totalResponseTime / tasksCompletedOnDate.length)
                }

                return {
                    date: format(date, dateFormat),
                    responseTime: avgResponseTime,
                    count: tasksCompletedOnDate.length,
                }
            })
            .filter((item) => item.count > 0) // Only include dates with completed tasks
    }, [tasks, timeframe])

    if (chartData.length === 0) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No response time data available</p>
            </div>
        )
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                        formatter={(value) => [`${value} hours`, "Avg. Response Time"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="responseTime" name="Avg. Response Time (hours)" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TaskResponseTimeChart;
