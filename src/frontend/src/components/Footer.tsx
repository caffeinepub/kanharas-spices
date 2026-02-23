import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'kanharas-spices';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-serif text-lg font-semibold text-spice-primary">
              KanhaRas Spices
            </h3>
            <p className="text-sm text-muted-foreground">
              Bringing authentic Indian spices to your kitchen. Quality, tradition, and flavor in every blend.
            </p>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Our Spices</li>
              <li>Contact</li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <p className="text-sm text-muted-foreground">
              Follow us for recipes, tips, and special offers.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-spice-accent text-spice-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-spice-primary"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {currentYear} KanhaRas Spices. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
