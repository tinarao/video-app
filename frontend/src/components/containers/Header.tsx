import { Button } from '@/components/ui/button';
import { userQueryOpts } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import ProfileDropdown from '../ui/profile-dropdown';
import Logo from '../Logo';

const Header = () => {
  const { data: user } = useQuery(userQueryOpts);

  return (
    <header className="border-b h-16">
      <div className="container flex justify-between items-center py-2 text-neutral-800">
        <nav className="flex items-center">
          <Link to="/">
            <Logo size={10} />
          </Link>
          {/* <ul className="flex gap-1">
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-200/50"
              ></Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-200/50"
              >
                <Link to="/profile">Мой профиль</Link>
              </Button>
            </li>
          </ul> */}
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
