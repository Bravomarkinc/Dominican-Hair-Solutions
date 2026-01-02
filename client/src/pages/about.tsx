import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import salonInterior from '@assets/DSC04018_1767042086817.jpeg';
import stylistWorking from '@assets/Dafenny_1767042205529.jpg';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-primary leading-tight">
              More Than Just <br/> <span className="text-secondary italic">A Salon.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2010, Dominican Style started with a simple mission: to bring the authentic, high-quality hair care techniques of the Dominican Republic to our local community.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe that every texture is beautiful and deserves expert care. Our stylists are trained in the art of the "Dominican Blowout" — a technique passed down through generations that smooths and shines without compromising hair health.
            </p>
            
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <img 
              src={salonInterior} 
              alt="Luxury Salon Interior" 
              className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-primary text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative">
                <img 
                  src={stylistWorking} 
                  alt="Stylist working" 
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover border-2 border-red-600" style={{ objectPosition: 'center 15%' }}
                />
                <div className="absolute -bottom-6 -right-6 bg-white text-primary p-8 rounded-xl shadow-xl max-w-xs hidden md:block">
                  <p className="font-serif text-xl italic font-bold">"Beauty is power, and a blowout is its sword."</p>
                </div>
             </div>
             
             <div className="order-1 md:order-2">
               <h2 className="text-4xl font-serif font-bold mb-6">Our Philosophy</h2>
               <div className="space-y-8">
                 {[
                   { title: "Authenticity", text: "We stay true to traditional techniques while embracing modern innovation." },
                   { title: "Care", text: "Hair health is our non-negotiable priority. We never sacrifice long-term health for short-term style." },
                   { title: "Community", text: "Our salon is a sanctuary where clients become family." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl shrink-0">
                       {i + 1}
                     </div>
                     <div>
                       <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                       <p className="text-blue-100">{item.text}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
