'use client';

import { useState } from 'react';
import MainLayout from './MainLayout';
import { products } from '@/data/products';
import { paymentMethods } from '@/data/paymentMethods';
import { categories } from '@/data/category';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { CartItemComponent } from '@/components/CartItemComponent';
import { OrderForm } from '@/components/OrderForm';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';

interface FormData {
  customer: string;
  payment: string;
}

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { cart, addToCart, decreaseQuantity, getCartTotals, resetCart } = useCart(products);

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totals = getCartTotals(serviceCharge);

  const handleConfirmOrder = (data: FormData) => {
    setFormData(data);
    const orderDetails = {
      ...data,
      cartItems: cart,
      subtotal: totals.subtotal,
      serviceChargePercentage: serviceCharge,
      serviceChargeAmount: totals.serviceChargeAmount,
      totalAmount: totals.totalAmount,
    };
    console.log('Complete Order Details:', orderDetails);
    setIsOrderConfirmed(true);
  };

  const handleDialogClose = () => {
    setIsOrderConfirmed(false);
    setFormData(null);
    setServiceCharge(0);
    setSearchTerm('');
    resetCart();
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 xl:flex-row">
        <div className="flex-grow">
          <h1 className="text-[32px] text-neutral-900 font-bold mb-8">Transactions</h1>
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find(cat => cat.id === product.category_id)?.name || 'Unknown Category'}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        <div className="w-full xl:max-w-[300px] h-max">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-7">
              <ShoppingCart className="w-6 h-6 text-neutral-900" />
              <h2 className="text-[24px] text-neutral-900 font-bold">Cart ({cart.length})</h2>
            </div>

            {cart.length === 0 && (
              <div className="min-h-24 flex items-center justify-center">
                <p className="text-neutral-300 text-center">Your cart is empty.</p>
              </div>
            )}

            {cart.map(item => (
              <CartItemComponent
                key={item.id}
                item={item}
                onIncrease={addToCart}
                onDecrease={decreaseQuantity}
              />
            ))}

            {cart.length > 0 && <hr className="my-4" />}

            <OrderForm
              cart={cart}
              paymentMethods={paymentMethods}
              serviceCharge={serviceCharge}
              onServiceChargeChange={setServiceCharge}
              onSubmit={handleConfirmOrder}
              totals={totals}
              onDialogClose={handleDialogClose}
            />
          </div>
        </div>

        <OrderConfirmation
          isOpen={isOrderConfirmed}
          onClose={handleDialogClose}
          cartItems={cart}
          totalAmount={totals.totalAmount}
          customer={formData?.customer || ''}
          paymentMethod={paymentMethods.find(method => method.id === formData?.payment)?.name || ''}
          serviceCharge={serviceCharge}
          subtotal={totals.subtotal}
          serviceChargeAmount={totals.serviceChargeAmount}
        />
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
