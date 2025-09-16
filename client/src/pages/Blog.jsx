import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Luxury Cars to Rent in 2025",
    date: "June 28, 2025",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/21917406132509939_0",
    summary:
      "Explore the most stylish and comfortable cars that define luxury and performance.",
  },
  {
    id: 2,
    title: "Why Renting Beats Owning in Big Cities",
    date: "June 20, 2025",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/6766727075440496258_0",
    summary:
      "Learn why renting is smarter for city dwellers dealing with traffic, costs, and parking.",
  },
  {
    id: 3,
    title: "Traveling for Business? Rent Smart.",
    date: "June 10, 2025",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/11771162971067250822_0",
    summary:
      "Make the right impression with premium rental cars tailored for business trips.",
  },
];

const Blog = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 bg-gray-50">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Latest from Our Blog
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Tips, updates, and insights from the car rental world.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-52 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-3">
                {post.date}
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                {post.summary}
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200">
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
