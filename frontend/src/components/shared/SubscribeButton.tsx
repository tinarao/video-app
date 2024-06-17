import { User } from '@/types/user';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscribes';
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
  const [isTheSameUser, setIsTheSameUser] = useState(false);
  const { subscriptionIDs, subscribe, unsubscribe } = useSubscriptions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setIsSubscribed(false);
      return;
    }

    if (currentUser.id === targetUser.id) {
      setIsTheSameUser(true);
      return;
    }

    const isSubscribedTo = subscriptionIDs.includes(targetUser.id);
    setIsSubscribed(isSubscribedTo);
  }, [currentUser, targetUser.id, subscriptionIDs]);

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

    unsubscribe(targetUser.id);
    queryClient.invalidateQueries({ queryKey: ['get-user-by-username'] });
    console.log(await res.json());
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

    subscribe(targetUser.id);
    queryClient.invalidateQueries({ queryKey: ['get-user-by-username'] });
    console.log(await res.json());
    return;
  };

  // TODO: Функционал подписок завозить сюда
  return (
    <>
      {isSubscribed ? (
        <Button
          disabled={isTheSameUser}
          onClick={unsubscribeHandler}
          variant="outline"
          className="hover:bg-rose-400 hover:text-white"
        >
          <UserRoundX className="size-4 mr-2" /> Отписаться
        </Button>
      ) : (
        <Button
          disabled={isTheSameUser}
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
