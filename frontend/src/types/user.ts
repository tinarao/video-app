import { Playlist, Video } from "@prisma/client";

export interface User {
    id: number;
    email: string;
    family_name: string | null;
    given_name: string | null;
    username: string;
    password?: string;
    bio: string | null;
    picture: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    isVerified: boolean;

    videos?: Video[];
    likedVideos?: Video[];
    playlists?: Playlist[];
}