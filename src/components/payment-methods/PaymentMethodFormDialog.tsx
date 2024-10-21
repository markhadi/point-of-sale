import { useEffect } from 'react';
import { PaymentMethod } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';

interface PaymentMethodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData: PaymentMethod | null;
  onSubmit: (data: Partial<PaymentMethod>) => void;
}

interface FormData {
  name: string;
  description?: string;
  is_active: boolean;
}

export default function PaymentMethodFormDialog({ open, onOpenChange, mode, initialData, onSubmit }: PaymentMethodFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    } else {
      reset({
        name: '',
        description: '',
        is_active: true,
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
        aria-describedby={mode === 'add' ? 'Add New Payment Method' : 'Edit Payment Method'}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">{mode === 'add' ? 'Add New Payment Method' : 'Edit Payment Method'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Payment method name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active Status</Label>
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={value => setValue('is_active', value)}
            />
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
