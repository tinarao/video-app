const VideoPlayer = ({ url }: { url: string }) => {
  return <video className="rounded-md shadow-md" src={url} controls></video>;
};

export default VideoPlayer;
