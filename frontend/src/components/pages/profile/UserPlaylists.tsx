import NothingHere from '@/components/containers/NothingHere';
import { PlaylistsFrontend } from '@/types/playlists';
import { Link } from '@tanstack/react-router';

interface UPProps {
  playlists?: PlaylistsFrontend[];
}

const UserPlaylists = ({ playlists }: UPProps) => {
  return (
    <>
      {!playlists || playlists.length === 0 ? (
        <NothingHere />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {playlists.map((i) => (
            <div key={i.id} className="group">
              <Link to={`/profile/playlist/${i.url}`} className="col-span-1">
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
  );
};

export default UserPlaylists;
