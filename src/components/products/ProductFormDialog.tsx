import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData: Product | null;
  onSubmit: (data: Partial<Product>) => void;
  categories: Category[];
}

interface FormData {
  code: string;
  name: string;
  stock: number;
  price: number;
  category_id: number;
}

export default function ProductFormDialog({ open, onOpenChange, mode, initialData, onSubmit, categories }: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      code: '',
      name: '',
      stock: 0,
      price: 0,
      category_id: 1,
    },
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    } else {
      reset({
        code: '',
        name: '',
        stock: 0,
        price: 0,
        category_id: 1,
      });
    }
  }, [mode, initialData, reset]);

  const onSubmitForm = (data: FormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby={mode === 'add' ? 'Add New Product' : 'Edit Product'}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="space-y-2"
        >
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              disabled={mode === 'edit'}
              {...register('code', {
                required: 'Product code is required',
                pattern: {
                  value: /^[A-Z][0-9]{3}$/,
                  message: 'Code must be in format: X000 (1 capital letter followed by 3 numbers)',
                },
              })}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Product name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', {
                  required: 'Stock is required',
                  min: {
                    value: 0,
                    message: 'Stock cannot be negative',
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price cannot be negative',
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={watch('category_id')?.toString()}
              onValueChange={value => setValue('category_id', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {mode === 'add' ? 'Save' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
