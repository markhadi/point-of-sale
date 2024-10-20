import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PaymentMethod } from '@/types/types';

interface PaymentMethodSelectProps {
  field: any;
  form: any;
  paymentMethods: PaymentMethod[];
}

export const PaymentMethodSelect = ({ field, form, paymentMethods }: PaymentMethodSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Payment Method</FormLabel>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
            >
              {field.value ? paymentMethods.find(method => method.id === field.value)?.name : 'Select payment method'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {paymentMethods
                  .filter(method => method.is_active)
                  .map(method => (
                    <CommandItem
                      key={method.id}
                      value={method.id}
                      onSelect={currentValue => {
                        form.setValue('payment', currentValue === field.value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', field.value === method.id ? 'opacity-100' : 'opacity-0')} />
                      <div className="flex flex-col">
                        <span>{method.name}</span>
                        {method.description && <span className="text-xs text-muted-foreground">{method.description}</span>}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};
