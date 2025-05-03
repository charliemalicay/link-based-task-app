import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import type { Task } from "./models/task"
import type { User, UserWithoutPassword } from "./models/user"
import bcrypt from "bcryptjs"

// Database collection names
const DB_NAME = "task-approval"
const TASKS_COLLECTION = "tasks"
const USERS_COLLECTION = "users"

export const db = {
    // Tasks
    getTasks: async () => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)
        return (await collection.find({}).toArray()) as Task[]
    },

    getTasksByStatus: async (status: "active" | "pending" | "completed") => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)
        return (await collection.find({ status }).toArray()) as Task[]
    },

    getTasksByUser: async (userId: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)
        return (await collection.find({ createdBy: userId }).toArray()) as Task[]
    },

    getTaskById: async (id: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)
        return (await collection.findOne({ _id: new ObjectId(id) })) as Task | null
    },

    getTaskByToken: async (token: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)
        return (await collection.findOne({ token })) as Task | null
    },

    createTask: async (task: Omit<Task, "id" | "createdAt" | "token">) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)

        const now = new Date().toISOString()
        const token = generateToken()

        const newTask = {
            ...task,
            createdAt: now,
            token,
            status: "active",
        }

        const result = await collection.insertOne(newTask)

        return {
            ...newTask,
            id: result.insertedId.toString(),
        } as Task
    },

    updateTask: async (id: string, task: Partial<Task>) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: task },
            { returnDocument: "after" },
        )

        return result ? (result as unknown as Task) : null
    },

    updateTaskByToken: async (token: string, response: { approved: boolean; feedback?: string }) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)

        const result = await collection.findOneAndUpdate(
            { token },
            {
                $set: {
                    status: "completed",
                    completedDate: new Date().toISOString(),
                    response: {
                        ...response,
                        respondedAt: new Date().toISOString(),
                    },
                },
            },
            { returnDocument: "after" },
        )

        return result ? (result as unknown as Task) : null
    },

    deleteTask: async (id: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(TASKS_COLLECTION)

        const result = await collection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    // Users
    getUserByEmail: async (email: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(USERS_COLLECTION)
        return (await collection.findOne({ email })) as User | null
    },

    getUserById: async (id: string) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(USERS_COLLECTION)
        return (await collection.findOne({ _id: new ObjectId(id) })) as User | null
    },

    createUser: async (userData: Omit<User, "id" | "createdAt">) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(USERS_COLLECTION)

        // Check if user already exists
        const existingUser = await collection.findOne({ email: userData.email })
        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const now = new Date().toISOString()
        const newUser = {
            ...userData,
            password: hashedPassword,
            createdAt: now,
        }

        const result = await collection.insertOne(newUser)

        // Return user without password
        const { password, ...userWithoutPassword } = newUser
        return {
            ...userWithoutPassword,
            id: result.insertedId.toString(),
        } as UserWithoutPassword
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        const client = await clientPromise
        const collection = client.db(DB_NAME).collection(USERS_COLLECTION)

        // If updating password, hash it
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10)
        }

        // Update the user
        userData.updatedAt = new Date().toISOString()

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: userData },
            { returnDocument: "after" },
        )

        if (!result) return null

        // Remove password from returned user
        const { password, ...userWithoutPassword } = result as unknown as User
        return userWithoutPassword as UserWithoutPassword
    },
}

// Generate a random token for task approval links
function generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
