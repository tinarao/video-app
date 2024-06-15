import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/user/')({
  component: () => <div>Hello /user/!</div>
})