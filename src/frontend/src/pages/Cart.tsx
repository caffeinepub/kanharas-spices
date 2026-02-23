import { useNavigate } from '@tanstack/react-router';
import { useGetCartWithProducts, useAddToCart } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { data: cartWithProducts = [], isLoading } = useGetCartWithProducts();
  const addToCart = useAddToCart();

  const updateQuantity = (productId: bigint, newQuantity: number) => {
    addToCart.mutate(
      { productId, quantity: BigInt(newQuantity) },
      {
        onSuccess: () => {
          if (newQuantity === 0) {
            toast.success('Item removed from cart');
          }
        },
        onError: () => {
          toast.error('Failed to update cart');
        },
      }
    );
  };

  const subtotal = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const subtotalInDollars = subtotal / 100;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (cartWithProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Add some delicious spices to get started!
          </p>
          <Button onClick={() => navigate({ to: '/products' })}>
            Browse Spices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-serif text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartWithProducts.map((item) => {
            if (!item.product) return null;
            
            const priceInDollars = Number(item.product.price) / 100;
            const lineTotal = priceInDollars * Number(item.quantity);

            return (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={`/assets/generated/${item.product.imageUrl}`}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                    
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${priceInDollars.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product!.id, Number(item.quantity) - 1)}
                            disabled={addToCart.isPending}
                          >
                            {Number(item.quantity) === 1 ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {Number(item.quantity)}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product!.id, Number(item.quantity) + 1)}
                            disabled={addToCart.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="font-semibold">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotalInDollars.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-spice-primary">
                  ${subtotalInDollars.toFixed(2)}
                </span>
              </div>
              
              <Button
                size="lg"
                className="w-full bg-spice-primary hover:bg-spice-primary/90"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
