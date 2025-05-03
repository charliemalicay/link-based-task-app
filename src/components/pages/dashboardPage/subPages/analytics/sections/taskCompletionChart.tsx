"use client"

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"


interface TaskCompletionChartProps {
    approved: number
    rejected: number
    pending: number
}


const TaskCompletionChart = ({ approved, rejected, pending }: TaskCompletionChartProps) => {
    const data = [
        { name: "Approved", value: approved, color: "#10b981" },
        { name: "Rejected", value: rejected, color: "#ef4444" },
        { name: "Pending", value: pending, color: "#d1d5db" },
    ].filter((item) => item.value > 0)

    // If no data, show a message
    if (data.length === 0 || (approved === 0 && rejected === 0 && pending === 0)) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No completion data available</p>
            </div>
        )
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TaskCompletionChart;
