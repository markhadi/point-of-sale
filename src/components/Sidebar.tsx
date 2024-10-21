'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react'; // Importing icons for mobile menu
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
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar toggle state
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar state
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed z-[999] top-4 right-6 flex items-center p-4">
        <Button
          onClick={toggleSidebar}
          className="flex gap-2 items-center"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar for larger screens */}
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

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 w-full h-full bg-black bg-opacity-50 sm:hidden">
          <div className="bg-indigo-50 w-max px-4 py-8 h-full flex flex-col justify-between">
            <nav>
              <ul className="flex flex-col gap-2 text-neutral-900">
                {navigation.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname === href;

                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        className={`px-4 py-2 flex gap-2 items-center font-bold rounded-md w-full min-w-max hover:bg-indigo-700 hover:text-white transition-all duration-300 ${isActive ? 'bg-indigo-200 text-indigo-600' : ''}`}
                        onClick={toggleSidebar} // Close sidebar after navigation
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
              onClick={() => {
                signOut({ callbackUrl: '/login' });
                toggleSidebar(); // Close sidebar after logout
              }}
              className="w-full h-max px-4 py-2 text-[16px] font-bold flex items-center justify-center gap-2"
            >
              <LogOut strokeWidth={3} />
              Logout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
