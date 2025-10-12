import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components";

const HashBased = () => {
  const navigate = useNavigate();

  const hashStructures = [
    {
      id: "hash-tables",
      name: "Hash Tables",
      description: "Fundamental hash table implementations with collision resolution strategies",
      difficulty: "Intermediate",
      topics: ["Separate Chaining", "Open Addressing", "Linear Probing", "Quadratic Probing", "Double Hashing"],
      icon: "📊",
      color: "from-blue-500 to-purple-600",
      features: [
        "O(1) average-time operations",
        "Collision resolution strategies",
        "Load factor management",
        "Dynamic resizing"
      ]
    },
    {
      id: "hash-maps",
      name: "Hash Maps",
      description: "Key-value pair storage with efficient lookup, insertion, and deletion",
      difficulty: "Intermediate",
      topics: ["STL unordered_map", "Custom implementations", "Concurrent hash maps", "Memory management"],
      icon: "🗺️",
      color: "from-indigo-500 to-purple-600",
      features: [
        "Key-value associations",
        "Automatic memory management",
        "Thread-safe implementations",
        "Rich API operations"
      ]
    },
    {
      id: "hash-sets",
      name: "Hash Sets",
      description: "Unique element storage with fast membership testing and set operations",
      difficulty: "Intermediate",
      topics: ["STL unordered_set", "Set operations", "Custom hash functions", "Performance optimization"],
      icon: "🔗",
      color: "from-emerald-500 to-teal-600",
      features: [
        "Unique element storage",
        "Fast membership testing",
        "Set algebra operations",
        "Memory-efficient storage"
      ]
    },
    {
      id: "bloom-filters",
      name: "Bloom Filters",
      description: "Space-efficient probabilistic data structure for set membership testing",
      difficulty: "Advanced",
      topics: ["Basic Bloom filters", "Counting Bloom filters", "Scalable Bloom filters", "False positive analysis"],
      icon: "🌸",
      color: "from-rose-500 to-pink-600",
      features: [
        "Space-efficient membership testing",
        "Controlled false positive rate",
        "No false negatives",
        "Multiple filter variants"
      ]
    },
    {
      id: "consistent-hashing",
      name: "Consistent Hashing",
      description: "Distributed hashing scheme that minimizes key remapping during node changes",
      difficulty: "Advanced",
      topics: ["Hash ring", "Virtual nodes", "Load balancing", "Distributed systems"],
      icon: "🔄",
      color: "from-cyan-500 to-blue-600",
      features: [
        "Minimal key remapping",
        "Scalable distributed systems",
        "Load balancing",
        "Fault tolerance"
      ]
    },
    {
      id: "perfect-hashing",
      name: "Perfect Hashing",
      description: "Hash functions with zero collisions, guaranteeing O(1) worst-case performance",
      difficulty: "Expert",
      topics: ["Static perfect hashing", "Dynamic perfect hashing", "Minimal perfect hashing", "FKS scheme"],
      icon: "🎯",
      color: "from-indigo-500 to-purple-600",
      features: [
        "Zero collision guarantee",
        "Worst-case O(1) performance",
        "Space-efficient storage",
        "Precomputed hash functions"
      ]
    },
    {
      id: "cuckoo-hashing",
      name: "Cuckoo Hashing",
      description: "Collision resolution using two hash tables with guaranteed worst-case bounds",
      difficulty: "Advanced",
      topics: ["Cuckoo displacement", "Multiple hash functions", "Worst-case analysis", "Concurrent implementations"],
      icon: "🐦",
      color: "from-pink-500 to-rose-600",
      features: [
        "Worst-case O(1) guarantees",
        "High space efficiency",
        "Excellent cache performance",
        "Concurrent access support"
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Hash-Based Data Structures
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Master the fundamental building blocks of efficient data storage and retrieval.
              From basic hash tables to advanced probabilistic structures, explore the world
              of hash-based algorithms that power modern computing systems.
            </p>
          </div>

          {/* Overview Section */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Hash-Based Structures Matter</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Performance</h3>
                <p className="text-gray-300">
                  Average O(1) time complexity for core operations, enabling high-performance
                  applications that require fast data access.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-3">Fundamental</h3>
                <p className="text-gray-300">
                  Core concepts that underlie databases, caches, compilers, and distributed
                  systems. Understanding hashing is essential for system design.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold text-orange-400 mb-3">Versatile</h3>
                <p className="text-gray-300">
                  From simple key-value storage to complex probabilistic filters,
                  hash-based structures solve diverse computational problems.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 text-center">Key Learning Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Master collision resolution strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Understand probabilistic data structures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Design efficient hash functions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Analyze space-time trade-offs</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Implement distributed hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Handle concurrent access patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Optimize for specific use cases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Apply in real-world systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hash Structures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {hashStructures.map((structure) => (
              <div
                key={structure.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${structure.color} p-6 text-white`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{structure.icon}</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(structure.difficulty)}`}>
                      {structure.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{structure.name}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{structure.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {structure.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Features</h4>
                    <ul className="space-y-2">
                      {structure.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-300 text-sm">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/data-structures/hash-based/${structure.id}`)}
                    className={`w-full bg-gradient-to-r ${structure.color} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group-hover:scale-105`}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Path */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Recommended Learning Path</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Hash Tables</h3>
                <p className="text-gray-300 text-sm">Start with the fundamentals of hashing and collision resolution</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Hash Maps & Sets</h3>
                <p className="text-gray-300 text-sm">Learn key-value storage and set operations</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-rose-400 mb-2">Advanced Structures</h3>
                <p className="text-gray-300 text-sm">Explore Bloom filters and perfect hashing</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Distributed Systems</h3>
                <p className="text-gray-300 text-sm">Master consistent hashing and cuckoo hashing</p>
              </div>
            </div>
          </div>

          {/* Applications Overview */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Real-World Applications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">System Software</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Compiler symbol tables</li>
                  <li>• Database indexing</li>
                  <li>• Operating system caches</li>
                  <li>• File system metadata</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-3">Networking</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Router forwarding tables</li>
                  <li>• DNS caching</li>
                  <li>• Network packet filtering</li>
                  <li>• Load balancing</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-3">Distributed Systems</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Distributed databases</li>
                  <li>• Content delivery networks</li>
                  <li>• Peer-to-peer networks</li>
                  <li>• Cloud storage systems</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">Security</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Password hashing</li>
                  <li>• Digital signatures</li>
                  <li>• Cryptographic hash functions</li>
                  <li>• Secure communication</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Data Processing</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Big data analytics</li>
                  <li>• Stream processing</li>
                  <li>• Real-time analytics</li>
                  <li>• Machine learning</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-rose-900/20 to-pink-900/20 border border-rose-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-rose-400 mb-3">Performance Critical</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• High-frequency trading</li>
                  <li>• Game engines</li>
                  <li>• Real-time systems</li>
                  <li>• Embedded systems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Quick Start Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Essential Concepts</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Hash Function</div>
                    <div className="text-sm">Maps keys to array indices uniformly</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Load Factor</div>
                    <div className="text-sm">Ratio of elements to table size (α = n/m)</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Collision Resolution</div>
                    <div className="text-sm">Strategy for handling hash conflicts</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-cyan-400 font-medium mb-2">Amortized Analysis</div>
                    <div className="text-sm">Average performance over multiple operations</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-green-400 font-medium mb-2">Separate Chaining</div>
                    <div className="text-sm">Linked lists at each hash table slot</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-green-400 font-medium mb-2">Open Addressing</div>
                    <div className="text-sm">Probe sequence to find next available slot</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-green-400 font-medium mb-2">Perfect Hashing</div>
                    <div className="text-sm">Zero collisions for known key sets</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-green-400 font-medium mb-2">Consistent Hashing</div>
                    <div className="text-sm">Minimal remapping in distributed systems</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Ready to dive deep into hash-based data structures?
              </p>
              <button
                onClick={() => navigate('/data-structures/hash-based/hash-tables')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              >
                Begin with Hash Tables
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HashBased;

