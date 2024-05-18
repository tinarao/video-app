import { UploadForm } from '@/components/forms/UploadForm';
import MainLayout from '@/components/layouts/main-layout';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/upload')({
  component: Upload,
});

function Upload() {
  return (
    <MainLayout>
      <div className="container">
        <h1 className="text-5xl mb-8">Загрузка видео</h1>
        <UploadForm />
      </div>
    </MainLayout>
  );
}
