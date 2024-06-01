import Header from '@/components/containers/Header';
import VideoPlayer from '@/components/shared/VideoPlayer';
import { Button } from '@/components/ui/button';
import { useLikes } from '@/hooks/useLikes';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { cn, viewsHandler } from '@/lib/utils';
import { queryClient } from '@/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Eye, Heart, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/video/$videoID')({
  component: PostComponent,
});

function PostComponent() {
  const { data: user } = useQuery(userQueryOpts);
  const [metric, setMetric] = useState(0);
  const { videoID } = Route.useParams();
  const { likedVideos, addLikedVideo, removeLikedVideo } = useLikes();
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
      toast.success(`Video page info fetched in ${metric} millisec.`);
      viewsHandler(video!.id);
    }
  }, [isSuccess]);

  const getVideo = async (videoID: string) => {
    const time = performance.now();
    const res = await api.videos[':url'].$get({ param: { url: videoID } });
    if (!res.ok) {
      throw new Error('No video');
    }
    const data = await res.json();
    const result = (performance.now() - time).toFixed(2);
    setMetric(parseInt(result));
    return data.foundVid;
  };

  const like = useMutation({
    onError: () => toast.error('Произошла ошибка, попробуйте позже'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['video_page'] });
    },
    mutationFn: async (action: string) => {
      await api.videos.like[':id{[0-9]+}'][':isLiking'].$patch({
        param: { id: String(video!.id), isLiking: action },
      });
    },
  });

  if (isError) {
    return <Navigate to="/" />;
  }

  const likeHandler = () => {
    if (!user) {
      return toast.message('Вы не авторизованы!', {
        description: 'Авторизуйтесь, чтобы получить возможность лайкать видео',
        icon: '😕',
      });
    }

    const isLiked = likedVideos.includes(video!.id);

    if (!isLiked) {
      like.mutateAsync('like');
      addLikedVideo(video!.id);
      return;
    }

    like.mutateAsync('dislike');
    removeLikedVideo(video!.id);
    return;
  };

  return (
    <>
      <Header />
      <div className="container grid grid-cols-4">
        {isLoading && !isSuccess ? (
          <div className="h-80 col-span-4 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="col-span-3 py-4">
              <div>
                <VideoPlayer url={video!.video} />
              </div>
              <div className="py-2">
                <div>
                  <h1 className="text-xl font-medium line-clamp-1 text-ellipsis">
                    {video!.title}
                  </h1>
                </div>
                <div className="py-2 border-t">
                  <span className="flex items-center text-muted-foreground">
                    <Eye className="size-4 mr-2" /> {video!.views}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={video!.author!.picture as string}
                      className="rounded-full size-10"
                      alt={`Аватарка пользователя ${video!.author!.username}`}
                    />
                    <div>
                      <h5 className="font-medium">{video!.author!.username}</h5>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      disabled={like.isPending}
                      onClick={likeHandler}
                    >
                      <Heart
                        className={cn(
                          'size-4 mr-2',
                          likedVideos.includes(video!.id) &&
                            'shadow-2xl shadow-red-500 text-red-500 fill-red-500',
                        )}
                      />
                      {video!.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
          </>
        )}
      </div>
    </>
  );
}
