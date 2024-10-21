import { Plus, Minus } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CartItemComponentProps {
  item: CartItem;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

export const CartItemComponent = ({ item, onIncrease, onDecrease }: CartItemComponentProps) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-[16px] font-bold text-neutral-900">{item.name}</span>
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <button
          className="w-4 h-4 bg-indigo-600 rounded-[2px] hover:bg-indigo-700 transition-colors"
          onClick={() => onDecrease(item.id)}
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        <span>{item.quantity}</span>
        <button
          className="w-4 h-4 bg-indigo-600 rounded-[2px] hover:bg-indigo-700 transition-colors"
          onClick={() => onIncrease(item.id)}
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
      <span className="text-[16px] font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  </div>
);
