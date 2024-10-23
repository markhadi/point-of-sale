'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';

export default function CashierPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cashier/dashboard');
  }, [router]);

  return <Loading />;
}
