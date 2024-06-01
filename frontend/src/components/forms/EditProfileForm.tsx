import { useForm } from '@tanstack/react-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

const EditProfileForm = ({ user }: { user: User }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      if (isPictureChanged) {
        console.log('Avatar uploading here....');
      }
      console.log(value);
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
      </div>
      <Button>Сохранить</Button>
    </form>
  );
};

export default EditProfileForm;
