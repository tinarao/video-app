import { Video } from '@/types/video';
import VideoPlayer from '@/components/shared/VideoPlayer';
import { Button } from '@/components/ui/button';
import AddToPlaylistModal from '@/components/modals/AddToPlaylistModal';
import { Eye, Heart, ListPlusIcon, LoaderCircle } from 'lucide-react';
import { viewsHandler } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { api } from '@/lib/rpc';
import { useLikes } from '@/hooks/useLikes';

interface PVMWProps {
  user?: User;
  video: Video;
  isSuccess: boolean;
  isLoading: boolean;

  children: JSX.Element;
}

const PlayVideoMainWidget = ({
  video,
  isSuccess,
  isLoading,
  user,
  children,
}: PVMWProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isViewCounted, setIsViewCounted] = useState(false);
  const { likedVideos, addLikedVideo, removeLikedVideo } = useLikes();

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

  useEffect(() => {
    if (isSuccess) {
      if (likedVideos.includes(video!.id)) setIsLiked(true);
    }
  }, [likedVideos, video, isSuccess]);

  useEffect(() => {
    if (isSuccess && !isViewCounted) {
      viewsHandler(video.id);
      setIsViewCounted(true); // защита от накрутки, kind of
    }
  }, [isSuccess, video]);

  // console.log({ widget: 'pvmw', video });

  return (
    <div className="container-wrapper grid grid-cols-11 gap-2 py-4">
      {isLoading && !isSuccess ? (
        <div className="h-80 col-span-4 flex items-center justify-center">
          <LoaderCircle color="black" size={50} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="col-span-8">
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
                to={`/user/${video!.author!.username}`}
                className="inline-flex items-center gap-4 group"
              >
                <img
                  src={video!.author!.picture as string}
                  className="rounded-full size-10 group-hover:shadow-md transition"
                  alt={`Аватарка пользователя ${video!.author!.username}`}
                />
                <div>
                  <h5 className="font-medium group-hover:underline">
                    {video!.author!.username}
                  </h5>
                </div>
              </Link>
              <div className="flex justify-between py-4">
                {user ? (
                  <AddToPlaylistModal video={video!} userId={user?.id}>
                    <Button size="sm" variant="outline">
                      <ListPlusIcon className="size-4 mr-2" />
                      Добавить в плейлист
                    </Button>
                  </AddToPlaylistModal>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/login">
                      <ListPlusIcon className="size-4 mr-2" />
                      Добавить в плейлист
                    </Link>
                  </Button>
                )}

                <Button variant="ghost" size="icon" onClick={likeHandler}>
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
          <div className="col-span-3">{children}</div>
        </>
      )}
    </div>
  );
};

export default PlayVideoMainWidget;
