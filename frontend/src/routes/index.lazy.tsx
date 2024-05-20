import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { ArrowUpRightIcon, LoaderCircle } from 'lucide-react';

import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/shared/VideoCard';
import MainLayout from '@/components/layouts/main-layout';
import NothingHere from '@/components/containers/NothingHere';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const [metric, setMetric] = useState<number>(0);

  const getVideos = async () => {
    const time = performance.now();

    const data = await api.videos.$get();
    const vids = await data.json();

    setMetric(performance.now() - time);
    return vids.data;
  };

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['videosIndex'],
    queryFn: getVideos,
  });

  if (isFetched) {
    toast.success(`fetched index videos in ${metric.toFixed(2)} millisec.`);
  }

  return (
    <MainLayout>
      <div className="container">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {/* made this to avoid nested ternaries */}
            {(data === undefined || data.length === 0) && (
              <div className="col-span-4 py-48 flex flex-col items-center justify-center gap-8 text-muted-foreground">
                <NothingHere />
                <Button asChild size="lg" variant="outline">
                  <Link to="/upload">
                    <ArrowUpRightIcon className="size-4 mr-2" /> Загрузить видео
                  </Link>
                </Button>
              </div>
            )}
            {data !== undefined &&
              data.length !== 0 &&
              data!.map((i) => <VideoCard vid={i} key={i.id} />)}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
