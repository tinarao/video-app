import DashHeader from '@/components/containers/DashHeader';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: UserDashboard,
});

function UserDashboard() {
  return (
    <>
      <DashHeader />
    </>
  );
}
