import React, { useState } from "react";
import { Layout } from "../components";
import { useNavigate } from "react-router-dom";

const Linear = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  // Linear Data Structures
  const linearStructures = [
    {
      id: "arrays",
      name: "Arrays",
      description: "Contiguous memory blocks storing elements of same type",
      icon: "📊",
      route: "/data-structures/arrays",
      complexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
      features: ["Random Access", "Cache Friendly", "Fixed Size", "Simple Implementation"]
    },
    {
      id: "linked-lists",
      name: "Linked Lists",
      description: "Dynamic structures with nodes connected via pointers",
      icon: "🔗",
      route: "/data-structures/linked-lists",
      complexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
      features: ["Dynamic Size", "Efficient Insert/Delete", "No Wasted Space", "Flexible Memory"]
    },
    {
      id: "stacks",
      name: "Stacks",
      description: "LIFO data structure with push/pop operations",
      icon: "📚",
      route: "/data-structures/stacks",
      complexity: { push: "O(1)", pop: "O(1)", peek: "O(1)", search: "O(n)" },
      features: ["LIFO Order", "Simple Operations", "Memory Efficient", "Function Call Stack"]
    },
    {
      id: "queues",
      name: "Queues",
      description: "FIFO data structure with enqueue/dequeue operations",
      icon: "🎯",
      route: "/data-structures/queues",
      complexity: { enqueue: "O(1)", dequeue: "O(1)", peek: "O(1)", search: "O(n)" },
      features: ["FIFO Order", "BFS Traversal", "Task Scheduling", "Buffer Management"]
    }
  ];

  // Linear DS Overview Content
  const overviewContent = {
    definition: "Linear data structures organize data in a sequential manner where each element is connected to its previous and next elements. Elements are arranged in a linear fashion, forming a sequence or line.",
    characteristics: [
      "Elements are arranged sequentially",
      "Each element has a unique predecessor and successor (except first and last)",
      "Operations are performed in linear time (usually)",
      "Memory can be contiguous or linked",
      "Supports traversal in one direction (or both in some cases)"
    ],
    types: [
      {
        name: "Contiguous Memory",
        structures: ["Arrays", "Static Arrays", "Dynamic Arrays"],
        pros: ["Fast access", "Cache friendly", "Simple implementation"],
        cons: ["Fixed size (static)", "Costly insertions/deletions", "Memory wastage"]
      },
      {
        name: "Linked Memory",
        structures: ["Singly Linked Lists", "Doubly Linked Lists", "Circular Lists"],
        pros: ["Dynamic size", "Efficient insertions/deletions", "No memory wastage"],
        cons: ["Slow access", "Extra memory for pointers", "Not cache friendly"]
      },
      {
        name: "Restricted Access",
        structures: ["Stacks", "Queues", "Deques"],
        pros: ["Fast operations", "Simple interface", "Memory efficient"],
        cons: ["Limited operations", "No random access", "Specific use cases"]
      }
    ]
  };

  // Comparison Data
  const comparisonData = [
    { operation: "Access by Index", arrays: "O(1)", linkedLists: "O(n)", stacks: "O(n)", queues: "O(n)" },
    { operation: "Search Element", arrays: "O(n)", linkedLists: "O(n)", stacks: "O(n)", queues: "O(n)" },
    { operation: "Insert at Beginning", arrays: "O(n)", linkedLists: "O(1)", stacks: "O(1)", queues: "O(1)" },
    { operation: "Insert at End", arrays: "O(1)*", linkedLists: "O(n)", stacks: "O(1)", queues: "O(1)" },
    { operation: "Insert in Middle", arrays: "O(n)", linkedLists: "O(n)", stacks: "N/A", queues: "N/A" },
    { operation: "Delete from Beginning", arrays: "O(n)", linkedLists: "O(1)", stacks: "O(1)", queues: "O(1)" },
    { operation: "Delete from End", arrays: "O(1)", linkedLists: "O(n)", stacks: "O(1)", queues: "O(1)" },
    { operation: "Space Complexity", arrays: "O(n)", linkedLists: "O(n)", stacks: "O(n)", queues: "O(n)" }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(1)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(log n)")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(n)") && !complexity.includes("n log")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("O(n²)") || complexity.includes("O(n log n)")) color = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {complexity}
      </span>
    );
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Linear Data Structures
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Sequential data structures where elements are arranged in a linear manner.
              Master the fundamental building blocks of data organization.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("structures")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "structures"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Structures
            </button>
            <button
              onClick={() => setActiveSection("comparison")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "comparison"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Comparison
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">What are Linear Data Structures?</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Definition</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {overviewContent.definition}
                  </p>

                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    {overviewContent.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Types of Linear Structures</h3>
                  <div className="space-y-6">
                    {overviewContent.types.map((type, idx) => (
                      <div key={idx} className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">{type.name}</h4>
                        <div className="text-sm text-gray-400 mb-2">
                          <strong>Structures:</strong> {type.structures.join(", ")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-green-400 font-medium">Pros:</span>
                            <ul className="text-gray-300 ml-2">
                              {type.pros.map((pro, i) => (
                                <li key={i}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-red-400 font-medium">Cons:</span>
                            <ul className="text-gray-300 ml-2">
                              {type.cons.map((con, i) => (
                                <li key={i}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-blue-400 mb-3">Sequential Access</h4>
                  <p className="text-gray-300">Elements arranged in order</p>
                  <p className="text-sm text-gray-400 mt-2">One after another</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Memory Layout</h4>
                  <p className="text-gray-300">Contiguous or linked</p>
                  <p className="text-sm text-gray-400 mt-2">Physical vs logical order</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Traversal</h4>
                  <p className="text-gray-300">Linear time operations</p>
                  <p className="text-sm text-gray-400 mt-2">Visit each element once</p>
                </div>
              </div>
            </div>
          )}

          {/* Structures Section */}
          {activeSection === "structures" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Linear Data Structures</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {linearStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{structure.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{structure.name}</h3>
                          <p className="text-gray-300 text-sm">{structure.description}</p>
                        </div>
                      </div>

                      {/* Complexity Table */}
                      <div className="bg-gray-700/50 p-4 rounded-xl mb-6">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Time Complexity</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(structure.complexity).map(([op, comp]) => (
                            <div key={op} className="flex justify-between items-center">
                              <span className="text-gray-300 capitalize">{op}:</span>
                              {renderComplexityBadge(comp)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {structure.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(structure.route)}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold text-white hover:from-blue-500 hover:to-cyan-400 transition-all duration-500 transform hover:scale-105 hover:shadow-xl"
                      >
                        Learn {structure.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Section */}
          {activeSection === "comparison" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Linear Data Structures Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-6 text-gray-200 text-lg font-bold">Operation</th>
                      <th className="pb-6 text-blue-400 text-lg font-bold">Arrays</th>
                      <th className="pb-6 text-green-400 text-lg font-bold">Linked Lists</th>
                      <th className="pb-6 text-orange-400 text-lg font-bold">Stacks</th>
                      <th className="pb-6 text-purple-400 text-lg font-bold">Queues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                        <td className="py-6 text-white font-medium group-hover:text-blue-400 transition-all duration-300">
                          {row.operation}
                        </td>
                        <td className="py-6 text-blue-400 font-medium group-hover:text-blue-300 transition-all duration-300">
                          {row.arrays}
                        </td>
                        <td className="py-6 text-green-400 font-medium group-hover:text-green-300 transition-all duration-300">
                          {row.linkedLists}
                        </td>
                        <td className="py-6 text-orange-400 font-medium group-hover:text-orange-300 transition-all duration-300">
                          {row.stacks}
                        </td>
                        <td className="py-6 text-purple-400 font-medium group-hover:text-purple-300 transition-all duration-300">
                          {row.queues}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-sm text-gray-500 transition-all duration-300 hover:text-gray-400">
                * Amortized for dynamic arrays | N/A = Not Applicable
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 mt-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Choose Your Learning Path
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {linearStructures.map((structure) => (
                <button
                  key={structure.id}
                  onClick={() => navigate(structure.route)}
                  className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-blue-500 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                      {structure.icon}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {structure.name}
                    </h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                      {structure.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Linear;

