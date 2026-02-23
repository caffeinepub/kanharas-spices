import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = Number(product.price) / 100;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to="/products/$id" params={{ id: product.id.toString() }} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={`/assets/generated/${product.imageUrl}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.available && (
            <Badge 
              variant="secondary" 
              className="absolute right-2 top-2 bg-background/90"
            >
              Out of Stock
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="font-serif text-xl font-bold text-spice-primary">
            ${priceInDollars.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            variant="outline"
            className="group-hover:bg-spice-primary group-hover:text-white"
          >
            View Details
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
