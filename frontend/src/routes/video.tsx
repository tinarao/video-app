import Header from '@/components/containers/Header';
import PlayVideoMainWidget from '@/components/pages/video/PlayVideoMainWidget';
import { setTitle } from '@/hooks/useTitle';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import {
  Link,
  Navigate,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { z } from 'zod';
import { Fragment, useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';

const searchParams = z.object({
  nid: z.string().min(4).max(20),
});

export const Route = createFileRoute('/video')({
  component: PostComponent,
  validateSearch: (search) => searchParams.parse(search),
  beforeLoad: (opts) => {
    if (!opts.search.nid) {
      return redirect({ to: '/' });
    }
  },
});

function PostComponent() {
  const { data: user } = useQuery(userQueryOpts);
  const { nid: videoURL } = Route.useSearch();

  const getVideo = async (videoID: string) => {
    const res = await api.videos[':url'].$get({ param: { url: videoID } });

    const { foundVid } = await res.json();
    return foundVid;
  };

  const getRecommendations = async () => {
    const res = await api.videos.search.cat.$get({
      query: { category: video!.category },
    });
    const data = await res.json();
    return data;
  };

  const {
    data: video,
    isLoading: isLoadingV,
    isSuccess: isSuccessV,
    isError: isErrorV,
  } = useQuery({
    queryKey: ['video_page', videoURL],
    queryFn: () => getVideo(videoURL),
    retry: false,
  });

  const {
    data: recoms,
    isLoading: isLoadingR,
    isSuccess: isSuccessR,
  } = useQuery({
    queryKey: ['video_page_recommendations', videoURL],
    queryFn: getRecommendations,
    retry: false,
    enabled: !!video?.category,
  });

  useEffect(() => {
    if (isSuccessV) {
      setTitle(`${video!.title} - ${video!.author.username}`);
    }
  }, [isSuccessV, video, recoms]);

  if (isErrorV) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <PlayVideoMainWidget
        user={user}
        video={video!}
        isLoading={isLoadingV}
        isSuccess={isSuccessV}
      >
        <Fragment>
          {isLoadingR ? (
            <LoaderCircle size={24} />
          ) : (
            <>
              {/* 
                  TODO: Придумать что-то получше
             */}
              {isSuccessR ? (
                <div className="space-y-2">
                  {recoms?.map((i) => (
                    <Link
                      to="/video"
                      search={{ nid: i.url }}
                      key={i.id}
                      className="flex gap-2 px-2 group"
                    >
                      <video
                        src={i.video}
                        className="w-36 min-w-36 rounded-md line-clamp-2 text-ellipsis"
                      ></video>
                      <div className="flex flex-col justify-between">
                        <h5 className="font-medium text-lg group-hover:text-neutral-400 transition duration-75">
                          {i.title}
                        </h5>
                        <h5>{i.author.username}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <h5>Рекоммендаций не нашли</h5>
              )}
            </>
          )}
        </Fragment>
      </PlayVideoMainWidget>
    </>
  );
}
