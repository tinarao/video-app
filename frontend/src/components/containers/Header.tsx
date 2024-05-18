import { Button } from '@/components/ui/button';
import { userQueryOpts } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import ProfileDropdown from '../ui/profile-dropdown';

const Header = () => {
  const { data: user } = useQuery(userQueryOpts);

  return (
    <header className="border-b">
      <div className="container flex justify-between items-center py-2 text-neutral-800">
        <nav>
          <ul className="flex gap-1">
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-200/50"
              >
                <Link to="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-200/50"
              >
                <Link to="/profile">Profile</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-200/50"
              >
                <Link to="/upload">Upload</Link>
              </Button>
            </li>
          </ul>
        </nav>
        <div>
          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
