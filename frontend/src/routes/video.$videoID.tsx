import Header from '@/components/containers/Header';
import AddToPlaylistModal from '@/components/modals/AddToPlaylistModal';
import VideoPlayer from '@/components/shared/VideoPlayer';
import { Button } from '@/components/ui/button';
import { useLikes } from '@/hooks/useLikes';
import { useModals } from '@/hooks/useModal';
import { setTitle } from '@/hooks/useTitle';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { cn, viewsHandler } from '@/lib/utils';
import { queryClient } from '@/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, Navigate, createFileRoute } from '@tanstack/react-router';
import { Eye, Heart, ListPlusIcon, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/video/$videoID')({
  component: PostComponent,
});

function PostComponent() {
  const { data: user } = useQuery(userQueryOpts);
  const [isLiked, setIsLiked] = useState(false);
  const { videoID } = Route.useParams();
  const { likedVideos, addLikedVideo, removeLikedVideo } = useLikes();
  const { isAddToPlaylistModalShown, toggleAddToPlaylistModalShown } =
    useModals();
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
      viewsHandler(video!.id);
      if (likedVideos.includes(video!.id)) setIsLiked(true);
      setTitle(video!.title);
    }
  }, [isSuccess, video, likedVideos]);

  const getVideo = async (videoID: string) => {
    const res = await api.videos[':url'].$get({ param: { url: videoID } });

    const data = await res.json();
    return data.foundVid;
  };

  const like = useMutation({
    onError: () => toast.error('Произошла ошибка, попробуйте позже'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['video_page'] });
    },
    mutationFn: async (action: string) => {
      const res = await api.videos.like[':id{[0-9]+}'][':isLiking'].$patch({
        param: { id: String(video!.id), isLiking: action },
      });

      console.log(await res.json());
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

    if (!isLiked) {
      like.mutateAsync('like');
      setIsLiked(true);
      addLikedVideo(video!.id);
      return;
    }

    like.mutateAsync('dislike');
    setIsLiked(false);
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
                <Link
                  to={`/user/${video!.author.username}`}
                  className="inline-flex items-center gap-4 group"
                >
                  <img
                    src={video!.author.picture as string}
                    className="rounded-full size-10 group-hover:shadow-md transition"
                    alt={`Аватарка пользователя ${video!.author.username}`}
                  />
                  <div>
                    <h5 className="font-medium group-hover:underline">
                      {video!.author.username}
                    </h5>
                  </div>
                </Link>
                <div className="flex justify-between py-4">
                  <AddToPlaylistModal
                    isOpen={isAddToPlaylistModalShown}
                    video={video!}
                    user={user!}
                  />
                  <Button
                    onClick={() => {
                      if (!user) {
                        toast.error(
                          'Авторизуйтесь, чтобы создавать и редактировать плейлисты!',
                        );
                        return;
                      }

                      toggleAddToPlaylistModalShown(true);
                      return;
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <ListPlusIcon className="size-4 mr-2" />
                    Добавить в плейлист
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={like.isPending}
                    onClick={likeHandler}
                  >
                    <Heart
                      className={cn(
                        'size-4',
                        likedVideos.includes(video!.id) &&
                          'shadow-2xl shadow-red-500 text-red-500 fill-red-500',
                      )}
                    />
                  </Button>
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
