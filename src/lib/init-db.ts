import clientPromise from "./mongodb"

// Database and collection names
const DB_NAME = "task-approval"
const TASKS_COLLECTION = "tasks"
const USERS_COLLECTION = "users"

export async function initializeDatabase() {
    try {
        console.log("Initializing database...")
        const client = await clientPromise
        const db = client.db(DB_NAME)

        // Create collections if they don't exist
        const collections = await db.listCollections().toArray()
        const collectionNames = collections.map((c) => c.name)

        if (!collectionNames.includes(TASKS_COLLECTION)) {
            await db.createCollection(TASKS_COLLECTION)
            console.log(`Created collection: ${TASKS_COLLECTION}`)
        }

        if (!collectionNames.includes(USERS_COLLECTION)) {
            await db.createCollection(USERS_COLLECTION)
            console.log(`Created collection: ${USERS_COLLECTION}`)
        }

        // Create indexes for tasks collection
        await db.collection(TASKS_COLLECTION).createIndex({ token: 1 }, { unique: true })
        await db.collection(TASKS_COLLECTION).createIndex({ status: 1 })
        await db.collection(TASKS_COLLECTION).createIndex({ assignee: 1 })
        await db.collection(TASKS_COLLECTION).createIndex({ createdAt: 1 })
        await db.collection(TASKS_COLLECTION).createIndex({ createdBy: 1 })

        // Create indexes for users collection
        await db.collection(USERS_COLLECTION).createIndex({ email: 1 }, { unique: true })
        await db.collection(USERS_COLLECTION).createIndex({ createdAt: 1 })

        console.log("Database initialization complete!")
        return { success: true }
    } catch (error) {
        console.error("Database initialization failed:", error)
        return { success: false, error }
    }
}
