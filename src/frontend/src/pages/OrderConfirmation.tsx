import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Retrieve order data from sessionStorage
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
      // Clear the stored order data
      sessionStorage.removeItem('lastOrder');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />
        
        <h1 className="mb-4 font-serif text-4xl font-bold">
          Order Confirmed!
        </h1>
        
        <p className="mb-8 text-lg text-muted-foreground">
          Thank you for your order{orderData?.name ? `, ${orderData.name}` : ''}. We'll start preparing your spices right away!
        </p>

        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">What's Next?</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ You'll receive an order confirmation email shortly</li>
              <li>✓ We'll notify you when your order ships</li>
              <li>✓ Your spices will arrive fresh and ready to use</li>
            </ul>
          </CardContent>
        </Card>

        <Button
          size="lg"
          onClick={() => navigate({ to: '/products' })}
          className="bg-spice-primary hover:bg-spice-primary/90"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
