import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LikeStorage {
  likedVideos: number[];
  addLikedVideo: (vid: number) => void;
  removeLikedVideo: (vid: number) => void;
}

export const useLikes = create<LikeStorage>()(
  persist(
    (set, get) => ({
      likedVideos: [],
      addLikedVideo: (vid) => {
        const likedVideos = get().likedVideos;
        const newLikedVideos = [...likedVideos, vid];
        set({ likedVideos: newLikedVideos });
      },
      removeLikedVideo: (vid) => {
        const likedVideos = get().likedVideos;
        const newLikedVideos = likedVideos.filter((i) => i !== vid);
        set({ likedVideos: newLikedVideos });
      },
    }),
    {
      name: 'liked_videos',
    },
  ),
);
