interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Espresso', price: 15, category: 'Coffee' },
  { id: 2, name: 'Americano', price: 18, category: 'Coffee' },
  { id: 3, name: 'Green Tea', price: 12, category: 'Tea' },
  { id: 4, name: 'Black Tea', price: 12, category: 'Tea' },
  { id: 5, name: 'Croissant', price: 20, category: 'Pastry' },
  { id: 6, name: 'Danish Pastry', price: 25, category: 'Pastry' },
];

export default function ProductList({ addToCart }: { addToCart: (product: Product) => void }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="p-4 border rounded"
        >
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-2 p-2 bg-blue-500 text-white"
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
