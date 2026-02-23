import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, CartItem } from '../backend';

// Get all products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get product by ID
export function useGetProductById(productId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Get cart
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get cart with product details
export function useGetCartWithProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ product: Product | null; quantity: bigint }>>({
    queryKey: ['cart-with-products'],
    queryFn: async () => {
      if (!actor) return [];
      
      const cartItems = await actor.getCart();
      
      // Merge duplicate product IDs by summing quantities
      const mergedCart = cartItems.reduce((acc, item) => {
        const existing = acc.find(i => i.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as CartItem[]);
      
      const productsPromises = mergedCart.map(async (item) => {
        const product = await actor.getProductById(item.productId);
        return { product, quantity: item.quantity };
      });
      
      return Promise.all(productsPromises);
    },
    enabled: !!actor && !isFetching,
  });
}

// Add item to cart
export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addItemToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-with-products'] });
    },
  });
}

// Initialize products (seed data)
export function useInitializeProducts() {
  const { actor } = useActor();
  const { data: products } = useGetAllProducts();

  useQuery({
    queryKey: ['initialize-products'],
    queryFn: async () => {
      if (!actor || !products || products.length > 0) return null;

      const spiceProducts = [
        {
          name: 'Turmeric Powder',
          description: 'Premium quality turmeric powder with vibrant color and earthy flavor. Perfect for curries, golden milk, and anti-inflammatory dishes.',
          price: BigInt(899),
          imageUrl: 'turmeric-powder.dim_800x800.png',
          available: true,
        },
        {
          name: 'Red Chili Powder',
          description: 'Fiery red chili powder made from sun-dried chilies. Adds heat and rich color to your favorite dishes.',
          price: BigInt(749),
          imageUrl: 'chili-powder.dim_800x800.png',
          available: true,
        },
        {
          name: 'Cumin Seeds',
          description: 'Aromatic cumin seeds with a warm, earthy flavor. Essential for tempering and spice blends.',
          price: BigInt(649),
          imageUrl: 'cumin-seeds.dim_800x800.png',
          available: true,
        },
        {
          name: 'Coriander Seeds',
          description: 'Fresh coriander seeds with a citrusy, slightly sweet flavor. Perfect for grinding fresh or using whole.',
          price: BigInt(599),
          imageUrl: 'coriander-seeds.dim_800x800.png',
          available: true,
        },
        {
          name: 'Garam Masala',
          description: 'Our signature blend of warming spices including cardamom, cinnamon, cloves, and more. The heart of Indian cuisine.',
          price: BigInt(999),
          imageUrl: 'garam-masala.dim_800x800.png',
          available: true,
        },
        {
          name: 'Black Pepper',
          description: 'Premium whole black peppercorns with bold, pungent flavor. Freshly grind for maximum aroma and taste.',
          price: BigInt(1099),
          imageUrl: 'black-pepper.dim_800x800.png',
          available: true,
        },
      ];

      for (const product of spiceProducts) {
        await actor.addProduct(
          product.name,
          product.description,
          product.price,
          product.imageUrl,
          product.available
        );
      }

      return true;
    },
    enabled: !!actor && products !== undefined,
    staleTime: Infinity,
  });
}
