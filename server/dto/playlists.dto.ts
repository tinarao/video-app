import { z } from 'zod';

export const createPlaylistDTO = z.object({
    title: z.string().min(1).max(20),
    isPublic: z.boolean(),
})

export const addVideoDTO = z.object({
    videoID: z.number(),
    playlistID: z.number(),
})