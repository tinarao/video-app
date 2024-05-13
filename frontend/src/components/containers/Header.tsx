import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const Header = () => {
  return (
    <header>
      <div className="container py-2 text-neutral-800">
        <nav>
          <ul className="flex gap-1">
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-100"
              >
                <Link to="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="[&.active]:bg-neutral-100"
              >
                <Link to="/profile">Profile</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
