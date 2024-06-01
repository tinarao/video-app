import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './button';
import { api } from '@/lib/rpc';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { Link } from '@tanstack/react-router';

const ProfileDropdown = ({ user }: { user: User }) => {
  const handleLogout = async () => {
    const res = await api.auth.logout.$get();
    if (!res.ok) {
      const json = await res.json();
      console.log(json);
      toast.error('Произошла ошибка при выходе из аккаунта');
      return;
    }
    toast.success('Успешно!');
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg">
          <img
            src={user.picture || 'https://amu.edu.kz/upload/default-avatar.jpg'}
            className="size-8 mr-2 rounded-full"
          />
          {user.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile">Мой профиль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/dashboard">Дашборд</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/upload">Загрузить видео</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
