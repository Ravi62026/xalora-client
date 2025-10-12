import React from "react";
import { Layout } from "../components";

const Community = () => {
  // Sample community data
  const forums = [
    {
      id: 1,
      title: "Algorithms & Data Structures",
      description: "Discuss coding problems, algorithms, and data structures with fellow learners.",
      posts: "1.2K",
      members: "8.5K",
      icon: "📊",
      color: "emerald"
    },
    {
      id: 2,
      title: "System Design",
      description: "Share resources and discuss system design concepts and interview questions.",
      posts: "850",
      members: "5.2K",
      icon: "🏗️",
      color: "blue"
    },
    {
      id: 3,
      title: "Career Advice",
      description: "Get guidance on job searching, resume building, and career growth.",
      posts: "2.1K",
      members: "12.3K",
      icon: "💼",
      color: "purple"
    },
    {
      id: 4,
      title: "Interview Preparation",
      description: "Share interview experiences and preparation tips with the community.",
      posts: "1.8K",
      members: "9.7K",
      icon: "🎯",
      color: "cyan"
    },
    {
      id: 5,
      title: "Project Showcase",
      description: "Show off your projects and get feedback from the community.",
      posts: "950",
      members: "6.4K",
      icon: "🚀",
      color: "teal"
    },
    {
      id: 6,
      title: "General Discussion",
      description: "Talk about anything related to learning and development.",
      posts: "3.2K",
      members: "15.8K",
      icon: "💬",
      color: "lime"
    }
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: "Best resources for learning dynamic programming?",
      author: "Alex Johnson",
      replies: 24,
      views: 156,
      time: "2 hours ago",
      category: "Algorithms & Data Structures"
    },
    {
      id: 2,
      title: "How to design a scalable chat application?",
      author: "Sarah Chen",
      replies: 18,
      views: 203,
      time: "5 hours ago",
      category: "System Design"
    },
    {
      id: 3,
      title: "Feedback on my portfolio website project",
      author: "Michael Rodriguez",
      replies: 32,
      views: 421,
      time: "1 day ago",
      category: "Project Showcase"
    },
    {
      id: 4,
      title: "Amazon SDE interview experience - 2023",
      author: "Priya Sharma",
      replies: 45,
      views: 876,
      time: "1 day ago",
      category: "Interview Preparation"
    }
  ];

  const communityStats = [
    { label: "Members", value: "50K+" },
    { label: "Discussions", value: "100K+" },
    { label: "Solutions Shared", value: "250K+" },
    { label: "Countries", value: "120+" }
  ];

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Xalora Community
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Connect with fellow learners, share knowledge, and grow together
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2 transition-all duration-300 hover:text-emerald-300">{stat.value}</div>
                <div className="text-gray-400 transition-all duration-300 hover:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Forums Section */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Discussion Forums</h2>
              <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105">
                Start New Discussion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.map((forum) => (
                <div 
                  key={forum.id} 
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="flex items-start mb-4">
                    <div className={`bg-${forum.color}-500/20 p-3 rounded-lg mr-4 text-2xl transition-all duration-300 hover:scale-110`}>
                      {forum.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-emerald-400">{forum.title}</h3>
                      <p className="text-gray-400 text-sm transition-all duration-300 hover:text-gray-300">{forum.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                      <span className="text-white font-medium transition-all duration-300 hover:text-emerald-400">{forum.posts}</span> posts
                    </div>
                    <div className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                      <span className="text-white font-medium transition-all duration-300 hover:text-emerald-400">{forum.members}</span> members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discussions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 transition-all duration-300 hover:text-emerald-400">Recent Discussions</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              {recentDiscussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  className="p-6 border-b border-gray-700 last:border-b-0 transition-all duration-300 hover:bg-gray-700/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 transition-all duration-300 hover:text-emerald-400">{discussion.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full transition-all duration-300 hover:bg-gray-600 hover:scale-105">
                          {discussion.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="mr-4 transition-all duration-300 hover:text-gray-300">
                        <span className="text-white font-medium transition-all duration-300 hover:text-emerald-400">{discussion.replies}</span> replies
                      </div>
                      <div className="mr-4 transition-all duration-300 hover:text-gray-300">
                        <span className="text-white font-medium transition-all duration-300 hover:text-emerald-400">{discussion.views}</span> views
                      </div>
                      <div className="transition-all duration-300 hover:text-gray-300">{discussion.time}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <div className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 transition-all duration-300 hover:scale-110">
                      <span className="text-emerald-400 text-xs font-bold">
                        {discussion.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-gray-400 transition-all duration-300 hover:text-gray-300">by <span className="text-white transition-all duration-300 hover:text-emerald-400">{discussion.author}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 p-8 mb-16 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-6 transition-all duration-300 hover:text-emerald-400">Community Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-3 transition-all duration-300 hover:text-emerald-300">Be Respectful</h3>
                <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                  Treat all community members with respect and kindness. Harassment, hate speech, and personal attacks are not tolerated.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3 transition-all duration-300 hover:text-blue-300">Stay On Topic</h3>
                <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                  Keep discussions relevant to the forum category. Off-topic posts may be moved or removed.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3 transition-all duration-300 hover:text-purple-300">Help Each Other</h3>
                <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                  Share knowledge, provide constructive feedback, and help others learn. Be patient with beginners.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-3 transition-all duration-300 hover:text-cyan-300">No Spam</h3>
                <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                  Do not post promotional content, advertisements, or repetitive posts. This is a learning community.
                </p>
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Ready to Join the Community?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto transition-all duration-300 hover:text-gray-200">
              Connect with thousands of learners, share your knowledge, and accelerate your growth.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 text-lg">
              Join Now - It's Free!
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;