'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CashierPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cashier/dashboard');
  }, [router]);

  return <p>Loading Dashboard...</p>;
}
