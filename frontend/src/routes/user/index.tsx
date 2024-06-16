import Header from '@/components/containers/Header';
import UserLikedVideos from '@/components/pages/profile/LikedVideos';
import UserPlaylists from '@/components/pages/profile/UserPlaylists';
import UserVideosBlock from '@/components/pages/profile/UserVideosBlock';
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
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { LucideArrowDown, Menu, UserCheck, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { z } from 'zod';
import UserInfoModal from '../../components/modals/UserInfoModal';
import { PlaylistsFrontend } from '@/types/playlists';

export const Route = createFileRoute('/user/')({
  component: UsernameRoute,
  validateSearch: (search) => searchValidator.parse(search),
  beforeLoad: (opts) => {
    if (!opts.search.name) {
      throw redirect({ to: '/' });
    }
  },
});

const searchValidator = z.object({
  name: z.string().min(4).max(20), // username
});

type SearchParams = z.infer<typeof searchValidator>;

const panels = {
  'my-videos': 'Видео',
  'liked-videos': 'Понравившиеся видео',
  'my-playlists': 'Плейлисты',
};

type Panels = keyof typeof panels;

function UsernameRoute() {
  const { name: usernameParam }: SearchParams = Route.useSearch();
  const { data: activeUser } = useQuery(userQueryOpts); // the one who watches the page
  const [currentPanel, setCurrentPanel] = useState<Panels>('my-videos');
  const [nonEmptyPlaylists, setNonEmptyPlaylists] = useState<
    PlaylistsFrontend[] | undefined
  >(undefined);
  const navigate = useNavigate();
  const [isSubscribed, setIsSubcribed] = useState(false);

  const getUser = async () => {
    const res = await api.users['by-username'][':username'].$get({
      param: { username: usernameParam },
    });
    return await res.json();
  };

  const {
    data: user,
    isError,
    isLoading,
    isSuccess,
    failureCount,
  } = useQuery({
    queryFn: getUser,
    queryKey: ['get-user-by-username'],
  });

  useEffect(() => {
    if (isSuccess) {
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
  }, [isSuccess, activeUser, user?.subscribers, user?.username]);

  useEffect(() => {
    if (isSuccess) {
      const nonEmptyPl = user.playlists.filter((p) => p.videos.length !== 0);
      setNonEmptyPlaylists(nonEmptyPl);
    }
  }, [isSuccess, user?.playlists]);

  if (isError) {
    return navigate({ to: '/' });
  }

  return (
    <>
      <Header />
      <main className="container py-4">
        {isLoading ? (
          <div className="w-full py-32 text-center text-3xl">
            <h3>
              {failureCount === 0 && 'Ищем...'}
              {failureCount === 1 && 'Поиски затянулись...'}
              {failureCount === 2 && 'Подключили следственный комитет...'}
              {failureCount === 3 && 'Пользователь не найден 😢'}
            </h3>
          </div>
        ) : (
          <div>
            <div className="flex border-b py-2 justify-between items-end">
              {/* Info panel */}
              <div className="flex items-center">
                <img
                  className="size-20 rounded-full"
                  src={user!.picture}
                  alt={`Аватарка ${user!.username}`}
                />
                <div className="pl-4">
                  <h1 className="text-5xl">{user!.username}</h1>
                </div>
              </div>
              <div className="flex gap-4">
                <UserInfoModal user={user!}>
                  <Button variant="outline">Подробнее о пользователе</Button>
                </UserInfoModal>
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
            <div className="py-4">
              {currentPanel === 'my-videos' && (
                <UserVideosBlock videos={user!.videos} />
              )}
              {currentPanel === 'liked-videos' && (
                <UserLikedVideos videos={user!.likedVideos} />
              )}
              {currentPanel === 'my-playlists' && (
                <UserPlaylists playlists={nonEmptyPlaylists} />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
