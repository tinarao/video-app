import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { User } from '@/types/user';
import { Separator } from '../ui/separator';
import { Clock } from 'lucide-react';

interface UIMProps {
  children: JSX.Element;
  user: User;
}

const UserInfoModal = ({ children, user }: UIMProps) => {
  const registeredAt = new Date(user.createdAt!).toLocaleDateString();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="w-full py-24">
          <img
            src={user.picture as string}
            className="size-60 mx-auto rounded-full"
            alt={`Аватар пользователя ${user.username}`}
          />
          <div className="py-2">
            <h5 className="text-2xl font-medium text-center">
              {user.username}
            </h5>
            <p className="text-center">{user.bio}</p>
            <div className="py-2">
              <Separator />
            </div>
            <div className="grid grid-cols-2 w-[50%] mx-auto">
              <div className="col-span-1 bg-rose-100">
                <span className="flex items-center">
                  <Clock className="size-4 mr-2" />
                  {registeredAt}
                </span>
              </div>
              <div className="col-span-1 bg-yellow-100">
                {/* TODO: Расширить модалку с информацией */}
                <span>Количество залитых видео</span>
                <span>Общее количество лайков</span>
                <span>Общее количество просмотров</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoModal;
