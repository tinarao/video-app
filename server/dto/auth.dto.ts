import { z } from 'zod';

export const AuthDTO = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8),
})

export const MeDTO = z.object({
    access_token: z.string(),
    refresh_token: z.string()
})