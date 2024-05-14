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

interface UserProp {
  picture: string | null;
  family_name: string;
  given_name: string;
  email: string;
  id: string;
}

const ProfileDropdown = ({ user }: { user: UserProp }) => {
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
          {user.family_name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
