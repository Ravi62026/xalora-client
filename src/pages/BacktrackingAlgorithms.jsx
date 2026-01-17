import React, { useState } from "react";
import { Layout } from "../components";

const BacktrackingAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Backtracking Fundamentals
  const fundamentals = [
    {
      id: "backtracking-basics",
      name: "Backtracking Fundamentals",
      description: "Systematic exploration of solution space by trying choices and backtracking when constraints fail.",
      keyConcepts: [
        "State Space Tree - represents all possible solutions",
        "Pruning - eliminate invalid paths early",
        "Constraint Satisfaction - check validity at each step",
        "Backtracking - undo choices that don't work"
      ],
      code: `// Basic backtracking template
void backtrack(State current, vector<State>& solutions) {
    // Base case: solution found
    if (isSolution(current)) {
        solutions.push_back(current);
        return;
    }

    // Try all possible choices
    for (Choice choice : getChoices(current)) {
        // Make choice
        makeChoice(current, choice);

        // Recurse if valid
        if (isValid(current)) {
            backtrack(current, solutions);
        }

        // Backtrack (undo choice)
        undoChoice(current, choice);
    }
}`
    },
    {
      id: "when-to-use",
      name: "When to Use Backtracking",
      description: "Problems requiring exhaustive search with constraints and optimization.",
      applications: [
        "N-Queens Problem",
        "Sudoku Solver",
        "Subset Sum",
        "Word Search",
        "Knight's Tour",
        "Hamiltonian Path",
        "Graph Coloring"
      ],
      vsOther: {
        bruteForce: "Backtracking prunes invalid paths",
        DP: "Use when state space is too large for DP",
        greedy: "Backtracking explores all possibilities"
      }
    }
  ];

  // Classic Backtracking Problems
  const classicProblems = [
    {
      id: "n-queens",
      name: "N-Queens Problem",
      complexity: { time: "O(N!)", space: "O(N²)" },
      description: "Place N queens on N×N chessboard so no two attack each other.",
      code: `class NQueens {
private:
    int N;
    vector<vector<string>> solutions;
    vector<string> board;

    bool isSafe(int row, int col, vector<string>& board) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }

        // Check diagonal (top-left)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }

        // Check diagonal (top-right)
        for (int i = row - 1, j = col + 1; i >= 0 && j < N; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }

        return true;
    }

    void solve(int row) {
        if (row == N) {
            solutions.push_back(board);
            return;
        }

        for (int col = 0; col < N; col++) {
            if (isSafe(row, col, board)) {
                board[row][col] = 'Q';
                solve(row + 1);
                board[row][col] = '.';
            }
        }
    }

public:
    NQueens(int n) : N(n) {
        board.assign(N, string(N, '.'));
    }

    vector<vector<string>> solveNQueens() {
        solve(0);
        return solutions;
    }
};`
    },
    {
      id: "sudoku",
      name: "Sudoku Solver",
      complexity: { time: "O(9^(81-k))", space: "O(1)" },
      description: "Fill 9×9 grid following Sudoku rules (unique numbers in rows, columns, 3×3 boxes).",
      code: `class SudokuSolver {
private:
    vector<vector<char>> board;
    int N = 9;

    bool isValid(int row, int col, char num) {
        // Check row and column
        for (int i = 0; i < N; i++) {
            if (board[row][i] == num || board[i][col] == num) {
                return false;
            }
        }

        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] == num) {
                    return false;
                }
            }
        }

        return true;
    }

    bool solve(int row, int col) {
        // Find next empty cell
        while (row < N && board[row][col] != '.') {
            col++;
            if (col == N) {
                col = 0;
                row++;
            }
        }

        // All cells filled
        if (row == N) return true;

        // Try digits 1-9
        for (char num = '1'; num <= '9'; num++) {
            if (isValid(row, col, num)) {
                board[row][col] = num;

                int nextRow = row;
                int nextCol = col + 1;
                if (nextCol == N) {
                    nextRow++;
                    nextCol = 0;
                }

                if (solve(nextRow, nextCol)) {
                    return true;
                }

                board[row][col] = '.'; // Backtrack
            }
        }

        return false;
    }

public:
    SudokuSolver(vector<vector<char>>& b) : board(b) {}

    bool solveSudoku() {
        return solve(0, 0);
    }
};`
    },
    {
      id: "subset-sum",
      name: "Subset Sum Problem",
      complexity: { time: "O(2^n)", space: "O(n)" },
      description: "Find subset of numbers that sum to target value.",
      code: `class SubsetSum {
private:
    vector<int> nums;
    vector<vector<int>> solutions;

    void findSubsets(int index, int target, vector<int>& current) {
        if (target == 0) {
            solutions.push_back(current);
            return;
        }

        for (int i = index; i < nums.size(); i++) {
            if (nums[i] <= target) {
                current.push_back(nums[i]);
                findSubsets(i + 1, target - nums[i], current);
                current.pop_back();
            }
        }
    }

public:
    SubsetSum(vector<int>& n) : nums(n) {}

    vector<vector<int>> findSubsetsWithSum(int target) {
        vector<int> current;
        findSubsets(0, target, current);
        return solutions;
    }

    // Decision version: exists subset with sum = target
    bool hasSubsetWithSum(int target) {
        int n = nums.size();
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));

        // Base case: empty subset sums to 0
        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                if (j >= nums[i-1]) {
                    dp[i][j] = dp[i-1][j] || dp[i-1][j - nums[i-1]];
                } else {
                    dp[i][j] = dp[i-1][j];
                }
            }
        }

        return dp[n][target];
    }
};`
    },
    {
      id: "word-search",
      name: "Word Search",
      complexity: { time: "O(N × 4^L)", space: "O(L)" },
      description: "Find if word exists in 2D grid by moving adjacent cells.",
      code: `class WordSearch {
private:
    vector<vector<char>> board;
    int rows, cols;
    string word;

    bool dfs(int row, int col, int index) {
        if (index == word.length()) return true;

        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            board[row][col] != word[index]) {
            return false;
        }

        char temp = board[row][col];
        board[row][col] = '#'; // Mark visited

        // Try all 4 directions
        vector<pair<int, int>> directions = {
            {-1, 0}, {1, 0}, {0, -1}, {0, 1}
        };

        for (auto& dir : directions) {
            int newRow = row + dir.first;
            int newCol = col + dir.second;

            if (dfs(newRow, newCol, index + 1)) {
                board[row][col] = temp; // Restore
                return true;
            }
        }

        board[row][col] = temp; // Restore
        return false;
    }

public:
    WordSearch(vector<vector<char>>& b, string w) :
        board(b), word(w) {
        rows = board.size();
        cols = rows > 0 ? board[0].size() : 0;
    }

    bool exist() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (board[i][j] == word[0] && dfs(i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
};`
    }
  ];

  // Optimization Techniques
  const optimization = [
    {
      id: "pruning",
      name: "Pruning Techniques",
      description: "Reduce search space by eliminating invalid paths early.",
      techniques: [
        {
          name: "Early Termination",
          description: "Stop when solution found or constraints violated",
          example: "N-Queens: stop if queen placement conflicts"
        },
        {
          name: "Feasibility Checks",
          description: "Check partial solutions before proceeding",
          example: "Sudoku: validate row/column/box constraints"
        },
        {
          name: "Symmetry Breaking",
          description: "Avoid exploring symmetric solutions",
          example: "N-Queens: fix first queen in first row"
        },
        {
          name: "Heuristics",
          description: "Use domain knowledge to guide search",
          example: "Most constrained variable first"
        }
      ]
    },
    {
      id: "state-representation",
      name: "State Representation",
      description: "Efficient ways to represent and track problem state.",
      methods: [
        {
          name: "Bit Manipulation",
          description: "Use bits to track used numbers/positions",
          example: "Subset sum with bitmasks"
        },
        {
          name: "Hash Sets",
          description: "Track visited states or used elements",
          example: "Permutations without duplicates"
        },
        {
          name: "Arrays/Flags",
          description: "Boolean arrays for used elements",
          example: "N-Queens board state"
        }
      ]
    }
  ];

  // Advanced Backtracking Problems
  const advancedProblems = [
    {
      id: "permutations",
      name: "Generate All Permutations",
      complexity: { time: "O(n!)", space: "O(n)" },
      description: "Generate all possible arrangements of distinct elements.",
      code: `class Permutations {
private:
    vector<vector<int>> results;

    void backtrack(vector<int>& nums, int start) {
        if (start == nums.size()) {
            results.push_back(nums);
            return;
        }

        for (int i = start; i < nums.size(); i++) {
            swap(nums[start], nums[i]);
            backtrack(nums, start + 1);
            swap(nums[start], nums[i]); // backtrack
        }
    }

public:
    vector<vector<int>> permute(vector<int>& nums) {
        backtrack(nums, 0);
        return results;
    }

    // Permutations with duplicates
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        backtrackUnique(nums, 0);
        return results;
    }

private:
    void backtrackUnique(vector<int>& nums, int start) {
        if (start == nums.size()) {
            results.push_back(nums);
            return;
        }

        unordered_set<int> used;
        for (int i = start; i < nums.size(); i++) {
            if (used.count(nums[i])) continue;

            used.insert(nums[i]);
            swap(nums[start], nums[i]);
            backtrackUnique(nums, start + 1);
            swap(nums[start], nums[i]);
        }
    }
};`
    },
    {
      id: "combinations",
      name: "Generate Combinations",
      complexity: { time: "O(2^n)", space: "O(k)" },
      description: "Find all combinations of k elements from n elements.",
      code: `class Combinations {
private:
    vector<vector<int>> results;

    void backtrack(int n, int k, int start, vector<int>& current) {
        if (current.size() == k) {
            results.push_back(current);
            return;
        }

        for (int i = start; i <= n; i++) {
            current.push_back(i);
            backtrack(n, k, i + 1, current);
            current.pop_back();
        }
    }

public:
    vector<vector<int>> combine(int n, int k) {
        vector<int> current;
        backtrack(n, k, 1, current);
        return results;
    }

    // Combinations with sum
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        backtrackSum(candidates, target, 0, {});
        return results;
    }

private:
    void backtrackSum(vector<int>& candidates, int target, int start, vector<int> current) {
        if (target == 0) {
            results.push_back(current);
            return;
        }

        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > target) break;

            current.push_back(candidates[i]);
            backtrackSum(candidates, target - candidates[i], i, current);
            current.pop_back();
        }
    }
};`
    },
    {
      id: "palindrome-partitioning",
      name: "Palindrome Partitioning",
      complexity: { time: "O(2^n)", space: "O(n)" },
      description: "Partition string into minimum number of palindromic substrings.",
      code: `class PalindromePartitioning {
private:
    vector<vector<string>> results;
    vector<vector<bool>> isPalindrome;

    void buildPalindromeTable(string& s) {
        int n = s.length();
        isPalindrome.assign(n, vector<bool>(n, false));

        for (int i = 0; i < n; i++) {
            isPalindrome[i][i] = true;
        }

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (len == 2) {
                    isPalindrome[i][j] = (s[i] == s[j]);
                } else {
                    isPalindrome[i][j] = (s[i] == s[j] && isPalindrome[i+1][j-1]);
                }
            }
        }
    }

    void backtrack(string& s, int start, vector<string>& current) {
        if (start == s.length()) {
            results.push_back(current);
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalindrome[start][end]) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, current);
                current.pop_back();
            }
        }
    }

public:
    vector<vector<string>> partition(string s) {
        buildPalindromeTable(s);
        vector<string> current;
        backtrack(s, 0, current);
        return results;
    }
};`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      description: "Generate all letter combinations from phone digits",
      hint: "Backtrack through digit mappings"
    },
    {
      name: "Restore IP Addresses",
      difficulty: "Medium",
      description: "Restore all possible valid IP addresses",
      hint: "Backtrack with dot placement validation"
    },
    {
      name: "Combination Sum",
      difficulty: "Medium",
      description: "Find combinations that sum to target",
      hint: "Backtrack with index to avoid duplicates"
    },
    {
      name: "Generate Parentheses",
      difficulty: "Medium",
      description: "Generate all valid parentheses combinations",
      hint: "Track open/close counts"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(n)") || complexity.includes("O(L)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(2^n)") || complexity.includes("O(9^(81-k))")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("O(N!)") || complexity.includes("O(N × 4^L)")) color = "bg-red-100 text-red-800";

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
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Backtracking Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the systematic exploration of solution spaces with pruning and constraint satisfaction techniques.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("fundamentals")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "fundamentals"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Fundamentals
            </button>
            <button
              onClick={() => setActiveSection("classic")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "classic"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Classic Problems
            </button>
            <button
              onClick={() => setActiveSection("optimization")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "optimization"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Optimization
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "advanced"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Backtracking Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-violet-400 mb-4">What is Backtracking?</h3>
                  <p className="text-gray-300 mb-6">
                    Backtracking is a systematic way to explore all possible solutions to a problem
                    by incrementally building candidates and abandoning paths that fail to satisfy
                    the constraints. It's like trying all possibilities but with smart pruning.
                  </p>

                  <h3 className="text-2xl font-semibold text-violet-400 mb-4">Core Principles</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-violet-400 mr-2">🔄</span>
                      <span><strong>Incremental Construction:</strong> Build solution step by step</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-violet-400 mr-2">✂️</span>
                      <span><strong>Constraint Checking:</strong> Validate partial solutions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-violet-400 mr-2">↩️</span>
                      <span><strong>Backtracking:</strong> Undo choices when stuck</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-violet-400 mr-2">🌳</span>
                      <span><strong>State Space Tree:</strong> Search tree of all possibilities</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-violet-400 mb-4">When to Use Backtracking</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Problems Requiring:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Exhaustive search with constraints</li>
                        <li>• Finding all possible solutions</li>
                        <li>• Optimization with multiple choices</li>
                        <li>• Problems with combinatorial explosion</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">vs Other Approaches:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <strong>Brute Force:</strong> Backtracking prunes invalid paths</li>
                        <li>• <strong>DP:</strong> When state space is too large</li>
                        <li>• <strong>Greedy:</strong> When you need all solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-violet-400 mb-3">Time Complexity</h4>
                  <p className="text-gray-300">Often exponential: O(k^n)</p>
                  <p className="text-sm text-gray-400 mt-2">But pruning makes it practical for small n</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">O(n) for recursion stack</p>
                  <p className="text-sm text-gray-400 mt-2">Plus space for current solution</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Key Techniques</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• State representation</li>
                    <li>• Constraint validation</li>
                    <li>• Early pruning</li>
                    <li>• Symmetry breaking</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Fundamentals Section */}
          {activeSection === "fundamentals" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Backtracking Fundamentals</h2>

              <div className="grid grid-cols-1 gap-8">
                {fundamentals.map((concept) => (
                  <div
                    key={concept.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{concept.name}</h3>
                        <span className="px-3 py-1 bg-violet-900/50 text-violet-300 text-sm rounded-lg">
                          Core Concept
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6">{concept.description}</p>

                      {concept.keyConcepts && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-violet-400 mb-3">Key Concepts</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {concept.keyConcepts.map((concept, idx) => (
                              <div key={idx} className="bg-gray-700/50 p-3 rounded-lg">
                                <p className="text-gray-300 text-sm">{concept}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {concept.applications && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-violet-400 mb-3">Applications</h4>
                          <div className="flex flex-wrap gap-2">
                            {concept.applications.map((app, idx) => (
                              <span key={idx} className="px-3 py-1 bg-violet-900/50 text-violet-300 text-sm rounded-lg">
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {concept.vsOther && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-violet-400 mb-3">vs Other Approaches</h4>
                          <div className="space-y-2">
                            {Object.entries(concept.vsOther).map(([key, value], idx) => (
                              <div key={idx} className="bg-gray-700/50 p-3 rounded-lg">
                                <span className="text-cyan-400 font-medium">{key}:</span>
                                <span className="text-gray-300 ml-2">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Basic Template</h4>
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

          {/* Classic Problems Section */}
          {activeSection === "classic" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Classic Backtracking Problems</h2>

              <div className="grid grid-cols-1 gap-8">
                {classicProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
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

          {/* Optimization Section */}
          {activeSection === "optimization" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Optimization Techniques</h2>

              <div className="grid grid-cols-1 gap-8">
                {optimization.map((technique) => (
                  <div
                    key={technique.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{technique.name}</h3>
                        <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-lg">
                          Optimization
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6">{technique.description}</p>

                      {technique.techniques && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {technique.techniques.map((tech, idx) => (
                            <div key={idx} className="bg-gray-700/50 p-4 rounded-xl">
                              <h4 className="text-md font-semibold text-cyan-400 mb-2">{tech.name}</h4>
                              <p className="text-gray-300 mb-2 text-sm">{tech.description}</p>
                              <p className="text-xs text-gray-400 italic">{tech.example}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {technique.methods && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {technique.methods.map((method, idx) => (
                            <div key={idx} className="bg-gray-700/50 p-4 rounded-xl">
                              <h4 className="text-md font-semibold text-cyan-400 mb-2">{method.name}</h4>
                              <p className="text-gray-300 mb-2 text-sm">{method.description}</p>
                              <p className="text-xs text-gray-400 italic">{method.example}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Problems Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Backtracking Problems</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
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

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Backtracking</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Subsets (all possible subsets)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Letter Case Permutation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Binary Watch (backtrack on LED combinations)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Strobogrammatic Number II</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Backtracking</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Combination Sum II (no duplicates)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Permutations II (with duplicates)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Beautiful Arrangement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Expression Add Operators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Generalized Abbreviation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Backtracking</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Word Search II (on board)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Remove Invalid Parentheses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Sudoku Solver (with optimizations)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>N-Queens II (count solutions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Matchsticks to Square</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewProblems.map((problem, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyan-400 font-semibold">{problem.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                        }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{problem.description}</p>
                    <p className="text-xs text-gray-400 italic">{problem.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backtracking Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Backtracking Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-4">Template Structure</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Base Case:</div>
                    <div className="text-gray-400">→ if (isSolution(current)) add to results</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Recursive Case:</div>
                    <div className="text-gray-400">→ for each choice: make choice, recurse, undo</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Pruning:</div>
                    <div className="text-gray-400">→ if (!isValid(current)) return</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">State Tracking:</div>
                    <div className="text-gray-400">→ visited arrays, used sets, current path</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Permutations:</div>
                    <div className="text-gray-400">→ swap elements, backtrack</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Combinations:</div>
                    <div className="text-gray-400">→ choose or skip, increment index</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Subsets:</div>
                    <div className="text-gray-400">→ include/exclude each element</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Grid Problems:</div>
                    <div className="text-gray-400">→ mark visited, try all directions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BacktrackingAlgorithms;

