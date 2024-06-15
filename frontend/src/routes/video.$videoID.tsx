import Header from '@/components/containers/Header';
import PlayVideoMainWidget from '@/components/pages/video/PlayVideoMainWidget';
import { setTitle } from '@/hooks/useTitle';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/video/$videoID')({
  component: PostComponent,
});

function PostComponent() {
  const { data: user } = useQuery(userQueryOpts);
  const { videoID } = Route.useParams();
  const {
    data: video,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['video_page', videoID],
    queryFn: () => getVideo(videoID),
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setTitle(`${video!.title} - ${video!.author.username}`);
    }
  }, [isSuccess, video]);

  const getVideo = async (videoID: string) => {
    const res = await api.videos[':url'].$get({ param: { url: videoID } });

    const data = await res.json();
    return data.foundVid;
  };

  if (isError) {
    return <Navigate to="/" />;
  }

  if (isError) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <PlayVideoMainWidget
        user={user}
        video={video!}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    </>
  );
}
