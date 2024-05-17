import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

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

    @Column("text")
    authorID: string

    @Column("text")
    desc: string

    @Column("timestamptz")
    createdAt: Date | string
}