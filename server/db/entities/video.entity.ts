import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    title: string

    @Column("text")
    video: string

    @Column({ type: "numeric", default: 0, nullable: false })
    views: number

    @Column({ type: "numeric", default: 0, nullable: false })
    likes: number

    @Column({ type: "text", nullable: true })
    url: string

    @ManyToOne(() => User, (user) => user.videos)
    author: User

    @ManyToOne(() => User, (user) => user.likedVideos)
    likedBy: User

    @Column("text")
    desc: string

    @Column("timestamptz")
    createdAt: Date | string
}