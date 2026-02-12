import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "../components";
import axios from "../utils/axios";
import ApiRoutes from "../routes/routes";
import { Search, Briefcase, Building2, MapPin, ExternalLink, Clock, Sparkles, IndianRupee, Timer } from "lucide-react";

const TIME_OPTIONS = [
  { value: "qdr:h", label: "Past Hour" },
  { value: "qdr:d", label: "Past 24h" },
  { value: "qdr:w", label: "Past Week" },
  { value: "qdr:m", label: "Past Month" },
];

const JobGenie = () => {
  const [searchType, setSearchType] = useState("role"); // "role" | "company"
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [timeFilter, setTimeFilter] = useState("qdr:d");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      let response;
      if (searchType === "role") {
        const params = new URLSearchParams();
        params.append("q", query.trim());
        if (location.trim()) params.append("location", location.trim());
        params.append("time", timeFilter);
        response = await axios.get(`${ApiRoutes.jobs.searchByRole}?${params}`);
      } else {
        const params = new URLSearchParams();
        params.append("q", query.trim());
        if (location.trim()) params.append("location", location.trim());
        response = await axios.get(`${ApiRoutes.jobs.searchByCompany}?${params}`);
      }

      setJobs(response.data.data.jobs || []);
    } catch (err) {
      console.error("Job search error:", err);
      setError("Failed to fetch jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-emerald-400" />
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                  Job Genie
                </h1>
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Search jobs by role or company. Powered by real-time data from across the web.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800/50 rounded-xl p-1 flex">
                <button
                  onClick={() => { setSearchType("role"); setJobs([]); setSearched(false); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    searchType === "role"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Search by Role
                </button>
                <button
                  onClick={() => { setSearchType("company"); setJobs([]); setSearched(false); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    searchType === "company"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Search by Company
                </button>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Query Input */}
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
                    placeholder={searchType === "role" ? "e.g. Backend Developer, React Developer..." : "e.g. Google, Microsoft, Infosys..."}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all"
                  />
                </div>

                {/* Location Input - shown for both */}
                <div className="relative sm:w-48">
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

                {/* Time Filter - only for role search */}
                {searchType === "role" && (
                  <div className="relative sm:w-40">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Timer className="w-5 h-5 text-gray-500" />
                    </div>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all appearance-none cursor-pointer"
                    >
                      {TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-emerald-500"></div>
              </div>
              <p className="mt-4 text-gray-400">Searching for jobs...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* No Results */}
          {searched && !loading && !error && jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No jobs found. Try a different search.</p>
            </div>
          )}

          {/* Results Count */}
          {!loading && jobs.length > 0 && (
            <p className="text-gray-400 mb-6 text-sm">
              Found <span className="text-emerald-400 font-semibold">{jobs.length}</span> results for "<span className="text-white">{query}</span>"
            </p>
          )}

          {/* Job Cards Grid */}
          {!loading && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Company & Location */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {job.company && (
                      <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1.5 text-sm text-cyan-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    )}
                  </div>

                  {/* Tags for company search */}
                  {searchType === "company" && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.schedule && (
                        <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                          {job.schedule}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                          <IndianRupee className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                      {job.date && (
                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-500/10 text-gray-400 rounded-full border border-gray-500/20">
                          <Clock className="w-3 h-3" />
                          {job.date}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Snippet */}
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {job.snippet}
                  </p>

                  {/* Source & Link */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    {job.source && (
                      <span className="text-xs text-gray-500 capitalize">{job.source}</span>
                    )}

                    {/* For company search - show apply links */}
                    {searchType === "company" && job.applyLinks && job.applyLinks.length > 0 ? (
                      <a
                        href={job.applyLinks[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                      >
                        Apply <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : job.link ? (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                      >
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Initial State */}
          {!searched && !loading && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Search className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-lg mb-2">Start your job search</p>
              <p className="text-gray-600 text-sm">Search by job role with location, or explore openings at specific companies</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobGenie;
