import { PlaylistsFrontend } from "./playlists";
import { Video } from "./video";

export interface User {
    id: number;
    email?: string;
    family_name?: string | null;
    given_name?: string | null;
    username: string;
    password?: string;
    bio?: string | null;
    picture?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isVerified?: boolean;

    uploadedVideosCount?: number
    uploadedVideosViewsCount?: number

    videos?: Video[] | null;
    likedVideos?: Video[] | null;
    playlists?: PlaylistsFrontend[] | null;
}