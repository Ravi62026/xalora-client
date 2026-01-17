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
      color: "emerald",
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
      color: "blue",
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
      color: "purple",
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
      color: "cyan",
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
      color: "teal",
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
      color: "lime",
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
      color: "yellow",
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
      color: "orange",
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
      color: "red",
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
      color: "pink",
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
      color: "indigo",
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
      color: "gray",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Data Structures
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Build a strong foundation with essential data structures for efficient problem solving
            </p>
          </div>

          {/* Categories Grid - Enhanced UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {dataStructureCategories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className={`flex items-center mb-4`}>
                    <div className={`bg-${category.color}-500/20 p-3 rounded-xl mr-4 transition-all duration-300 hover:scale-110`}>
                      <svg className={`h-8 w-8 text-${category.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:text-emerald-400">{category.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">{category.description}</p>

                  {/* Structure List */}
                  <div className="mb-6">
                    <h4 className="text-gray-200 font-bold mb-3 transition-all duration-300 hover:text-white">Structures Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.structures.slice(0, 5).map((structure, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-2 bg-${category.color}-900/50 text-${category.color}-300 text-sm rounded-xl transition-all duration-300 hover:bg-${category.color}-700 hover:scale-105 hover:shadow-md border border-${category.color}-700/50`}
                        >
                          {structure}
                        </span>
                      ))}
                      {category.structures.length > 5 && (
                        <span className="px-3 py-2 bg-gray-700/50 text-gray-300 text-sm rounded-xl transition-all duration-300 hover:bg-gray-600 hover:scale-105 border border-gray-600">
                          +{category.structures.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Navigate to specific data structure pages
                      if (category.id === 'basic') {
                        navigate('/data-structures/basic');
                      } else if (category.id === 'linear') {
                        navigate('/data-structures/linear');
                      } else if (category.id === 'hash') {
                        navigate('/data-structures/hash-based');
                      }
                      // For other categories, keep the button as is for now
                    }}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-${category.color}-600 to-${category.color}-500 rounded-xl font-bold text-white text-sm sm:text-base hover:from-${category.color}-500 hover:to-${category.color}-400 transition-all duration-500 transform hover:scale-105 hover:shadow-xl`}
                    disabled={category.id !== 'basic' && category.id !== 'linear' && category.id !== 'hash'}
                  >
                    {category.id === 'basic' || category.id === 'linear' || category.id === 'hash' ? 'Start Learning' : 'Coming Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Time Complexity Comparison - Enhanced UI */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700 p-6 sm:p-10 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 transition-all duration-300 hover:text-cyan-400">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Time Complexity Comparison
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-6 text-gray-200 text-lg font-bold transition-all duration-300 hover:text-white">Operation</th>
                    <th className="pb-6 text-emerald-400 text-lg font-bold transition-all duration-300 hover:text-emerald-300">Array</th>
                    <th className="pb-6 text-red-400 text-lg font-bold transition-all duration-300 hover:text-red-300">Linked List</th>
                    <th className="pb-6 text-emerald-400 text-lg font-bold transition-all duration-300 hover:text-emerald-300">Hash Table</th>
                    <th className="pb-6 text-yellow-400 text-lg font-bold transition-all duration-300 hover:text-yellow-300">BST</th>
                    <th className="pb-6 text-emerald-400 text-lg font-bold transition-all duration-300 hover:text-emerald-300">Heap</th>
                    <th className="pb-6 text-cyan-400 text-lg font-bold transition-all duration-300 hover:text-cyan-300">AVL Tree</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Access</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)</td>
                    <td className="py-6 text-red-400 font-medium group-hover:text-red-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)*</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-red-400 font-medium group-hover:text-red-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Search</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)*</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Insertion</td>
                    <td className="py-6 text-red-400 font-medium group-hover:text-red-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)**</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)*</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Deletion</td>
                    <td className="py-6 text-red-400 font-medium group-hover:text-red-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)**</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)*</td>
                    <td className="py-6 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                  </tr>
                  <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Space</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 text-sm text-gray-500 transition-all duration-300 hover:text-gray-400">
                * Average case, ** At head/tail
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataStructures;