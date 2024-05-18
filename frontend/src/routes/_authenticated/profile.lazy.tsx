import MainLayout from '@/components/layouts/main-layout';
import FirstInfoBlock from '@/components/pages/profile/FirstInfoBlock';
import UserVideosBlock from '@/components/pages/profile/UserVideosBlock';
import { userQueryOpts } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

export const Route = createLazyFileRoute('/_authenticated/profile')({
  component: About,
});

function About() {
  const { isLoading, data: user } = useQuery(userQueryOpts);

  return (
    <MainLayout>
      <div>
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <>
            <FirstInfoBlock user={user!} />
            <UserVideosBlock user={user!} />
          </>
        )}
      </div>
    </MainLayout>
  );
}
