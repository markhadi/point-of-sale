'use client';

import React, { useState } from 'react';
import MainLayout from '../MainLayout';
import { SearchBar } from '../SearchBar';
import { PencilIcon, TrashIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductFormDialog from './ProductFormDialog';
import { products } from '@/data/products';
import { categories } from '@/data/category';
import { Product } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useSession } from 'next-auth/react';

export default function ProductsPage() {
  const { data: session } = useSession();
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null as Product | null,
  });

  // Filter products based on search term
  const filteredProducts = productList.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.code.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || '';
  };

  // Handle form submission
  const handleSubmit = (formData: Partial<Product>) => {
    const currentUser = session?.user?.name || 'Unknown User';
    const timestamp = new Date();

    if (formMode === 'add') {
      const newProduct: Product = {
        ...formData,
        id: Math.max(...productList.map(p => p.id)) + 1,
        created_at: timestamp,
        updated_at: timestamp,
        created_by: currentUser,
        updated_by: currentUser,
      } as Product;

      setProductList(prev => [...prev, newProduct]);
    } else if (selectedProduct) {
      setProductList(prev =>
        prev.map(product =>
          product.id === selectedProduct.id
            ? {
                ...product,
                ...formData,
                updated_at: timestamp,
                updated_by: currentUser,
              }
            : product
        )
      );
    }

    console.log('Form submitted:', formData);
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (method: Product) => {
    setDeleteDialog({
      open: true,
      item: method,
    });
  };

  // function to handle confirmed deletion
  const handleConfirmDelete = () => {
    if (deleteDialog.item) {
      setProductList(prev => prev.filter(method => method.id !== deleteDialog.item?.id));
    }
    setDeleteDialog({ open: false, item: null });
  };

  // Handle add new button click
  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormMode('add');
    setFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-[32px] font-bold">Products</h1>

        <div className="flex items-center justify-between gap-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search data product"
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
            <span className="hidden md:block md:w-max">Add New Product</span>
          </button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="w-full">Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="max-w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{getCategoryName(product.category_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <PencilIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product)}
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

        <ProductFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          initialData={selectedProduct}
          onSubmit={handleSubmit}
          categories={categories}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={open => setDeleteDialog(prev => ({ ...prev, open }))}
          onConfirm={handleConfirmDelete}
          itemName={deleteDialog.item?.name || ''}
          itemType="product"
        />
      </div>
    </MainLayout>
  );
}
