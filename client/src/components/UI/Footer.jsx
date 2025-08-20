import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0b132b] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
        {/* Reservation */}
        <div>
          <h3 className="font-semibold mb-3">Reservation</h3>
          <ul className="space-y-1">
            <li>Car Hire</li>
            <li>Modify Or Cancel</li>
            <li>Get A Receipt</li>
          </ul>
        </div>

        {/* Customer Services */}
        <div>
          <h3 className="font-semibold mb-3">Customer Services</h3>
          <ul className="space-y-1">
            <li>Help / FAQS</li>
            <li>Press</li>
            <li>Blog</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Career</li>
            <li>Report & Governance</li>
          </ul>
        </div>

        {/* Footer bottom */}
        <div className="col-span-full border-t border-gray-600 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-gray-400">LUXURYCARS</span>
          <div className="flex gap-4 text-white text-lg">
            <FaTwitter className="hover:text-yellow-500 cursor-pointer" />
            <FaFacebookF className="hover:text-yellow-500 cursor-pointer" />
            <FaInstagram className="hover:text-yellow-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
