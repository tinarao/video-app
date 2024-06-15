import { Eye } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Video } from '@/types/video';

const VideoCard = ({ vid }: { vid: Video }) => {
  return (
    <Link
      to="/video"
      search={{ nid: vid.url }}
      className="col-span-1 rounded-md group transition"
    >
      <video src={vid.video} className="rounded-t-md" controls={false}></video>
      <div className="p-2">
        <h3 className="text-lg font-medium group-hover:text-neutral-500 transition">
          {vid.title}
        </h3>
        <div className="flex items-center text-muted-foreground font-medium text-sm">
          <Eye className="size-4 mr-1" />
          <span>{vid.views}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
