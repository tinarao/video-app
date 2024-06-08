import NothingHere from '@/components/containers/NothingHere';
import { api } from '@/lib/rpc';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

const UserPlaylists = ({ user }: { user: User }) => {
  const getVideos = async () => {
    const res = await api.playlists[':userID{[0-9]+}'].$get({
      param: { userID: String(user.id) },
    });

    const { playlists } = await res.json();

    return playlists;
  };

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists-profile-page'],
    queryFn: getVideos,
  });

  return (
    <div className="container py-4">
      {isLoading ? (
        <LoaderCircle color="black" size={50} className="animate-spin" />
      ) : (
        <>
          {!playlists || playlists.length === 0 ? (
            <NothingHere />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {playlists.map((i) => (
                <div key={i.id} className="group">
                  <Link
                    to={`/profile/playlist/${i.url}`}
                    className="col-span-1"
                  >
                    {i.videos.length === 0 ? (
                      <img
                        src="https://www.forexpeacearmy.com/images/placeholder/video.png"
                        alt="Пустой плейлист"
                        className="rounded-md group-hover:shadow-xl transition"
                      />
                    ) : (
                      <video src={i.videos[0].video}></video>
                    )}
                    <h5 className="font-medium mt-1 text-lg line-clamp-1 text-ellipsis">
                      {i.title}
                    </h5>
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
