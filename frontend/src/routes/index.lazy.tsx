import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const getVideos = async () => {
    const data = await axios.get('/api/videos');
    return data;
  };

  // Queries
  const { data, isPending } = useQuery({
    queryKey: ['videos'],
    queryFn: getVideos,
  });

  console.log(data);

  return (
    <div>
      {isPending ? (
        <div className="h-80 flex items-center justify-center">
          <LoaderCircle color="black" size={50} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {/* {videos.map((i) => (
            <div key={i.title}></div>
          ))} */}
        </div>
      )}
    </div>
  );
}
