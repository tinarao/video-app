import NothingHere from '@/components/containers/NothingHere';
import VideoCard from '@/components/shared/VideoCard';
import { api } from '@/lib/rpc';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const UserLikedVideos = ({ user }: { user: User }) => {
  const [metric, setMetric] = useState(0);

  const getVideos = async () => {
    const time = performance.now();

    // get liked vids
    const res = await api.videos.liked[':userID'].$get({
      param: { userID: String(user.id) },
    });

    const { videos } = await res.json();
    console.log(videos);
    setMetric(performance.now() - time);

    return videos;
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

export default UserLikedVideos;
