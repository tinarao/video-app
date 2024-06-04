import Profile from '@/components/containers/Profile';
import MainLayout from '@/components/layouts/main-layout';
import { userQueryOpts } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

export const Route = createLazyFileRoute('/_authenticated/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { isLoading, data: user } = useQuery(userQueryOpts);

  return (
    <MainLayout>
      <div>
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <Profile user={user!} />
        )}
      </div>
    </MainLayout>
  );
}
