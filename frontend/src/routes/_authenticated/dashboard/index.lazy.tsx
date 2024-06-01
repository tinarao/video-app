import DashLayout from '@/components/layouts/dash-layout';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/dashboard/')({
  component: UserDashboard,
});

function UserDashboard() {
  return (
    <DashLayout>
      <h1>dashboard</h1>
    </DashLayout>
  );
}
