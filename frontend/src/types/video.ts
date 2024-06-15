import { User } from "./user";

export interface Video {
    id: number;
    title: string;
    video: string;
    views: number;
    likes: number;
    url: string;
    desc: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    authorID: number;
    isHidden: boolean;

    author?: User
}

export const categories = [
    { id: 0, value: "Музыка", slug: "music" },
    { id: 1, value: "Игры", slug: "games" },
    { id: 2, value: "Кино", slug: "movies" },
    { id: 3, value: "Жизнь", slug: "lifestyle" },
    { id: 4, value: "Красота и здоровье", slug: "beauty-and-health" },
    { id: 5, value: "Коты и собачки", slug: "cats-and-dogs" },
    { id: 6, value: "Прочее", slug: "other" }
]

export type CategoriesValues = "Музыка" | "Игры" | "Кино" | "Жизнь" | "Красота и здоровье" | "Коты и собачки" | "Прочее"
export type CategoriesSlugs = "music" | "games" | "movies" | "lifestyle" | "beauty-and-health" | "cats-and-dogs" | "other"