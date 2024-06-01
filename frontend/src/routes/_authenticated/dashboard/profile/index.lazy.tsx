import DashLayout from '@/components/layouts/dash-layout';
import { userQueryOpts } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import EditProfileForm from '@/components/forms/EditProfileForm';

export const Route = createLazyFileRoute('/_authenticated/dashboard/profile/')({
  component: Page,
});

function Page() {
  const { isLoading, data: user } = useQuery(userQueryOpts);

  return (
    <DashLayout>
      <div>
        <h1 className="font-bold text-5xl">Настройки профиля</h1>
      </div>
      <div>
        {isLoading ? (
          <h3 className="text-6xl font-medium py-32 text-center">
            Думаем<span className="animate-pulse">...</span>
          </h3>
        ) : (
          <EditProfileForm user={user!} />
        )}
      </div>
    </DashLayout>
  );
}
