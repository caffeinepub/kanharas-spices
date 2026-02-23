import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetProductById, useAddToCart } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const productId = BigInt(id);
  const { data: product, isLoading } = useGetProductById(productId);
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart.mutate(
      { productId, quantity: BigInt(quantity) },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} ${product.name} to cart`);
        },
        onError: () => {
          toast.error('Failed to add item to cart');
        },
      }
    );
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate({ to: '/products' })}>
          Back to Products
        </Button>
      </div>
    );
  }

  const priceInDollars = Number(product.price) / 100;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate({ to: '/products' })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg bg-muted">
          <img
            src={`/assets/generated/${product.imageUrl}`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-start justify-between">
            <h1 className="font-serif text-4xl font-bold text-foreground">
              {product.name}
            </h1>
            {!product.available && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          <p className="mb-6 text-3xl font-bold text-spice-primary">
            ${priceInDollars.toFixed(2)}
          </p>

          <div className="mb-8 text-muted-foreground">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          {product.available && (
            <div className="mt-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-2 bg-spice-primary hover:bg-spice-primary/90"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
