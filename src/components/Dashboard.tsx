'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { productTransactions } from '@/data/productTransactions';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { ProductTransaction } from '@/types/types';

// Fungsi untuk menghitung total sales hari ini
const calculateTotalSalesToday = (transactions: ProductTransaction[], today: Date) => {
  const todayString = today.toISOString().split('T')[0];
  return transactions.filter(transaction => new Date(transaction.issued_at).toISOString().split('T')[0] === todayString).reduce((acc, transaction) => acc + transaction.total_amount, 0);
};

// Fungsi untuk menghitung total transaksi hari ini
const calculateTotalTransactionsToday = (transactions: ProductTransaction[], today: Date) => {
  const todayString = today.toISOString().split('T')[0];
  return transactions.filter(transaction => new Date(transaction.issued_at).toISOString().split('T')[0] === todayString).length;
};

// Fungsi untuk menghitung rata-rata penjualan
const calculateAverageSales = (totalSales: number, totalTransactions: number) => {
  return totalTransactions > 0 ? totalSales / totalTransactions : 0;
};

// Fungsi untuk menghitung total penjualan dalam 7 hari terakhir
const calculateLast7DaysSales = (transactions: ProductTransaction[], today: Date) => {
  const last7Days: { date: string; totalSale: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayAndMonth = dateString.substring(5, 10);
    const totalSale = transactions.filter(transaction => new Date(transaction.issued_at).toISOString().split('T')[0] === dateString).reduce((acc, transaction) => acc + transaction.total_amount, 0);
    last7Days.push({ date: dayAndMonth, totalSale });
  }
  return last7Days;
};

// Komponen untuk menampilkan card statistik
interface StatisticCardProps {
  label: string;
  value: string | number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ label, value }) => (
  <div className="w-full md:max-w-[280px] flex flex-col p-4 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-xl text-neutral-50">
    <span className="text-[16px] font-normal">{label}</span>
    <span className="text-[32px] font-bold">{value}</span>
  </div>
);

// Mendefinisikan kolom untuk DataTable
const sortedTransactions = productTransactions.sort((a, b) => b.issued_at.getTime() - a.issued_at.getTime());

const columns: ColumnDef<(typeof sortedTransactions)[0]>[] = [
  {
    accessorKey: 'issued_at',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('issued_at')).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer',
  },
  {
    accessorKey: 'service_by',
    header: 'Service By',
  },
  {
    accessorKey: 'total_amount',
    header: 'Total',
    cell: ({ row }) => {
      return `$${row.getValue('total_amount')}`;
    },
  },
];

const DashboardPage = () => {
  const today = new Date();

  const totalSalesToday = calculateTotalSalesToday(productTransactions, today);
  const totalTransactions = calculateTotalTransactionsToday(productTransactions, today);
  const averageSales = calculateAverageSales(totalSalesToday, totalTransactions);
  const last7Days = calculateLast7DaysSales(productTransactions, today);

  return (
    <MainLayout>
      <h1 className="text-[32px] font-bold mb-8">Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8 md:justify-between">
        <StatisticCard
          label="Today's Sales"
          value={`$${totalSalesToday}`}
        />
        <StatisticCard
          label="Today's Transactions"
          value={totalTransactions}
        />
        <StatisticCard
          label="Avg. Sale"
          value={`$${averageSales}`}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 font-bold text-[20px] text-neutral-900">Last 7 Days Sales</h2>
        <Card>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalSale"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-bold text-[20px] mb-3 text-neutral-900">Transaction History</h2>
        <DataTable
          columns={columns}
          data={sortedTransactions}
        />
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
