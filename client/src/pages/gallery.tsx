import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import hair1 from '@assets/stock_images/woman_with_beautiful_4db5fec7.jpg';
import hair2 from '@assets/stock_images/woman_with_beautiful_f2f017af.jpg';
import hair3 from '@assets/stock_images/woman_with_beautiful_1884425e.jpg';
import interior from '@assets/stock_images/professional_hair_sa_82a74ef7.jpg';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Gallery: React.FC = () => {
  const images = [
    { src: hair1, category: "Blowouts", title: "Silk Press Perfection" },
    { src: hair2, category: "Color", title: "Honey Blonde Balayage" },
    { src: interior, category: "Salon", title: "Our Luxury Space" },
    { src: hair3, category: "Styling", title: "Red Carpet Waves" },
    { src: hair1, category: "Treatments", title: "Keratin Smooth" },
    { src: hair2, category: "Color", title: "Chocolate Brunette" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <div className="bg-muted/30 pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-primary">Lookbook</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Real clients. Real results. Explore our portfolio of transformations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <Dialog key={idx}>
              <DialogTrigger asChild>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md bg-black aspect-[3/4]"
                >
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-bold uppercase tracking-widest mb-1 text-secondary">{img.category}</p>
                    <h3 className="text-2xl font-serif font-bold">{img.title}</h3>
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;
