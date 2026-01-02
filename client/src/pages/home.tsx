import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "wouter";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroBg1 from '@assets/DSC04018_1767044629903.jpeg';
import heroBg2 from '@assets/DSC02996_1767044634145.jpeg';
import heroBg3 from '@assets/DSC04023_1767044681884.jpeg';
import heroBg4 from '@assets/dhs2_(3)_1767307419853.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, Star, Heart, Calendar, Clock, Instagram, Pencil } from 'lucide-react';
import hair1 from '@assets/stock_images/woman_with_beautiful_4db5fec7.jpg';
import hair2 from '@assets/stock_images/woman_with_beautiful_f2f017af.jpg';
import hair3 from '@assets/stock_images/woman_with_beautiful_1884425e.jpg';
import interior from '@assets/stock_images/professional_hair_sa_82a74ef7.jpg';
import reviewIcon from '@assets/Review_Icon_1767068880012.webp';

const fadeInUp: any = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

import { salonConfig } from '@/config/salon';

const Home: React.FC = () => {
  const heroImages = [heroBg1, heroBg2, heroBg3, heroBg4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const loadEmbedSocial = () => {
      const existingScript = document.getElementById('EmbedSocialHashtagScript');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.id = 'EmbedSocialHashtagScript';
      script.src = 'https://embedsocial.com/cdn/ht.js';
      script.async = true;
      document.head.appendChild(script);
    };
    
    const timer = setTimeout(loadEmbedSocial, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Dominican Style Background"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className={`absolute inset-0 w-full h-full object-cover opacity-90 ${
                heroImages[currentImageIndex] === heroBg4 ? 'object-[center_-80px]' : ''
              }`}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/10 mix-blend-overlay z-10" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 pt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-white font-semibold mb-10 max-w-2xl mx-auto"
            style={{ textShadow: '1px 1px 2px #000, 0 0 8px #000, 0 0 15px rgba(0,0,0,0.8)' }}
          >
            Where elegance meets vibrancy. Experience the art of authentic beauty and culture.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link href="/services">
              <Button size="xl" variant="default" className="text-lg px-8 py-6 rounded-full bg-secondary hover:bg-secondary/90 text-white border-0 shadow-xl hover:scale-105 transition-transform w-full md:w-auto">
                View Our Services
              </Button>
            </Link>
            <Link href="/about">
              <Button size="xl" variant="outline" className="text-lg px-8 py-6 rounded-full bg-primary text-white border-primary hover:bg-primary/90 shadow-xl hover:scale-105 transition-transform w-full md:w-auto">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Description Section */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-8 text-center lg:text-left">Authentic Dominican Beauty Salon in the Heart of Lakeland</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                <p>
                  <span className="font-semibold text-primary">Dominican Hair Solutions</span> is Lakeland's premier destination for elegant, budget-friendly hair care. Our highly skilled stylists, trained in both the Dominican Republic and the United States, bring years of industry expertise to every chair, delivering an authentic experience you won't find anywhere else.
                </p>
                <p>
                  We take pride in offering an outstanding array of services, from vibrant professional coloring and precision cuts to our world-renowned <span className="font-semibold text-primary">Dominican Blowout</span>. As the first Dominican-style salon in Polk County, we are honored by the loyalty of our clients and the glowing reviews they share across social media.
                </p>
                <p className="font-serif italic text-2xl text-secondary pt-4 text-center lg:text-left">
                  Experience the perfect blend of Caribbean tradition and modern style. Visit us or call today for a free consultation—discover why we are Lakeland’s favorite sanctuary for beautiful, healthy hair.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-secondary py-8 px-6 text-center relative overflow-hidden group">
                   {/* Decorative Background Icon */}
                   <Clock className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out" />
                   
                   <div className="relative z-10">
                    <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-1.5 mb-4 shadow-sm group-hover:bg-white/30 transition-colors">
                        <p className="text-white text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          By Appointment Only
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="w-6 h-6 text-white/90" />
                      <h3 className="text-white font-bold text-2xl uppercase tracking-widest">Business Hours</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-0">
                    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-50 last:border-0">
                      <span className="font-bold text-lg text-gray-700">
                        Tuesday - Friday
                      </span>
                      <span className="text-gray-600">
                        10:00 - 5:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-50 last:border-0">
                      <span className="font-bold text-lg text-gray-700">
                        Saturday
                      </span>
                      <span className="text-gray-600">
                        9:30 - 5:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-gray-50 border-b border-gray-50 last:border-0">
                      <span className="font-bold text-lg text-secondary">
                        Sunday - Monday
                      </span>
                      <span className="text-gray-600 font-bold text-gray-800">
                        Closed
                      </span>
                    </div>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Testimonials Link Section */}
      <section className="py-8 px-6 bg-gray-50 text-center">
        <div className="flex flex-col items-center gap-3">
          <img src={reviewIcon} alt="Review" className="w-12 h-12" />
          <a 
            href="https://g.page/r/CQ0iygJ8zONuEAE/review" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors font-bold text-[24px] flex items-center gap-2"
          >Read Testimonials or Write a Review. <Pencil className="w-6 h-6" /></a>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-24 px-6 bg-stone-100 relative overflow-hidden">
        {/* Abstract Pattern Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: Scissors, 
                title: "Signature Blowouts", 
                desc: "Our world-famous technique leaving your hair silky, bouncy, and full of life without harsh chemicals." 
              },
              { 
                icon: Star, 
                title: "Vibrant Color", 
                desc: "From deep brunettes to sun-kissed blondes, our color experts bring the Dominican flair to your look." 
              },
              { 
                icon: Heart, 
                title: "Hair Health First", 
                desc: "We prioritize the integrity of your hair with premium treatments and gentle handling." 
              }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white h-full transform hover:-translate-y-2">
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    <div className="mb-6 p-5 rounded-full bg-stone-50 text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-1 ring-inset ring-stone-100">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Instagram Feed */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 text-primary">
               <Instagram className="w-8 h-8" />
               <h2 className="text-3xl font-serif font-bold">@dafennydominicanstyle</h2>
            </div>
            <p className="text-gray-600">Follow us for daily inspiration and hair transformations.</p>
           </div>
           
           <div className="embedsocial-hashtag" data-ref="edc87cd6150f4429cf9fbf6a6028949fce19a625"></div>
           
           <div className="text-center mt-12">
             <a href="https://instagram.com/dafennydominicanstyle" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                  Follow on Instagram
                </Button>
             </a>
           </div>
        </div>
      </section>
      {/* Promo Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mb-8"
          >
            Ready for your transformation?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:text-2xl text-blue-100 mb-12 font-light text-[22px] whitespace-nowrap"
          >Join thousands of happy clients who have discovered the magic of Dominican Hair Solutions.</motion.p>
          <Link href="/booking">
            <Button size="xl" className="bg-white text-primary hover:bg-gray-100 rounded-full text-lg px-12 py-8 font-bold shadow-2xl">
              <Calendar className="mr-2 h-5 w-5" /> Book Now
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
