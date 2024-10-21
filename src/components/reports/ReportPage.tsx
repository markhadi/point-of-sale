'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react'; // Icon for the button
import { format } from 'date-fns'; // Formatting dates
import { productTransactions } from '@/data/productTransactions';
import MainLayout from '../MainLayout';

const ReportPage = () => {
  const [date, setDate] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(new Date().setDate(new Date().getDate() - 1)),
  });

  // Function to format date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Function to generate daily report data
  const generateDailyReport = () => {
    const from = date?.from;
    const to = date?.to;
    const report = new Map();

    // Initialize dates in range
    let currentDate = new Date(from);
    while (currentDate <= to) {
      const dateStr = formatDate(currentDate);
      report.set(dateStr, {
        date: dateStr,
        totalSales: 0,
        numberOfTransactions: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate totals for each day
    productTransactions.forEach(transaction => {
      const transactionDate = formatDate(new Date(transaction.issued_at));
      if (report.has(transactionDate)) {
        const dayReport = report.get(transactionDate);
        dayReport.totalSales += transaction.total_amount;
        dayReport.numberOfTransactions += 1;
      }
    });

    return Array.from(report.values());
  };

  const reportData = generateDailyReport();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>

        <div className="flex gap-4 items-end">
          {/* Popover for Date Range Picker */}
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className="w-[300px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="range"
                  defaultMonth={date.from}
                  selected={date}
                  onSelect={newDate =>
                    setDate({
                      from: newDate?.from ?? new Date(new Date().setDate(new Date().getDate() - 7)),
                      to: newDate?.to ?? new Date(new Date().setDate(new Date().getDate() - 1)),
                    })
                  }
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Sales Trend</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      type="category"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalSales"
                      stroke="#4f46e5"
                      name="Total Sales"
                    />
                    <Line
                      type="monotone"
                      dataKey="numberOfTransactions"
                      stroke="#10b981"
                      name="Number of Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Daily Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-right">Total Sales</th>
                      <th className="px-4 py-2 text-right">Number of Transactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.map(day => (
                      <tr key={day.date}>
                        <td className="px-4 py-2">{day.date}</td>
                        <td className="px-4 py-2 text-right">${day.totalSales}</td>
                        <td className="px-4 py-2 text-right">{day.numberOfTransactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportPage;
