import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import VideoCard from '../../shared/VideoCard';
import { User } from '@/types/user';
import NothingHere from '@/components/containers/NothingHere';

const UserVideosBlock = ({ user }: { user: User }) => {
  const [metric, setMetric] = useState(0);

  const getVideos = async () => {
    const time = performance.now();

    const res = await api.videos['by-user'][':userID{[0-9]+}'].$get({
      param: { userID: String(user.id) },
    });

    const videos = await res.json();
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
    toast.success(`fetched user's videos in ${metric.toFixed(2)} millisec.`);
  }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <>
            {!vids || vids.length === 0 ? (
              <NothingHere />
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
