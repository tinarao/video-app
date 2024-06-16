import { User } from '@/types/user';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscribes';
import { UserPlus2, UserRoundX } from 'lucide-react';
import { toast } from 'sonner';

interface SBProps {
  currentUser?: User;
  targetUser: User;
}

const SubscribeButton = ({ currentUser, targetUser }: SBProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { subscriptionIDs } = useSubscriptions();

  useEffect(() => {
    if (!currentUser) {
      setIsSubscribed(false);
      return;
    }

    const isSubscribedTo = subscriptionIDs.includes(targetUser.id);
    setIsSubscribed(isSubscribedTo);
  }, [currentUser, subscriptionIDs, targetUser.id]);

  const unsubscribeHandler = async () => {
    toast.success('Отписан');
  };

  const subscribeHandler = async () => {
    toast.success('Подписан');
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
