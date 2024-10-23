'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
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

      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 bg-white shadow-xl right-10 z-50 h-max p-3 rounded-lg flex items-center justify-center"
      >
        {isOpen ? (
          <X
            strokeWidth={3}
            className="h-6 w-6"
          />
        ) : (
          <Menu
            strokeWidth={3}
            className="h-6 w-6"
          />
        )}
      </button>

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
          variant="destructive"
          className="w-full h-max px-4 py-2 text-[16px] font-bold flex items-center justify-center gap-2"
        >
          <LogOut strokeWidth={3} />
          Logout
        </Button>
      </section>
      {/* Mobile Sidebar */}
      <div className={`fixed z-30 flex inset-0 w-full h-full bg-black/50 transition-opacity duration-300 sm:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed top-0 left-0 bg-indigo-50 w-max px-4 py-8 pt-16 h-full flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav>
            <ul className="flex flex-col gap-2 text-neutral-900">
              {navigation.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <li key={name}>
                    <Link
                      href={href}
                      className={`px-4 py-2 flex gap-2 items-center font-bold rounded-md w-full min-w-max hover:bg-indigo-700 hover:text-white transition-all duration-300 ${isActive ? 'bg-indigo-200 text-indigo-600' : ''}`}
                      onClick={toggleSidebar}
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
              toggleSidebar();
            }}
            className="w-full h-max px-4 py-2 text-[16px] font-bold flex items-center justify-center gap-2"
            variant="destructive"
          >
            <LogOut strokeWidth={3} />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
