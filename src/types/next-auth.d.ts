declare module "next-auth" {
    interface User {
        id: string
        name: string
        email: string
        image?: string
    }

    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}
