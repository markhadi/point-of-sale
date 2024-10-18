import { User, Role } from '@/types/types';

export const users: User[] = [
  {
    id: '1',
    username: 'admin01',
    name: 'Alice Admin',
    password: 'adminPass123',
    role: Role.ADMIN,
  },
  {
    id: '2',
    username: 'cashier01',
    name: 'Bob Cashier',
    password: 'cashierPass123',
    role: Role.CASHIER,
  },
  {
    id: '3',
    username: 'cashier02',
    name: 'Charlie Cashier',
    password: 'cashierPass123',
    role: Role.CASHIER,
  },
  {
    id: '4',
    username: 'cashier03',
    name: 'Dave Cashier',
    password: 'cashierPass123',
    role: Role.CASHIER,
  },
  {
    id: '5',
    username: 'admin02',
    name: 'Eve Admin',
    password: 'adminPass123',
    role: Role.ADMIN,
  },
];
