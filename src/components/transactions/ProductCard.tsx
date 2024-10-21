import { Product } from '@/types/types';

interface ProductCardProps {
  product: Product;
  category: string;
  onAddToCart: (id: number) => void;
}

export const ProductCard = ({ product, category, onAddToCart }: ProductCardProps) => (
  <div className="border p-4 rounded-lg shadow bg-white text-[20px] font-semibold">
    <span className="text-indigo-300 text-[14px] font-normal">{category}</span>
    <h2 className="text-neutral-900">{product.name}</h2>
    <p className="text-indigo-500">Price: ${product.price}</p>
    <button
      className="border border-indigo-600 px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors mt-2 w-full font-semibold"
      onClick={() => onAddToCart(product.id)}
    >
      Add to cart
    </button>
  </div>
);
