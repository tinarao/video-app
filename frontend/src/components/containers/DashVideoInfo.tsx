import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, Eye, EyeOff, Heart } from 'lucide-react';
import { Video } from '@/types/video';
import { toast } from 'sonner';
import { api } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { User } from '@/types/user';
import { useState } from 'react';

interface DVIProps {
  video: Video;
  user: User;
}

const DashVideoInfo = ({ video, user }: DVIProps) => {
  const createdAt = new Date(video.createdAt).toLocaleString();
  const [isVideoHidden, setIsVideoHidden] = useState(video.isHidden);

  const status = useMutation({
    onError: () => toast.error('Произошла ошибка, попробуйте позже'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['videos-by-user', user!.id],
      });
    },
    mutationFn: async (action: 'show' | 'hide') => {
      const res = await api.videos.access[':videoID{[0-9]+}'][':action'].$patch(
        {
          param: { videoID: String(video.id), action: action },
        },
      );
      if (!res.ok) {
        switch (res.status) {
          case 404:
            toast.error('Видео не найдено');
            break;
          case 403:
            toast.error('Произошла ошибка аутентификации');
            break;
          case 400:
            toast.error('Ошибка при редактирования статуса видео');
            break;
        }
      }

      if (action === 'hide') {
        setIsVideoHidden(true);
        toast.info(
          `
          Видео "${video.title}" было успешно скрыто из общего доступа.
          Другие пользователи всё ещё могут открыть видео, если у них есть прямая ссылка.
          `,
        );
      }

      if (action === 'show') {
        setIsVideoHidden(false);
        toast.info(
          `Доступ к видео "${video.title}" открыт. Теперь его могут просмотреть все пользователи.`,
        );
      }
      return;
    },
  });

  return (
    <div className="py-4 px-2 border-y flex justify-between items-center">
      <div className="flex gap-2">
        <video src={video.video} className="h-20 rounded-md"></video>
        <div>
          <Link
            to="/video"
            search={{ nid: video.url }}
            target="_blank"
            className="font-medium text-xl line-clamp-1 text-ellipsis hover:text-neutral-500 transition hover:underline"
          >
            {video.title}
          </Link>
          <div className="inline-flex items-center text-muted-foreground">
            <Clock className="size-4 mr-2" />
            <span className="font-medium text-sm">{createdAt}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="grid grid-cols-2 w-48 text-muted-foreground">
          <div className="flex items-center col-span-1">
            <Heart className="size-5 mr-2" />
            <span className="font-medium text-md">{video.likes}</span>
          </div>
          <div className="flex items-center col-span-1">
            {isVideoHidden ? (
              <EyeOff className="size-5 mr-2" />
            ) : (
              <Eye className="size-5 mr-2" />
            )}
            <span className="font-medium text-md">{video.views}</span>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Действия</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {isVideoHidden ? (
                <DropdownMenuItem onClick={() => status.mutate('show')}>
                  Открыть доступ
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => status.mutate('hide')}>
                  Закрыть доступ
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashVideoInfo;
