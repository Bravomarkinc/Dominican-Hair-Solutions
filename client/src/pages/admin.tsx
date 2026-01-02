import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, User, Mail, Phone, Scissors, DollarSign, ArrowLeft, LogOut, ChevronDown, Check, X, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, isToday, isTomorrow, isPast, differenceInSeconds, addDays } from 'date-fns';
import { Link } from 'wouter';
import AdminLogin from './admin-login';

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceName: string;
  servicePrice: number;
  status: string;
  createdAt: string;
}

const SERVICES = [
  { name: 'Silk Press', price: 65 },
  { name: 'Deep Conditioning Treatment', price: 45 },
  { name: 'Dominican Blowout', price: 55 },
  { name: 'Relaxer Treatment', price: 85 },
  { name: 'Haircut & Style', price: 50 },
  { name: 'Color Treatment', price: 120 },
  { name: 'Braiding', price: 150 },
  { name: 'Wash & Set', price: 40 },
];

const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [editForm, setEditForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    serviceName: '',
    servicePrice: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    }
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
        throw new Error('Failed to fetch bookings');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof editForm }) => {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setEditingAppointment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const openEditDialog = (appointment: Appointment) => {
    setEditForm({
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      serviceName: appointment.serviceName,
      servicePrice: appointment.servicePrice,
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
    });
    setEditingAppointment(appointment);
  };

  const handleEditSubmit = () => {
    if (editingAppointment) {
      editMutation.mutate({ id: editingAppointment.id, data: editForm });
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      deleteMutation.mutate(id);
    }
  };

  const getNextAppointment = () => {
    if (!appointments) return null;
    const now = new Date();
    const futureAppointments = appointments
      .filter(a => a.status === 'scheduled')
      .map(a => {
        const { hours, minutes } = parseTimeString(a.appointmentTime);
        const appointmentDate = parseISO(a.appointmentDate);
        appointmentDate.setHours(hours, minutes, 0, 0);
        return { ...a, dateTime: appointmentDate };
      })
      .filter(a => a.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    return futureAppointments[0] || null;
  };

  const nextAppointment = getNextAppointment();

  useEffect(() => {
    if (!nextAppointment) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const { hours, minutes } = parseTimeString(nextAppointment.appointmentTime);
      const appointmentDate = parseISO(nextAppointment.appointmentDate);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      const diffSeconds = differenceInSeconds(appointmentDate, now);
      if (diffSeconds <= 0) {
        setCountdown(null);
        return;
      }
      
      const hrs = Math.floor(diffSeconds / 3600);
      const mins = Math.floor((diffSeconds % 3600) / 60);
      const secs = diffSeconds % 60;
      setCountdown({ hours: hrs, minutes: mins, seconds: secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextAppointment?.id, nextAppointment?.appointmentDate, nextAppointment?.appointmentTime]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const getDateBadge = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>;
    }
    if (isTomorrow(date)) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Tomorrow</Badge>;
    }
    if (isPast(date)) {
      return <Badge variant="secondary">Past</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load appointments</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Today's appointments that are still scheduled (not yet marked as showed/no-show)
  const todayAppointments = appointments?.filter(a => 
    isToday(parseISO(a.appointmentDate)) && a.status === 'scheduled'
  ) || [];
  const upcomingAppointments = appointments?.filter(a => !isPast(parseISO(a.appointmentDate)) && !isToday(parseISO(a.appointmentDate))) || [];
  // Past appointments: either from past dates, OR today's appointments that have been completed/no-show
  const pastAppointments = appointments?.filter(a => 
    (isPast(parseISO(a.appointmentDate)) && !isToday(parseISO(a.appointmentDate))) ||
    (isToday(parseISO(a.appointmentDate)) && (a.status === 'completed' || a.status === 'no-show'))
  ) || [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="link-home">
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900" data-testid="text-admin-title">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your salon appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-total-bookings">{appointments?.length || 0}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Today</p>
                  <p className="text-3xl font-bold text-green-800" data-testid="text-today-count">{todayAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-800" data-testid="text-upcoming-count">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Today's Revenue</p>
                  <p className="text-3xl font-bold text-amber-800" data-testid="text-today-revenue">
                    ${appointments?.filter(a => isToday(parseISO(a.appointmentDate))).reduce((sum, a) => sum + a.servicePrice, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Revenue</p>
                  <p className="text-3xl font-bold text-gray-800" data-testid="text-revenue">
                    ${appointments?.reduce((sum, a) => sum + a.servicePrice, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {nextAppointment && countdown && (
          <Card className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/80 mb-1">Next Appointment</p>
                  <p className="text-xl font-bold">{nextAppointment.customerName}</p>
                  <p className="text-white/90">{nextAppointment.serviceName} - {nextAppointment.appointmentTime}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-white/80 mb-2">Time Until Appointment</p>
                  <div className="flex gap-3 justify-center md:justify-end" data-testid="countdown-timer">
                    <div className="bg-white/20 rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold font-mono">{String(countdown.hours).padStart(2, '0')}</p>
                      <p className="text-xs text-white/70">hours</p>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold font-mono">{String(countdown.minutes).padStart(2, '0')}</p>
                      <p className="text-xs text-white/70">mins</p>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2 min-w-[70px]">
                      <p className="text-3xl font-bold font-mono">{String(countdown.seconds).padStart(2, '0')}</p>
                      <p className="text-xs text-white/70">secs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {todayAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Today's Appointments
            </h2>
            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} getDateBadge={getDateBadge} formatDate={formatDate} onEdit={openEditDialog} onCancel={handleCancel} onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <Accordion type="single" collapsible defaultValue="upcoming">
              <AccordionItem value="upcoming" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid="button-accordion-upcoming">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-xl font-serif font-bold text-gray-900">Upcoming Appointments</span>
                    <Badge className="bg-blue-500 ml-2">{upcomingAppointments.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {upcomingAppointments.length > 0 ? (
                    <div className="grid gap-4">
                      {upcomingAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} getDateBadge={getDateBadge} formatDate={formatDate} onEdit={openEditDialog} onCancel={handleCancel} onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No upcoming appointments scheduled.</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="overflow-hidden">
            <Accordion type="single" collapsible defaultValue="past">
              <AccordionItem value="past" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid="button-accordion-past">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-xl font-serif font-bold text-gray-900">Past Appointments</span>
                    <Badge className="bg-amber-500 ml-2">{pastAppointments.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {pastAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-gray-500">
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Time</th>
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Service</th>
                            <th className="pb-3 font-medium text-right">Price</th>
                            <th className="pb-3 font-medium text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastAppointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b last:border-none hover:bg-gray-50" data-testid={`row-past-${appointment.id}`}>
                              <td className="py-3 text-gray-900">{format(parseISO(appointment.appointmentDate), 'MMM d, yyyy')}</td>
                              <td className="py-3 text-gray-600">{appointment.appointmentTime}</td>
                              <td className="py-3">
                                <div className="font-medium text-gray-900">{appointment.customerName}</div>
                                <div className="text-xs text-gray-500">{appointment.customerPhone}</div>
                              </td>
                              <td className="py-3 text-gray-700">{appointment.serviceName}</td>
                              <td className="py-3 text-right font-medium text-gray-900">${appointment.servicePrice}</td>
                              <td className="py-3 text-center">
                                {appointment.status === 'completed' ? (
                                  <Badge className="bg-green-500">Showed</Badge>
                                ) : appointment.status === 'no-show' ? (
                                  <Badge className="bg-red-500">No Show</Badge>
                                ) : (
                                  <div className="flex gap-1 justify-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs text-green-600 border-green-300 hover:bg-green-50"
                                      onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'completed' })}
                                      disabled={updateStatusMutation.isPending}
                                      data-testid={`button-showed-${appointment.id}`}
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Showed
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
                                      onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'no-show' })}
                                      disabled={updateStatusMutation.isPending}
                                      data-testid={`button-noshow-${appointment.id}`}
                                    >
                                      <X className="w-3 h-3 mr-1" />
                                      No Show
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No past appointments yet. Completed appointments will appear here.</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>

      <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && setEditingAppointment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                value={editForm.customerName}
                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                data-testid="input-edit-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.customerEmail}
                onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.customerPhone}
                onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                data-testid="input-edit-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.appointmentDate}
                onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })}
                data-testid="input-edit-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Select value={editForm.appointmentTime} onValueChange={(value) => setEditForm({ ...editForm, appointmentTime: value })}>
                <SelectTrigger data-testid="select-edit-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'].map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-service">Service</Label>
              <Select 
                value={editForm.serviceName} 
                onValueChange={(value) => {
                  const service = SERVICES.find(s => s.name === value);
                  setEditForm({ ...editForm, serviceName: value, servicePrice: service?.price || 0 });
                }}
              >
                <SelectTrigger data-testid="select-edit-service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAppointment(null)} data-testid="button-edit-cancel">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={editMutation.isPending} data-testid="button-edit-save">
              {editMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AppointmentCard: React.FC<{
  appointment: Appointment;
  getDateBadge: (date: string) => React.ReactNode;
  formatDate: (date: string) => string;
  onEdit: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}> = ({ appointment, getDateBadge, formatDate, onEdit, onCancel, onUpdateStatus }) => (
  <Card className="hover:shadow-md transition-shadow" data-testid={`card-appointment-${appointment.id}`}>
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-customer-${appointment.id}`}>{appointment.customerName}</h3>
            {getDateBadge(appointment.appointmentDate)}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{appointment.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <a href={`tel:${appointment.customerPhone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{appointment.customerPhone}</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="break-all">{appointment.customerEmail}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 md:text-right">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <Scissors className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary" data-testid={`text-service-${appointment.id}`}>{appointment.serviceName}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-gray-900" data-testid={`text-price-${appointment.id}`}>${appointment.servicePrice}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(appointment)}
              data-testid={`button-edit-${appointment.id}`}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => onCancel(appointment.id)}
              data-testid={`button-cancel-${appointment.id}`}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-gray-500">Status:</span>
            {appointment.status === 'completed' ? (
              <Badge className="bg-green-500">Showed</Badge>
            ) : appointment.status === 'no-show' ? (
              <Badge className="bg-red-500">No Show</Badge>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs text-green-600 border-green-300 hover:bg-green-50"
                  onClick={() => onUpdateStatus(appointment.id, 'completed')}
                  data-testid={`button-showed-${appointment.id}`}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Showed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => onUpdateStatus(appointment.id, 'no-show')}
                  data-testid={`button-noshow-${appointment.id}`}
                >
                  <X className="w-3 h-3 mr-1" />
                  No Show
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Admin;
