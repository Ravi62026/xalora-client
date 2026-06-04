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
      <div className="min-h-screen xalora-grid-bg">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Job Search
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Job Genie
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Search jobs by role or company. Real-time results from across the web.
            </p>
          </motion.div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            <div className="relative z-10">
              {/* Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-1 flex gap-1 shadow-sm">
                <button
                  onClick={() => { setSearchType("role"); setJobs([]); setSearched(false); }}
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
                  onClick={() => { setSearchType("company"); setJobs([]); setSearched(false); }}
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
              <form onSubmit={handleSearch} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Query Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {searchType === "role" ? (
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchType === "role" ? "e.g. Backend Developer, React Developer..." : "e.g. Google, Microsoft, Infosys..."}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-400 transition-all shadow-sm hover:border-gray-300"
                  />
                </div>

                {/* Location Input - shown for both */}
                <div className="relative sm:w-48">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:border-purple-400 transition-all shadow-sm hover:border-gray-300"
                  />
                </div>

                {/* Time Filter - only for role search */}
                {searchType === "role" && (
                  <div className="relative sm:w-40">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Timer className="w-5 h-5 text-indigo-600" />
                    </div>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 focus:border-indigo-400 transition-all appearance-none cursor-pointer shadow-sm hover:border-gray-300"
                    >
                      {TIME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: '#4f46e5' }}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3" style={{ borderTopColor: '#4f46e5', borderBottomColor: '#4f46e5' }}></div>
              </div>
              <p className="mt-4 text-gray-500">Searching for jobs...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* No Results */}
          {searched && !loading && !error && jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No jobs found. Try a different search.</p>
            </div>
          )}

          {/* Results Count */}
          {!loading && jobs.length > 0 && (
            <p className="text-gray-600 mb-6 text-sm">
              Found <span className="text-indigo-600 font-semibold">{jobs.length}</span> results for "<span className="text-gray-900">{query}</span>"
            </p>
          )}

          {/* Job Cards Grid */}
          {!loading && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Title */}
                  <h3 className="text-gray-900 font-bold text-lg mb-3 line-clamp-2 relative z-10 group-hover:text-indigo-700 transition-colors">
                    {job.title}
                  </h3>

                  {/* Company & Location */}
                  <div className="flex flex-wrap gap-3 mb-4 relative z-10">
                    {job.company && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    )}
                  </div>

                  {/* Tags for company search */}
                  {searchType === "company" && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {job.schedule && (
                        <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
                          {job.schedule}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
                          <IndianRupee className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                      {job.date && (
                        <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full border border-gray-300 font-medium">
                          <Clock className="w-3 h-3" />
                          {job.date}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Snippet */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-5 flex-1 relative z-10 leading-relaxed">
                    {job.snippet}
                  </p>

                  {/* Source & Link */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative z-10">
                    {job.source && (
                      <span className="text-xs text-gray-500 capitalize">{job.source}</span>
                    )}

                    {/* For company search - show apply links */}
                    {searchType === "company" && job.applyLinks && job.applyLinks.length > 0 ? (
                      <a
                        href={job.applyLinks[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                      >
                        Apply <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : job.link ? (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
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
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-lg">
                  <Search className="w-14 h-14 text-indigo-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ background: '#4f46e5' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-gray-800 text-2xl font-bold mb-3">Start your job search</p>
              <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">Search by job role with location, or explore openings at specific companies</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobGenie;
