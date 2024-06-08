import { Video } from "./video";

export interface PlaylistsFrontend {
    id: number;
    title: string;
    desc: string | null;
    isPublic: boolean;
    url: string;
    authorID: number;
    createdAt: Date | string;
    updatedAt: Date | string;

    videos: Video[];

}