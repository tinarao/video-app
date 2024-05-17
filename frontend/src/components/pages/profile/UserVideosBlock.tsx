import { api } from '@/lib/rpc';
import { UserType } from '@kinde-oss/kinde-typescript-sdk';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, TvIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import VideoCard from '../shared/VideoCard';

const UserVideosBlock = ({ user }: { user: UserType }) => {
  const [metric, setMetric] = useState(0);

  const getVideos = async () => {
    const time = performance.now();
    const res = await api.videos[':userID'].$get({
      param: { userID: user.id },
    });
    const videos = await res.json();

    console.log(videos);
    setMetric(performance.now() - time);

    return videos.videos;
  };

  const {
    data: vids,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['videosProfilePage'],
    queryFn: getVideos,
  });

  if (isFetched) {
    toast.success(`fetched videos in ${metric.toFixed(2)} millisec.`);
    console.log(vids);
  }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <>
            {!vids || vids.length === 0 ? (
              <div>
                <TvIcon size={48} className="w-fit mx-auto" />
                <h1 className="text-6xl text-center">
                  Здесь пусто! Загрузите своё первое видео или подпишитесь на
                  интересующие каналы.
                </h1>
              </div>
            ) : (
              <>
                {vids.map((i) => (
                  <VideoCard vid={i} key={i.id} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserVideosBlock;
