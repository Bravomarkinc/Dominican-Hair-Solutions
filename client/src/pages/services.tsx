import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Scissors, Droplets, Sparkles, Wind } from 'lucide-react';

import { salonConfig } from '@/config/salon';

const Services: React.FC = () => {
  const categories = salonConfig.services;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary text-white pt-32 pb-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Our Services</h1>
        <p className="text-xl text-blue-100 max-w-none mx-auto whitespace-nowrap">
          Experience the finest in hair care with our specialized Dominican techniques.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12">
          {categories.map((category, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <category.icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif font-bold">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, i) => (
                  <Card key={i} className="group hover:border-primary/50 transition-colors duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                        <Badge variant="secondary" className="font-bold text-lg">{item.price}</Badge>
                      </div>
                      <CardDescription className="text-gray-500 leading-relaxed">
                        {item.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                         <li className="flex items-center text-sm text-gray-500">
                           <Check className="w-4 h-4 mr-2 text-green-500" /> Professional Consultation
                         </li>
                         <li className="flex items-center text-sm text-gray-500">
                           <Check className="w-4 h-4 mr-2 text-green-500" /> Premium Products
                         </li>
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 p-12 bg-muted/30 rounded-2xl text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">Don't see what you're looking for?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            We offer customized packages for weddings, special events, and photoshoots. Contact us to discuss your specific needs.
          </p>
          <a href="tel:+13013557991">
            <Button size="lg" className="rounded-full">Contact Us for Custom Quote</Button>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
