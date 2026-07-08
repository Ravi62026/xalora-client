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

  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border border-blue-100",
    purple: "bg-purple-50 text-purple-600 border border-purple-100",
    cyan: "bg-cyan-50 text-cyan-600 border border-cyan-100",
    teal: "bg-teal-50 text-teal-600 border border-teal-100",
    lime: "bg-lime-50 text-lime-600 border border-lime-100"
  };

  const communityStats = [
    { label: "Members", value: "50K+" },
    { label: "Discussions", value: "100K+" },
    { label: "Solutions Shared", value: "250K+" },
    { label: "Countries", value: "120+" }
  ];

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Xalora Community
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect with fellow learners, share knowledge, and grow together
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {communityStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/80 border border-slate-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
              >
                <div className="text-3xl font-black text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-semibold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Forums Section */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900">Discussion Forums</h2>
              <button className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                Start New Discussion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.map((forum) => (
                <div 
                  key={forum.id} 
                  className="bg-white/80 border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 transform hover:-translate-y-1"
                >
                  <div className="flex items-start mb-4">
                    <div className={`${colorClasses[forum.color] || "bg-slate-100 text-slate-600"} p-3 rounded-lg mr-4 text-2xl transition-all duration-300`}>
                      {forum.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{forum.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{forum.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm pt-4 border-t border-slate-100">
                    <div className="text-slate-500">
                      <span className="text-slate-800 font-bold">{forum.posts}</span> posts
                    </div>
                    <div className="text-slate-500">
                      <span className="text-slate-800 font-bold">{forum.members}</span> members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discussions */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Recent Discussions</h2>
            <div className="bg-white/80 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {recentDiscussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  className="p-6 border-b border-slate-100 last:border-b-0 transition-all duration-300 hover:bg-slate-50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-indigo-600 transition-colors cursor-pointer">{discussion.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200/60 font-semibold">
                          {discussion.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 font-medium">
                      <div className="mr-4">
                        <span className="text-slate-800 font-bold">{discussion.replies}</span> replies
                      </div>
                      <div className="mr-4">
                        <span className="text-slate-800 font-bold">{discussion.views}</span> views
                      </div>
                      <div className="text-slate-400">{discussion.time}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <div className="bg-slate-100 border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      <span className="text-indigo-600 text-xs font-bold">
                        {discussion.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-slate-500">by <span className="text-slate-800 font-bold hover:text-indigo-600 cursor-pointer">{discussion.author}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 mb-16 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Community Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200/60">
                <h3 className="text-xl font-bold text-emerald-600 mb-3">Be Respectful</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Treat all community members with respect and kindness. Harassment, hate speech, and personal attacks are not tolerated.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200/60">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Stay On Topic</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Keep discussions relevant to the forum category. Off-topic posts may be moved or removed.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200/60">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Help Each Other</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Share knowledge, provide constructive feedback, and help others learn. Be patient with beginners.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200/60">
                <h3 className="text-xl font-bold text-cyan-600 mb-3">No Spam</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Do not post promotional content, advertisements, or repetitive posts. This is a learning community.
                </p>
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="bg-white/80 border border-slate-200 p-8 text-center rounded-2xl shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Join the Community?</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Connect with thousands of learners, share your knowledge, and accelerate your growth.
            </p>
            <button className="px-8 py-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-lg">
              Join Now - It's Free!
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;