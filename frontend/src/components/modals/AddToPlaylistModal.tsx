import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useModals } from '@/hooks/useModal';
import { api } from '@/lib/rpc';
import { Video } from '@/types/video';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Loader2, LoaderCircle } from 'lucide-react';
import { PlaylistsFrontend } from '@/types/playlists';
import { useState } from 'react';

interface ATPMProps {
  video: Video;
  userId?: number;
  children: JSX.Element;
}

const AddToPlaylistModal = ({ video, userId, children }: ATPMProps) => {
  const { toggleAddToPlaylistModalShown } = useModals();
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const addVideoHandler = async (playlist: PlaylistsFrontend) => {
    try {
      setIsUploadLoading(true);
      const res = await api.playlists['add-to-playlist'].$post({
        json: { videoID: video.id, playlistID: playlist.id },
      });
      if (!res.ok) {
        switch (res.status) {
          case 404:
            toast.error('Плейлист не найден!');
            return;
          case 403:
            toast.error('Доступ запрещён!');
            return;
          case 400:
            toast.error('Данное видео уже добавлено в выбранный плейлист.');
            return;
        }
      }
      toast.success('Видео успешно добавлено!');
      toggleAddToPlaylistModalShown(false);
      return;
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка при добавлении видео в плейлист.');
      return;
    } finally {
      setIsUploadLoading(false);
    }
  };

  const getPlaylists = async () => {
    if (!userId) return;

    const res = await api.playlists[':userID{[0-9]+}'].$get({
      param: { userID: String(userId) },
    });

    const { playlists } = await res.json();
    return playlists;
  };

  const {
    data: playlists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['playlists-profile-page'],
    queryFn: getPlaylists,
    retry: false,
  });

  if (isError) {
    toast.error('Авторизуйтесь, чтобы создавать и редактировать плейлисты');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[300px]">
        <DialogHeader>
          <DialogTitle>Выберите плейлист...</DialogTitle>
        </DialogHeader>
        <div>
          {isLoading && (
            <div className="w-full h-12 flex items-center justify-center">
              <LoaderCircle color="gray" size={20} className="animate-spin" />
            </div>
          )}
          {playlists?.length === 0 || !playlists ? (
            <h5>Вы не создали ни одного плейлиста!</h5>
          ) : (
            <>
              {playlists?.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <Button
                    disabled={isUploadLoading}
                    onClick={() => addVideoHandler(i)}
                    variant="ghost"
                    className="w-full"
                  >
                    {isUploadLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      i.title
                    )}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
