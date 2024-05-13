import { createLazyFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

import { useEffect, useState } from 'react';
import { api } from '@/lib/rpc';
import { Video } from '@server/types/video';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const [videos, setVideos] = useState<Video[]>([]);
  const isPending = false;

  useEffect(() => {
    const getVideos = async () => {
      let time = performance.now();
      const data = await api.videos.$get();
      const vids = await data.json();
      setVideos(vids.data);
      time = performance.now() - time;

      console.log(`fetched videos in ${time.toFixed(2)} millisec.`);
    };

    getVideos();
  }, []);

  return (
    <div className="container">
      {isPending ? (
        <div className="h-80 flex items-center justify-center">
          <LoaderCircle color="black" size={50} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {videos.map((i) => (
            <div key={i.id} className="col-span-1 p-2 border rounded-md">
              <h1>{i.title}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
