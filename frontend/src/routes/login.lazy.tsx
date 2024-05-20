import AuthLayout from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/rpc';
import { useForm } from '@tanstack/react-form';
import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password === '' || value.password === '') {
        return toast.error('Заполнены не все поля!');
      }
      if (value.password.length < 8) {
        return toast.error('Слишком короткий пароль!');
      }

      const res = await api.auth.login.$post({ json: value });
      if (res.ok) {
        toast.success('Давно не виделись!');
        return router.navigate({ to: '/' });
      }

      if (res.status === 404) {
        return toast.error('Пользователь с такими данными не существует!');
      } else if (res.status === 400) {
        return toast.error('Неправильный логин и/или пароль!');
      } else {
        return toast.error('Произошла ошибка, попробуйте ещё раз');
      }
    },
  });

  return (
    <AuthLayout>
      <form
        className="pb-32 px-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          children={(f) => (
            <div>
              <Label>Имя пользователя</Label>
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
          name="password"
          children={(f) => (
            <div>
              <Label>Пароль</Label>
              <Input
                type="password"
                name={f.name}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <div className="text-right p-0">
          <Link
            to="/register"
            className="border-b text-right border-transparent hover:border-neutral-500 hover:text-neutral-500 cursor-pointer transition text-sm font-medium"
          >
            У меня нет аккаунта
          </Link>
        </div>
        <div className="pt-4 mt-4 border-t w-full">
          <Button variant="outline" size="lg" className="w-full">
            Сохранить
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
