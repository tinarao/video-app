import { api } from '@/lib/rpc';
import { useEffect } from 'react';
import { setTitle } from '@/hooks/useTitle';
import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import VideoCard from '@/components/shared/VideoCard';
import MainLayout from '@/components/layouts/main-layout';
import NothingHere from '@/components/containers/NothingHere';
import { ArrowUpRightIcon, LoaderCircle } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const getVideos = async () => {
    const data = await api.videos.$get();
    const { videos } = await data.json();
    return videos;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['videosIndex'],
    queryFn: getVideos,
  });

  useEffect(() => {
    setTitle('Главная | VidTube');
  });

  return (
    <MainLayout>
      <div className="container">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <LoaderCircle color="black" size={50} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
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
              data!.map((i) => (
                <VideoCard showAuthor={true} vid={i} key={i.id} />
              ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
