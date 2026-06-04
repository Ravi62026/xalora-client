import React from "react";
import { Layout } from "../components";

const topics = [
  {
    title: "Scalability Fundamentals",
    description: "Learn core concepts of scalability, performance, and distributed systems.",
    badges: [
      { label: "Intermediate", bg: "bg-blue-100", text: "text-blue-700" },
      { label: "Advanced", bg: "bg-purple-100", text: "text-purple-700" },
    ],
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    borderHover: "hover:border-emerald-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    ),
  },
  {
    title: "Load Balancing",
    description: "Understand load distribution techniques and algorithms for high availability.",
    badges: [
      { label: "Intermediate", bg: "bg-blue-100", text: "text-blue-700" },
      { label: "Advanced", bg: "bg-purple-100", text: "text-purple-700" },
    ],
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    borderHover: "hover:border-blue-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    ),
  },
  {
    title: "Caching Strategies",
    description: "Master caching layers, CDN, Redis, and cache invalidation techniques.",
    badges: [
      { label: "Intermediate", bg: "bg-blue-100", text: "text-blue-700" },
      { label: "Advanced", bg: "bg-purple-100", text: "text-purple-700" },
    ],
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    borderHover: "hover:border-purple-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
  },
  {
    title: "Database Scaling",
    description: "Learn sharding, replication, partitioning, and distributed database design.",
    badges: [
      { label: "Intermediate", bg: "bg-blue-100", text: "text-blue-700" },
      { label: "Advanced", bg: "bg-purple-100", text: "text-purple-700" },
    ],
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    borderHover: "hover:border-cyan-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    ),
  },
  {
    title: "Microservices",
    description: "Design and implement distributed systems with service-oriented architecture.",
    badges: [
      { label: "Advanced", bg: "bg-purple-100", text: "text-purple-700" },
    ],
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    borderHover: "hover:border-teal-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    ),
  },
  {
    title: "API Design",
    description: "Create RESTful APIs, GraphQL, and design principles for scalable interfaces.",
    badges: [
      { label: "Beginner", bg: "bg-green-100", text: "text-green-700" },
      { label: "Intermediate", bg: "bg-blue-100", text: "text-blue-700" },
    ],
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    borderHover: "hover:border-indigo-300",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
  },
];

const SystemDesign = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                System Design
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Design scalable and efficient systems for real-world applications
            </p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${topic.borderHover} p-6 sm:p-7`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${topic.iconBg} p-3 rounded-lg flex-shrink-0`}>
                    <svg className={`h-6 w-6 ${topic.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {topic.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{topic.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {topic.badges.map((badge, bidx) => (
                    <span
                      key={bidx}
                      className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2.5 px-4 bg-indigo-600 rounded-xl font-medium text-white hover:bg-indigo-700 transition-colors text-sm">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemDesign;
