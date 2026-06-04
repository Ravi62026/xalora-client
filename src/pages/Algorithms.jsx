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
      bgColor: "from-blue-50 to-cyan-50",
      accentColor: "text-blue-700",
      borderColor: "border-blue-200",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
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
      bgColor: "from-indigo-50 to-blue-50",
      accentColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-700",
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
      bgColor: "from-purple-50 to-pink-50",
      accentColor: "text-purple-700",
      borderColor: "border-purple-200",
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-700",
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
      bgColor: "from-cyan-50 to-teal-50",
      accentColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      badgeBg: "bg-cyan-100",
      badgeText: "text-cyan-700",
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
      bgColor: "from-green-50 to-emerald-50",
      accentColor: "text-green-700",
      borderColor: "border-green-200",
      badgeBg: "bg-green-100",
      badgeText: "text-green-700",
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
      bgColor: "from-emerald-50 to-green-50",
      accentColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
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
      bgColor: "from-amber-50 to-orange-50",
      accentColor: "text-amber-700",
      borderColor: "border-amber-200",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
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
      bgColor: "from-rose-50 to-pink-50",
      accentColor: "text-rose-700",
      borderColor: "border-rose-200",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
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
      bgColor: "from-violet-50 to-purple-50",
      accentColor: "text-violet-700",
      borderColor: "border-violet-200",
      badgeBg: "bg-violet-100",
      badgeText: "text-violet-700",
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
      bgColor: "from-red-50 to-orange-50",
      accentColor: "text-red-700",
      borderColor: "border-red-200",
      badgeBg: "bg-red-100",
      badgeText: "text-red-700",
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
      bgColor: "from-orange-50 to-amber-50",
      accentColor: "text-orange-700",
      borderColor: "border-orange-200",
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-700",
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
      bgColor: "from-slate-50 to-gray-50",
      accentColor: "text-slate-700",
      borderColor: "border-slate-200",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
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
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Algorithms
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master the fundamental algorithms that power modern software development
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {algorithmCategories.map((category) => (
              <button
                key={category.id}
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
                  else if (category.id === 'math') navigate('/algorithms/mathematical');
                  else if (category.id === 'geometric') navigate('/algorithms/geometric');
                  else if (category.id === 'randomized') navigate('/algorithms/randomized');
                }}
                className={`bg-gradient-to-br ${category.bgColor} rounded-2xl border ${category.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-opacity-100 text-left p-6 sm:p-7`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`${category.badgeBg} p-3 rounded-lg flex-shrink-0`}>
                    <svg className={`h-6 w-6 ${category.badgeText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${category.accentColor}`}>{category.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  </div>
                </div>

                {/* Algorithm List */}
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.algorithms.slice(0, 4).map((algorithm, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 ${category.badgeBg} ${category.badgeText} text-xs rounded-full`}
                      >
                        {algorithm}
                      </span>
                    ))}
                    {category.algorithms.length > 4 && (
                      <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                        +{category.algorithms.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Complexity Cheatsheet */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-9 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Algorithm Complexity Cheatsheet
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-gray-900 font-bold">Algorithm</th>
                    <th className="pb-4 text-green-700 font-bold">Best Case</th>
                    <th className="pb-4 text-blue-700 font-bold">Average Case</th>
                    <th className="pb-4 text-red-700 font-bold">Worst Case</th>
                    <th className="pb-4 text-purple-700 font-bold">Space</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
                    { name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
                    { name: "Binary Search", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
                    { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
                    { name: "DFS", best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
                    { name: "BFS", best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
                    { name: "Dijkstra's", best: "O(V+E)", avg: "O(E+V log V)", worst: "O(E+V log V)", space: "O(V)" },
                    { name: "Kruskal's", best: "O(E log E)", avg: "O(E log E)", worst: "O(E log E)", space: "O(V)" },
                  ].map((algo, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 text-gray-900 font-medium">{algo.name}</td>
                      <td className="py-4 text-green-700">{algo.best}</td>
                      <td className="py-4 text-blue-700">{algo.avg}</td>
                      <td className="py-4 text-red-700">{algo.worst}</td>
                      <td className="py-4 text-purple-700">{algo.space}</td>
                    </tr>
                  ))}
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