import { useState } from 'react';
import { useGetAllProducts, useInitializeProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products = [], isLoading } = useGetAllProducts();
  useInitializeProducts();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-spice-primary/20 to-spice-secondary/20">
        <img
          src="/assets/generated/spices-hero.dim_1920x600.png"
          alt="Colorful spices"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-5xl font-bold text-foreground md:text-6xl">
              Discover Authentic Spices
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Premium quality spices for your culinary adventures
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              {searchQuery ? 'No spices found matching your search.' : 'No products available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
