import React from "react";
import { Layout } from "../components";
import { useNavigate } from "react-router-dom";

const DataStructures = () => {
  const navigate = useNavigate();
  // Reordered and expanded data structure categories in a logical learning sequence
  const dataStructureCategories = [
    {
      id: "basic",
      name: "Basic Data Structures",
      description: "Foundational data structures that form the building blocks for complex structures.",
      bgColor: "from-blue-50 to-cyan-50",
      accentColor: "text-blue-700",
      borderColor: "border-blue-200",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      structures: [
        "Variables",
        "Arrays",
        "Strings",
        "Pointers",
        "References"
      ]
    },
    {
      id: "linear",
      name: "Linear Data Structures",
      description: "Sequential data structures where elements are arranged in a sequential manner.",
      bgColor: "from-indigo-50 to-blue-50",
      accentColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-700",
      structures: [
        "Arrays",
        "Linked Lists",
        "Doubly Linked Lists",
        "Circular Linked Lists",
        "Stacks",
        "Queues",
        "Deques",
        "Vectors",
        "Dynamic Arrays"
      ]
    },
    {
      id: "hash",
      name: "Hash-Based Structures",
      description: "Data structures that use hash functions for efficient data retrieval.",
      bgColor: "from-purple-50 to-pink-50",
      accentColor: "text-purple-700",
      borderColor: "border-purple-200",
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-700",
      structures: [
        "Hash Tables",
        "Hash Maps",
        "Hash Sets",
        "Bloom Filters",
        "Consistent Hashing",
        "Perfect Hashing",
        "Cuckoo Hashing"
      ]
    },
    {
      id: "trees",
      name: "Tree Data Structures",
      description: "Hierarchical data structures with parent-child relationships.",
      bgColor: "from-cyan-50 to-teal-50",
      accentColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      badgeBg: "bg-cyan-100",
      badgeText: "text-cyan-700",
      structures: [
        "Binary Trees",
        "Binary Search Trees",
        "AVL Trees",
        "Red-Black Trees",
        "B-Trees",
        "B+ Trees",
        "Tries",
        "Segment Trees",
        "Fenwick Trees",
        "Heap/Priority Queue",
        "Splay Trees",
        "Treaps",
        "Suffix Trees",
        "Expression Trees",
        "Decision Trees"
      ]
    },
    {
      id: "graphs",
      name: "Graph Data Structures",
      description: "Non-linear data structures consisting of nodes and edges.",
      bgColor: "from-green-50 to-emerald-50",
      accentColor: "text-green-700",
      borderColor: "border-green-200",
      badgeBg: "bg-green-100",
      badgeText: "text-green-700",
      structures: [
        "Adjacency Matrix",
        "Adjacency List",
        "Edge List",
        "Incidence Matrix",
        "Directed Graphs",
        "Undirected Graphs",
        "Weighted Graphs",
        "Special Graphs",
        "Hypergraphs",
        "Multigraphs",
        "Directed Acyclic Graphs (DAGs)",
        "Planar Graphs"
      ]
    },
    {
      id: "advanced",
      name: "Advanced Data Structures",
      description: "Complex data structures for specialized use cases and optimization.",
      bgColor: "from-emerald-50 to-green-50",
      accentColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      structures: [
        "Disjoint Set Union",
        "Suffix Arrays",
        "Suffix Trees",
        "Interval Trees",
        "Range Trees",
        "KD Trees",
        "R Trees",
        "Sparse Tables",
        "Van Emde Boas Trees",
        "Fibonacci Heaps",
        "Binomial Heaps",
        "Leftist Heaps",
        "Skew Heaps"
      ]
    },
    {
      id: "string",
      name: "String Data Structures",
      description: "Specialized structures for efficient string processing and pattern matching.",
      bgColor: "from-amber-50 to-orange-50",
      accentColor: "text-amber-700",
      borderColor: "border-amber-200",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
      structures: [
        "Tries",
        "Suffix Arrays",
        "Suffix Trees",
        "Radix Trees",
        "Rope Data Structure",
        "Burrows-Wheeler Transform",
        "FM Index",
        "Wavelet Trees"
      ]
    },
    {
      id: "probabilistic",
      name: "Probabilistic Data Structures",
      description: "Space-efficient data structures that allow for small error rates.",
      bgColor: "from-orange-50 to-amber-50",
      accentColor: "text-orange-700",
      borderColor: "border-orange-200",
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-700",
      structures: [
        "Bloom Filters",
        "Count-Min Sketch",
        "HyperLogLog",
        "MinHash",
        "Cuckoo Filters",
        "Quotient Filters"
      ]
    },
    {
      id: "distributed",
      name: "Distributed Data Structures",
      description: "Data structures designed for distributed and concurrent environments.",
      bgColor: "from-red-50 to-orange-50",
      accentColor: "text-red-700",
      borderColor: "border-red-200",
      badgeBg: "bg-red-100",
      badgeText: "text-red-700",
      structures: [
        "Distributed Hash Tables",
        "CRDTs (Conflict-free Replicated Data Types)",
        "Consistent Hashing",
        "Vector Clocks",
        "Merkle Trees",
        "Skip Graphs"
      ]
    },
    {
      id: "concurrent",
      name: "Concurrent Data Structures",
      description: "Thread-safe data structures for concurrent programming environments.",
      bgColor: "from-rose-50 to-pink-50",
      accentColor: "text-rose-700",
      borderColor: "border-rose-200",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
      structures: [
        "Lock-Free Queues",
        "Lock-Free Stacks",
        "Concurrent Hash Maps",
        "Atomic References",
        "Compare-And-Swap Structures",
        "Non-blocking Algorithms"
      ]
    },
    {
      id: "functional",
      name: "Functional Data Structures",
      description: "Immutable data structures that support functional programming paradigms.",
      bgColor: "from-violet-50 to-purple-50",
      accentColor: "text-violet-700",
      borderColor: "border-violet-200",
      badgeBg: "bg-violet-100",
      badgeText: "text-violet-700",
      structures: [
        "Persistent Lists",
        "Persistent Trees",
        "Zipper Data Structures",
        "Finger Trees",
        "Random-Access Lists"
      ]
    },
    {
      id: "specialized",
      name: "Specialized Data Structures",
      description: "Domain-specific structures for particular use cases and applications.",
      bgColor: "from-slate-50 to-gray-50",
      accentColor: "text-slate-700",
      borderColor: "border-slate-200",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
      structures: [
        "LRU Cache",
        "LFU Cache",
        "Bloom Filters",
        "Spatial Data Structures",
        "Temporal Data Structures",
        "Cache-Oblivious Structures",
        "Cache-Aware Structures"
      ]
    }
  ];

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Data Structures
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Build a strong foundation with essential data structures for efficient problem solving
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {dataStructureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  if (category.id === 'basic') navigate('/data-structures/basic');
                  else if (category.id === 'linear') navigate('/data-structures/linear');
                  else if (category.id === 'hash') navigate('/data-structures/hash-based');
                }}
                className={`bg-gradient-to-br ${category.bgColor} rounded-2xl border ${category.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-opacity-100 text-left p-6 sm:p-7`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`${category.badgeBg} p-3 rounded-lg flex-shrink-0`}>
                    <svg className={`h-6 w-6 ${category.badgeText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${category.accentColor}`}>{category.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  </div>
                </div>

                {/* Structure List */}
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.structures.slice(0, 4).map((structure, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 ${category.badgeBg} ${category.badgeText} text-xs rounded-full`}
                      >
                        {structure}
                      </span>
                    ))}
                    {category.structures.length > 4 && (
                      <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                        +{category.structures.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Time Complexity Comparison */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-9 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Data Structure Complexity Cheatsheet
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-gray-900 font-bold">Data Structure</th>
                    <th className="pb-4 text-green-700 font-bold">Access</th>
                    <th className="pb-4 text-blue-700 font-bold">Search</th>
                    <th className="pb-4 text-orange-700 font-bold">Insertion</th>
                    <th className="pb-4 text-red-700 font-bold">Deletion</th>
                    <th className="pb-4 text-purple-700 font-bold">Space</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Array", access: "O(1)", search: "O(n)", insertion: "O(n)", deletion: "O(n)", space: "O(n)" },
                    { name: "Linked List", access: "O(n)", search: "O(n)", insertion: "O(1)*", deletion: "O(1)*", space: "O(n)" },
                    { name: "Hash Table", access: "O(1)**", search: "O(1)**", insertion: "O(1)**", deletion: "O(1)**", space: "O(n)" },
                    { name: "Binary Search Tree", access: "O(log n)", search: "O(log n)", insertion: "O(log n)", deletion: "O(log n)", space: "O(n)" },
                    { name: "AVL Tree", access: "O(log n)", search: "O(log n)", insertion: "O(log n)", deletion: "O(log n)", space: "O(n)" },
                    { name: "Heap", access: "O(n)", search: "O(n)", insertion: "O(log n)", deletion: "O(log n)", space: "O(n)" },
                  ].map((ds, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 text-gray-900 font-medium">{ds.name}</td>
                      <td className="py-4 text-green-700">{ds.access}</td>
                      <td className="py-4 text-blue-700">{ds.search}</td>
                      <td className="py-4 text-orange-700">{ds.insertion}</td>
                      <td className="py-4 text-red-700">{ds.deletion}</td>
                      <td className="py-4 text-purple-700">{ds.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-xs text-gray-600">
                * At head/tail, ** Average case
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataStructures;