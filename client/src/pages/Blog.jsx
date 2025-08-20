import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Luxury Cars to Rent in 2025",
    date: "June 28, 2025",
    image: "/luxury-car.jpg", 
    summary: "Explore the most stylish and comfortable cars that define luxury and performance.",
  },
  {
    id: 2,
    title: "Why Renting Beats Owning in Big Cities",
    date: "June 20, 2025",
    image: "/urban-driving.jpg",
    summary: "Learn why renting is smarter for city dwellers dealing with traffic, costs, and parking.",
  },
  {
    id: 3,
    title: "Traveling for Business? Rent Smart.",
    date: "June 10, 2025",
    image: "/business-travel.jpg",
    summary: "Make the right impression with premium rental cars tailored for business trips.",
  },
];

const Blog = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Latest from Our Blog</h1>
        <p className="text-gray-600 mt-2">
          Tips, updates, and insights from the car rental world.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <p className="text-gray-700 text-sm">{post.summary}</p>
              <button className="mt-4 text-blue-700 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
