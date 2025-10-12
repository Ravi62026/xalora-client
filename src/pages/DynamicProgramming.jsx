import React, { useState } from "react";
import { Layout } from "../components";

const DynamicProgramming = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // DP Fundamentals
  const fundamentals = [
    {
      id: "overlapping-subproblems",
      name: "Overlapping Subproblems",
      description: "Problems that can be broken down into subproblems which are reused multiple times",
      examples: ["Fibonacci", "Longest Common Subsequence", "Matrix Chain Multiplication"],
      code: `// Fibonacci - Classic overlapping subproblems
// Without DP: O(2^n) - exponential
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2); // fib(5) calls fib(4) and fib(3)
                                    // fib(4) calls fib(3) and fib(2)
                                    // fib(3) is computed TWICE!
}

// With DP: O(n) - linear
vector<int> dp(n+1, -1);
int fib_memo(int n) {
    if (n <= 1) return n;
    if (dp[n] != -1) return dp[n]; // Reuse computed result
    return dp[n] = fib_memo(n-1) + fib_memo(n-2);
}`
    },
    {
      id: "optimal-substructure",
      name: "Optimal Substructure",
      description: "Optimal solution can be constructed from optimal solutions of its subproblems",
      examples: ["Shortest Path", "Minimum Cost Path", "Longest Increasing Subsequence"],
      code: `// Shortest path example
// Path from A to C via B is shortest
// IF: shortest(A->B) + shortest(B->C) = shortest(A->C)
// THEN: Problem has optimal substructure

// Counterexample: Longest Simple Path (NP-hard)
// No optimal substructure property`
    }
  ];

  // 1D DP Problems
  const oneDDP = [
    {
      id: "fibonacci",
      name: "Fibonacci Sequence",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Classic DP problem - each number is sum of previous two",
      approaches: ["Recursion + Memoization", "Bottom-up DP", "Space Optimized"],
      code: `// Bottom-up DP - O(n) time, O(n) space
int fibonacci(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Space Optimized - O(n) time, O(1) space
int fibonacci_optimized(int n) {
    if (n <= 1) return n;

    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`
    },
    {
      id: "climbing-stairs",
      name: "Climbing Stairs",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Number of ways to climb n stairs (1 or 2 steps at a time)",
      code: `int climbStairs(int n) {
    if (n <= 2) return n;

    int prev2 = 1, prev1 = 2; // ways for 1 and 2 stairs
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2; // ways to reach i
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`
    },
    {
      id: "house-robber",
      name: "House Robber",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Maximum money robbed without robbing adjacent houses",
      code: `int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];

    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < n; i++) {
        int curr = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`
    },
    {
      id: "maximum-subarray",
      name: "Maximum Subarray Sum",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Largest sum of contiguous subarray (Kadane's Algorithm)",
      code: `int maxSubArray(vector<int>& nums) {
    int max_so_far = INT_MIN, max_ending_here = 0;

    for (int num : nums) {
        max_ending_here = max(num, max_ending_here + num);
        max_so_far = max(max_so_far, max_ending_here);
    }
    return max_so_far;
}`
    }
  ];

  // 2D DP Problems
  const twoDDP = [
    {
      id: "knapsack",
      name: "0/1 Knapsack",
      complexity: { time: "O(nW)", space: "O(nW)" },
      description: "Select items with max value, given weight constraint",
      code: `int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (weights[i-1] <= w) {
                // Take item or leave it
                dp[i][w] = max(dp[i-1][w],
                              dp[i-1][w - weights[i-1]] + values[i-1]);
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    return dp[n][W];
}`
    },
    {
      id: "lcs",
      name: "Longest Common Subsequence",
      complexity: { time: "O(m*n)", space: "O(m*n)" },
      description: "Longest subsequence present in both strings",
      code: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}`
    },
    {
      id: "edit-distance",
      name: "Edit Distance",
      complexity: { time: "O(m*n)", space: "O(m*n)" },
      description: "Minimum operations to convert string A to string B",
      code: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));

    // Initialize base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i; // deletions
    for (int j = 0; j <= n; j++) dp[0][j] = j; // insertions

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1]) {
                dp[i][j] = dp[i-1][j-1]; // no operation
            } else {
                dp[i][j] = 1 + min({dp[i-1][j],      // delete
                                   dp[i][j-1],      // insert
                                   dp[i-1][j-1]}); // replace
            }
        }
    }
    return dp[m][n];
}`
    }
  ];

  // String DP Problems
  const stringDP = [
    {
      id: "longest-palindromic-substring",
      name: "Longest Palindromic Substring",
      complexity: { time: "O(n²)", space: "O(n²)" },
      description: "Find longest substring that reads same forwards and backwards",
      code: `string longestPalindrome(string s) {
    int n = s.size();
    vector<vector<bool>> dp(n, vector<bool>(n, false));
    int start = 0, maxLen = 1;

    // All single characters are palindromes
    for (int i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // Check for sub-string of length 2
    for (int i = 0; i < n-1; i++) {
        if (s[i] == s[i+1]) {
            dp[i][i+1] = true;
            start = i;
            maxLen = 2;
        }
    }

    // Check for lengths greater than 2
    for (int len = 3; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;
            if (s[i] == s[j] && dp[i+1][j-1]) {
                dp[i][j] = true;
                if (len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }

    return s.substr(start, maxLen);
}`
    },
    {
      id: "palindrome-partitioning",
      name: "Palindrome Partitioning",
      complexity: { time: "O(n²)", space: "O(n²)" },
      description: "Minimum cuts to partition string into palindromes",
      code: `int minCut(string s) {
    int n = s.size();
    vector<vector<bool>> isPal(n, vector<bool>(n, false));
    vector<int> cuts(n, 0);

    // Precompute palindromes
    for (int i = 0; i < n; i++) {
        isPal[i][i] = true;
    }

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (len == 2) {
                isPal[i][j] = (s[i] == s[j]);
            } else {
                isPal[i][j] = (s[i] == s[j]) && isPal[i+1][j-1];
            }
        }
    }

    // DP for minimum cuts
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) {
            cuts[i] = 0;
        } else {
            cuts[i] = INT_MAX;
            for (int j = 0; j < i; j++) {
                if (isPal[j+1][i]) {
                    cuts[i] = min(cuts[i], cuts[j] + 1);
                }
            }
        }
    }

    return cuts[n-1];
}`
    }
  ];

  // Grid/Matrix DP
  const gridDP = [
    {
      id: "unique-paths",
      name: "Unique Paths",
      complexity: { time: "O(m*n)", space: "O(m*n)" },
      description: "Number of unique paths from top-left to bottom-right in grid",
      code: `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 0));

    // First row and column have only 1 way
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }

    return dp[m-1][n-1];
}`
    },
    {
      id: "minimum-path-sum",
      name: "Minimum Path Sum",
      complexity: { time: "O(m*n)", space: "O(m*n)" },
      description: "Minimum sum path from top-left to bottom-right",
      code: `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));

    dp[0][0] = grid[0][0];

    // Fill first row
    for (int j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }

    // Fill first column
    for (int i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }

    // Fill rest of the grid
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);
        }
    }

    return dp[m-1][n-1];
}`
    },
    {
      id: "triangle-minimum-path",
      name: "Triangle Minimum Path",
      complexity: { time: "O(n²)", space: "O(n)" },
      description: "Minimum path sum from top to bottom in triangle",
      code: `int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp = triangle.back(); // Start from bottom

    for (int i = n - 2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);
        }
    }

    return dp[0];
}`
    }
  ];

  // Advanced DP Concepts
  const advancedDP = [
    {
      id: "lis",
      name: "Longest Increasing Subsequence",
      complexity: { time: "O(n²)", space: "O(n)" },
      description: "Length of longest subsequence where elements are in increasing order",
      code: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1); // Each element is LIS of length 1

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }

    return *max_element(dp.begin(), dp.end());
}`
    },
    {
      id: "coin-change",
      name: "Coin Change",
      complexity: { time: "O(amount * coins)", space: "O(amount)" },
      description: "Minimum coins needed to make given amount",
      code: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0; // 0 coins needed for amount 0

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i >= coin) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}`
    },
    {
      id: "word-break",
      name: "Word Break",
      complexity: { time: "O(n²)", space: "O(n)" },
      description: "Check if string can be segmented into dictionary words",
      code: `bool wordBreak(string s, vector<string>& wordDict) {
    int n = s.size();
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    vector<bool> dp(n + 1, false);
    dp[0] = true; // Empty string is always breakable

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n];
}`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Decode Ways",
      difficulty: "Medium",
      description: "Number of ways to decode a string of digits",
      hint: "Use DP where dp[i] represents ways to decode first i characters"
    },
    {
      name: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      description: "Maximum profit with one transaction",
      hint: "Track minimum price seen so far"
    },
    {
      name: "Jump Game",
      difficulty: "Medium",
      description: "Can reach last index with given jump lengths",
      hint: "Use greedy or DP to track farthest reachable"
    },
    {
      name: "Partition Equal Subset Sum",
      difficulty: "Medium",
      description: "Can partition array into two subsets with equal sum",
      hint: "Convert to 0/1 knapsack where target is total_sum/2"
    },
    {
      name: "Longest Valid Parentheses",
      difficulty: "Hard",
      description: "Length of longest valid parentheses substring",
      hint: "Use stack or DP to track valid parentheses"
    }
  ];

  // Space Optimization Techniques
  const spaceOptimization = [
    {
      name: "1D DP Space Optimization",
      description: "Many 2D DP problems can be optimized to O(n) space",
      example: "Fibonacci: Use two variables instead of array"
    },
    {
      name: "State Compression",
      description: "Use bitmasks for subset DP problems",
      example: "TSP, subset sum with bit manipulation"
    },
    {
      name: "Rolling Array",
      description: "Keep only last few states in memory",
      example: "Edit distance with two arrays instead of full matrix"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(1)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(n)")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(n²)") || complexity.includes("O(n^2)")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("O(m*n)") || complexity.includes("O(2^n)")) color = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {complexity}
      </span>
    );
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dynamic Programming
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the art of breaking down complex problems into simpler subproblems with optimal substructure and overlapping subproblems.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("fundamentals")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "fundamentals"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Fundamentals
            </button>
            <button
              onClick={() => setActiveSection("1d")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "1d"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              1D DP
            </button>
            <button
              onClick={() => setActiveSection("2d")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "2d"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              2D DP
            </button>
            <button
              onClick={() => setActiveSection("string")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "string"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              String DP
            </button>
            <button
              onClick={() => setActiveSection("grid")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "grid"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Grid DP
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "advanced"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Dynamic Programming Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">What is DP?</h3>
                  <p className="text-gray-300 mb-6">
                    Dynamic Programming is a method for solving complex problems by breaking them down into simpler
                    subproblems. It solves each subproblem only once and stores the solution for future reference.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Two Key Properties</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">🔄</span>
                      <span><strong>Overlapping Subproblems:</strong> The problem can be broken down into subproblems which are reused multiple times</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">⚡</span>
                      <span><strong>Optimal Substructure:</strong> The optimal solution can be constructed from optimal solutions of its subproblems</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">DP Approaches</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Top-Down (Memoization)</h4>
                      <p className="text-gray-300 text-sm">Recursive approach with caching. Natural way to think about problems.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Bottom-Up (Tabulation)</h4>
                      <p className="text-gray-300 text-sm">Iterative approach filling DP table. Often more space efficient.</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Space Optimization</h4>
                      <p className="text-gray-300 text-sm">Reduce space complexity by keeping only necessary previous states.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">When to Use DP?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="text-sm text-gray-300">Overlapping subproblems exist</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm text-gray-300">Optimal substructure property</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💾</div>
                    <div className="text-sm text-gray-300">Subproblem solutions can be cached</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm text-gray-300">Need optimal solution, not just any</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fundamentals Section */}
          {activeSection === "fundamentals" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">DP Fundamentals</h2>

              <div className="grid grid-cols-1 gap-8">
                {fundamentals.map((concept) => (
                  <div
                    key={concept.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{concept.name}</h3>
                        <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                          Core Concept
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6">{concept.description}</p>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-400 mb-3">Examples</h4>
                        <div className="flex flex-wrap gap-2">
                          {concept.examples.map((example, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Code Illustration</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{concept.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1D DP Section */}
          {activeSection === "1d" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">1D Dynamic Programming</h2>

              <div className="grid grid-cols-1 gap-8">
                {oneDDP.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${problem.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${problem.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      {problem.approaches && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-blue-400 mb-3">Solution Approaches</h4>
                          <div className="flex flex-wrap gap-2">
                            {problem.approaches.map((approach, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                                {approach}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2D DP Section */}
          {activeSection === "2d" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">2D Dynamic Programming</h2>

              <div className="grid grid-cols-1 gap-8">
                {twoDDP.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${problem.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${problem.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* String DP Section */}
          {activeSection === "string" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">String Dynamic Programming</h2>

              <div className="grid grid-cols-1 gap-8">
                {stringDP.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${problem.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${problem.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid DP Section */}
          {activeSection === "grid" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Grid/Matrix Dynamic Programming</h2>

              <div className="grid grid-cols-1 gap-8">
                {gridDP.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 text-sm rounded-lg">
                            Time: {problem.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-orange-900/50 text-orange-300 text-sm rounded-lg">
                            Space: {problem.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced DP Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Dynamic Programming</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedDP.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-lg">
                            Time: {problem.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-300 text-sm rounded-lg">
                            Space: {problem.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Space Optimization Section */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Space Optimization Techniques</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {spaceOptimization.map((technique, idx) => (
                      <div key={idx} className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">{technique.name}</h4>
                        <p className="text-gray-300 mb-2 text-sm">{technique.description}</p>
                        <p className="text-xs text-gray-400 italic">{technique.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy DP Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Climbing Stairs (different step sizes)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Best Time to Buy and Sell Stock (I)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>House Robber (circular houses)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Maximum Subarray (with constraints)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Fibonacci with matrix exponentiation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium DP Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Decode Ways (message decoding)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Unique Paths II (with obstacles)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Longest Increasing Subsequence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Coin Change II (number of ways)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Word Break (with memoization)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard DP Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Regular Expression Matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Edit Distance (with costs)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Scramble String</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Distinct Subsequences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Burst Balloons</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Common Interview Patterns */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Common DP Interview Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">1D DP Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Kadane's Algorithm (Max Subarray)</li>
                    <li>• House Robber variants</li>
                    <li>• Climbing Stairs problems</li>
                    <li>• Jump Game problems</li>
                    <li>• Best time to buy/sell stock</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">2D DP Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Knapsack problems</li>
                    <li>• String matching (LCS, Edit Distance)</li>
                    <li>• Grid path problems</li>
                    <li>• Matrix chain multiplication</li>
                    <li>• Optimal binary search tree</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">String DP Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Palindrome problems</li>
                    <li>• Word break problems</li>
                    <li>• Regular expression matching</li>
                    <li>• Distinct subsequences</li>
                    <li>• Longest common substring</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• State compression DP</li>
                    <li>• Digit DP</li>
                    <li>• Tree DP</li>
                    <li>• Interval DP</li>
                    <li>• Bitmask DP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              DP Mastery Checklist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Fundamentals</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Overlapping subproblems</li>
                  <li>• Optimal substructure</li>
                  <li>• Memoization vs Tabulation</li>
                  <li>• State definition</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">🎯 Problem Recognition</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• When to use DP</li>
                  <li>• State space analysis</li>
                  <li>• Transition functions</li>
                  <li>• Base cases</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">⚡ Optimization</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Space optimization</li>
                  <li>• Time optimization</li>
                  <li>• Rolling arrays</li>
                  <li>• State compression</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-red-400 mb-2">🚀 Advanced Techniques</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Bitmask DP</li>
                  <li>• Digit DP</li>
                  <li>• Matrix exponentiation</li>
                  <li>• Convex hull trick</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DynamicProgramming;

