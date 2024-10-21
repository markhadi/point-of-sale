import { useEffect } from 'react';
import { Category } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface CategoriesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData: Category | null;
  onSubmit: (data: Partial<Category>) => void;
  categories: Category[];
}

interface FormData {
  name: string;
}

export default function CategoriesFormDialog({ open, onOpenChange, mode, initialData, onSubmit }: CategoriesFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    } else {
      reset({
        name: '',
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
        aria-describedby={mode === 'add' ? 'Add New Categories' : 'Edit Categories'}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">{mode === 'add' ? 'Add New Categories' : 'Edit Categories'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="space-y-2"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name Category</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Categories name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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
