// https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes

import { userQueryOpts } from '@/lib/auth';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const Comp = () => {
  const { user } = Route.useRouteContext();
  const root =
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

  if (!user) {
    return window.location.replace(`${root}/api/auth/login`);
  }

  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    try {
      const queryClient = context.queryClient;
      const user = await queryClient.fetchQuery(userQueryOpts);

      return { user: user };
    } catch (error) {
      return { user: null };
    }
  },
  component: Comp,
});
