import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Video } from "./video.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text", unique: true, nullable: true })
    email: string

    @Column({ type: "text", nullable: true })
    family_name: string

    @Column({ type: "text", nullable: true })
    given_name: string

    @Column({ type: "text", unique: true })
    username: string // basically its f_name + g_name or reverse idk

    @Column({ type: "text", select: false })
    password: string // basically its f_name + g_name or reverse idk

    @Column({ type: "text", nullable: false, default: "https://mygardenia.ru/uploads/pers1.jpg" })
    picture: string | null

    @Column("timestamptz")
    createdAt: Date | string

    @Column({ type: "boolean", nullable: false, default: false })
    isVerified: boolean

    @OneToMany(() => Video, (video) => video.author, { nullable: true })
    videos: Video[]

    @OneToMany(() => Video, (video) => video.likedBy, { nullable: true })
    likedVideos: Video[]
}