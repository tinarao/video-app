import { useForm } from '@tanstack/react-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { api } from '@/lib/rpc';
import { useNavigate } from '@tanstack/react-router';
import { queryClient } from '@/main';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/firebase';
import { Progress } from '../ui/progress';

interface ApiPayload {
  username: string;
  family_name: string;
  given_name: string;
  bio: string;
  picture: string;
}

const EditProfileForm = ({ user }: { user: User }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.picture as string,
  );
  const [isPictureChanged, setIsPictureChanged] = useState(false);

  useEffect(() => {
    if (!selectedFile) return;
    const src = URL.createObjectURL(new Blob([selectedFile]));
    setAvatarPreview(src);

    return () => URL.revokeObjectURL(src);
  }, [selectedFile]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];
    if (file.size / 1024 / 1024 > 2) {
      toast.error('Слишком большой файл! Ограничение по размеру файла - 2 Мб.');
      return;
    }

    setSelectedFile(e.target.files[0]);
    setIsPictureChanged(true);
  };

  const form = useForm({
    defaultValues: {
      username: user.username,
      family_name: user.family_name || '',
      given_name: user.given_name || '',
      bio: user.bio || '',
    },
    onSubmit: async ({ value }) => {
      const payload: ApiPayload = {
        ...value,
        picture: user.picture as string,
      };

      if (isPictureChanged) {
        // load pic to firebase
        const now = new Date().getTime();
        const storage = getStorage(app);
        const pathToFile = `pictures/avatars/${user.username}-${now}`;
        const storageRef = ref(storage, pathToFile);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile!);

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
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                payload.picture = downloadURL!;

                // rest api code
                const res = await api.users['update-profile'].$patch({
                  json: payload,
                });

                if (!res.ok) {
                  console.log(res);
                  toast.error('Произошла ошибка, попробуйте ещё раз');
                  return;
                }

                toast.success('Успешно!');
                queryClient.invalidateQueries({
                  queryKey: ['user-data'],
                  refetchType: 'active',
                  exact: true,
                });

                return navigate({ to: '/' });
              },
            );
          },
        );

        return;
      }

      const res = await api.users['update-profile'].$patch({
        json: payload,
      });

      if (!res.ok) {
        console.log(res);
        toast.error('Произошла ошибка, попробуйте ещё раз');
        return;
      }

      toast.success('Успешно!');
      queryClient.invalidateQueries({
        queryKey: ['user-data'],
        refetchType: 'active',
        exact: true,
      });

      return navigate({ to: '/' });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="py-4"
    >
      <form.Field
        name="username"
        children={(f) => (
          <div>
            <Label>Юзернейм</Label>
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
        name="family_name"
        children={(f) => (
          <div>
            <Label>Фамилия</Label>
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
        name="given_name"
        children={(f) => (
          <div>
            <Label>Имя</Label>
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
        name="bio"
        children={(f) => (
          <div>
            <Label>Биография</Label>
            <Textarea
              name={f.name}
              value={f.state.value}
              onBlur={f.handleBlur}
              onChange={(e) => f.handleChange(e.target.value)}
            />
          </div>
        )}
      />
      <div className="py-8">
        <img
          className="size-32 rounded-full aspect-square object-cover"
          src={avatarPreview}
        />
        <Input
          type="file"
          multiple={false}
          onChange={(e) => onFileSelect(e)}
          accept="image/png, image/jpeg"
        />
        <Progress className="my-4" value={progress} />
      </div>
      <Button>Сохранить</Button>
    </form>
  );
};

export default EditProfileForm;
