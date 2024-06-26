import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { Link } from '@tanstack/react-router';
import { Cog } from 'lucide-react';

const FirstInfoBlock = ({ user }: { user: User }) => {
  return (
    <div className="border-b">
      <div className="container flex justify-between py-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.picture || 'https://amu.edu.kz/upload/default-avatar.jpg'
            }
            className="rounded-full size-12"
          />
          <div>
            <span className="text-muted-foreground font-medium">Привет,</span>
            <h3 className="text-5xl font-medium">
              {user.username}
              <span className="text-orange-400">!</span>
            </h3>
          </div>
        </div>
        <div className="space-x-4 pt-12">
          <Button variant="outline" asChild>
            <Link to="/dashboard/profile">
              <Cog className="size-4 mr-2" /> Редактировать
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstInfoBlock;
