import { Eye, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Video } from '@/types/video';

interface VCProps {
  showAuthor?: boolean;
  vid: Video;
}

const VideoCard = ({ vid, showAuthor = false }: VCProps) => {
  return (
    <Link
      to="/video"
      search={{ nid: vid.url }}
      className="col-span-1 rounded-md group transition"
    >
      <video src={vid.video} className="rounded-t-md" controls={false}></video>
      <div className="flex flex-col justify-between p-2">
        <h3 className="text-lg font-medium group-hover:text-neutral-500 line-clamp-1 transition">
          {vid.title}
        </h3>
        <div className="flex items-center gap-4 text-muted-foreground text-sm pt-2">
          <div className="inline-flex items-center">
            <Eye className="size-4 mr-1" />
            <span>{vid.views}</span>
          </div>
          {showAuthor && (
            <div className="inline-flex items-center">
              <User className="size-4 mr-1" />
              <span>{vid.author?.username}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
