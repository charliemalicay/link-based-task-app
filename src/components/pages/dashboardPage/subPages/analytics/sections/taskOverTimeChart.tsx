"use client"

import * as React from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, subDays, subMonths, subYears, eachDayOfInterval, eachMonthOfInterval } from "date-fns"

import type { Task } from "@/lib/models/task"

interface TasksOverTimeChartProps {
    tasks: Task[]
    timeframe: "week" | "month" | "year"
}


const TasksOverTimeChart = ({ tasks, timeframe }: TasksOverTimeChartProps) => {
    const chartData = React.useMemo(() => {
        if (!tasks || tasks.length === 0) {
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
        return interval.map((date) => {
            // For each date, count created and completed tasks
            const dateStr = format(date, "yyyy-MM-dd")
            const monthStr = format(date, "yyyy-MM")

            // Filter tasks based on timeframe
            const createdTasks = tasks.filter((task) => {
                const taskDate = new Date(task.createdAt)
                if (timeframe === "year") {
                    return format(taskDate, "yyyy-MM") === monthStr
                }
                return format(taskDate, "yyyy-MM-dd") === dateStr
            }).length

            const completedTasks = tasks.filter((task) => {
                if (!task.completedDate) return false
                const taskDate = new Date(task.completedDate)
                if (timeframe === "year") {
                    return format(taskDate, "yyyy-MM") === monthStr
                }
                return format(taskDate, "yyyy-MM-dd") === dateStr
            }).length

            return {
                date: format(date, dateFormat),
                created: createdTasks,
                completed: completedTasks,
            }
        })
    }, [tasks, timeframe])

    if (tasks.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No task data available</p>
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="created" stroke="#3b82f6" activeDot={{ r: 8 }} name="Tasks Created" />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" name="Tasks Completed" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TasksOverTimeChart;
