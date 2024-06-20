import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/test')({
  component: TestComponent,
});

function TestComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    isPlaying ? videoRef.current?.pause() : videoRef.current?.play();
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {});

  return (
    <div
      className="absolute"
      onKeyUpCapture={(e) => {
        console.log(e.key);
      }}
    >
      <video ref={videoRef}>
        <source src="https://firebasestorage.googleapis.com/v0/b/video-hosting-8c6bf.appspot.com/o/videos%2Fusers%2FApksQW5upiLE_Y2mate.mx-Skrillex%2C%20Hamdi%2C%20TAICHU%20%26%20OFFAIAH%20-%20Push-(720p60).mp4?alt=media&token=e865626e-296b-4901-8a34-e412bbf7ab8f" />
      </video>
      <Button
        size="icon"
        variant="ghost"
        className="relative"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
