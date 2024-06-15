import Profile from '@/components/containers/Profile';
import MainLayout from '@/components/layouts/main-layout';
import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/_authenticated/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: authenticatedUser } = useQuery(userQueryOpts);
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['active-user-details'],
    queryFn: async () => {
      if (!authenticatedUser) {
        throw new Error();
      }
      const res = await api.users['by-username'][':username'].$get({
        param: { username: authenticatedUser?.username },
      });

      return await res.json();
    },
  });

  if (isError) {
    toast.error('Произошла ошибка при загрузке профиля, попробуйте позже');
    return navigate({ to: '/' });
  }

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
