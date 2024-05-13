export interface Video {
  id?: number
  title: string
  desc?: string
  video: string
  views?: number
  authorID: number
}

export const VideoMocks = [
  {
    id: 0,
    title: 'me at the zoo',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
  },
  {
    id: 1,
    title: 'another video',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 9
  },
  {
    id: 2,
    title: 'very nice vid',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 10
  },
  {
    id: 3,
    title: 'pipe festival',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 9
  },
];
