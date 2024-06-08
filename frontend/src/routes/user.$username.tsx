import Header from '@/components/containers/Header';
import VideoCard from '@/components/shared/VideoCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setTitle } from '@/hooks/useTitle';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { LucideArrowDown, Menu, UserCheck, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/user/$username')({
  component: UserProfilePage,
});

const panels = {
  'my-videos': 'Видео',
  'liked-videos': 'Понравившиеся видео',
  'my-playlists': 'Плейлисты',
};

type Panels = keyof typeof panels;

function UserProfilePage() {
  const { username: usernameParam } = Route.useParams();
  const { data: activeUser } = useQuery(userQueryOpts); // the one who watches the page
  const [currentPanel, setCurrentPanel] = useState<Panels>('my-videos');

  const [isSubscribed, setIsSubcribed] = useState(false);

  const getUser = async () => {
    const res = await api.users[':username'].$get({
      param: { username: usernameParam },
    });
    return await res.json();
  };

  const {
    data: user,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: getUser,
    queryKey: ['get-user-by-username'],
  });

  useEffect(() => {
    if (!isSuccess) {
      setTitle('Загрузка...');
    } else {
      if (!activeUser) {
        setIsSubcribed(false);
      } else {
        user.subscribers.forEach((i) => {
          if (i.id === activeUser.id) {
            setIsSubcribed(true);
          }
        });
      }

      setTitle(user?.username);
    }
  }, [user, isSuccess, activeUser]);

  if (isError) {
    return <Navigate to="/" />;
  }

  if (isSuccess) {
    console.log(user);
  }

  return (
    <>
      <Header />
      <main className="container py-4">
        {isLoading ? (
          <h1>думаем</h1>
        ) : (
          <div>
            <div className="flex border-b py-2 justify-between items-end">
              {/* Info panel */}
              <div className="flex">
                <img
                  className="size-20 rounded-full"
                  src={user!.picture}
                  alt={`Аватарка ${user!.username}`}
                />
                <div>
                  <h1 className="text-4xl ml-2">{user!.username}</h1>
                  <p>{user!.bio}</p>
                  <span>
                    {user!.family_name} {user!.given_name}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                {isSubscribed ? (
                  <Button
                    disabled={activeUser?.id === user?.id}
                    variant="outline"
                  >
                    <UserCheck className="size-4 mr-2" /> Вы подписаны!
                  </Button>
                ) : (
                  <Button disabled={activeUser?.id === user?.id}>
                    <UserPlus className="size-4 mr-2" /> Подписаться
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </div>
            </div>
            <div className="py-4 border-b">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="w-48">
                    <LucideArrowDown className="size-4 mr-2" />
                    {panels[currentPanel]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={currentPanel === 'my-videos'}
                    onCheckedChange={() => setCurrentPanel('my-videos')}
                  >
                    Мои видео
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={currentPanel === 'liked-videos'}
                    onCheckedChange={() => setCurrentPanel('liked-videos')}
                  >
                    Понравившиеся видео
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={currentPanel === 'my-playlists'}
                    onCheckedChange={() => setCurrentPanel('my-playlists')}
                  >
                    Мои плейлисты
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-4 gap-4 py-4">
              {/* Videos */}
              {user?.videos.length === 0 ? (
                <>pusto</>
              ) : (
                <>
                  {user!.videos.map((i) => (
                    <VideoCard vid={i} key={i.id} />
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
