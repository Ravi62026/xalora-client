import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, Building2, MapPin, Sparkles, ArrowRight } from "lucide-react";

const HomeJobGenie = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("role");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.append("type", searchType);
    params.append("q", query.trim());
    if (searchType === "role" && location.trim()) {
      params.append("location", location.trim());
    }
    navigate(`/job-genie?${params}`);
  };

  const popularSearches = [
    { label: "Frontend Developer", type: "role" },
    { label: "Backend Developer", type: "role" },
    { label: "Google", type: "company" },
    { label: "Data Scientist", type: "role" },
    { label: "Microsoft", type: "company" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            New Feature
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Job Genie
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Search jobs by role or company. Real-time results from across the web.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
        >
          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setSearchType("role")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchType === "role"
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={searchType === "role" ? { background: '#4f46e5' } : {}}
              >
                <Briefcase className="w-4 h-4" />
                By Role
              </button>
              <button
                onClick={() => setSearchType("company")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchType === "company"
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={searchType === "company" ? { background: '#4f46e5' } : {}}
              >
                <Building2 className="w-4 h-4" />
                By Company
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {searchType === "role"
                  ? <Briefcase className="w-5 h-5 text-gray-400" />
                  : <Building2 className="w-5 h-5 text-gray-400" />
                }
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchType === "role" ? "e.g. React Developer, Data Analyst..." : "e.g. Google, TCS, Flipkart..."}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
              />
            </div>

            {searchType === "role" && (
              <div className="relative sm:w-44">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
              style={{ background: '#4f46e5' }}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Popular:</span>
            {popularSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchType(item.type);
                  setQuery(item.label);
                  navigate(`/job-genie?type=${item.type}&q=${encodeURIComponent(item.label)}`);
                }}
                className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate("/job-genie")}
            className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors text-sm"
          >
            Explore Job Genie
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default HomeJobGenie;
