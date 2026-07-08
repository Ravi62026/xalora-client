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
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Xalora Blog
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Insights, tutorials, and industry trends to help you master technical skills
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden mb-12 transition-all duration-300 hover:shadow-md">
              <div className="md:flex">
                <div className="md:w-2/3 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-slate-600 mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center mr-3 border border-slate-200">
                        <span className="text-indigo-600 font-bold">AJ</span>
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold text-sm">{featuredPost.author}</p>
                        <p className="text-slate-400 text-xs font-semibold">{featuredPost.date} · {featuredPost.readTime}</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                      Read Article
                    </button>
                  </div>
                </div>
                <div className="md:w-1/3 bg-slate-50 flex items-center justify-center p-8 border-l border-slate-100">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="rounded-xl w-full h-64 object-cover shadow-sm"
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
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  category === "All"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
                className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl"
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200/60 font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center">
                      <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center mr-2 border border-slate-200">
                        <span className="text-indigo-600 text-xs font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-800 text-xs font-bold">{post.author}</p>
                        <p className="text-slate-400 text-[10px] font-semibold">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold">{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 mt-16 text-center shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Stay Updated</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and industry insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );;
};

export default Blog;