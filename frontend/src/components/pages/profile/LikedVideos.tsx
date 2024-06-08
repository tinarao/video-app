import NothingHere from '@/components/containers/NothingHere';
import VideoCard from '@/components/shared/VideoCard';
import { Video } from '@/types/video';

const UserLikedVideos = ({ videos }: { videos?: Video[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {!videos || videos.length === 0 ? (
        <NothingHere />
      ) : (
        videos.map((i) => <VideoCard vid={i} key={i.id} />)
      )}
    </div>
  );
};

export default UserLikedVideos;
