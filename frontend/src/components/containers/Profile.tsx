import { User } from '@/types/user';
import FirstInfoBlock from '@/components/pages/profile/FirstInfoBlock';
import UserVideosBlock from '@/components/pages/profile/UserVideosBlock';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import UserLikedVideos from '../pages/profile/LikedVideos';
import UserPlaylists from '../pages/profile/UserPlaylists';
import { PlusSquare } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import CreatePlaylistModal from '../modals/CreatePlaylistModal';

const panels = {
  'my-videos': 'Мои видео',
  'liked-videos': 'Понравившиеся видео',
  'my-playlists': 'Мои плейлисты',
};

const Profile = ({ user }: { user: User }) => {
  type Panels = keyof typeof panels;
  const [currentPanel, setCurrentPanel] = useState<Panels>('my-videos');

  return (
    <>
      <FirstInfoBlock user={user!} />
      <div className="container py-4 flex gap-8 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-48">
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
        {currentPanel === 'my-playlists' && (
          <CreatePlaylistModal user={user}>
            <Button variant="ghost" size="sm">
              <PlusSquare className="size-4 mr-2" />
              Создать плейлист
            </Button>
          </CreatePlaylistModal>
        )}
        {currentPanel === 'my-videos' && (
          <Button asChild variant="ghost" size="sm">
            <Link to="/upload">
              <PlusSquare className="size-4 mr-2" />
              Загрузить видео
            </Link>
          </Button>
        )}
      </div>
      {currentPanel === 'my-videos' && <UserVideosBlock user={user!} />}
      {currentPanel === 'liked-videos' && <UserLikedVideos user={user!} />}
      {currentPanel === 'my-playlists' && <UserPlaylists user={user!} />}
    </>
  );
};

export default Profile;
