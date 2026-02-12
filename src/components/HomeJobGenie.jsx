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
    <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="text-emerald-400 font-medium tracking-wide uppercase text-sm">New Feature</span>
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Job Genie
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Search jobs by role or company. Real-time results from across the web.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800/50 rounded-xl p-1 flex">
              <button
                onClick={() => setSearchType("role")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  searchType === "role"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                By Role
              </button>
              <button
                onClick={() => setSearchType("company")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  searchType === "company"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
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
                {searchType === "role" ? (
                  <Briefcase className="w-5 h-5 text-gray-500" />
                ) : (
                  <Building2 className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchType === "role" ? "e.g. React Developer, Data Analyst..." : "e.g. Google, TCS, Flipkart..."}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all"
              />
            </div>

            <div className="relative sm:w-44">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>

          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Popular:</span>
            {popularSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchType(item.type);
                  setQuery(item.label);
                  navigate(`/job-genie?type=${item.type}&q=${encodeURIComponent(item.label)}`);
                }}
                className="text-xs px-3 py-1.5 bg-gray-800/50 text-gray-400 rounded-full border border-gray-700/50 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-pointer"
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
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate("/job-genie")}
            className="group inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
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
