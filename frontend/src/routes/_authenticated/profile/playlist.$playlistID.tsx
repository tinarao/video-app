import Header from '@/components/containers/Header';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/profile/playlist/$playlistID',
)({
  component: PlaylistComponent,
});

function PlaylistComponent() {
  const { playlistID } = Route.useParams();

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
  } = useQuery({
    queryKey: ['profile-playlist-page'],
    queryFn: getPlaylistInfo,
    retry: false,
  });

  if (isError) {
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <Header />
      <main>
        {isLoading ? (
          <div className="h-80 col-span-4 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <div>
            <h1>{playlist!.title}</h1>
          </div>
        )}
      </main>
    </>
  );
}
