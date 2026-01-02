import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-serif font-bold mb-6">Dafenny's Dominican Style</h3>
          <p className="text-gray-400 max-w-sm">
            Elevating beauty standards with passion, precision, and a touch of Caribbean soul.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg">Hours</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>Tuesday - Friday: 10:00 AM - 5:30 PM</li>
            <li>Saturday: 9:30 AM - 5:30 PM</li>
            <li>Sunday - Monday: Closed</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg">Contact</h4>
          <ul className="space-y-3 text-gray-400">
            <li><a href="https://www.google.com/maps/search/?api=1&query=Dominican+Hair+Solutions+2407+South+Florida+Ave+Lakeland+FL+33803" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">2407 South Florida Ave.</a></li>
            <li><a href="https://www.google.com/maps/search/?api=1&query=Dominican+Hair+Solutions+2407+South+Florida+Ave+Lakeland+FL+33803" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Lakeland, FL 33803</a></li>
            <li><a href="tel:+18639404469" className="hover:text-white transition-colors">Tel. (863) 940-4469</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <span>© {new Date().getFullYear()} Dafenny's Dominican Style. All rights reserved.</span>
        <Link href="/admin">
          <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-admin-login">
            Staff Login
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
