import { TvIcon } from 'lucide-react';

const NothingHere = () => {
  return (
    <div className="col-span-4 text-muted-foreground">
      <TvIcon size={48} className="w-fit mx-auto" />
      <h1 className="text-6xl text-center">
        Здесь пусто! Загрузите своё первое видео или подпишитесь на интересующие
        каналы.
      </h1>
    </div>
  );
};

export default NothingHere;
