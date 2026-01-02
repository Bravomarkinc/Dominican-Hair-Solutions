import { Scissors, Palette, Heart } from 'lucide-react';

export const salonConfig = {
  hours: [
    { day: "Sunday", time: "Closed", active: false, highlight: true },
    { day: "Monday", time: "Closed", active: false, highlight: true },
    { day: "Tuesday", time: "10:00 - 5:30", active: true, highlight: false },
    { day: "Wednesday", time: "10:00 - 5:30", active: true, highlight: false },
    { day: "Thursday", time: "10:00 - 5:30", active: true, highlight: false },
    { day: "Friday", time: "10:00 - 5:30", active: true, highlight: false },
    { day: "Saturday", time: "9:30 - 5:30", active: true, highlight: false },
  ],
  services: [
    {
      title: "Signature Styling",
      icon: Scissors,
      items: [
        { name: "Bangs Cut", price: "$20+", desc: "" },
        { name: "Bangs Trim", price: "$10+", desc: "" },
        { name: "Up-dos", price: "$65+", desc: "" },
        { name: "Hair Cut", price: "$35+", desc: "Does not include Styling" },
        { name: "Keratin Hair Treatment", price: "$250+", desc: "" },
        { name: "Press-Curl", price: "$55+", desc: "" },
        { name: "Spiral Curl", price: "$55+", desc: "" },
        { name: "Men Haircut", price: "$25+", desc: "" },
        { name: "Boys (12 & Under)", price: "$20+", desc: "" },
      ]
    },
    {
      title: "Color & Chemical",
      icon: Palette,
      items: [
        { name: "Permanent Color", price: "$70+", desc: "" },
        { name: "Semi Permanent Color", price: "$45+", desc: "" },
        { name: "Touch-up Perm and Permanent Color", price: "$70+", desc: "" },
        { name: "Cellophane Rinse Protein Color", price: "$45+", desc: "" },
        { name: "Foil Highlights", price: "$150+", desc: "" },
        { name: "Cap Highlights", price: "$75+", desc: "" },
      ]
    },
    {
      title: "Hair Care Treatments",
      icon: Heart,
      items: [
        { name: "Relaxers Touch-up", price: "$95+", desc: "" },
        { name: "Full Relaxer", price: "$120+", desc: "Includes Style, Trim and Deep Conditioner" },
        { name: "Full Perm", price: "$95+", desc: "" },
      ]
    },
  ],
  contact: {
    address: ["2407 South Florida Ave.", "Lakeland, FL 33803"],
    phone: "863-940-4469",
    email: "info@dominicanstyle.com",
    hoursText: ["Sun-Mon: Closed", "Tue-Fri: 10:00am - 5:30pm", "Sat: 9:30am - 5:30pm"]
  }
};
