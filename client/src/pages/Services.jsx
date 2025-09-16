import React from "react";
import FAQ from "./FAQ";

const Services = () => {
  return (
    <section className="py-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* Left: Image */}
        <div className="flex justify-center">
          <img
            src="Car.png"
            alt="Luxury Car"
            className="w-full max-w-md md:max-w-full h-auto object-contain"
          />
        </div>

        {/* Right: Services Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Services</h2>

          {/* Service Items */}
          {[
            {
              title: "Car Hire",
              desc: "We pride ourselves in always going the extra mile for our customers.",
            },
            {
              title: "Car Sales",
              desc: "We sell the best luxury cars across the world at competitive prices.",
            },
            {
              title: "Hire a Driver",
              desc: "You want to travel and feel comfortable — our drivers are available.",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <img src="points.png" alt="icon" className="w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FAQ/>
    </section>
  );
};

export default Services;
