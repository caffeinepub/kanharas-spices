import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { useGetCart } from '../hooks/useQueries';
import { Button } from './ui/button';

export default function Header() {
  const navigate = useNavigate();
  const { data: cartItems = [] } = useGetCart();
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src="/assets/generated/kanharas-logo.dim_400x400.png" 
            alt="KanhaRas Spices Logo" 
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-spice-primary">
              KanhaRas Spices
            </span>
            <span className="text-xs tracking-wider text-muted-foreground">
              Authentic Indian Flavors
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            to="/products"
            className="text-sm font-medium transition-colors hover:text-spice-primary"
          >
            Shop Spices
          </Link>
          
          <Button
            variant="outline"
            size="sm"
            className="relative gap-2"
            onClick={() => navigate({ to: '/cart' })}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-spice-accent text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
