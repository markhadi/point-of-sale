'use client';

import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import { SearchBar } from '../SearchBar';
import { PencilIcon, TrashIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoriesFormDialog from './CategoriesFormDialog';
import { categories } from '@/data/category';
import { Category } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useSession } from 'next-auth/react';

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    categoryId: 0,
    categoryName: '',
  });

  // Filter categories based on search term
  const filteredCategories = categoriesList.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || '';
  };

  // Handle form submission
  const handleSubmit = (formData: Partial<Category>) => {
    const currentUser = session?.user?.name || 'Unknown User';
    const timestamp = new Date();

    if (formMode === 'add') {
      const newCategory: Category = {
        ...formData,
        id: Math.max(...categoriesList.map(p => p.id)) + 1,
        created_at: timestamp,
        updated_at: timestamp,
        created_by: currentUser,
        updated_by: currentUser,
      } as Category;

      setCategoriesList(prev => [...prev, newCategory]);
    } else if (selectedCategory) {
      setCategoriesList(prev =>
        prev.map(category =>
          category.id === selectedCategory.id
            ? {
                ...category,
                ...formData,
                updated_at: timestamp,
                updated_by: currentUser,
              }
            : category
        )
      );
    }

    console.log('Form submitted:', formData);
  };

  // Handle edit button click
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormMode('edit');
    setFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (category: Category) => {
    setDeleteDialog({
      open: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  // function to handle confirmed deletion
  const handleConfirmDelete = () => {
    setCategoriesList(prev => prev.filter(category => category.id !== deleteDialog.categoryId));
    setDeleteDialog({ open: false, categoryId: 0, categoryName: '' });
  };

  // Handle add new button click
  const handleAddNew = () => {
    setSelectedCategory(null);
    setFormMode('add');
    setFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-[32px] font-bold">Categories</h1>

        <div className="flex items-center justify-between gap-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search data category"
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
            <span className="hidden md:block md:w-max">Add New Category</span>
          </button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead className="w-full">Category</TableHead>
                <TableHead className="max-w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="max-w-20">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <PencilIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
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

        <CategoriesFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initialData={selectedCategory}
          onSubmit={handleSubmit}
          categories={categories}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
          onConfirm={handleConfirmDelete}
          categoryName={deleteDialog.categoryName}
        />
      </div>
    </MainLayout>
  );
}
