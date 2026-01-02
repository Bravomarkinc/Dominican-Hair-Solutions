import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2">
        <Link href="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg md:text-2xl font-serif font-bold text-primary tracking-tight cursor-pointer"
          >
            <span className="hidden sm:inline">Dominican Hair Solutions</span>
            <span className="sm:hidden">Dominicn Hair Solutions</span>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wide text-gray-600">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <motion.div 
                  whileHover={{ y: -2, color: 'hsl(var(--primary))' }} 
                  className={cn(
                    "cursor-pointer transition-colors relative",
                    location === item.path ? "text-primary font-bold" : ""
                  )}
                >
                  {item.name}
                  {location === item.path && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary"
                    />
                  )}
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Booking Button */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block">
            <Link href="/booking">
              <Button size="lg" className="rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                Book Appointment
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Booking Button - Always Visible */}
          <div className="md:hidden">
            <Link href="/booking">
              <Button size="sm" className="rounded-full font-bold shadow-md" data-testid="button-book-now-mobile">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle className="text-2xl font-serif font-bold text-primary">Dafenny's</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.path} onClick={() => setIsOpen(false)}>
                      <div className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location === item.path ? "text-primary font-bold" : "text-gray-600"
                      )}>
                        {item.name}
                      </div>
                    </Link>
                  ))}
                  <div className="pt-4">
                    <Link href="/booking" onClick={() => setIsOpen(false)}>
                      <Button size="lg" className="w-full rounded-full font-bold shadow-lg">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
