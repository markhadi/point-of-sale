import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  customer: string;
  paymentMethod: string;
  subtotal: number;
  serviceCharge: number;
  serviceChargeAmount: number;
  totalAmount: number;
}

export const OrderConfirmation = ({ isOpen, onClose, cartItems, customer, paymentMethod, subtotal, serviceCharge, serviceChargeAmount, totalAmount }: OrderConfirmationProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="text-neutral-900">
        <DialogHeader>
          <DialogTitle className="font-bold text-[32px] text-neutral-900">Order Confirmation</DialogTitle>
          <div>
            <DialogDescription className="flex gap-4 justify-between items-center text-neutral-500 text-[14px]">
              <span>Customer name </span>
              <span>{customer}</span>
            </DialogDescription>
          </div>
          <div>
            <DialogDescription className="flex gap-4 justify-between items-center text-neutral-500 text-[14px]">
              <span>Payment method </span>
              <span>{paymentMethod}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-t pt-4 max-h-[25vh] overflow-y-scroll">
            <h4 className="font-semibold mb-2">Order Details:</h4>
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex justify-between py-1"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge ({serviceCharge}%):</span>
              <span>${serviceChargeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="mt-4"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
