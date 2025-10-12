import React from "react";
import { Layout } from "../components";

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Mastering Dynamic Programming: A Complete Guide",
      excerpt: "Learn the fundamentals of dynamic programming with practical examples and common patterns.",
      author: "Alex Johnson",
      date: "May 15, 2023",
      readTime: "8 min read",
      category: "Algorithms",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: true
    },
    {
      id: 2,
      title: "System Design for Beginners: Scalable Architecture Patterns",
      excerpt: "Understanding the core principles of building scalable systems from the ground up.",
      author: "Sarah Chen",
      date: "June 2, 2023",
      readTime: "12 min read",
      category: "System Design",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: false
    },
    {
      id: 3,
      title: "Cracking the Coding Interview: Tips from Top Tech Companies",
      excerpt: "Insider advice on how to prepare for technical interviews at FAANG and other top companies.",
      author: "Michael Rodriguez",
      date: "June 28, 2023",
      readTime: "10 min read",
      category: "Interview Prep",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: false
    },
    {
      id: 4,
      title: "The Future of AI in Education: Personalized Learning Paths",
      excerpt: "How artificial intelligence is transforming the way we learn and acquire new skills.",
      author: "Priya Sharma",
      date: "July 12, 2023",
      readTime: "6 min read",
      category: "AI & Education",
      image: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: false
    },
    {
      id: 5,
      title: "Data Structures You Should Know for Coding Interviews",
      excerpt: "Essential data structures and when to use them in technical interviews.",
      author: "David Kim",
      date: "August 5, 2023",
      readTime: "9 min read",
      category: "Data Structures",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: false
    },
    {
      id: 6,
      title: "Building Your First Full-Stack Application: A Step-by-Step Guide",
      excerpt: "A comprehensive tutorial on creating a full-stack web application from scratch.",
      author: "Emma Wilson",
      date: "August 20, 2023",
      readTime: "15 min read",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1555066932-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      featured: false
    }
  ];

  const categories = [
    "All", "Algorithms", "Data Structures", "System Design", 
    "Interview Prep", "AI & Education", "Web Development"
  ];

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Xalora Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Insights, tutorials, and industry trends to help you master technical skills
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden mb-12 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2">
              <div className="md:flex">
                <div className="md:w-2/3 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">{featuredPost.title}</h2>
                  <p className="text-gray-400 mb-6 text-lg transition-all duration-300 hover:text-gray-300">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 transition-all duration-300 hover:scale-110">
                        <span className="text-emerald-400 font-bold">AJ</span>
                      </div>
                      <div>
                        <p className="text-white font-medium transition-all duration-300 hover:text-emerald-400">{featuredPost.author}</p>
                        <p className="text-gray-500 text-sm transition-all duration-300 hover:text-gray-400">{featuredPost.date} · {featuredPost.readTime}</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105">
                      Read Article
                    </button>
                  </div>
                </div>
                <div className="md:w-1/3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center p-8 transition-all duration-300 hover:from-emerald-500/20 hover:to-cyan-500/20">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="rounded-xl w-full h-64 object-cover transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  category === "All"
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <div 
                key={post.id} 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105"
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover transition-all duration-300 hover:scale-105"
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full transition-all duration-300 hover:bg-gray-600 hover:scale-105">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 transition-all duration-300 hover:text-blue-400">{post.title}</h3>
                  <p className="text-gray-400 mb-4 transition-all duration-300 hover:text-gray-300">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2 transition-all duration-300 hover:scale-110">
                        <span className="text-emerald-400 text-xs font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium transition-all duration-300 hover:text-emerald-400">{post.author}</p>
                        <p className="text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm transition-all duration-300 hover:text-gray-400">{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 p-8 mt-16 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Stay Updated</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto transition-all duration-300 hover:text-gray-200">
              Get the latest articles, tutorials, and industry insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;