import { useForm } from '@tanstack/react-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { app } from '@/firebase';
import { nanoid } from 'nanoid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { api } from '@/lib/rpc';
import { Loader2Icon, Save } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter } from '@tanstack/react-router';

export const UploadForm = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!file) return;
    const src = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
    setVideoSrc(src);
  }, [file]);

  const form = useForm({
    defaultValues: {
      title: '',
      desc: '',
    },

    onSubmit: async ({ value }) => {
      if (file === null) return toast.error('Файл не выбран');
      const storage = getStorage(app);
      const name = nanoid(12);
      const pathToFile = `videos/users/${name}_${file.name}`;
      const storageRef = ref(storage, pathToFile);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading(true);
      const url = nanoid(8);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          return error;
        },
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              const payload = {
                ...value,
                video: downloadURL,
                url: url,
              };
              const res = await api.videos.$post({ json: payload });
              const saved = await res.json();
              console.log(saved);
            } catch (error) {
              console.error(error);
              toast.error('Ошибка при сохранении видео');
            } finally {
              setLoading(false);
              router.navigate({ to: '/' });
            }
          });
        },
      );
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-4 gap-8"
      >
        <div className="col-span-3">
          <video className="w-full" id="videoPreview" controls src={videoSrc} />
        </div>
        <div className="col-span-1 space-y-4">
          <form.Field
            name="title"
            children={(f) => (
              <div>
                <Label>Название видео</Label>
                <Input
                  name={f.name}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          />
          <form.Field
            name="desc"
            children={(f) => (
              <div>
                <Label>Описание</Label>
                <Textarea
                  name={f.name}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  className="resize-none"
                  rows={10}
                />
              </div>
            )}
          />
          <div>
            <Input
              type="file"
              multiple={false}
              accept="video/mp4,video/x-m4v,video/*"
              onChange={(e) => {
                if (!e.target.files) return;
                setFile(e.target.files[0]);
              }}
              disabled={loading}
              ref={videoRef}
            />
          </div>
          {loading && <Progress value={progress} className="bg-neutral-200" />}
        </div>

        <Button disabled={loading}>
          {loading ? (
            <Loader2Icon className="size-4 mr-2 animate-spin" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          Загрузить
        </Button>
      </form>
    </div>
  );
};
