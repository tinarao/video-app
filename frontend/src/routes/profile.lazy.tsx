import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/profile')({
  component: About,
});

function About() {
  return (
    <div>
      <h1 className="text-8xl text-center">Profile</h1>
    </div>
  );
}
