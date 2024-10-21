'use client';

import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import { SearchBar } from '../SearchBar';
import { PencilIcon, TrashIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { PaymentMethod } from '@/types/types';
import { paymentMethods } from '@/data/paymentMethods';
import { Badge } from '@/components/ui/badge';
import PaymentMethodFormDialog from './PaymentMethodFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

export default function PaymentMethodsPage() {
  const { data: session } = useSession();
  const [methodsList, setMethodsList] = useState<PaymentMethod[]>(paymentMethods);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    methodId: '',
    methodName: '',
  });

  // Filter payment methods based on search term
  const filteredMethods = methodsList.filter(method => method.name.toLowerCase().includes(searchTerm.toLowerCase()) || method.id.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle form submission
  const handleSubmit = (formData: Partial<PaymentMethod>) => {
    const currentUser = session?.user?.name || 'Unknown User';
    const timestamp = new Date();

    if (formMode === 'add') {
      const newMethod: PaymentMethod = {
        ...formData,
        id: `PM${String(methodsList.length + 1).padStart(3, '0')}`,
        created_at: timestamp,
        updated_at: timestamp,
        created_by: currentUser,
        updated_by: currentUser,
      } as PaymentMethod;

      setMethodsList(prev => [...prev, newMethod]);
    } else if (selectedMethod) {
      setMethodsList(prev =>
        prev.map(method =>
          method.id === selectedMethod.id
            ? {
                ...method,
                ...formData,
                updated_at: timestamp,
                updated_by: currentUser,
              }
            : method
        )
      );
    }

    setFormOpen(false);
  };

  // Handle edit button click
  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormMode('edit');
    setFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (method: PaymentMethod) => {
    setDeleteDialog({
      open: true,
      methodId: method.id,
      methodName: method.name,
    });
  };

  // Function to handle confirmed deletion
  const handleConfirmDelete = () => {
    setMethodsList(prev => prev.filter(method => method.id !== deleteDialog.methodId));
    setDeleteDialog({ open: false, methodId: '', methodName: '' });
  };

  // Handle add new button click
  const handleAddNew = () => {
    setSelectedMethod(null);
    setFormMode('add');
    setFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-[32px] font-bold">Payment Methods</h1>

        <div className="flex items-center justify-between gap-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search payment methods"
            className="w-full !mb-0"
          />
          <button
            onClick={handleAddNew}
            className="text-[16px] w-max h-max flex items-center gap-1 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus
              size={24}
              strokeWidth={4}
            />
            <span className="hidden md:block md:w-max">Add New Method</span>
          </button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-full">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="max-w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMethods.map((method, index) => (
                <TableRow key={method.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{method.id}</TableCell>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={method.is_active ? 'default' : 'secondary'}>{method.is_active ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(method)}
                      >
                        <PencilIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(method)}
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PaymentMethodFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initialData={selectedMethod}
          onSubmit={handleSubmit}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
          onConfirm={handleConfirmDelete}
          methodName={deleteDialog.methodName}
        />
      </div>
    </MainLayout>
  );
}
