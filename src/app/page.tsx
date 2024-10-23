'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role;

      if (role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else if (role === 'CASHIER') {
        router.replace('/cashier/dashboard');
      }
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [session, status, router]);

  return <Loading />;
}
