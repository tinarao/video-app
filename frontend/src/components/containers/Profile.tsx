import { User } from '@/types/user';
import FirstInfoBlock from '@/components/pages/profile/FirstInfoBlock';
import UserVideosBlock from '@/components/pages/profile/UserVideosBlock';

const Profile = ({ user }: { user: User }) => {
  return (
    <>
      <FirstInfoBlock user={user!} />
      <UserVideosBlock user={user!} />
    </>
  );
};

export default Profile;
