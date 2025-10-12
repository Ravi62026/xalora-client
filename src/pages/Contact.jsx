import React, { useState } from "react";
import { Layout } from "../components";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 transition-all duration-300 hover:text-emerald-400">Get in Touch</h2>
              <p className="text-gray-400 mb-8 transition-all duration-300 hover:text-gray-300">
                Our team is here to help you with any questions or concerns you may have. 
                We typically respond within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="bg-emerald-500/20 p-3 rounded-lg mr-4 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white transition-all duration-300 group-hover:text-emerald-400">Phone</h3>
                    <p className="text-gray-400 transition-all duration-300 group-hover:text-gray-300">+91 6202620644</p>
                    <p className="text-gray-500 text-sm transition-all duration-300 group-hover:text-gray-400">Mon-Fri from 9AM to 6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-blue-500/20 p-3 rounded-lg mr-4 transition-all duration-300 group-hover:scale-110">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white transition-all duration-300 group-hover:text-blue-400">Email</h3>
                    <p className="text-gray-400 transition-all duration-300 group-hover:text-gray-300">support@xalora.one</p>
                    <p className="text-gray-400 transition-all duration-300 group-hover:text-gray-300">raviraunak30@gmail.com</p>
                  </div>
                </div>
                
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-lg font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-110">
                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-110">
                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-110">
                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-110">
                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                <h2 className="text-2xl font-bold text-white mb-6 transition-all duration-300 hover:text-emerald-400">Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-300 mb-2 transition-all duration-300 hover:text-gray-200">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-300 mb-2 transition-all duration-300 hover:text-gray-200">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-300 mb-2 transition-all duration-300 hover:text-gray-200">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-300 mb-2 transition-all duration-300 hover:text-gray-200">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;