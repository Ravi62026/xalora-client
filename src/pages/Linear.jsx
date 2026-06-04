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
    if (complexity.includes("O(1)")) color = "bg-green-50 text-green-700";
    if (complexity.includes("O(log n)")) color = "bg-blue-50 text-blue-700";
    if (complexity.includes("O(n)") && !complexity.includes("n log")) color = "bg-amber-50 text-amber-700";
    if (complexity.includes("O(n²)") || complexity.includes("O(n log n)")) color = "bg-red-50 text-red-700";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {complexity}
      </span>
    );
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Linear Data Structures
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sequential data structures where elements are arranged in a linear manner.
              Master the fundamental building blocks of data organization.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("structures")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "structures"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Structures
            </button>
            <button
              onClick={() => setActiveSection("comparison")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "comparison"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Comparison
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">What are Linear Data Structures?</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Definition</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {overviewContent.definition}
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-700">
                    {overviewContent.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Types of Linear Structures</h3>
                  <div className="space-y-6">
                    {overviewContent.types.map((type, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-indigo-600 mb-2">{type.name}</h4>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Structures:</strong> {type.structures.join(", ")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-green-700 font-medium">Pros:</span>
                            <ul className="text-gray-700 ml-2">
                              {type.pros.map((pro, i) => (
                                <li key={i}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-red-700 font-medium">Cons:</span>
                            <ul className="text-gray-700 ml-2">
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
                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-3">Sequential Access</h4>
                  <p className="text-gray-700">Elements arranged in order</p>
                  <p className="text-sm text-gray-600 mt-2">One after another</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-blue-600 mb-3">Memory Layout</h4>
                  <p className="text-gray-700">Contiguous or linked</p>
                  <p className="text-sm text-gray-600 mt-2">Physical vs logical order</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-600 mb-3">Traversal</h4>
                  <p className="text-gray-700">Linear time operations</p>
                  <p className="text-sm text-gray-600 mt-2">Visit each element once</p>
                </div>
              </div>
            </div>
          )}

          {/* Structures Section */}
          {activeSection === "structures" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Linear Data Structures</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {linearStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{structure.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{structure.name}</h3>
                          <p className="text-gray-600 text-sm">{structure.description}</p>
                        </div>
                      </div>

                      {/* Complexity Table */}
                      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-indigo-600 mb-3">Time Complexity</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(structure.complexity).map(([op, comp]) => (
                            <div key={op} className="flex justify-between items-center">
                              <span className="text-gray-700 capitalize">{op}:</span>
                              {renderComplexityBadge(comp)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-indigo-600 mb-3">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {structure.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(structure.route)}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Linear Data Structures Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-gray-900 font-bold">Operation</th>
                      <th className="pb-4 text-blue-700 font-bold">Arrays</th>
                      <th className="pb-4 text-green-700 font-bold">Linked Lists</th>
                      <th className="pb-4 text-orange-700 font-bold">Stacks</th>
                      <th className="pb-4 text-purple-700 font-bold">Queues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                        <td className="py-4 text-gray-900 font-medium">
                          {row.operation}
                        </td>
                        <td className="py-4 text-blue-700 font-medium">
                          {row.arrays}
                        </td>
                        <td className="py-4 text-green-700 font-medium">
                          {row.linkedLists}
                        </td>
                        <td className="py-4 text-orange-700 font-medium">
                          {row.stacks}
                        </td>
                        <td className="py-4 text-purple-700 font-medium">
                          {row.queues}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                * Amortized for dynamic arrays | N/A = Not Applicable
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Choose Your Learning Path
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {linearStructures.map((structure) => (
                <button
                  key={structure.id}
                  onClick={() => navigate(structure.route)}
                  className="bg-gray-50 hover:bg-white border border-gray-200 hover:border-indigo-300 p-6 rounded-xl transition-all duration-300 hover:shadow-md group"
                >
                  <div className="text-center">
                    <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                      {structure.icon}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {structure.name}
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
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

