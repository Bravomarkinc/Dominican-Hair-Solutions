import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Calendar as CalendarIcon, Clock, Scissors, User } from 'lucide-react';
import { salonConfig } from '@/config/salon';
import { format } from 'date-fns';

const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedServicePrice, setSelectedServicePrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleServiceSelect = (name: string, priceString: string) => {
    setSelectedService(name);
    // Parse price string (e.g., "$45+" -> 45)
    const price = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
    setSelectedServicePrice(price);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Please select date and time", variant: "destructive" });
      const element = document.getElementById('date-time-section');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!selectedService) {
      toast({ title: "Please select a service", variant: "destructive" });
      const element = document.getElementById('service-section');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast({ title: "Please fill in all contact details", variant: "destructive" });
      const element = document.getElementById('details-section');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
          appointmentTime: selectedTime,
          serviceName: selectedService,
          servicePrice: selectedServicePrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({ 
        title: "Booking failed", 
        description: "Please try again or call us directly.",
        variant: "destructive" 
      });
    }
  };

  const getTimeSlots = () => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    
    // Saturday: 9:30 AM - 5:30 PM
    if (dayOfWeek === 6) {
      return ["09:30 AM", "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", 
              "01:15 PM", "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "04:45 PM"];
    }

    // Tuesday - Friday: 10:00 AM - 5:30 PM
    return ["10:00 AM", "10:45 AM", "11:30 AM", "12:15 PM", "01:00 PM", 
            "01:45 PM", "02:30 PM", "03:15 PM", "04:00 PM", "04:45 PM"];
  };

  const timeSlots = getTimeSlots();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans selection:bg-primary selection:text-white pt-32 pb-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Card className="border-none shadow-xl bg-white overflow-hidden py-16">
              <CardContent className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                    Thank you, <span className="font-bold text-gray-900">{formData.name}</span>. We've scheduled your appointment for <span className="font-bold text-primary">{selectedService}</span> on <span className="font-bold text-gray-900">{selectedDate && format(selectedDate, "MMMM do")} at {selectedTime}</span>.
                  </p>
                  <div className="bg-stone-50 p-6 rounded-xl max-w-md mx-auto mb-10 border border-stone-100">
                    <p className="text-sm text-gray-500 mb-2">A confirmation email has been sent to:</p>
                    <p className="font-medium text-gray-900">{formData.email}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Estimated Price: <span className="font-bold text-gray-900">${selectedServicePrice}</span></p>
                      <p className="text-sm text-gray-500 italic mt-1">(Payment will be collected at the salon)</p>
                    </div>
                  </div>
                  <Button onClick={() => window.location.href = '/'} size="xl" className="rounded-full px-10 py-6 text-lg">
                    Return to Home
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-primary selection:text-white pt-32 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Book Your Appointment</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Complete the form below to secure your spot with our expert stylists.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                
                {/* Side-by-Side Group: Date/Time and Service */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Section 1: Date & Time */}
                    <Card id="date-time-section" className="border-none shadow-md overflow-hidden h-full">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Date & Time</h2>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-center w-full">
                                    <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border shadow-sm p-3 pointer-events-auto w-full max-w-[320px] mx-auto"
                                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 1} 
                                    />
                                </div>
                                <div className="w-full">
                                    <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide text-center xl:text-left">Available Slots</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                        <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        size="sm"
                                        className={`w-full text-xs px-1 ${selectedTime === time ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedTime(time)}
                                        >
                                        {time}
                                        </Button>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Service */}
                    <Card id="service-section" className="border-none shadow-md overflow-hidden h-full">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Select Service</h2>
                            </div>

                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {salonConfig.services.map((category) => (
                                <div key={category.title} className="space-y-3">
                                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider pl-1">{category.title}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {category.items.map((item) => (
                                        <div 
                                            key={item.name} 
                                            className={`
                                                flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200
                                                ${selectedService === item.name 
                                                ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary scale-[1.02]' 
                                                : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'}
                                            `} 
                                            onClick={() => handleServiceSelect(item.name, item.price)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedService === item.name ? 'border-primary' : 'border-gray-400'}`}>
                                                    {selectedService === item.name && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-primary text-sm whitespace-nowrap ml-2">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 3: Details */}
                <Card id="details-section" className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900">Your Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input 
                                    id="name" 
                                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                    placeholder="Jane Doe" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input 
                                    id="phone" 
                                    type="tel" 
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                    placeholder="(555) 123-4567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-36">
                    <Card className="border-none shadow-xl bg-white overflow-hidden">
                        <div className="bg-primary/5 p-6 border-b border-primary/10">
                            <h3 className="font-serif font-bold text-xl text-primary">Booking Summary</h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-3">
                                    <CalendarIcon className={`w-5 h-5 mt-0.5 ${selectedDate ? 'text-secondary' : 'text-gray-300'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</p>
                                        <p className={`font-medium ${selectedDate ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                            {selectedDate ? format(selectedDate, "MMMM do, yyyy") : 'Select a date'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className={`w-5 h-5 mt-0.5 ${selectedTime ? 'text-secondary' : 'text-gray-300'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time</p>
                                        <p className={`font-medium ${selectedTime ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                            {selectedTime || 'Select a time'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Scissors className={`w-5 h-5 mt-0.5 ${selectedService ? 'text-secondary' : 'text-gray-300'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Service</p>
                                        <p className={`font-medium ${selectedService ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                            {selectedService || 'Select a service'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="pt-6 mt-6 border-t border-dashed border-gray-200 space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                                        <span>Estimated Price</span>
                                        <span>{selectedServicePrice > 0 ? `$${selectedServicePrice}` : '$0'}</span>
                                    </div>
                                    <p className="text-xs text-right text-gray-500 italic">Pay at salon</p>
                                </div>
                            </div>

                            <Button 
                                size="lg" 
                                className="w-full rounded-full h-14 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={handleSubmit}
                            >
                                Confirm Booking
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                By clicking confirm, you agree to our booking policy.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;