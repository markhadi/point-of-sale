import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod } from '@/types/types';

interface PaymentMethodSelectProps {
  field: any;
  form: any;
  paymentMethods: PaymentMethod[];
}

export const PaymentMethodSelect = ({ field, form, paymentMethods }: PaymentMethodSelectProps) => {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>Payment Method</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {paymentMethods
            .filter(method => method.is_active)
            .map(method => (
              <SelectItem
                key={method.id}
                value={method.id}
              >
                <div className="flex flex-col">
                  <span>{method.name}</span>
                  {method.description && <span className="text-xs text-muted-foreground">{method.description}</span>}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
