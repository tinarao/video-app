import DashVideoInfo from '@/components/containers/DashVideoInfo';
import NothingHere from '@/components/containers/NothingHere';
import DashLayout from '@/components/layouts/dash-layout';

import { userQueryOpts } from '@/lib/auth';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/_authenticated/dashboard/videos/')({
  component: Videos,
});

function Videos() {
  const { data: user } = useQuery(userQueryOpts);

  const getVideos = async () => {
    try {
      const res = await api.videos['by-user'][':userID{[0-9]+}'].$get({
        param: { userID: String(user!.id) },
      });
      const { videos } = await res.json();
      return videos;
    } catch (error) {
      console.error(error);
      toast.error('An error occured');
    }
  };

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos-by-user', user!.id],
    queryFn: getVideos,
  });

  if (!videos || videos.length === 0) {
    return (
      <DashLayout>
        <div className="py-32">
          <NothingHere />
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout>
      <div>
        {isLoading ? (
          <LoaderCircle color="black" size={50} className="animate-spin" />
        ) : (
          <div>
            {videos.map((i) => (
              <DashVideoInfo key={i.id} user={user!} video={i} />
            ))}
          </div>
        )}
      </div>
    </DashLayout>
  );
}
