import Header from '@/components/containers/Header';
import PlayVideoMainWidget from '@/components/pages/video/PlayVideoMainWidget';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { Fragment } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/playlist/')({
  component: PlaylistView,
  validateSearch: (search) => searchValidator.parse(search),
});

const searchValidator = z.object({
  playlistUrl: z.string().min(4).max(20),
  index: z.number().min(0).catch(0),
});

type searchParams = z.infer<typeof searchValidator>;

function PlaylistView() {
  const { playlistUrl, index }: searchParams = Route.useSearch();
  const {
    data: playlist,
    isError,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [`playlist-${playlistUrl}`],
    queryFn: async () => {
      const res = await api.playlists['playlist-id'][':playlistUrl'].$get({
        param: { playlistUrl },
      });
      return await res.json();
    },
  });

  if (isError) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      {isSuccess ? (
        <PlayVideoMainWidget
          video={playlist.videos[index]}
          isLoading={isLoading}
          isSuccess={isSuccess}
        >
          <Fragment>
            <div className="border rounded-md py-2 space-y-2">
              <h1>{index}</h1>
              <div className="border-b pb-4 flex justify-center items-center">
                <Link
                  to="/user/$username"
                  className="font-medium text-lg"
                  params={{ username: playlist.author.username }}
                >
                  {playlist.title} - плейлист от {playlist.author.username}
                </Link>
              </div>
              {playlist.videos.map((video, index) => (
                <Link
                  to="/playlist"
                  search={{ playlistUrl: playlistUrl, index: index }}
                  key={video.id}
                  className="flex gap-2 px-2"
                >
                  <video
                    src={video.video}
                    className="w-36 min-w-36 rounded-md line-clamp-2 text-ellipsis"
                  ></video>
                  <h5>{index}</h5>
                  <div className="flex flex-col justify-between">
                    <h5 className="font-medium text-lg">{video.title}</h5>
                    <h5>{video.author.username}</h5>
                  </div>
                </Link>
              ))}
            </div>
          </Fragment>
        </PlayVideoMainWidget>
      ) : (
        <div className="py-48">
          <LoaderCircle size={32} className="animate-spin mx-auto" />
        </div>
      )}
    </>
  );
}
