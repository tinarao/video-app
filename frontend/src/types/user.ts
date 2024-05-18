import { Video } from "@server/db/entities/video.entity"

export interface User {
    id: number
    email: string | null
    family_name: string | null
    given_name: string | null
    username: string
    picture: string | null
    createdAt: Date | string
    isVerified: boolean
    videos: Video[]
}