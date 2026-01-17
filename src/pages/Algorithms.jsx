import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components";

const Algorithms = () => {
  const navigate = useNavigate();
  // Reordered and expanded algorithm categories in a logical learning sequence
  const algorithmCategories = [
    {
      id: "fundamentals",
      name: "Fundamentals",
      description: "Essential concepts and foundational algorithms every programmer should master.",
      color: "emerald",
      algorithms: [
        "Time and Space Complexity",
        "Asymptotic Notation",
        "Recursion",
        "Divide and Conquer",
        "Brute Force",
        "Bit Manipulation",
        "Two Pointers Technique",
        "Sliding Window Technique"
      ]
    },
    {
      id: "sorting",
      name: "Sorting Algorithms",
      description: "Learn essential sorting techniques including Quick Sort, Merge Sort, Heap Sort, and more.",
      color: "blue",
      algorithms: [
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
        "Merge Sort",
        "Quick Sort",
        "Heap Sort",
        "Counting Sort",
        "Radix Sort",
        "Bucket Sort",
        "Shell Sort",
        "Tim Sort",
        "Intro Sort"
      ]
    },
    {
      id: "searching",
      name: "Searching Algorithms",
      description: "Master search techniques including Binary Search, Depth-First Search, and Breadth-First Search.",
      color: "purple",
      algorithms: [
        "Linear Search",
        "Binary Search",
        "Ternary Search",
        "Depth-First Search",
        "Breadth-First Search",
        "Jump Search",
        "Interpolation Search",
        "Exponential Search",
        "Fibonacci Search",
        "Sublist Search"
      ]
    },
    {
      id: "dynamic",
      name: "Dynamic Programming",
      description: "Solve complex problems efficiently using dynamic programming techniques and memoization.",
      color: "cyan",
      algorithms: [
        "Fibonacci Sequence",
        "Longest Common Subsequence",
        "0/1 Knapsack",
        "Unbounded Knapsack",
        "Coin Change",
        "Matrix Chain Multiplication",
        "Edit Distance",
        "Longest Increasing Subsequence",
        "Palindrome Partitioning",
        "Egg Dropping Problem",
        "Traveling Salesman Problem",
        "Optimal Binary Search Tree",
        "Subset Sum Problem",
        "Partition Problem",
        "Rod Cutting Problem"
      ]
    },
    {
      id: "greedy",
      name: "Greedy Algorithms",
      description: "Solve optimization problems using greedy techniques and approaches.",
      color: "teal",
      algorithms: [
        "Activity Selection",
        "Fractional Knapsack",
        "Huffman Coding",
        "Prim's Algorithm",
        "Kruskal's Algorithm",
        "Dijkstra's Algorithm",
        "Job Sequencing",
        "Optimal Merge Pattern",
        "Egyptian Fraction",
        "K Centers Problem"
      ]
    },
    {
      id: "graph",
      name: "Graph Algorithms",
      description: "Understand graph traversal, shortest path algorithms, and network flow problems.",
      color: "lime",
      algorithms: [
        "Breadth-First Search",
        "Depth-First Search",
        "Dijkstra's Algorithm",
        "Bellman-Ford Algorithm",
        "Floyd-Warshall Algorithm",
        "Kruskal's Algorithm",
        "Prim's Algorithm",
        "Topological Sort",
        "Strongly Connected Components",
        "Bipartite Check",
        "Articulation Points",
        "Bridges in Graph",
        "Tarjan's Algorithm",
        "Kosaraju's Algorithm",
        "Ford-Fulkerson Algorithm",
        "Edmonds-Karp Algorithm",
        "Dinic's Algorithm"
      ]
    },
    {
      id: "tree",
      name: "Tree Algorithms",
      description: "Master tree traversals, balanced trees, and advanced tree data structures.",
      color: "yellow",
      algorithms: [
        "Inorder Traversal",
        "Preorder Traversal",
        "Postorder Traversal",
        "Level Order Traversal",
        "Morris Traversal",
        "AVL Trees",
        "Red-Black Trees",
        "B-Trees",
        "B+ Trees",
        "Trie Structures",
        "Segment Trees",
        "Binary Indexed Trees",
        "Splay Trees",
        "Treaps",
        "Suffix Trees",
        "Expression Trees"
      ]
    },
    {
      id: "string",
      name: "String Algorithms",
      description: "Learn pattern matching, string manipulation, and text processing algorithms.",
      color: "pink",
      algorithms: [
        "KMP Algorithm",
        "Rabin-Karp Algorithm",
        "Z Algorithm",
        "Manacher's Algorithm",
        "Boyer-Moore Algorithm",
        "Aho-Corasick Algorithm",
        "Suffix Arrays",
        "Suffix Trees",
        "Edit Distance",
        "Longest Common Substring",
        "Longest Palindromic Substring",
        "Anagram Detection",
        "Pattern Searching",
        "String Matching with Finite Automata"
      ]
    },
    {
      id: "backtracking",
      name: "Backtracking Algorithms",
      description: "Explore recursive problem-solving techniques for constraint satisfaction problems.",
      color: "indigo",
      algorithms: [
        "N-Queens Problem",
        "Sudoku Solver",
        "Rat in a Maze",
        "Subset Sum",
        "Graph Coloring",
        "Hamiltonian Cycle",
        "Permutations",
        "Combinations",
        "Knight's Tour",
        "M-Coloring Problem",
        "Palindrome Partitioning",
        "Word Break Problem"
      ]
    },
    {
      id: "math",
      name: "Mathematical Algorithms",
      description: "Algorithms for number theory, combinatorics, and mathematical computations.",
      color: "red",
      algorithms: [
        "Sieve of Eratosthenes",
        "Euclidean Algorithm",
        "Extended Euclidean Algorithm",
        "Modular Exponentiation",
        "Chinese Remainder Theorem",
        "Euler's Totient Function",
        "Fermat's Little Theorem",
        "Matrix Exponentiation",
        "Fast Fourier Transform",
        "Miller-Rabin Primality Test",
        "Pollard's Rho Algorithm"
      ]
    },
    {
      id: "geometric",
      name: "Geometric Algorithms",
      description: "Algorithms for computational geometry problems and spatial computations.",
      color: "orange",
      algorithms: [
        "Convex Hull (Graham Scan)",
        "Convex Hull (Jarvis March)",
        "Closest Pair of Points",
        "Line Intersection",
        "Polygon Area",
        "Point in Polygon",
        "Geometric Transformations",
        "Voronoi Diagrams",
        "Delaunay Triangulation"
      ]
    },
    {
      id: "randomized",
      name: "Randomized Algorithms",
      description: "Algorithms that use randomness to achieve efficient solutions.",
      color: "gray",
      algorithms: [
        "Quick Sort (Randomized)",
        "Quick Select",
        "Karger's Min-Cut Algorithm",
        "Monte Carlo Methods",
        "Las Vegas Algorithms",
        "Skip Lists",
        "Bloom Filters",
        "Hash Functions"
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
                Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Master the fundamental algorithms that power modern software development
            </p>
          </div>

          {/* Categories Grid - Enhanced UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {algorithmCategories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className={`flex items-center mb-4`}>
                    <div className={`bg-${category.color}-500/20 p-3 rounded-xl mr-4 transition-all duration-300 hover:scale-110`}>
                      <svg className={`h-8 w-8 text-${category.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:text-emerald-400">{category.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">{category.description}</p>

                  {/* Algorithm List */}
                  <div className="mb-6">
                    <h4 className="text-gray-200 font-bold mb-3 transition-all duration-300 hover:text-white">Algorithms Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.algorithms.slice(0, 6).map((algorithm, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-2 bg-${category.color}-900/50 text-${category.color}-300 text-sm rounded-xl transition-all duration-300 hover:bg-${category.color}-700 hover:scale-105 hover:shadow-md border border-${category.color}-700/50`}
                        >
                          {algorithm}
                        </span>
                      ))}
                      {category.algorithms.length > 6 && (
                        <span className="px-3 py-2 bg-gray-700/50 text-gray-300 text-sm rounded-xl transition-all duration-300 hover:bg-gray-600 hover:scale-105 border border-gray-600">
                          +{category.algorithms.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-${category.color}-600 to-${category.color}-500 rounded-xl font-bold text-white text-sm sm:text-base hover:from-${category.color}-500 hover:to-${category.color}-400 transition-all duration-500 transform hover:scale-105 hover:shadow-xl`}
                    onClick={() => {
                      if (category.id === 'searching') navigate('/algorithms/searching');
                      else if (category.id === 'sorting') navigate('/algorithms/sorting');
                      else if (category.id === 'fundamentals') navigate('/algorithms/fundamentals');
                      else if (category.id === 'dynamic') navigate('/algorithms/dynamic-programming');
                      else if (category.id === 'greedy') navigate('/algorithms/greedy');
                      else if (category.id === 'graph') navigate('/algorithms/graph');
                      else if (category.id === 'tree') navigate('/algorithms/tree');
                      else if (category.id === 'string') navigate('/algorithms/string');
                      else if (category.id === 'backtracking') navigate('/algorithms/backtracking');
                      else if (category.id === 'mathematical') navigate('/algorithms/mathematical');
                      else if (category.id === 'geometric') navigate('/algorithms/geometric');
                      else if (category.id === 'randomized') navigate('/algorithms/randomized');
                    }}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources - Enhanced UI */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700 p-6 sm:p-10 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 transition-all duration-300 hover:text-cyan-400">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Algorithm Complexity Cheatsheet
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-6 text-gray-200 text-lg font-bold transition-all duration-300 hover:text-white">Algorithm</th>
                    <th className="pb-6 text-emerald-400 text-lg font-bold transition-all duration-300 hover:text-emerald-300">Best Case</th>
                    <th className="pb-6 text-emerald-400 text-lg font-bold transition-all duration-300 hover:text-emerald-300">Average Case</th>
                    <th className="pb-6 text-red-400 text-lg font-bold transition-all duration-300 hover:text-red-300">Worst Case</th>
                    <th className="pb-6 text-cyan-400 text-lg font-bold transition-all duration-300 hover:text-cyan-300">Space Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Quick Sort</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-red-400 font-medium group-hover:text-red-300 transition-all duration-300">O(n²)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(log n)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Merge Sort</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(n)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Binary Search</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(1)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(log n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(1)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Heap Sort</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(n log n)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(1)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">DFS</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(V)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">BFS</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(V)</td>
                  </tr>
                  <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Dijkstra's Algorithm</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(V+E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(E + V log V)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(E + V log V)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(V)</td>
                  </tr>
                  <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                    <td className="py-6 text-white font-medium group-hover:text-emerald-400 transition-all duration-300">Kruskal's Algorithm</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(E log E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(E log E)</td>
                    <td className="py-6 text-emerald-400 font-medium group-hover:text-emerald-300 transition-all duration-300">O(E log E)</td>
                    <td className="py-6 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">O(V)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Algorithms;