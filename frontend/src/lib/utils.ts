import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from './rpc';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const viewsHandler = async (videoID: number) => {
  const res = await api.videos.view[':id{[0-9]+}'].$patch({
    param: { id: String(videoID) }
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  }

  return
}