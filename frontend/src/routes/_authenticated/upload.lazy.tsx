import { UploadForm } from '@/components/forms/UploadForm';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/upload')({
  component: Upload,
});

function Upload() {
  return (
    <div className="container">
      <h1 className="text-5xl">Загрузка видео</h1>
      <UploadForm />
    </div>
  );
}
