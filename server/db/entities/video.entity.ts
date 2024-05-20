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

    @Column("numeric")
    views: number

    @Column({ type: "text", nullable: true })
    url: string

    @ManyToOne(() => User, (user) => user.videos)
    author: User

    @Column("text")
    desc: string

    @Column("timestamptz")
    createdAt: Date | string
}