import React, { useState } from "react";
import { Layout } from "../components";

const Arrays = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Array Operations
  const operations = [
    {
      id: "access",
      name: "Array Access",
      complexity: { time: "O(1)", space: "O(1)" },
      description: "Direct access to any element using index",
      code: `// Direct access by index - O(1)
int getElement(int arr[], int index, int n) {
    if (index < 0 || index >= n) {
        throw std::out_of_range("Index out of bounds");
    }
    return arr[index]; // Constant time access
}

// Setting element by index - O(1)
void setElement(int arr[], int index, int value, int n) {
    if (index < 0 || index >= n) {
        throw std::out_of_range("Index out of bounds");
    }
    arr[index] = value; // Constant time modification
}`
    },
    {
      id: "search",
      name: "Linear Search",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Sequential search through all elements",
      code: `// Linear search - O(n) time
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Found at index i
        }
    }
    return -1; // Not found
}

// Enhanced linear search with early termination
int linearSearchWithCount(int arr[], int n, int target, int& comparisons) {
    comparisons = 0;
    for (int i = 0; i < n; i++) {
        comparisons++;
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`
    },
    {
      id: "binary-search",
      name: "Binary Search",
      complexity: { time: "O(log n)", space: "O(1)" },
      prerequisite: "Sorted array",
      description: "Efficient search in sorted arrays using divide and conquer",
      code: `// Iterative binary search - O(log n)
int binarySearch(int arr[], int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    return -1; // Not found
}

// Recursive binary search
int binarySearchRecursive(int arr[], int left, int right, int target) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;

    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) {
        return binarySearchRecursive(arr, mid + 1, right, target);
    } else {
        return binarySearchRecursive(arr, left, mid - 1, target);
    }
}`
    }
  ];

  // Array Manipulation
  const manipulation = [
    {
      id: "insertion",
      name: "Array Insertion",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Insert element at specific position, shifting subsequent elements",
      code: `// Insert at specific position - O(n)
void insertAtPosition(int arr[], int& n, int position, int value, int capacity) {
    if (n >= capacity) {
        throw std::overflow_error("Array is full");
    }
    if (position < 0 || position > n) {
        throw std::out_of_range("Invalid position");
    }

    // Shift elements to the right
    for (int i = n; i > position; i--) {
        arr[i] = arr[i - 1];
    }

    arr[position] = value;
    n++;
}

// Insert at end - amortized O(1) for dynamic arrays
void insertAtEnd(std::vector<int>& arr, int value) {
    arr.push_back(value); // Automatic resizing
}`
    },
    {
      id: "deletion",
      name: "Array Deletion",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Remove element at specific position, shifting subsequent elements",
      code: `// Delete at specific position - O(n)
void deleteAtPosition(int arr[], int& n, int position) {
    if (position < 0 || position >= n) {
        throw std::out_of_range("Invalid position");
    }

    // Shift elements to the left
    for (int i = position; i < n - 1; i++) {
        arr[i] = arr[i + 1];
    }

    n--;
}

// Delete by value - O(n)
int deleteByValue(int arr[], int& n, int value) {
    int position = -1;

    // Find the value
    for (int i = 0; i < n; i++) {
        if (arr[i] == value) {
            position = i;
            break;
        }
    }

    if (position != -1) {
        deleteAtPosition(arr, n, position);
    }

    return position;
}`
    },
    {
      id: "rotation",
      name: "Array Rotation",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Rotate array elements by k positions",
      code: `// Rotate left by k positions - O(n) time, O(1) space
void rotateLeft(int arr[], int n, int k) {
    k = k % n; // Handle k > n

    // Reverse entire array
    reverseArray(arr, 0, n - 1);

    // Reverse first n-k elements
    reverseArray(arr, 0, n - k - 1);

    // Reverse last k elements
    reverseArray(arr, n - k, n - 1);
}

// Helper function to reverse array segment
void reverseArray(int arr[], int start, int end) {
    while (start < end) {
        std::swap(arr[start], arr[end]);
        start++;
        end--;
    }
}

// Rotate right by k positions
void rotateRight(int arr[], int n, int k) {
    rotateLeft(arr, n, n - (k % n));
}`
    }
  ];

  // Array Algorithms
  const algorithms = [
    {
      id: "kadane",
      name: "Kadane's Algorithm (Maximum Subarray Sum)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Find contiguous subarray with maximum sum",
      code: `// Kadane's algorithm - O(n) time, O(1) space
int maxSubarraySum(int arr[], int n) {
    int maxSoFar = INT_MIN;
    int maxEndingHere = 0;

    for (int i = 0; i < n; i++) {
        maxEndingHere += arr[i];

        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
        }

        if (maxEndingHere < 0) {
            maxEndingHere = 0;
        }
    }

    return maxSoFar;
}

// With subarray indices
std::tuple<int, int, int> maxSubarraySumWithIndices(int arr[], int n) {
    int maxSoFar = INT_MIN;
    int maxEndingHere = 0;
    int start = 0, end = 0, tempStart = 0;

    for (int i = 0; i < n; i++) {
        maxEndingHere += arr[i];

        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }

        if (maxEndingHere < 0) {
            maxEndingHere = 0;
            tempStart = i + 1;
        }
    }

    return {maxSoFar, start, end};
}`
    },
    {
      id: "dutch-flag",
      name: "Dutch National Flag (3-way Partition)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Sort array of 0s, 1s, and 2s in single pass",
      code: `// Dutch National Flag algorithm - O(n) time, O(1) space
void dutchNationalFlag(int arr[], int n) {
    int low = 0, mid = 0, high = n - 1;

    while (mid <= high) {
        switch (arr[mid]) {
            case 0:
                std::swap(arr[low], arr[mid]);
                low++;
                mid++;
                break;

            case 1:
                mid++;
                break;

            case 2:
                std::swap(arr[mid], arr[high]);
                high--;
                // Don't increment mid here
                break;
        }
    }
}

// Generalized 3-way partition
void threeWayPartition(int arr[], int n, int pivot) {
    int low = 0, mid = 0, high = n - 1;

    while (mid <= high) {
        if (arr[mid] < pivot) {
            std::swap(arr[low], arr[mid]);
            low++;
            mid++;
        } else if (arr[mid] == pivot) {
            mid++;
        } else {
            std::swap(arr[mid], arr[high]);
            high--;
        }
    }
}`
    },
    {
      id: "sliding-window",
      name: "Sliding Window Maximum",
      complexity: { time: "O(n)", space: "O(k)" },
      description: "Find maximum in each window of size k",
      code: `// Sliding window maximum using deque - O(n) time
std::vector<int> slidingWindowMaximum(const std::vector<int>& arr, int k) {
    std::vector<int> result;
    std::deque<int> dq; // Store indices

    for (int i = 0; i < arr.size(); i++) {
        // Remove elements outside current window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // Remove smaller elements from back
        while (!dq.empty() && arr[dq.back()] <= arr[i]) {
            dq.pop_back();
        }

        // Add current element
        dq.push_back(i);

        // Add maximum for current window
        if (i >= k - 1) {
            result.push_back(arr[dq.front()]);
        }
    }

    return result;
}

// Naive approach - O(n*k) time
std::vector<int> slidingWindowMaximumNaive(const std::vector<int>& arr, int k) {
    std::vector<int> result;

    for (int i = 0; i <= arr.size() - k; i++) {
        int maxVal = arr[i];
        for (int j = 1; j < k; j++) {
            maxVal = std::max(maxVal, arr[i + j]);
        }
        result.push_back(maxVal);
    }

    return result;
}`
    }
  ];

  // Multi-dimensional Arrays
  const multiDimArrays = [
    {
      id: "2d-arrays",
      name: "2D Array Operations",
      complexity: { access: "O(1)", traversal: "O(rows × cols)" },
      description: "Working with matrices and 2D arrays",
      code: `// 2D Array traversal patterns
void traverseRowWise(int arr[][COLS], int rows, int cols) {
    std::cout << "Row-wise traversal:" << std::endl;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            std::cout << arr[i][j] << " ";
        }
        std::cout << std::endl;
    }
}

void traverseColumnWise(int arr[][COLS], int rows, int cols) {
    std::cout << "Column-wise traversal:" << std::endl;
    for (int j = 0; j < cols; j++) {
        for (int i = 0; i < rows; i++) {
            std::cout << arr[i][j] << " ";
        }
        std::cout << std::endl;
    }
}

void traverseDiagonally(int arr[][COLS], int rows, int cols) {
    std::cout << "Main diagonal:" << std::endl;
    for (int i = 0; i < std::min(rows, cols); i++) {
        std::cout << arr[i][i] << " ";
    }
    std::cout << std::endl;

    std::cout << "Anti diagonal:" << std::endl;
    for (int i = 0; i < std::min(rows, cols); i++) {
        std::cout << arr[i][cols - 1 - i] << " ";
    }
    std::cout << std::endl;
}`
    },
    {
      id: "matrix-operations",
      name: "Matrix Operations",
      complexity: { addition: "O(rows × cols)", multiplication: "O(rows × cols × common)" },
      description: "Basic matrix operations and transformations",
      code: `// Matrix addition - O(rows × cols)
std::vector<std::vector<int>> matrixAdd(const std::vector<std::vector<int>>& A,
                                       const std::vector<std::vector<int>>& B) {
    int rows = A.size();
    int cols = A[0].size();
    std::vector<std::vector<int>> result(rows, std::vector<int>(cols));

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }

    return result;
}

// Matrix multiplication - O(rowsA × colsB × colsA)
std::vector<std::vector<int>> matrixMultiply(const std::vector<std::vector<int>>& A,
                                           const std::vector<std::vector<int>>& B) {
    int rowsA = A.size();
    int colsA = A[0].size();
    int colsB = B[0].size();

    std::vector<std::vector<int>> result(rowsA, std::vector<int>(colsB, 0));

    for (int i = 0; i < rowsA; i++) {
        for (int j = 0; j < colsB; j++) {
            for (int k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}

// Matrix transpose - O(rows × cols)
std::vector<std::vector<int>> matrixTranspose(const std::vector<std::vector<int>>& matrix) {
    int rows = matrix.size();
    int cols = matrix[0].size();

    std::vector<std::vector<int>> result(cols, std::vector<int>(rows));

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }

    return result;
}`
    }
  ];

  // Dynamic Arrays (Vectors)
  const dynamicArrays = [
    {
      id: "vector-basics",
      name: "Vector (Dynamic Array) Basics",
      complexity: { access: "O(1)", insert_end: "O(1) amortized", insert_middle: "O(n)" },
      description: "Dynamic arrays that automatically resize",
      code: `// Vector operations - C++ std::vector
#include <vector>

void vectorOperations() {
    std::vector<int> vec;

    // Adding elements
    vec.push_back(10);     // O(1) amortized
    vec.push_back(20);
    vec.push_back(30);

    // Size and capacity
    std::cout << "Size: " << vec.size() << std::endl;
    std::cout << "Capacity: " << vec.capacity() << std::endl;

    // Accessing elements - O(1)
    std::cout << "Element at index 1: " << vec[1] << std::endl;
    std::cout << "Front: " << vec.front() << std::endl;
    std::cout << "Back: " << vec.back() << std::endl;

    // Inserting in middle - O(n)
    vec.insert(vec.begin() + 1, 15);

    // Erasing elements - O(n)
    vec.erase(vec.begin() + 1);

    // Resizing
    vec.resize(10, 0);    // Resize to 10 elements, fill with 0
    vec.reserve(20);      // Reserve capacity for 20 elements
}`
    },
    {
      id: "vector-algorithms",
      name: "Vector Algorithms",
      complexity: { sort: "O(n log n)", find: "O(n)", unique: "O(n)" },
      description: "Common algorithms using vectors",
      code: `// Vector algorithms using STL
#include <algorithm>
#include <vector>
#include <iostream>

void vectorAlgorithms() {
    std::vector<int> vec = {3, 1, 4, 1, 5, 9, 2, 6};

    // Sorting - O(n log n)
    std::sort(vec.begin(), vec.end());  // Ascending
    std::sort(vec.rbegin(), vec.rend()); // Descending

    // Finding elements - O(n)
    auto it = std::find(vec.begin(), vec.end(), 5);
    if (it != vec.end()) {
        std::cout << "Found 5 at position: " << (it - vec.begin()) << std::endl;
    }

    // Binary search (requires sorted vector) - O(log n)
    bool found = std::binary_search(vec.begin(), vec.end(), 4);

    // Removing duplicates - O(n)
    std::sort(vec.begin(), vec.end());
    auto last = std::unique(vec.begin(), vec.end());
    vec.erase(last, vec.end());

    // Reversing - O(n)
    std::reverse(vec.begin(), vec.end());

    // Accumulate/Reduce - O(n)
    int sum = std::accumulate(vec.begin(), vec.end(), 0);

    // Transform - O(n)
    std::vector<int> doubled(vec.size());
    std::transform(vec.begin(), vec.end(), doubled.begin(),
                   [](int x) { return x * 2; });
}`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Two Sum",
      difficulty: "Easy",
      description: "Find two numbers that add up to target",
      hint: "Use hash map for O(n) solution"
    },
    {
      name: "Maximum Subarray",
      difficulty: "Medium",
      description: "Find contiguous subarray with maximum sum",
      hint: "Kadane's algorithm - track current and global max"
    },
    {
      name: "Product of Array Except Self",
      difficulty: "Medium",
      description: "Compute product of all elements except current",
      hint: "Use prefix and suffix products"
    },
    {
      name: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      description: "Find minimum element in rotated sorted array",
      hint: "Binary search with rotation point detection"
    },
    {
      name: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      description: "Search target in rotated sorted array",
      hint: "Determine which half is sorted, then search"
    }
  ];

  // const renderComplexityBadge = (complexity) => {
  //   if (!complexity) return null;

  //   let color = "bg-gray-100 text-gray-800";
  //   if (complexity.includes("O(1)")) color = "bg-green-100 text-green-800";
  //   if (complexity.includes("O(log n)")) color = "bg-blue-100 text-blue-800";
  //   if (complexity.includes("O(n)") && !complexity.includes("n log")) color = "bg-yellow-100 text-yellow-800";
  //   if (complexity.includes("O(n²)") || complexity.includes("O(n log n)")) color = "bg-red-100 text-red-800";

  //   return (
  //     <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
  //       {complexity}
  //     </span>
  //   );
  // };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Arrays & Dynamic Arrays
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the fundamental data structure - arrays, their operations, algorithms, and memory management techniques.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("theory")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "theory"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Theory
            </button>
            <button
              onClick={() => setActiveSection("operations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "operations"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveSection("manipulation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "manipulation"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Manipulation
            </button>
            <button
              onClick={() => setActiveSection("algorithms")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "algorithms"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Algorithms
            </button>
            <button
              onClick={() => setActiveSection("multidim")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "multidim"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              2D Arrays
            </button>
            <button
              onClick={() => setActiveSection("dynamic")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "dynamic"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Dynamic Arrays
            </button>
          </div>

          {/* Theory Section */}
          {activeSection === "theory" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Array Theory & Deep Concepts</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Memory Layout & Cache Behavior */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">Memory Layout & Cache Behavior</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Contiguous Memory Allocation</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Arrays allocate memory as a contiguous block of bytes. This means:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-blue-400 mr-2">📍</span>
                              <span><strong>Sequential Addresses:</strong> Elements stored at consecutive memory addresses</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-400 mr-2">⚡</span>
                              <span><strong>Formula:</strong> Address of arr[i] = base_address + (i × element_size)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-400 mr-2">🎯</span>
                              <span><strong>Pointer Arithmetic:</strong> arr[i] ≡ *(arr + i) in C/C++</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Cache Performance</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Arrays excel in modern computer architectures due to:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2">🚀</span>
                              <span><strong>Spatial Locality:</strong> Accessing arr[i] loads nearby elements into cache</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2">💾</span>
                              <span><strong>Cache Lines:</strong> Multiple elements loaded together (typically 64 bytes)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2">⚡</span>
                              <span><strong>Prefetching:</strong> CPU predicts and loads sequential access patterns</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Cache Miss Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-green-400 font-medium mb-2">✅ Cache Hits (Good)</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Sequential access: O(1) per element</li>
                            <li>• Local access patterns</li>
                            <li>• Small working sets</li>
                          </ul>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-red-400 font-medium mb-2">❌ Cache Misses (Bad)</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Random access patterns</li>
                            <li>• Large stride jumps</li>
                            <li>• Sparse data access</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Array Bounds & Safety */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">Array Bounds Checking & Memory Safety</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Bounds Checking Trade-offs</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Runtime Bounds Checking</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Prevents buffer overflows</li>
                              <li>• Memory safety guarantee</li>
                              <li>• Performance overhead: O(1) per access</li>
                              <li>• Used in: Java, Python, Rust</li>
                            </ul>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-red-400 font-medium mb-2">No Bounds Checking</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Maximum performance</li>
                              <li>• Direct memory access</li>
                              <li>• Risk of undefined behavior</li>
                              <li>• Used in: C, C++ (by default)</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Memory Safety Issues</h4>
                        <div className="space-y-4 text-gray-300">
                          <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                            <h5 className="text-red-400 font-medium mb-2">Buffer Overflow</h5>
                            <p className="text-sm mb-2">Writing beyond array bounds:</p>
                            <pre className="bg-gray-900 text-red-300 p-2 rounded text-xs">
                              <code>int arr[5]; arr[10] = 42; // Undefined behavior</code>
                            </pre>
                            <p className="text-xs text-gray-400">Can overwrite other variables, cause crashes, or security vulnerabilities</p>
                          </div>

                          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
                            <h5 className="text-yellow-400 font-medium mb-2">Off-by-One Errors</h5>
                            <p className="text-sm mb-2">Common indexing mistakes:</p>
                              <pre className="bg-gray-900 text-yellow-300 p-2 rounded text-xs">
                                <code>{`for(int i = 0; i <= n; i++) // Wrong: accesses arr[n]`}</code>
                              </pre>
                            <p className="text-xs text-gray-400">Valid indices: 0 to n-1 for array of size n</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Array vs Other Structures */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">Arrays vs Other Data Structures</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Arrays</th>
                            <th className="pb-4 text-green-400 text-lg font-bold">Linked Lists</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">Dynamic Arrays</th>
                            <th className="pb-4 text-orange-400 text-lg font-bold">Hash Tables</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Memory Layout</td>
                            <td className="py-4 text-blue-400 font-medium">Contiguous</td>
                            <td className="py-4 text-green-400 font-medium">Scattered</td>
                            <td className="py-4 text-purple-400 font-medium">Contiguous (resizable)</td>
                            <td className="py-4 text-orange-400 font-medium">Hash-based</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Access Time</td>
                            <td className="py-4 text-green-400 font-medium">O(1)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-green-400 font-medium">O(1)</td>
                            <td className="py-4 text-green-400 font-medium">O(1)*</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Insert/Delete</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-green-400 font-medium">O(1)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)/O(1)*</td>
                            <td className="py-4 text-green-400 font-medium">O(1)*</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Memory Overhead</td>
                            <td className="py-4 text-green-400 font-medium">None</td>
                            <td className="py-4 text-red-400 font-medium">High (pointers)</td>
                            <td className="py-4 text-yellow-400 font-medium">Low (amortized)</td>
                            <td className="py-4 text-yellow-400 font-medium">Medium</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Cache Performance</td>
                            <td className="py-4 text-green-400 font-medium">Excellent</td>
                            <td className="py-4 text-red-400 font-medium">Poor</td>
                            <td className="py-4 text-green-400 font-medium">Good</td>
                            <td className="py-4 text-yellow-400 font-medium">Varies</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-blue-400 transition-all duration-300">Use Case</td>
                            <td className="py-4 text-blue-400 font-medium">Fixed-size, random access</td>
                            <td className="py-4 text-green-400 font-medium">Dynamic size, frequent inserts</td>
                            <td className="py-4 text-purple-400 font-medium">Growing collections</td>
                            <td className="py-4 text-orange-400 font-medium">Key-value lookups</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 text-sm text-gray-400">
                      * Average case, amortized, or with good hash function
                    </div>
                  </div>
                </div>

                {/* Mathematical Analysis */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">Mathematical Analysis of Array Operations</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Time Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Access Operation: O(1)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Mathematical Basis:</strong></p>
                              <p>• Direct memory address calculation</p>
                              <p>• Address = base + (index × element_size)</p>
                              <p>• No loops or iterations required</p>
                              <p>• Constant time regardless of array size</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-yellow-400 font-medium mb-2">Search Operation: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Worst Case:</strong> Element not found</p>
                              <p>• Must check all n elements</p>
                              <p>• Linear time proportional to size</p>
                              <p>• Best case: O(1) if first element</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Space Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-blue-400 font-medium mb-2">Static Arrays: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Space Usage:</strong></p>
                              <p>• Fixed size: n × element_size bytes</p>
                              <p>• No extra space for metadata</p>
                              <p>• Memory allocated at compile time</p>
                              <p>• Stack or static memory section</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Dynamic Arrays: O(n) amortized</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Space Analysis:</strong></p>
                              <p>• Capacity ≥ size, often 1.5-2× size</p>
                              <p>• Amortized O(1) space per element</p>
                              <p>• Periodic resizing operations</p>
                              <p>• Memory fragmentation possible</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Asymptotic Analysis Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg mb-2">O(1) Operations</div>
                          <div className="text-gray-300 text-sm">Access, Update, Push/Pop (end)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-lg mb-2">O(n) Operations</div>
                          <div className="text-gray-300 text-sm">Search, Insert, Delete, Traverse</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold text-lg mb-2">O(log n) Operations</div>
                          <div className="text-gray-300 text-sm">Binary search (sorted arrays)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Array Applications in Algorithms */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">Arrays in Algorithm Design</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Algorithmic Applications</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Prefix Sum Arrays</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• prefix[i] = sum of first i elements</p>
                              <p>• Range queries in O(1) time</p>
                              <p>• Used in: Range sum, equilibrium point</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Difference Arrays</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Efficient range updates</p>
                              <p>• Add k to range [L,R] in O(1)</p>
                              <p>• Used in: Lazy propagation concepts</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Two Pointer Technique</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Maintain two indices simultaneously</p>
                              <p>• O(n) time for many problems</p>
                              <p>• Used in: Palindrome, pair sum, etc.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Advanced Techniques</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Sliding Window</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Fixed/variable size windows</p>
                              <p>• O(n) time complexity</p>
                              <p>• Used in: Maximum sum, string problems</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Dutch National Flag</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• 3-way partitioning</p>
                              <p>• O(n) time, O(1) space</p>
                              <p>• Used in: Quick sort, 3-sum problems</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Kadane's Algorithm</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Maximum subarray sum</p>
                              <p>• Dynamic programming approach</p>
                              <p>• O(n) time, O(1) space</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-green-400 mb-4">Why Arrays are Fundamental</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Algorithm Building Blocks</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Base for sorting algorithms</li>
                            <li>• Foundation for dynamic programming</li>
                            <li>• Core of graph representations</li>
                            <li>• Essential for numerical computing</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">System-Level Importance</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Memory management understanding</li>
                            <li>• Cache behavior optimization</li>
                            <li>• Pointer arithmetic foundation</li>
                            <li>• Low-level programming basis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Arrays Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">What are Arrays?</h3>
                  <p className="text-gray-300 mb-6">
                    Arrays are contiguous blocks of memory that store elements of the same type.
                    They provide O(1) access time and are the foundation of most data structures
                    and algorithms. Understanding arrays is crucial for efficient programming.
                  </p>

                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">⚡</span>
                      <span><strong>Fast Access:</strong> O(1) time for element access by index</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">📏</span>
                      <span><strong>Fixed Size:</strong> Size determined at creation (static arrays)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">🔗</span>
                      <span><strong>Contiguous Memory:</strong> Elements stored in adjacent memory locations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">🎯</span>
                      <span><strong>Cache Friendly:</strong> Excellent spatial locality for performance</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Array Types</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Static Arrays</h4>
                      <p className="text-gray-300">Fixed size, stack allocated, size known at compile time</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>int arr[100]; // C++ fixed size</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Dynamic Arrays</h4>
                      <p className="text-gray-300">Resizable, heap allocated, automatic memory management</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>std::vector&lt;int&gt; vec; // C++ dynamic array</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Multi-dimensional</h4>
                      <p className="text-gray-300">Arrays of arrays, matrices, tensors</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>int matrix[3][4]; // 2D array</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-blue-400 mb-3">Time Complexity</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Access: O(1)</li>
                    <li>• Search: O(n)</li>
                    <li>• Insert/Delete: O(n)</li>
                    <li>• Binary Search: O(log n)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">O(n) for elements</p>
                  <p className="text-sm text-gray-400 mt-2">Plus O(1) overhead</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Storing sequential data</li>
                    <li>• Implementing other DS</li>
                    <li>• Matrix operations</li>
                    <li>• Lookup tables</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Operations Section */}
          {activeSection === "operations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Array Operations</h2>

              <div className="grid grid-cols-1 gap-8">
                {operations.map((operation) => (
                  <div
                    key={operation.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{operation.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Time: {operation.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            Space: {operation.complexity.space}
                          </span>
                        </div>
                      </div>

                      {operation.prerequisite && (
                        <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded-lg mb-4">
                          <p className="text-yellow-300 text-sm"><strong>Prerequisite:</strong> {operation.prerequisite}</p>
                        </div>
                      )}

                      <p className="text-gray-300 mb-6">{operation.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manipulation Section */}
          {activeSection === "manipulation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Array Manipulation</h2>

              <div className="grid grid-cols-1 gap-8">
                {manipulation.map((operation) => (
                  <div
                    key={operation.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{operation.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-lg">
                            Time: {operation.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-gray-900/50 text-gray-300 text-sm rounded-lg">
                            Space: {operation.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{operation.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Algorithms Section */}
          {activeSection === "algorithms" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Array Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Time: {algorithm.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            Space: {algorithm.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-dimensional Arrays Section */}
          {activeSection === "multidim" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Multi-dimensional Arrays</h2>

              <div className="grid grid-cols-1 gap-8">
                {multiDimArrays.map((arrayType) => (
                  <div
                    key={arrayType.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{arrayType.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(arrayType.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-yellow-900/50 text-yellow-300 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{arrayType.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{arrayType.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Arrays Section */}
          {activeSection === "dynamic" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Dynamic Arrays (Vectors)</h2>

              <div className="grid grid-cols-1 gap-8">
                {dynamicArrays.map((vectorType) => (
                  <div
                    key={vectorType.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{vectorType.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(vectorType.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{vectorType.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{vectorType.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Array Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Remove Duplicates from Sorted Array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Best Time to Buy and Sell Stock</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Contains Duplicate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Single Number</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Array Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>3Sum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Container With Most Water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Next Permutation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Trapping Rain Water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Find Minimum in Rotated Sorted Array</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Array Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>First Missing Positive</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Median of Two Sorted Arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Maximum Rectangle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Sliding Window Maximum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Largest Rectangle in Histogram</span>
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
                      <span className={`px-2 py-1 text-xs rounded ${
                        problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
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

          {/* Array Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Array Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Access by index:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Linear search:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Binary search:</span>
                    <span className="text-blue-400 font-mono">O(log n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Insert/Delete:</span>
                    <span className="text-red-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Kadane's algorithm:</span>
                    <span className="text-green-400 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Two Pointers:</div>
                    <div className="text-gray-400">→ Opposite ends, same direction</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Sliding Window:</div>
                    <div className="text-gray-400">→ Variable/fixed size windows</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Prefix Sum:</div>
                    <div className="text-gray-400">→ Range queries in O(1)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Binary Search:</div>
                    <div className="text-gray-400">→ Sorted arrays, decision problems</div>
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

export default Arrays;

