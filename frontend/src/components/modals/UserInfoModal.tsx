import { User } from '@/types/user';
import { Clock, Eye, Globe, User2, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { getHost } from '@/lib/utils';
import { toast } from 'sonner';

interface UIMProps {
  children: JSX.Element;
  user: User;
}

const UserInfoModal = ({ children, user }: UIMProps) => {
  const registeredAt = new Date(user.createdAt!).toLocaleDateString();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="py-8">
        <img
          src={user.picture as string}
          className="size-60 mx-auto rounded-full"
          alt={`Аватар пользователя ${user.username}`}
        />
        <div className="py-2">
          <h5 className="text-2xl font-medium text-center pb-4">
            {user.username}
          </h5>

          <div>
            <p className="whitespace-pre-line">{user.bio}</p>
            <div className="py-2">
              <Separator />
            </div>
          </div>

          <div className="grid grid-cols-2 w-[60%] mx-auto">
            <div className="col-span-1 flex flex-col">
              <div className="flex items-center">
                <Clock className="size-4 mr-2" />
                {registeredAt}
              </div>
              <div className="flex items-center">
                <User2 className="size-4 mr-2" />
                {!(user.given_name || user.family_name) ? (
                  'Имя скрыто'
                ) : (
                  <>
                    {user.given_name || null}
                    {user.family_name || null}
                  </>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <Video className="size-4 mr-2" />
                <span>{user.uploadedVideosCount} видео</span>
              </div>
              <div className="flex items-center">
                <Eye className="size-4 mr-2" />
                <span>{user.uploadedVideosViewsCount} просмотров</span>
              </div>
            </div>
          </div>
          <div className="py-4">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const host = getHost();
                  navigator.clipboard
                    .writeText(`${host}/user?name=${user.username}`)
                    .then(() => {
                      toast.success('Ссылка скопирована!');
                    })
                    .catch(() => toast.error('Не удалось скопировать ссылку'));
                }}
              >
                <Globe className="size-4 mr-2" /> Скопировать ссылку
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoModal;
