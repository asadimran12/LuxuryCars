import React, { useState } from "react";

const FAQ = () => {
  const [showanswer, setshowasnwer] = useState(null);

  const FAQ = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You’ll need a valid driver’s license, a government-issued ID (like a passport or CNIC), and a valid payment method (credit/debit card).",
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
      question: "What’s included in the rental price?",
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
        "No, fuel costs are not included and are the renter’s responsibility unless otherwise stated.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-3">
      {FAQ.map((faq, index) => (
        <div key={index} className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => setshowasnwer(showanswer === index ? null : index)}
            className="cursor-pointer w-full flex justify-between items-center text-left font-semibold text-gray-900 focus:outline-none"
          >
            {faq.question}
            <span>{showanswer === index ? "-" : "+"}</span>
          </button>
          {showanswer === index && (
            <p className="text-gray-600 text-sm">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
