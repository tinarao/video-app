import DashLayout from '@/components/layouts/dash-layout';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/dashboard/videos/')({
  component: Videos,
});

function Videos() {
  return (
    <DashLayout>
      <div>
        <h1>ХУЙ</h1>
      </div>
    </DashLayout>
  );
}
