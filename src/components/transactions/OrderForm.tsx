import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { PaymentMethod } from '@/types/types';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const formSchema = z.object({
  customer: z.string().min(1, { message: 'Customer name is required' }),
  payment: z.string().min(1, { message: 'Payment method is required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  cart: CartItem[];
  paymentMethods: PaymentMethod[];
  serviceCharge: number;
  onServiceChargeChange: (value: number) => void;
  onSubmit: (data: FormValues) => void;
  totals: {
    subtotal: number;
    serviceChargeAmount: number;
    totalAmount: number;
  };
  onDialogClose: (resetForm: () => void) => void;
}

export const OrderForm = ({ cart, paymentMethods, serviceCharge, onServiceChargeChange, onSubmit, totals }: OrderFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      payment: '',
    },
  });

  if (cart.length === 0) {
    return null;
  }

  const handleServiceChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;

    const clampedValue = Math.max(0, Math.min(100, value));
    onServiceChargeChange(clampedValue);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => {
          onSubmit(data);
          form.reset();
        })}
        className="space-y-6"
      >
        {/* Customer Name Field */}
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-900 text-[16px]">Customer Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="px-4 py-2 text-[16px] rounded-md bg-neutral-50"
                  placeholder="Enter customer name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method Field */}
        <FormField
          control={form.control}
          name="payment"
          render={({ field }) => (
            <PaymentMethodSelect
              field={field}
              form={form}
              paymentMethods={paymentMethods}
            />
          )}
        />

        {/* Service Charge Field */}
        <div className="space-y-2">
          <FormLabel className="text-neutral-900 text-[16px]">Service Charge (%)</FormLabel>
          <Input
            type="number"
            min="0"
            max="100"
            value={serviceCharge}
            onChange={handleServiceChargeChange}
            className="px-4 py-2 text-[16px] rounded-md bg-neutral-50"
            placeholder="Enter service charge percentage"
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-600">Subtotal:</span>
            <span className="text-neutral-900 font-semibold">${totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-600">Service Charge ({serviceCharge}%):</span>
            <span className="text-neutral-900 font-semibold">${totals.serviceChargeAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[16px] font-bold border-t pt-2">
            <span className="text-neutral-900">Total:</span>
            <span className="text-neutral-900">${totals.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-[16px] font-bold"
        >
          Confirm Order
        </Button>
      </form>
    </Form>
  );
};
