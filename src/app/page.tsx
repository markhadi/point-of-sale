'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';

/**
 * Halaman utama aplikasi
 *
 * Jika user belum login maka akan di redirect ke halaman login
 * Jika user sudah login maka akan di redirect ke halaman dashboard berdasarkan role yang dimiliki
 *
 * @returns
 */
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role;
      const redirectToDashboard = () => {
        if (role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else if (role === 'CASHIER') {
          router.replace('/cashier/dashboard');
        }
      };

      redirectToDashboard();
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [session, status, router]);

  return <Loading />;
}
