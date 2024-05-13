import Header from '@/components/containers/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Header />
      <div className="text-foreground py-8">
        <Outlet />
      </div>
    </QueryClientProvider>
  ),
});
