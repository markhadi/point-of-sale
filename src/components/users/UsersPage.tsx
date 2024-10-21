'use client';

import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import { SearchBar } from '../SearchBar';
import { PencilIcon, TrashIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { User } from '@/types/types';
import { users } from '@/data/users';

import UserFormDialog from './UserFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

export default function UsersPage() {
  const { data: session } = useSession();
  const [userList, setUserList] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: '',
    username: '',
  });

  // Filter users based on search term
  const filteredUsers = userList.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle form submission
  const handleSubmit = (formData: Partial<User>) => {
    const currentUser = session?.user?.name || 'Unknown User';

    if (formMode === 'add') {
      const newUser: User = {
        ...formData,
        id: (Math.max(...userList.map(u => parseInt(u.id))) + 1).toString(),
      } as User;

      setUserList(prev => [...prev, newUser]);
    } else if (selectedUser) {
      setUserList(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...formData,
              }
            : user
        )
      );
    }

    setFormOpen(false);
  };

  // Handle edit button click
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
    setFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (user: User) => {
    setDeleteDialog({
      open: true,
      userId: user.id,
      username: user.username,
    });
  };

  // Function to handle confirmed deletion
  const handleConfirmDelete = () => {
    setUserList(prev => prev.filter(user => user.id !== deleteDialog.userId));
    setDeleteDialog({ open: false, userId: '', username: '' });
  };

  // Handle add new button click
  const handleAddNew = () => {
    setSelectedUser(null);
    setFormMode('add');
    setFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-[32px] font-bold">Users</h1>

        <div className="flex items-center justify-between gap-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search users"
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
            <span className="hidden md:block md:w-max">Add New User</span>
          </button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="w-full">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="max-w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <PencilIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
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

        <UserFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initialData={selectedUser}
          onSubmit={handleSubmit}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
          onConfirm={handleConfirmDelete}
          username={deleteDialog.username}
        />
      </div>
    </MainLayout>
  );
}
