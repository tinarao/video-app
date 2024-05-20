import Header from '@/components/containers/Header';
import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Eye, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/video/$videoID')({
  // loader: ({ params }) => fetchPost(params.videoID),
  component: PostComponent,
});

function PostComponent() {
  const { videoID } = Route.useParams();
  const [metric, setMetric] = useState(0);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['videoID'],
    queryFn: () => getVideo(videoID),
  });

  const getVideo = async (videoID: string) => {
    const time = performance.now();
    const res = await api.videos[':url'].$get({ param: { url: videoID } });
    const data = await res.json();
    const t = performance.now() - time;
    setMetric(t);
    return data;
  };

  if (data === undefined && isSuccess) {
    return <Navigate to="/" />;
  }

  if (isSuccess) {
    toast.success(`fetched video in ${metric} millisec.`);
  }

  return (
    <>
      <Header />
      <div className="container grid grid-cols-4">
        {isLoading ? (
          <div className="h-80 col-span-4 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="col-span-3 py-4">
              <div>
                <video
                  className="rounded-md"
                  src={data!.video}
                  controls
                ></video>
              </div>
              <div className="py-2">
                <div>
                  <h1 className="text-xl font-medium line-clamp-1 text-ellipsis">
                    {data!.title}
                  </h1>
                </div>
                <div className="py-2 border-t">
                  <span className="flex items-center text-muted-foreground">
                    <Eye className="size-4 mr-2" /> {data!.views}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
          </>
        )}
      </div>
    </>
  );
}
