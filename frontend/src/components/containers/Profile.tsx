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

const Profile = ({ user }: { user: User }) => {
  type Panels = 'my-videos' | 'liked-videos';
  const [currentPanel, setCurrentPanel] = useState<Panels>('my-videos');

  return (
    <>
      <FirstInfoBlock user={user!} />
      <div className="container py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-48">
              {currentPanel === 'my-videos'
                ? 'Мои видео'
                : 'Понравившиеся видео'}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {currentPanel === 'my-videos' ? (
        <UserVideosBlock user={user!} />
      ) : (
        <UserLikedVideos user={user!} />
      )}
    </>
  );
};

export default Profile;
