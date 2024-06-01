import { useEffect } from 'react';

export const setTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
