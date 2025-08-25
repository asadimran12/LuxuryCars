import React from "react";

const DriverFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left side */}
        <p className="text-sm">&copy; {new Date().getFullYear()} Driver Panel. All Rights Reserved.</p>

        {/* Right side links */}
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="/driver/help" className="hover:text-yellow-400 transition text-sm">
            Help
          </a>
          <a href="/driver/contact" className="hover:text-yellow-400 transition text-sm">
            Contact
          </a>
          <a href="/driver/terms" className="hover:text-yellow-400 transition text-sm">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DriverFooter;
