import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { MenuIcon, Trash } from 'lucide-react';
import { PlaylistsFrontend } from '@/types/playlists';
import { api } from '@/lib/rpc';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const EditPlaylistMenu = ({ playlist }: { playlist: PlaylistsFrontend }) => {
  const navigate = useNavigate();
  const deleteHandler = async () => {
    try {
      await api.playlists[':playlistID{[0-9]+}'].$delete({
        param: { playlistID: String(playlist.id) },
      });

      toast.success('Плейлист удалён!');
      navigate({ to: '/profile' });
      return;
    } catch (error) {
      toast.error('Произошла ошибка при удалении, попробуйте позже.');
      return;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Настройки</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={deleteHandler}>
          <Trash className="size-4 mr-2" /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditPlaylistMenu;
