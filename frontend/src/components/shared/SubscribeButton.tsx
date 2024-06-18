import { User } from '@/types/user';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { UserPlus2, UserRoundX } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/rpc';
import { useNavigate } from '@tanstack/react-router';
import { queryClient } from '@/main';

interface SBProps {
  currentUser?: User;
  targetUser: User;
}

const SubscribeButton = ({ currentUser, targetUser }: SBProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setIsSubscribed(false);
      return;
    }

    targetUser.subscribers?.forEach((i) => {
      if (i.id === currentUser.id) {
        setIsSubscribed(true);
      }
    });
  }, [currentUser, targetUser.id]);

  const unsubscribeHandler = async () => {
    if (!currentUser) {
      navigate({ to: '/login' });
      return;
    }

    const res = await api.users.unsubscribe[':targetUserID{[0-9]+}'].$patch({
      param: { targetUserID: String(targetUser.id) },
    });
    if (!res.ok) {
      const resp = await res.text();
      return toast.error(resp);
    }

    queryClient.invalidateQueries({ queryKey: ['get-user-by-username'] });
    setIsSubscribed(false);
    return;
  };

  const subscribeHandler = async () => {
    if (!currentUser) {
      navigate({ to: '/login' });
      return;
    }

    const res = await api.users.subscribe[':targetUserID{[0-9]+}'].$patch({
      param: { targetUserID: String(targetUser.id) },
    });
    if (!res.ok) {
      const resp = await res.text();
      return toast.error(resp);
    }

    queryClient.invalidateQueries({ queryKey: ['get-user-by-username'] });
    setIsSubscribed(true);
    return;
  };

  // TODO: Функционал подписок завозить сюда
  return (
    <>
      {isSubscribed ? (
        <Button
          onClick={unsubscribeHandler}
          variant="outline"
          className="hover:bg-rose-400 hover:text-white"
        >
          <UserRoundX className="size-4 mr-2" /> Отписаться
        </Button>
      ) : (
        <Button
          onClick={subscribeHandler}
          variant="outline"
          className="hover:bg-green-300"
        >
          <UserPlus2 className="size-4 mr-2" /> Подписаться
        </Button>
      )}
    </>
  );
};

export default SubscribeButton;
