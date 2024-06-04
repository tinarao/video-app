import NothingHere from '@/components/containers/NothingHere';
import { api } from '@/lib/rpc';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const UserPlaylists = ({ user }: { user: User }) => {
  const [metric, setMetric] = useState(0);

  const getVideos = async () => {
    const time = performance.now();

    const res = await api.playlists[':userID{[0-9]+}'].$get({
      param: { userID: String(user.id) },
    });

    const { playlists } = await res.json();
    setMetric(performance.now() - time);

    return playlists;
  };

  const {
    data: playlists,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['playlists-profile-page'],
    queryFn: getVideos,
  });

  if (isFetched) {
    toast.success(`fetched user's videos in ${metric.toFixed(2)} millisec.`);
    console.log(playlists);
  }

  return (
    <div className="container py-4">
      {isLoading ? (
        <LoaderCircle color="black" size={50} className="animate-spin" />
      ) : (
        <>
          {!playlists || playlists.length === 0 ? (
            <NothingHere />
          ) : (
            <div className="grid grid-cols-4">
              {playlists.map((i) => (
                <div key={i.id}>
                  <Link
                    to={`/profile/playlist/${i.url}`}
                    className="col-span-1"
                  >
                    <h5>{i.title}</h5>
                    {i.videos.length === 0 ? (
                      <img
                        src="https://www.forexpeacearmy.com/images/placeholder/video.png"
                        alt="Пустой плейлист"
                      />
                    ) : (
                      <video src={i.videos[0].video}></video>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPlaylists;
