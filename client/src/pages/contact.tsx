import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { salonConfig } from '@/config/salon';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <div className="bg-primary text-white pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          We'd love to hear from you. Book an appointment or visit us today.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Contact Information</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Whether you're a new client looking for a consultation or a regular looking to book your next appointment, our team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Visit Us", details: salonConfig.contact.address },
              { icon: Phone, title: "Call Us", details: [salonConfig.contact.phone] },
              { icon: Clock, title: "Hours", details: salonConfig.contact.hoursText },
            ].map((item, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardContent className="flex flex-col items-center text-center p-8 h-full">
                  <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-900">{item.title}</h3>
                  <div className="mt-auto space-y-1">
                    {item.details.map((line, i) => (
                      item.title === "Call Us" ? (
                        <a key={i} href={`tel:+1${salonConfig.contact.phone.replace(/[^0-9]/g, '')}`} className="text-gray-600 hover:text-primary transition-colors block">{line}</a>
                      ) : item.title === "Visit Us" ? (
                        <a key={i} href="https://www.google.com/maps/search/?api=1&query=Dominican+Hair+Solutions+2407+South+Florida+Ave+Lakeland+FL+33803" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors block">{line}</a>
                      ) : (
                        <p key={i} className="text-gray-600">{line}</p>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Map Placeholder */}
      <div className="h-96 w-full bg-gray-200 relative group">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.511388048259!2d-81.9542718!3d27.979069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88dd396d18721915%3A0xc6657c7d41f3e9c!2s2407%20S%20Florida%20Ave%2C%20Lakeland%2C%20FL%2033803!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale group-hover:grayscale-0 transition-all duration-700 border-0"
        ></iframe>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
