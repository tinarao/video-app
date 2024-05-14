import Header from '@/components/containers/Header';
import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Toaster />
      <Header />
      <div className="text-foreground py-8">
        <Outlet />
      </div>
    </>
  ),
});
