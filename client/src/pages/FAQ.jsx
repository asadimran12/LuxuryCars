import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [showanswer, setshowasnwer] = useState(null);

  const FAQ = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You'll need a valid driver's license, a government-issued ID (like a passport or CNIC), and a valid payment method (credit/debit card).",
    },
    {
      question: "Is there an age requirement for renting a car?",
      answer:
        "Yes, usually renters must be at least 21 years old. Some luxury or premium cars may require you to be 25 or older.",
    },
    {
      question: "Do I need a credit card to rent a car?",
      answer:
        "Most rental companies require a credit or debit card for security deposits, but some may allow cash payments with additional conditions.",
    },
    {
      question: "Can I rent a car without a driver?",
      answer:
        "Yes, you can rent a self-drive car, but chauffeur services are also available if you prefer not to drive yourself.",
    },
    {
      question: "What's included in the rental price?",
      answer:
        "Typically, the rental price includes the car, basic insurance, and standard mileage. Extra features like GPS, child seats, or additional insurance may cost extra.",
    },
    {
      question: "Is insurance included with my rental?",
      answer:
        "Basic insurance is usually included, but you can choose full coverage for extra protection.",
    },
    {
      question: "Can I pick up the car in one city and return it in another?",
      answer:
        "Yes, many companies allow one-way rentals, but there may be an additional fee.",
    },
    {
      question: "What happens if I return the car late?",
      answer:
        "Late returns may result in extra charges, usually calculated on an hourly or daily basis.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify your booking. Cancellation policies vary — some allow free cancellation up to 24 hours before pickup.",
    },
    {
      question: "Are fuel costs included in the rental price?",
      answer:
        "No, fuel costs are not included and are the renter's responsibility unless otherwise stated.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-3">
      {/* FAQ Title */}
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg">Everything you need to know about our car rental services</p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {FAQ.map((faq, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <button
              onClick={() => setshowasnwer(showanswer === index ? null : index)}
              className="cursor-pointer w-full flex justify-between items-center text-left p-5 focus:outline-none group-hover:bg-gray-50 transition-colors duration-300"
            >
              <span className="font-semibold text-gray-900 pr-4 group-hover:text-yellow-600 transition-colors duration-300">
                {faq.question}
              </span>

              {/* Animated Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md transform transition-all duration-500 ${showanswer === index ? "rotate-180 scale-110" : "rotate-0"
                  }`}
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* Animated Answer with smooth slide-down */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${showanswer === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-5 pb-5 pt-2">
                <div className="pl-4 border-l-4 border-yellow-400">
                  <p className="text-gray-600 text-sm leading-relaxed animate-slide-in">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FAQ;
