import React, { useState } from "react";
import { Layout } from "../components";

const Fundamentals = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Fundamental topics data
  const complexityTopics = [
    {
      id: "asymptotic",
      name: "Asymptotic Notation",
      description: "Big O, Big Ω, Big Θ - the language of algorithm analysis",
      content: {
        overview: "Asymptotic notation describes how an algorithm's performance scales as input size grows. It's the mathematical foundation for comparing algorithms.",
        concepts: [
          {
            name: "Big O (O)",
            description: "Upper bound - worst case scenario",
            examples: ["O(1) - constant time", "O(log n) - logarithmic", "O(n) - linear", "O(n²) - quadratic"],
            code: `// O(1) - Constant time
int getFirst(vector<int>& arr) { return arr[0]; }

// O(n) - Linear time
int sum(vector<int>& arr) {
    int total = 0;
    for (int x : arr) total += x;
    return total;
}

// O(n²) - Quadratic time
bool hasDuplicates(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = i + 1; j < arr.size(); j++) {
            if (arr[i] == arr[j]) return true;
        }
    }
    return false;
}`
          },
          {
            name: "Big Ω (Ω)",
            description: "Lower bound - best case scenario",
            examples: ["Ω(1) - at least constant", "Ω(n log n) - at least n log n"],
            code: `// Ω(n log n) - Best case for comparison sort
// Any comparison-based sorting algorithm
// must do at least n log n comparisons`
          },
          {
            name: "Big Θ (Θ)",
            description: "Tight bound - both upper and lower bound",
            examples: ["Θ(n) - exactly linear", "Θ(n log n) - exactly n log n"],
            code: `// Θ(n) - Linear time, always
void printArray(vector<int>& arr) {
    for (int x : arr) {
        cout << x << " ";
    }
    cout << endl;
}`
          }
        ],
        commonMistakes: [
          "Confusing O(n²) with O(2n) - constants don't matter",
          "Forgetting that O(n²) means the algorithm scales quadratically",
          "Thinking O(1) means instant - it means constant time, not necessarily fast"
        ]
      }
    },
    {
      id: "time-complexity",
      name: "Time Complexity Analysis",
      description: "How to analyze and calculate time complexity of algorithms",
      content: {
        rules: [
          {
            name: "Rule 1: Focus on Dominant Terms",
            description: "Keep the term that grows fastest",
            examples: ["O(n² + n) = O(n²)", "O(2n + 10) = O(n)", "O(n³ + n² + n + 1) = O(n³)"]
          },
          {
            name: "Rule 2: Ignore Constants",
            description: "Constant factors don't affect asymptotic growth",
            examples: ["O(2n) = O(n)", "O(1000n²) = O(n²)", "O(n/2) = O(n)"]
          },
          {
            name: "Rule 3: Nested Loops",
            description: "Multiply complexities of nested operations",
            examples: ["Two nested loops: O(n²)", "Triple nested loops: O(n³)", "While loop inside for: O(n²)"]
          }
        ],
        examples: [
          {
            name: "Linear Search",
            code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) { // O(n)
        if (arr[i] == target) return i;
    }
    return -1;
}
// Time: O(n), Space: O(1)`
          },
          {
            name: "Binary Search",
            code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) { // O(log n)
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
// Time: O(log n), Space: O(1)`
          }
        ],
        amortised: {
          name: "Amortized Analysis",
          description: "Average case over sequence of operations",
          example: "Dynamic array insertions: O(1) amortized"
        }
      }
    },
    {
      id: "space-complexity",
      name: "Space Complexity",
      description: "Memory usage analysis of algorithms",
      content: {
        auxiliary: "Space complexity considers both input space and auxiliary space",
        examples: [
          {
            name: "In-place algorithms",
            description: "O(1) auxiliary space",
            examples: ["Bubble Sort", "Selection Sort", "Quick Sort", "Heap Sort"]
          },
          {
            name: "Linear space algorithms",
            description: "O(n) auxiliary space",
            examples: ["Merge Sort", "Counting Sort (depends on range)"]
          }
        ],
        recursion: "Recursion stack space counts as auxiliary space",
        code: `// O(n) space due to recursion stack
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// O(1) auxiliary space, O(n) total space (input)
void printArray(vector<int>& arr) {
    for (int x : arr) cout << x << " ";
}`
      }
    }
  ];

  const recursionTopics = [
    {
      id: "recursion-basics",
      name: "Recursion Fundamentals",
      description: "Understanding recursive functions and the call stack",
      content: {
        definition: "A function that calls itself directly or indirectly",
        components: [
          {
            name: "Base Case",
            description: "Condition that stops recursion",
            example: "if (n == 0) return 1; // Factorial base case"
          },
          {
            name: "Recursive Case",
            description: "Calls itself with smaller input",
            example: "return n * factorial(n-1); // Factorial recursive case"
          },
          {
            name: "Progress",
            description: "Each call must progress toward base case",
            example: "n decreases by 1 each call"
          }
        ],
        examples: [
          {
            name: "Factorial",
            code: `int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive case
}`
          },
          {
            name: "Fibonacci",
            code: `int fibonacci(int n) {
    if (n <= 1) return n; // Base case
    return fibonacci(n-1) + fibonacci(n-2); // Recursive case
}
// Note: O(2^n) - very inefficient!`
          }
        ],
        callStack: "Each recursive call creates a new stack frame with its own variables"
      }
    },
    {
      id: "recursion-advanced",
      name: "Advanced Recursion",
      description: "Tail recursion, memoization, and optimization techniques",
      content: {
        tailRecursion: {
          name: "Tail Recursion",
          description: "Recursive call is the last operation",
          advantage: "Can be optimized by compiler to iteration",
          example: `// Tail recursive factorial
int factorialHelper(int n, int accumulator) {
    if (n <= 1) return accumulator;
    return factorialHelper(n - 1, n * accumulator);
}

int factorial(int n) {
    return factorialHelper(n, 1);
}`
        },
        memoization: {
          name: "Memoization",
          description: "Caching results to avoid recomputation",
          example: `// Memoized Fibonacci - O(n) time, O(n) space
map<int, int> memo;

int fibonacciMemo(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fibonacciMemo(n-1) + fibonacciMemo(n-2);
}`
        },
        backtracking: {
          name: "Backtracking",
          description: "Systematic exploration of solution space",
          example: "N-Queens problem, Sudoku solver"
        }
      }
    }
  ];

  const techniques = [
    {
      id: "divide-conquer",
      name: "Divide and Conquer",
      description: "Break problem into smaller subproblems, solve recursively, combine solutions",
      content: {
        steps: ["Divide", "Conquer", "Combine"],
        examples: [
          {
            name: "Merge Sort",
            description: "Divide array, sort halves, merge sorted halves",
            complexity: "O(n log n)"
          },
          {
            name: "Quick Sort",
            description: "Choose pivot, partition around pivot, sort partitions",
            complexity: "O(n log n) average"
          },
          {
            name: "Binary Search",
            description: "Search in sorted array by repeatedly halving search space",
            complexity: "O(log n)"
          }
        ],
        code: `// Classic D&C: Maximum Subarray Sum
int maxSubarray(vector<int>& nums, int left, int right) {
    if (left == right) return nums[left];

    int mid = left + (right - left) / 2;

    // Divide: left and right halves
    int leftMax = maxSubarray(nums, left, mid);
    int rightMax = maxSubarray(nums, mid + 1, right);

    // Conquer: cross middle
    int crossMax = maxCrossingSum(nums, left, mid, right);

    // Combine: maximum of three
    return max({leftMax, rightMax, crossMax});
}`
      }
    },
    {
      id: "two-pointers",
      name: "Two Pointers Technique",
      description: "Use two pointers to solve problems efficiently, often in linear time",
      content: {
        applications: [
          "Finding pairs that sum to target",
          "Removing duplicates from sorted array",
          "Finding longest substring without repeating characters",
          "Container with most water",
          "Trapping rain water"
        ],
        patterns: [
          {
            name: "Opposite Direction",
            description: "Start from both ends, move towards center",
            example: "Two sum in sorted array"
          },
          {
            name: "Same Direction",
            description: "Both pointers move in same direction",
            example: "Remove duplicates from sorted array"
          }
        ],
        code: `// Two Sum in Sorted Array (Opposite direction)
vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return {left + 1, right + 1}; // 1-indexed
        } else if (sum < target) {
            left++; // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    return {}; // No solution
}

// Remove Duplicates (Same direction)
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;

    int i = 0; // Slow pointer
    for (int j = 1; j < nums.size(); j++) { // Fast pointer
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}`
      }
    },
    {
      id: "sliding-window",
      name: "Sliding Window Technique",
      description: "Maintain a window of elements and slide it to find optimal subarrays/substrings",
      content: {
        types: [
          {
            name: "Fixed Size Window",
            description: "Window size remains constant",
            example: "Maximum sum subarray of size k"
          },
          {
            name: "Variable Size Window",
            description: "Window size adjusts based on condition",
            example: "Longest substring without repeating characters"
          }
        ],
        advantages: ["Often O(n) time complexity", "Reduces nested loops", "Handles streaming data"],
        code: `// Fixed Size: Maximum sum of subarray of size k
int maxSumSubarray(vector<int>& nums, int k) {
    int maxSum = 0, windowSum = 0;

    // First window
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    maxSum = windowSum;

    // Slide window
    for (int i = k; i < nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }

    return maxSum;
}

// Variable Size: Longest substring without repeating chars
int longestUniqueSubstring(string s) {
    unordered_set<char> chars;
    int left = 0, maxLength = 0;

    for (int right = 0; right < s.size(); right++) {
        // Remove duplicates by moving left pointer
        while (chars.count(s[right])) {
            chars.erase(s[left]);
            left++;
        }

        chars.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }

    return maxLength;
}`
      }
    },
    {
      id: "bit-manipulation",
      name: "Bit Manipulation",
      description: "Efficient operations using bitwise operators for speed and memory optimization",
      content: {
        operators: [
          { op: "&", name: "AND", desc: "Bitwise AND" },
          { op: "|", name: "OR", desc: "Bitwise OR" },
          { op: "^", name: "XOR", desc: "Bitwise XOR" },
          { op: "~", name: "NOT", desc: "Bitwise NOT" },
          { op: "<<", name: "Left Shift", desc: "Multiply by 2^n" },
          { op: ">>", name: "Right Shift", desc: "Divide by 2^n" }
        ],
        tricks: [
          {
            name: "Check if even/odd",
            code: "if (n & 1) // odd else // even"
          },
          {
            name: "Multiply by 2^k",
            code: "n << k  // equivalent to n * (1 << k)"
          },
          {
            name: "Divide by 2^k",
            code: "n >> k  // equivalent to n / (1 << k)"
          },
          {
            name: "Check k-th bit",
            code: "if (n & (1 << k)) // bit is set"
          },
          {
            name: "Set k-th bit",
            code: "n | (1 << k)"
          },
          {
            name: "Clear k-th bit",
            code: "n & ~(1 << k)"
          },
          {
            name: "Toggle k-th bit",
            code: "n ^ (1 << k)"
          }
        ],
        applications: [
          "Counting set bits",
          "Finding single number in array",
          "Power of two check",
          "Bit manipulation for subsets",
          "Efficient state representation"
        ],
        code: `// Count set bits (number of 1s)
int countBits(int n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

// More efficient: Brian Kernighan's algorithm
int countBitsEfficient(int n) {
    int count = 0;
    while (n) {
        n &= (n - 1); // Remove lowest set bit
        count++;
    }
    return count;
}

// Find single number (all others appear twice)
int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num; // XOR cancels out pairs
    }
    return result;
}`
      }
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("log")) color = "bg-blue-50 text-blue-700";
    if (complexity === "O(1)") color = "bg-green-50 text-green-700";
    if (complexity.includes("n") && !complexity.includes("log")) color = "bg-amber-50 text-amber-700";
    if (complexity.includes("n²") || complexity.includes("n^2")) color = "bg-red-50 text-red-700";
    if (complexity.includes("2^")) color = "bg-purple-50 text-purple-700";

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
                Algorithm Fundamentals
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master the essential concepts and techniques that form the foundation of computer science and algorithmic problem-solving.
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
              onClick={() => setActiveSection("complexity")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "complexity"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Complexity Analysis
            </button>
            <button
              onClick={() => setActiveSection("recursion")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "recursion"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Recursion
            </button>
            <button
              onClick={() => setActiveSection("techniques")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "techniques"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Problem Solving
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Why Fundamentals Matter</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">The Foundation</h3>
                  <p className="text-gray-600 mb-6">
                    Before diving into complex algorithms, you need to master these fundamental concepts.
                    They are the building blocks that make advanced algorithms possible and help you
                    analyze and optimize your solutions.
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Key Areas</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Complexity Analysis:</strong> Big O, Big Ω, Big Θ notation and time/space analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Recursion:</strong> Understanding recursive functions, call stack, and optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Problem Solving:</strong> Divide & conquer, two pointers, sliding window, bit manipulation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span><strong>Analysis Skills:</strong> Breaking down problems, identifying patterns, optimization</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Interview Perspective</h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <h4 className="text-lg font-semibold text-indigo-700 mb-2">Why Interviewers Ask</h4>
                      <p className="text-gray-700">
                        These concepts test your understanding of algorithmic thinking, not just memorization.
                        They reveal how you approach problems and optimize solutions.
                      </p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h4 className="text-lg font-semibold text-amber-700 mb-2">Common Pitfalls</h4>
                      <ul className="text-gray-700 text-sm space-y-2">
                        <li>• Not understanding Big O vs actual runtime</li>
                        <li>• Confusing recursion with iteration</li>
                        <li>• Missing edge cases in recursive solutions</li>
                        <li>• Not recognizing when to use specific techniques</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">Learning Approach</h4>
                      <p className="text-gray-700 text-sm">
                        Master one concept at a time. Practice implementing each technique,
                        then analyze your solution's complexity. Compare different approaches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complexity Analysis Section */}
          {activeSection === "complexity" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complexity Analysis</h2>

              <div className="grid grid-cols-1 gap-8">
                {complexityTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{topic.name}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg font-medium">
                          Foundation
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6">{topic.description}</p>

                      {topic.id === "asymptotic" && (
                        <div className="space-y-6">
                          {topic.content.concepts.map((concept, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="text-lg font-semibold text-indigo-600 mb-2">{concept.name}</h4>
                              <p className="text-gray-700 mb-3">{concept.description}</p>
                              <div className="mb-3">
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Examples:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {concept.examples.map((ex, i) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">
                                      {ex}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {concept.code && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-600 mb-2">Code Example:</h5>
                                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm border border-gray-700">
                                    <code>{concept.code}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}

                          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-red-700 mb-3">Common Mistakes to Avoid</h4>
                            <ul className="space-y-2 text-gray-700">
                              {topic.content.commonMistakes.map((mistake, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-red-600 mr-2">⚠️</span>
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {topic.id === "time-complexity" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topic.content.rules.map((rule, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-lg font-semibold text-indigo-600 mb-2">{rule.name}</h4>
                                <p className="text-gray-700 mb-3 text-sm">{rule.description}</p>
                                <div className="space-y-1">
                                  {rule.examples.map((ex, i) => (
                                    <div key={i} className="text-xs bg-indigo-50 p-2 rounded text-gray-700 border border-indigo-100">
                                      {ex}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-indigo-600 mb-4">Practical Examples</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {topic.content.examples.map((example, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                  <h5 className="text-md font-semibold text-gray-900 mb-2">{example.name}</h5>
                                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm mb-2 border border-gray-700">
                                    <code>{example.code}</code>
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-blue-700 mb-3">Amortized Analysis</h4>
                            <p className="text-gray-700 mb-2">{topic.content.amortised.description}</p>
                            <p className="text-sm text-gray-600">{topic.content.amortised.example}</p>
                          </div>
                        </div>
                      )}

                      {topic.id === "space-complexity" && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Key Concept</h4>
                            <p className="text-gray-700">{topic.content.auxiliary}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topic.content.examples.map((example, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-2">{example.name}</h4>
                                <p className="text-gray-700 mb-3 text-sm">{example.description}</p>
                                <div className="space-y-1">
                                  {example.examples.map((ex, i) => (
                                    <div key={i} className="text-xs bg-indigo-50 p-2 rounded text-gray-700 border border-indigo-100">
                                      {ex}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                              <h4 className="text-md font-semibold text-amber-700 mb-2">Recursion Stack</h4>
                              <p className="text-gray-700 text-sm">{topic.content.recursion}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="text-md font-semibold text-indigo-600 mb-2">Code Examples</h4>
                              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs border border-gray-700">
                                <code>{topic.content.code}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recursion Section */}
          {activeSection === "recursion" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recursion Mastery</h2>

              <div className="grid grid-cols-1 gap-8">
                {recursionTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{topic.name}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg font-medium">
                          Core Concept
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6">{topic.description}</p>

                      {topic.id === "recursion-basics" && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Definition</h4>
                            <p className="text-gray-700">{topic.content.definition}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topic.content.components.map((component, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-2">{component.name}</h4>
                                <p className="text-gray-700 mb-2 text-sm">{component.description}</p>
                                <div className="bg-indigo-50 p-2 rounded text-xs text-gray-700 border border-indigo-100">
                                  {component.example}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topic.content.examples.map((example, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-indigo-600 mb-2">{example.name}</h4>
                                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm border border-gray-700">
                                  <code>{example.code}</code>
                                </pre>
                              </div>
                            ))}
                          </div>

                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-blue-700 mb-3">Call Stack Visualization</h4>
                            <p className="text-gray-700">{topic.content.callStack}</p>
                          </div>
                        </div>
                      )}

                      {topic.id === "recursion-advanced" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                              <h4 className="text-md font-semibold text-green-700 mb-2">{topic.content.tailRecursion.name}</h4>
                              <p className="text-gray-700 mb-2 text-sm">{topic.content.tailRecursion.description}</p>
                              <p className="text-xs text-gray-600 mb-3">{topic.content.tailRecursion.advantage}</p>
                              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto border border-gray-700">
                                <code>{topic.content.tailRecursion.example}</code>
                              </pre>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                              <h4 className="text-md font-semibold text-purple-700 mb-2">{topic.content.memoization.name}</h4>
                              <p className="text-gray-700 mb-2 text-sm">{topic.content.memoization.description}</p>
                              <p className="text-xs text-gray-600 mb-3">Turns O(2^n) to O(n)</p>
                              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto border border-gray-700">
                                <code>{topic.content.memoization.example}</code>
                              </pre>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                              <h4 className="text-md font-semibold text-orange-700 mb-2">{topic.content.backtracking.name}</h4>
                              <p className="text-gray-700 mb-2 text-sm">{topic.content.backtracking.description}</p>
                              <p className="text-xs text-gray-600">Explores solution space systematically</p>
                              <p className="text-xs text-gray-600 mt-2">{topic.content.backtracking.example}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem Solving Techniques Section */}
          {activeSection === "techniques" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Problem Solving Techniques</h2>

              <div className="grid grid-cols-1 gap-8">
                {techniques.map((technique) => (
                  <div
                    key={technique.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{technique.name}</h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg font-medium">
                          Technique
                        </span>
                      </div>

                      <p className="text-gray-600 mb-6">{technique.description}</p>

                      {technique.id === "divide-conquer" && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Three Steps</h4>
                            <div className="grid grid-cols-3 gap-4">
                              {technique.content.steps.map((step, idx) => (
                                <div key={idx} className="text-center">
                                  <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-indigo-700 font-bold">{idx + 1}</span>
                                  </div>
                                  <p className="text-gray-900 font-medium">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {technique.content.examples.map((example, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-2">{example.name}</h4>
                                <p className="text-gray-700 mb-2 text-sm">{example.description}</p>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200">
                                  {example.complexity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Code Example</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                              <code>{technique.content.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {technique.id === "two-pointers" && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Common Applications</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {technique.content.applications.map((app, idx) => (
                                <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg border border-indigo-200">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {technique.content.patterns.map((pattern, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-2">{pattern.name}</h4>
                                <p className="text-gray-700 mb-2 text-sm">{pattern.description}</p>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200">
                                  {pattern.example}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Implementation Examples</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                              <code>{technique.content.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {technique.id === "sliding-window" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {technique.content.types.map((type, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-md font-semibold text-gray-900 mb-2">{type.name}</h4>
                                <p className="text-gray-700 mb-2 text-sm">{type.description}</p>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200">
                                  {type.example}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-green-700 mb-3">Advantages</h4>
                            <ul className="space-y-2 text-gray-700">
                              {technique.content.advantages.map((advantage, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-600 mr-2">✓</span>
                                  <span>{advantage}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Implementation Examples</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                              <code>{technique.content.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {technique.id === "bit-manipulation" && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Bitwise Operators</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {technique.content.operators.map((op, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg text-center border border-gray-200">
                                  <div className="text-lg font-mono text-gray-900">{op.op}</div>
                                  <div className="text-xs text-gray-600">{op.name}</div>
                                  <div className="text-xs text-gray-500">{op.desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-purple-600 mb-3">Common Tricks</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {technique.content.tricks.map((trick, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <h5 className="text-sm font-medium text-gray-900 mb-1">{trick.name}</h5>
                                  <div className="text-xs bg-gray-900 p-2 rounded text-gray-100 font-mono border border-gray-700">
                                    {trick.code}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-green-700 mb-3">Applications</h4>
                            <div className="flex flex-wrap gap-2">
                              {technique.content.applications.map((app, idx) => (
                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-semibold text-indigo-600 mb-3">Implementation Examples</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                              <code>{technique.content.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-semibold text-green-700 mb-3">🟢 Complexity Analysis</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Analyze time/space complexity of given code</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Compare algorithms with different complexities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Find best/worst/average cases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Explain amortized analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">🟡 Recursion Practice</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Implement factorial, fibonacci recursively</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Convert recursive to iterative</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Add memoization to recursive solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Debug recursive stack overflow</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-semibold text-red-700 mb-3">🔴 Technique Application</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Two pointers: sum, palindrome, container with most water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Sliding window: maximum sum, longest substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Bit manipulation: count bits, single number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Divide & conquer: merge sort, binary search</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Tips */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">💡 Interview Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-indigo-600 font-semibold mb-2">Analysis Questions</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• "What's the time complexity of this code?"</li>
                    <li>• "Can you optimize this further?"</li>
                    <li>• "Explain Big O vs Big Θ vs Big Ω"</li>
                    <li>• "When is recursive solution better?"</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-indigo-600 font-semibold mb-2">Technique Recognition</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• "This looks like a two pointers problem"</li>
                    <li>• "Sliding window could work here"</li>
                    <li>• "This needs divide and conquer"</li>
                    <li>• "Bit manipulation would be efficient"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cheat Sheet */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Fundamentals Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Time Complexity Hierarchy</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(1)</span>
                    <span className="text-green-600 font-medium">Constant - Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(log n)</span>
                    <span className="text-blue-600 font-medium">Logarithmic - Very fast</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(n)</span>
                    <span className="text-amber-600 font-medium">Linear - Acceptable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(n log n)</span>
                    <span className="text-orange-600 font-medium">Quasilinear - Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(n²)</span>
                    <span className="text-red-600 font-medium">Quadratic - Slow</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">O(2^n)</span>
                    <span className="text-red-700 font-medium">Exponential - Unusable</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Technique Selection Guide</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-indigo-600 font-medium mb-1">Sorted Array Search</div>
                    <div className="text-gray-600">→ Binary Search O(log n)</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-indigo-600 font-medium mb-1">Find Pair with Sum</div>
                    <div className="text-gray-600">→ Two Pointers O(n)</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-indigo-600 font-medium mb-1">Maximum Subarray</div>
                    <div className="text-gray-600">→ Sliding Window O(n)</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-indigo-600 font-medium mb-1">Bit Operations</div>
                    <div className="text-gray-600">→ Bit Manipulation O(1)</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-indigo-600 font-medium mb-1">Large Problem</div>
                    <div className="text-gray-600">→ Divide & Conquer O(n log n)</div>
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

export default Fundamentals;

