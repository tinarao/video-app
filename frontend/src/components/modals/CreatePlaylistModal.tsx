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
import { User } from '@/types/user';
import { toast } from 'sonner';

interface CreatePlaylistModalTypes {
  children: JSX.Element;
  user: User;
}

const CreatePlaylistModal = ({ children }: CreatePlaylistModalTypes) => {
  const [title, setTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);

  const createPlaylistHandler = async () => {
    const playlist = {
      title,
      isPublic,
    };

    const res = await api.playlists.$post({ json: playlist });
    const data = await res.json();
    if (!res.ok) {
      toast.success(
        'Произошла ошибка при создании плейлиста, попробуйте позже.',
      );
      return;
    }

    return data;
  };

  return (
    <Dialog>
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
        <DialogFooter>
          <Button onClick={createPlaylistHandler}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
