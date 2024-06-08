import Header from '@/components/containers/Header';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditPlaylistMenu from '@/components/ui/edit-playlist-menu';

export const Route = createFileRoute(
  '/_authenticated/profile/playlist/$playlistID',
)({
  component: PlaylistComponent,
});

function PlaylistComponent() {
  const { playlistID } = Route.useParams();
  const [createdAt, setCreatedAt] = useState<string>('');

  const getPlaylistInfo = async () => {
    const res = await api.playlists['my-playlists'][':playlistURL'].$get({
      param: { playlistURL: playlistID },
    });

    const data = await res.json();
    return data;
  };

  const {
    data: playlist,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['profile-playlist-page'],
    queryFn: getPlaylistInfo,
    retry: false,
  });

  useEffect(() => {
    if (playlist) {
      const timestamp = new Date(playlist?.createdAt).toLocaleDateString();
      setCreatedAt(timestamp);
    }

    console.log(playlist);
  }, [isSuccess, playlist]);

  if (isError) {
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <Header />
      <main className="h-[calc(100vh-4rem)]">
        {isLoading ? (
          <div className="h-80 col-span-4 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 container py-4 h-full">
            <div className="col-span-1 px-2 h-full border-r">
              <div>
                {playlist!.videos.length === 0 ? (
                  <img
                    src="https://www.forexpeacearmy.com/images/placeholder/video.png"
                    alt="Пустой плейлист"
                    className="rounded-md"
                  />
                ) : (
                  <video
                    className="rounded-md"
                    src={playlist!.videos[0].video}
                  ></video>
                )}
                <h1 className="font-medium text-2xl mt-1 mb-2">
                  {playlist!.title}
                </h1>
              </div>
              <Separator />
              <div className="py-2 flex justify-between items-center">
                <ul>
                  <li className="text-muted-foreground">Создан: {createdAt}</li>
                  <li className="text-muted-foreground">
                    {playlist!.isPublic ? 'Публичный' : 'Приватный'}
                  </li>
                  <li className="text-muted-foreground">
                    Всего видео: {playlist!.videos.length}
                  </li>
                  <li className="text-muted-foreground">
                    Автор: {playlist!.author.username}
                  </li>
                </ul>
                <EditPlaylistMenu playlist={playlist!} />
              </div>
            </div>
            <div className="col-span-2 px-2 h-full">
              {playlist!.videos.length === 0 ? (
                <div className="h-full flex justify-center items-center">
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-xl text-neutral-600">
                      Плейлист пуст!
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlist!.videos.map((i) => (
                    <Link
                      to={`/video/${i.url}`}
                      key={i.id}
                      className="flex gap-4 group"
                    >
                      <video
                        className="w-56 rounded-md group-hover:shadow-lg transition "
                        src={i.video}
                      ></video>
                      <div>
                        <h5 className="font-medium text-xl">{i.title}</h5>
                        <div className="flex items-center py-2">
                          <img
                            src={i.author.picture}
                            className="size-8 rounded-full mr-1"
                          />
                          <h5 className="font-medium text-sm">
                            {i.author.username}
                          </h5>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
