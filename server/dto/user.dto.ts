import { z } from "zod";

export const updateProfileDTO = z.object({
    bio: z.string(),
    family_name: z.string(),
    given_name: z.string(),
    username: z.string(),
    picture: z.string()
})