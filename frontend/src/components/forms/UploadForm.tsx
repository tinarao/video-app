import { useForm } from '@tanstack/react-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export const UploadForm = () => {
  const form = useForm({
    defaultValues: {
      title: '',
      video: '',
      desc: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
        className="grid grid-cols-2 gap-8"
      >
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
            name="video"
            children={(f) => (
              <div>
                <Label>Ссылка на видео</Label>
                <Input
                  name={f.name}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          />
        </div>
        <div className="col-span-1 space-y-4">
          <form.Field
            name="desc"
            children={(f) => (
              <div>
                <Label>desc</Label>
                <Textarea
                  name={f.name}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                />
              </div>
            )}
          />
        </div>
        <Button>Загрузить</Button>
      </form>
    </div>
  );
};
