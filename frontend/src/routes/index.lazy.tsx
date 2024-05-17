import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { ArrowUpRightIcon, Eye, LoaderCircle, TvIcon } from 'lucide-react';

import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    toast.success(`fetched videos in ${metric.toFixed(2)} millisec.`);
  }

  console.log(data);

  return (
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
              <div>
                <TvIcon size={48} className="w-fit mx-auto" />
                <h1 className="text-6xl text-center">
                  Здесь пусто! Загрузите своё первое видео или подпишитесь на
                  интересующие каналы.
                </h1>
              </div>
              <Button asChild size="lg" variant="outline">
                <Link to="/upload">
                  <ArrowUpRightIcon className="size-4 mr-2" /> Загрузить видео
                </Link>
              </Button>
            </div>
          )}
          {data !== undefined &&
            data.length !== 0 &&
            data!.map((i) => (
              <div
                key={i.id}
                className="col-span-1 p-2 border rounded-md shadow-sm hover:shadow-md transition"
              >
                <h3>{i.title}</h3>
                <div className="flex items-center text-muted-foreground font-medium text-sm">
                  <Eye className="size-4 mr-1" />
                  <span>{i.views}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
