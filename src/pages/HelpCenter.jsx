import React, { useState } from "react";
import { Layout } from "../components";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      category: "Account",
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of our website. You'll need to provide your email address, create a password, and verify your email. Once verified, you can log in and start using our platform."
    },
    {
      id: 2,
      category: "Account",
      question: "I forgot my password. How can I reset it?",
      answer: "Click on the 'Login' button and then select 'Forgot Password'. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      id: 3,
      category: "Billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support UPI payments for Indian users. All payments are processed securely through our payment partners."
    },
    {
      id: 4,
      category: "Billing",
      question: "Can I get a refund?",
      answer: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 7 days of purchase for a full refund. After 7 days, refunds are considered on a case-by-case basis."
    },
    {
      id: 5,
      category: "Learning",
      question: "How do I track my progress?",
      answer: "You can track your progress through your dashboard. We provide detailed analytics on completed lessons, quiz scores, and skill assessments. You'll also receive weekly progress reports via email."
    },
    {
      id: 6,
      category: "Learning",
      question: "Can I download course materials?",
      answer: "Yes, you can download PDF versions of our course materials for offline access. Video content can be downloaded with our mobile app for offline viewing. Download options are available in each course module."
    },
    {
      id: 7,
      category: "Technical",
      question: "The website is not loading properly. What should I do?",
      answer: "Try clearing your browser cache and cookies, then refresh the page. If the issue persists, try using a different browser or device. Make sure you're using the latest version of your browser. If problems continue, contact our support team."
    },
    {
      id: 8,
      category: "Technical",
      question: "I'm having trouble with the code editor.",
      answer: "Our code editor supports all modern browsers. Make sure JavaScript is enabled in your browser. If you're experiencing syntax highlighting issues, try refreshing the page. For persistent issues, check our community forum for similar problems or contact support."
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group FAQs by category
  const groupedFAQs = filteredFAQs.reduce((groups, faq) => {
    if (!groups[faq.category]) {
      groups[faq.category] = [];
    }
    groups[faq.category].push(faq);
    return groups;
  }, {});

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Help Center
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Find answers to common questions and get help with using our platform
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 pl-14 transform hover:scale-[1.02]"
              />
              <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="bg-emerald-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-emerald-400">Account Issues</h3>
              <p className="text-gray-400 mb-4 transition-all duration-300 hover:text-gray-300">Troubleshoot login, signup, and account management problems.</p>
              <button className="text-emerald-400 font-medium hover:text-emerald-300 transition-all duration-300 transform hover:scale-105">
                View Articles →
              </button>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="bg-blue-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-blue-400">Billing & Payments</h3>
              <p className="text-gray-400 mb-4 transition-all duration-300 hover:text-gray-300">Get help with subscriptions, payments, and refunds.</p>
              <button className="text-blue-400 font-medium hover:text-blue-300 transition-all duration-300 transform hover:scale-105">
                View Articles →
              </button>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="bg-purple-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-purple-400">Technical Support</h3>
              <p className="text-gray-400 mb-4 transition-all duration-300 hover:text-gray-300">Resolve issues with our platform, editor, or tools.</p>
              <button className="text-purple-400 font-medium hover:text-purple-300 transition-all duration-300 transform hover:scale-105">
                View Articles →
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 transition-all duration-300 hover:text-emerald-400">Frequently Asked Questions</h2>
            
            {Object.keys(groupedFAQs).map((category) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center transition-all duration-300 hover:text-emerald-400">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {category}
                  </span>
                </h3>
                
                <div className="space-y-4">
                  {groupedFAQs[category].map((faq) => (
                    <div 
                      key={faq.id} 
                      className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500/50 transform hover:-translate-y-1"
                    >
                      <button
                        className="w-full p-6 text-left flex justify-between items-center"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <h4 className="text-lg font-semibold text-white transition-all duration-300 hover:text-emerald-400">{faq.question}</h4>
                        <svg 
                          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
                          <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 p-8 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Still Need Help?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto transition-all duration-300 hover:text-gray-200">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-gray-700 rounded-lg font-medium text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;