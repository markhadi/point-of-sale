'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
}

interface SidebarProps {
  role: string | undefined;
  navigation: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
  const pathname = usePathname();

  return (
    <section className="bg-indigo-50 px-6 py-16 w-80 flex-col justify-between hidden sm:flex">
      <nav>
        <ul className="flex flex-col gap-2 text-neutral-900">
          {navigation.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={name}>
                <Link
                  href={href}
                  className={`px-4 py-2 flex gap-2 items-center font-bold rounded-md w-full min-w-max hover:bg-indigo-700 hover:text-white transition-all duration-300 ${isActive ? 'bg-indigo-200 text-indigo-600' : ''}`}
                >
                  <Icon />
                  <span>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="w-full h-max px-4 py-2 text-[16px] font-bold flex items-center justify-center gap-2"
      >
        <LogOut strokeWidth={3} />
        Logout
      </Button>
    </section>
  );
};

export default Sidebar;
