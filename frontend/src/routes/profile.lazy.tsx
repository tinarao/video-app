import { Button } from '@/components/ui/button';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Cog, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/profile')({
  component: About,
});

function About() {
  const [metric, setMetric] = useState<number>(0);

  const getUserData = async () => {
    const time = performance.now();

    const data = await api.auth.me.$get();
    const vids = await data.json();

    setMetric(performance.now() - time);
    return vids;
  };

  const {
    data: user,
    isLoading,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['user-data'],
    queryFn: getUserData,
  });

  if (isError) {
    toast.error('Not authenticated');
    return;
  }

  if (isFetched) {
    toast.success(`fetched user data in ${metric.toFixed(2)} millisec.`);
    console.log(user);
  }

  return (
    <div>
      <div>
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <div className="border-y">
            <div className="container flex justify-between py-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    user?.picture ||
                    'https://amu.edu.kz/upload/default-avatar.jpg'
                  }
                  className="rounded-full size-12"
                />
                <div>
                  <span className="text-muted-foreground font-medium">
                    Привет,
                  </span>
                  <h3 className="text-5xl font-medium">
                    {user?.family_name} {user?.given_name}
                  </h3>
                </div>
              </div>
              <div className="space-x-4 pt-12">
                <Button variant="outline">
                  <Cog className="size-4 mr-2" /> Редактировать
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
