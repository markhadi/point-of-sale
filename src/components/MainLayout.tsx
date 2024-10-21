'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { LayoutGrid, DollarSign, Package, Tag, User, CreditCard, ChartArea } from 'lucide-react';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
  { name: 'Transactions', href: '/admin/transactions', icon: DollarSign },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Users', href: '/admin/users', icon: User },
  { name: 'Payment Method', href: '/admin/payment-methods', icon: CreditCard },
  { name: 'Reports', href: '/admin/reports', icon: ChartArea },
];

const cashierNavigation = [
  { name: 'Dashboard', href: '/cashier/dashboard', icon: LayoutGrid },
  { name: 'Transactions', href: '/cashier/transactions', icon: DollarSign },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const role = session?.user?.role;
  const navigation = role === 'ADMIN' ? adminNavigation : cashierNavigation;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={role}
        navigation={navigation}
      />
      <main className="w-full px-10 py-16 bg-neutral-50 overflow-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
