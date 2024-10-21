import { PaymentMethod } from '@/types/types';

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'PM001',
    name: 'Cash',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin01',
    updated_by: 'admin01',
  },
  {
    id: 'PM002',
    name: 'Credit Card',
    description: 'Visa/MasterCard',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin01',
    updated_by: 'admin01',
  },
];
