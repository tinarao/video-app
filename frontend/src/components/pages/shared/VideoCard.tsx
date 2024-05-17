import { Eye } from 'lucide-react';
import { Video } from '@server/db/entities/video.entity';

const VideoCard = ({ vid }: { vid: Video }) => {
  return (
    <div className="col-span-1 border rounded-md shadow-sm hover:shadow-md transition">
      <video src={vid.video} className="rounded-t-md" controls={false}></video>
      <div className="p-2">
        <h3 className="text-lg font-medium">{vid.title}</h3>
        <div className="flex items-center text-muted-foreground font-medium text-sm">
          <Eye className="size-4 mr-1" />
          <span>{vid.views}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
