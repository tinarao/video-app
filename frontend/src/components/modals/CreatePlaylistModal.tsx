import { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { api } from '@/lib/rpc';
import { toast } from 'sonner';
import { useModals } from '@/hooks/useModal';
import { useNavigate } from '@tanstack/react-router';

interface CreatePlaylistModalTypes {
  children: JSX.Element;
  isShown: boolean;
}

const CreatePlaylistModal = ({
  children,
  isShown,
}: CreatePlaylistModalTypes) => {
  const [title, setTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const { toggleCreatePlaylistModal } = useModals();
  const [isInputError, setIsInputError] = useState(false);
  const navigate = useNavigate();

  const createPlaylistHandler = async () => {
    if (title.length === 0) {
      setIsInputError(true);
      toast.error('Название плейлиста не может быть пустым!');
      return;
    }

    const playlist = {
      title,
      isPublic,
    };

    const res = await api.playlists.$post({ json: playlist });
    if (!res.ok) {
      toast.success(
        'Произошла ошибка при создании плейлиста, попробуйте позже.',
      );
      return;
    }

    const data = await res.json();

    return navigate({ to: `/profile/playlist/${data.url}` });
  };

  return (
    <Dialog open={isShown}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Создать плейлист</DialogTitle>
          <DialogDescription>
            Никита электроник 228 ГООООООООЛ влад а4 смартфон vivo
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full">
          <div className="space-y-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
              className={
                isInputError ? 'bg-red-200 placeholder:text-black' : ''
              }
            />
          </div>
          <div className="my-2">
            <Separator />
          </div>
          <div className="flex items-center">
            <Checkbox
              checked={isPublic}
              onCheckedChange={() => setIsPublic(!isPublic)}
            />
            <Label className="ml-2">Публичный плейлист</Label>
          </div>
        </div>
        <DialogFooter className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleCreatePlaylistModal(false);
              setIsInputError(false);
            }}
          >
            Я передумал(а)
          </Button>
          <Button size="sm" onClick={createPlaylistHandler}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
