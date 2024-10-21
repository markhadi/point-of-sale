import { useEffect } from 'react';
import { User, Role } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData: User | null;
  onSubmit: (data: Partial<User>) => void;
}

interface FormData {
  username: string;
  name: string;
  password: string;
  role: Role;
}

export default function UserFormDialog({ open, onOpenChange, mode, initialData, onSubmit }: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      name: '',
      password: '',
      role: Role.CASHIER,
    },
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        ...initialData,
        password: '', // Don't show existing password
      });
    } else {
      reset({
        username: '',
        name: '',
        password: '',
        role: Role.CASHIER,
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
        aria-describedby={mode === 'add' ? 'Add New User' : 'Edit User'}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold">{mode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="space-y-2"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              disabled={mode === 'edit'}
              {...register('username', {
                required: 'Username is required',
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password {mode === 'edit' && <span className="text-sm text-gray-500">(Leave blank to keep current password)</span>}</Label>
            <Input
              id="password"
              type="password"
              {...register('password', {
                required: mode === 'add' ? 'Password is required' : false,
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={watch('role')}
              onValueChange={value => setValue('role', value as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                <SelectItem value={Role.CASHIER}>Cashier</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
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
