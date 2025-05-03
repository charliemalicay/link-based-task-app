import axios from "axios";
import {Task} from "@/lib/models/task";
import {TaskDetailsTypes} from "@/components/pages/taskPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TaskParams {
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
}

// Create a task
export async function createTask(task: TaskParams): Promise<Task> {
    const response = await axios.post<Task>(`${API_URL}task`, task);

    // @ts-ignore
    return response.data;
}

// Get all tasks
export async function getTasks(status: string = ""): Promise<Task[]> {
    let response = null;

    if (status === "")
        response = await axios.get<Task[]>(`${API_URL}`);

    else response = await axios.get<Task[]>(`${API_URL}task?status=${status}`);

    // @ts-ignore
    return response.data;
}

// Get a single task by ID
export async function getTaskById(taskId: string): Promise<Task> {
    const response = await axios.get<Task>(`${API_URL}task/${taskId}`);

    // @ts-ignore
    return response.data;
}

// Get a single task by Token
export async function getTaskByToken(token: string): Promise<Task> {
    const response = await axios.get<TaskDetailsTypes>(`${API_URL}task/token/${token}`);

    // @ts-ignore
    return response.data;
}

// Update a task
export async function updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    const response = await axios.put<Task>(`${API_URL}task/${taskId}`, taskData);

    // @ts-ignore
    return response.data;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_URL}task/${taskId}`);

    // @ts-ignore
    return response.data;
}

// Get send email task
export async function getSendEmail(taskId: string): Promise<Task> {
    const response = await axios.get<Task>(`${API_URL}task/send-email/${taskId}`);

    // @ts-ignore
    return response.data;
}
