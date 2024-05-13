import { createLazyFileRoute } from '@tanstack/react-router';
import { Eye, LoaderCircle } from 'lucide-react';

import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

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

  return (
    <div className="container">
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <LoaderCircle color="black" size={50} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {/* made this to avoid nested ternaries */}
          {data === undefined && (
            <div className="col-span-4 py-48 text-center">
              <h1 className="text-6xl">Empty here</h1>
            </div>
          )}
          {data !== undefined &&
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
