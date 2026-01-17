import React, { useState } from "react";
import { Layout } from "../components";

const Sorting = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Comprehensive sorting algorithms data
  const comparisonSorts = [
    {
      id: "bubble",
      name: "Bubble Sort",
      complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
      },
      stable: "Yes",
      inPlace: "Yes",
      adaptive: "Yes",
      description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. Pass through continues until no swaps are needed.",
      code: `void bubble_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization: early termination
    }
}`,
      whenToUse: "Small datasets, nearly sorted data, educational purposes",
      realWorld: "Used in embedded systems with limited memory, teaching sorting concepts"
    },
    {
      id: "selection",
      name: "Selection Sort",
      complexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
      },
      stable: "No",
      inPlace: "Yes",
      adaptive: "No",
      description: "Divides array into sorted and unsorted regions. Repeatedly finds minimum element from unsorted region and places it at the beginning.",
      code: `void selection_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}`,
      whenToUse: "When memory writes are expensive (exactly n-1 swaps)",
      realWorld: "Flash memory systems where write operations are costly"
    },
    {
      id: "insertion",
      name: "Insertion Sort",
      complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
      },
      stable: "Yes",
      inPlace: "Yes",
      adaptive: "Yes",
      description: "Builds final sorted array one item at a time. Much less efficient on large lists than advanced algorithms like quicksort or merge sort.",
      code: `void insertion_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      whenToUse: "Small arrays (<50 elements), nearly sorted data, online algorithms",
      realWorld: "Used in TimSort and IntroSort for small subarrays, real-time systems"
    },
    {
      id: "merge",
      name: "Merge Sort",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)"
      },
      stable: "Yes",
      inPlace: "No",
      adaptive: "No",
      description: "Divide-and-conquer algorithm that divides array into halves, recursively sorts them, and merges the sorted halves.",
      code: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left, k = 0; i <= right; i++, k++) {
        arr[i] = temp[k];
    }
}

void merge_sort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
      whenToUse: "Guaranteed O(n log n), stable sorting required, external sorting",
      realWorld: "Database sorting, external sorting for large files, tape sorting",
      variants: [
        "Bottom-up Merge Sort (Iterative)",
        "3-way Merge Sort",
        "In-place Merge Sort (O(n log² n))",
        "Natural Merge Sort"
      ]
    },
    {
      id: "quick",
      name: "Quick Sort",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)"
      },
      stable: "No",
      inPlace: "Yes",
      adaptive: "No",
      description: "Divide-and-conquer algorithm that selects a 'pivot' element and partitions array around it, recursively sorting partitions.",
      code: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Choose last element as pivot
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quick_sort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}`,
      whenToUse: "General-purpose sorting, average-case performance critical, in-place sorting",
      realWorld: "Default sorting in C++ STL, Java Arrays.sort() for primitives, system utilities",
      variants: [
        "Randomized Quick Sort",
        "3-Way Quick Sort (Dutch National Flag)",
        "Hoare Partition Scheme",
        "Median-of-three pivot selection"
      ]
    },
    {
      id: "heap",
      name: "Heap Sort",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)"
      },
      stable: "No",
      inPlace: "Yes",
      adaptive: "No",
      description: "Comparison-based sorting using binary heap data structure. Divides input into sorted and unsorted regions.",
      code: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(vector<int>& arr) {
    int n = arr.size();
    
    // Build max heap - O(n) time
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
      whenToUse: "Guaranteed O(n log n) with O(1) space, real-time systems, embedded systems",
      realWorld: "Priority queues, real-time operating systems, memory-constrained devices"
    },
    {
      id: "shell",
      name: "Shell Sort",
      complexity: {
        best: "O(n log n)",
        average: "O(n^(3/2))",
        worst: "O(n²)",
        space: "O(1)"
      },
      stable: "No",
      inPlace: "Yes",
      adaptive: "Yes",
      description: "Generalization of insertion sort using gap sequences. Allows exchange of items that are far apart.",
      code: `void shell_sort(vector<int>& arr) {
    int n = arr.size();
    
    // Start with large gap and reduce
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // Perform gapped insertion sort
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}`,
      whenToUse: "Medium-sized arrays, when simple implementation needed",
      realWorld: "Embedded systems, system utilities (uClibc library)",
      variants: [
        "Shell's sequence: n/2, n/4, ..., 1",
        "Knuth's sequence: (3^k - 1)/2",
        "Sedgewick's sequence: 4^k + 3×2^(k-1) + 1",
        "Hibbard's sequence: 2^k - 1"
      ]
    }
  ];

  const linearSorts = [
    {
      id: "counting",
      name: "Counting Sort",
      complexity: {
        best: "O(n + k)",
        average: "O(n + k)",
        worst: "O(n + k)",
        space: "O(k)"
      },
      stable: "Yes",
      inPlace: "No",
      description: "Integer sorting algorithm that counts occurrences of each distinct element. Works when k (range) is not significantly greater than n.",
      code: `void counting_sort(vector<int>& arr) {
    if (arr.empty()) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;
    
    vector<int> count(range, 0);
    vector<int> output(arr.size());
    
    // Count occurrences
    for (int num : arr) {
        count[num - min_val]++;
    }
    
    // Cumulative count (for stability)
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array (traverse backwards for stability)
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    // Copy back
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = output[i];
    }
}`,
      whenToUse: "Small range of integers, when linear time is crucial, k ≈ n",
      realWorld: "Sorting characters/strings, age sorting, rating systems"
    },
    {
      id: "radix",
      name: "Radix Sort",
      complexity: {
        best: "O(d × (n + k))",
        average: "O(d × (n + k))",
        worst: "O(d × (n + k))",
        space: "O(n + k)"
      },
      stable: "Yes",
      inPlace: "No",
      description: "Non-comparative sorting algorithm that sorts integers by processing individual digits. Can be LSD (Least Significant Digit) or MSD (Most Significant Digit).",
      code: `void counting_sort_for_radix(vector<int>& arr, int exp) {
    vector<int> output(arr.size());
    vector<int> count(10, 0);
    
    // Count occurrences of each digit
    for (int num : arr) {
        count[(num / exp) % 10]++;
    }
    
    // Cumulative count
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy back
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = output[i];
    }
}

void radix_sort(vector<int>& arr) {
    if (arr.empty()) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    
    // Sort by each digit
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_for_radix(arr, exp);
    }
}`,
      whenToUse: "Fixed-width integers, large datasets with small digit count",
      realWorld: "Sorting IP addresses, dates, strings of fixed length"
    },
    {
      id: "bucket",
      name: "Bucket Sort",
      complexity: {
        best: "O(n + k)",
        average: "O(n)",
        worst: "O(n²)",
        space: "O(n + k)"
      },
      stable: "Yes",
      inPlace: "No",
      description: "Distribution sort that distributes elements into buckets, sorts each bucket individually, and concatenates results.",
      code: `void bucket_sort(vector<float>& arr) {
    int n = arr.size();
    if (n <= 1) return;
    
    // Create buckets
    vector<vector<float>> buckets(n);
    
    // Distribute elements into buckets
    // Assumes input in [0, 1)
    for (float num : arr) {
        int bucket_idx = n * num;
        buckets[bucket_idx].push_back(num);
    }
    
    // Sort individual buckets
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
    }
    
    // Concatenate buckets
    int idx = 0;
    for (const auto& bucket : buckets) {
        for (float num : bucket) {
            arr[idx++] = num;
        }
    }
}`,
      whenToUse: "Uniformly distributed data, floating-point numbers",
      realWorld: "Sorting decimal numbers, external sorting, parallel sorting"
    }
  ];

  const hybridSorts = [
    {
      id: "tim",
      name: "Tim Sort",
      complexity: {
        best: "O(n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)"
      },
      stable: "Yes",
      inPlace: "No",
      adaptive: "Yes",
      description: "Hybrid stable sorting algorithm derived from merge sort and insertion sort. Used in Python and Java.",
      code: `void tim_sort(vector<int>& arr) {
    int n = arr.size();
    int min_run = 32; // Minimum run size
    
    // Sort individual runs of size min_run using insertion sort
    for (int i = 0; i < n; i += min_run) {
        int end = min(i + min_run - 1, n - 1);
        insertion_sort_range(arr, i, end);
    }
    
    // Start merging runs
    for (int size = min_run; size < n; size *= 2) {
        for (int start = 0; start < n; start += size * 2) {
            int mid = start + size - 1;
            int end = min(start + size * 2 - 1, n - 1);
            
            if (mid < end) {
                merge(arr, start, mid, end);
            }
        }
    }
}`,
      whenToUse: "Real-world applications, when stability and adaptiveness crucial",
      realWorld: "Python's sort(), Java's Arrays.sort() for objects, Android sorting"
    },
    {
      id: "intro",
      name: "Intro Sort",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(log n)"
      },
      stable: "No",
      inPlace: "Yes",
      adaptive: "No",
      description: "Hybrid sorting algorithm that combines quicksort, heapsort, and insertion sort. Starts with quicksort, switches to heapsort when recursion depth exceeds threshold.",
      code: `// Intro Sort combines:
// 1. Quick Sort for good average performance
// 2. Heap Sort when recursion depth exceeds 2*log(n)
// 3. Insertion Sort for small subarrays (< 16 elements)

void intro_sort(vector<int>& arr, int begin, int end, int depth_limit) {
    int size = end - begin;
    
    // Use insertion sort for small arrays
    if (size < 16) {
        insertion_sort_range(arr, begin, end);
        return;
    }
    
    // Switch to heap sort if depth limit exceeded
    if (depth_limit == 0) {
        heap_sort_range(arr, begin, end);
        return;
    }
    
    // Otherwise use quick sort
    int pivot = partition(arr, begin, end);
    intro_sort(arr, begin, pivot, depth_limit - 1);
    intro_sort(arr, pivot + 1, end, depth_limit - 1);
}`,
      whenToUse: "General-purpose sorting, when worst-case guarantee needed with good average performance",
      realWorld: "C++ STL sort(), .NET Framework sort, Rust std::sort"
    }
  ];

  const specialSorts = [
    {
      id: "cycle",
      name: "Cycle Sort",
      complexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
      },
      description: "In-place, unstable sorting algorithm that minimizes the number of memory writes. Useful when write operations are expensive.",
      whenToUse: "Flash memory, EEPROM where writes are costly"
    },
    {
      id: "pancake",
      name: "Pancake Sort",
      complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
      },
      description: "Sorting algorithm that only uses flip operations (reversing elements from 0 to i). Named after flipping pancakes.",
      whenToUse: "Theoretical interest, when only prefix reversals allowed"
    },
    {
      id: "bogo",
      name: "Bogo Sort",
      complexity: {
        best: "O(n)",
        average: "O((n+1)!)",
        worst: "Unbounded",
        space: "O(1)"
      },
      description: "Extremely inefficient sorting algorithm based on generate and test paradigm. Randomly permutes input until sorted.",
      whenToUse: "Never! Educational/humor purposes only"
    }
  ];

  const cheatSheetData = [
    { algorithm: "Bubble Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes", inPlace: "Yes" },
    { algorithm: "Selection Sort", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "No", inPlace: "Yes" },
    { algorithm: "Insertion Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes", inPlace: "Yes" },
    { algorithm: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes", inPlace: "No" },
    { algorithm: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No", inPlace: "Yes" },
    { algorithm: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No", inPlace: "Yes" },
    { algorithm: "Counting Sort", best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)", stable: "Yes", inPlace: "No" },
    { algorithm: "Radix Sort", best: "O(d(n+k))", avg: "O(d(n+k))", worst: "O(d(n+k))", space: "O(n+k)", stable: "Yes", inPlace: "No" },
    { algorithm: "Bucket Sort", best: "O(n+k)", avg: "O(n)", worst: "O(n²)", space: "O(n)", stable: "Yes", inPlace: "No" },
    { algorithm: "Shell Sort", best: "O(n log n)", avg: "O(n^1.5)", worst: "O(n²)", space: "O(1)", stable: "No", inPlace: "Yes" },
    { algorithm: "Tim Sort", best: "O(n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes", inPlace: "No" },
    { algorithm: "Intro Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(log n)", stable: "No", inPlace: "Yes" }
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
    if (complexity.includes("log")) color = "bg-blue-100 text-blue-800";
    if (complexity === "O(1)") color = "bg-green-100 text-green-800";
    if (complexity.includes("n") && !complexity.includes("log")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("n²") || complexity.includes("n^2")) color = "bg-red-100 text-red-800";
    if (complexity.includes("k")) color = "bg-purple-100 text-purple-800";

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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sorting Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master all sorting algorithms from basic to advanced: theory, implementations, complexity analysis, and real-world applications.
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
              onClick={() => setActiveSection("comparison")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "comparison"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Comparison Sorts
            </button>
            <button
              onClick={() => setActiveSection("linear")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "linear"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Linear-Time Sorts
            </button>
            <button
              onClick={() => setActiveSection("hybrid")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "hybrid"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Hybrid Sorts
            </button>
            <button
              onClick={() => setActiveSection("cheatsheet")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "cheatsheet"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Cheat Sheet
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Sorting Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">What is Sorting?</h3>
                  <p className="text-gray-300 mb-6">
                    Sorting is the process of arranging elements in a specific order (ascending or descending). It's one of the most fundamental operations in computer science, serving as a building block for many other algorithms.
                  </p>

                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Key Concepts</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Comparison Model Lower Bound:</strong> Any comparison-based sorting algorithm requires Ω(n log n) comparisons in the worst case.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Stability:</strong> Stable sorts maintain relative order of equal elements. Critical for multi-key sorting.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>In-Place:</strong> Algorithm uses O(1) extra space (excluding input array).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Adaptive:</strong> Algorithm performs better on partially sorted input.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Important:</strong> No algorithm can be Stable + In-place + O(n log n) simultaneously!</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Classification</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Simple O(n²) Sorts</h4>
                      <p className="text-gray-300">Bubble, Selection, Insertion Sort</p>
                      <p className="text-sm text-gray-400 mt-2">Best for: Small datasets, nearly sorted data, educational purposes</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Efficient O(n log n) Sorts</h4>
                      <p className="text-gray-300">Merge, Quick, Heap Sort</p>
                      <p className="text-sm text-gray-400 mt-2">Best for: General-purpose sorting, large datasets</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Linear Time Sorts O(n)</h4>
                      <p className="text-gray-300">Counting, Radix, Bucket Sort</p>
                      <p className="text-sm text-gray-400 mt-2">Best for: Integer/fixed-range data, specific constraints</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Hybrid Sorts</h4>
                      <p className="text-gray-300">Tim Sort, Intro Sort</p>
                      <p className="text-sm text-gray-400 mt-2">Best for: Real-world applications, production systems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Sorts Section */}
          {activeSection === "comparison" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Comparison-Based Sorting Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {comparisonSorts.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Stable: {algorithm.stable}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            In-Place: {algorithm.inPlace}
                          </span>
                          {algorithm.adaptive && (
                            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                              Adaptive: {algorithm.adaptive}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      {algorithm.variants && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-blue-400 mb-3">Variants</h4>
                          <div className="flex flex-wrap gap-2">
                            {algorithm.variants.map((variant, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                                {variant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-400 mb-3">Time & Space Complexity</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Best Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.best)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>

                          {algorithm.whenToUse && (
                            <div className="mt-4 bg-blue-900/20 border border-blue-700/50 p-3 rounded-lg">
                              <p className="text-blue-300 text-sm"><strong>When to use:</strong> {algorithm.whenToUse}</p>
                            </div>
                          )}

                          {algorithm.realWorld && (
                            <div className="mt-4 bg-green-900/20 border border-green-700/50 p-3 rounded-lg">
                              <p className="text-green-300 text-sm"><strong>Real-world:</strong> {algorithm.realWorld}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-blue-400 mb-3">C++ Implementation</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                            <code>{algorithm.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linear-Time Sorts Section */}
          {activeSection === "linear" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Linear-Time Sorting Algorithms</h2>

              <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg mb-8">
                <p className="text-yellow-300">
                  <strong>⚡ Key Insight:</strong> These algorithms break the O(n log n) comparison-based sorting lower bound by using non-comparison techniques. They work only under specific constraints (integer range, digit count, etc.).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {linearSorts.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                            Non-Comparison
                          </span>
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Stable: {algorithm.stable}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            In-Place: {algorithm.inPlace}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Time & Space Complexity</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Best Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.best)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>

                          {algorithm.whenToUse && (
                            <div className="mt-4 bg-purple-900/20 border border-purple-700/50 p-3 rounded-lg">
                              <p className="text-purple-300 text-sm"><strong>When to use:</strong> {algorithm.whenToUse}</p>
                            </div>
                          )}

                          {algorithm.realWorld && (
                            <div className="mt-4 bg-green-900/20 border border-green-700/50 p-3 rounded-lg">
                              <p className="text-green-300 text-sm"><strong>Real-world:</strong> {algorithm.realWorld}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">C++ Implementation</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                            <code>{algorithm.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hybrid Sorts Section */}
          {activeSection === "hybrid" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hybrid Sorting Algorithms</h2>

              <div className="bg-cyan-900/20 border border-cyan-700/50 p-4 rounded-lg mb-8">
                <p className="text-cyan-300">
                  <strong>🚀 Production-Ready:</strong> These hybrid algorithms combine multiple sorting techniques to achieve optimal real-world performance. Used in production systems like Python, Java, C++, and Rust.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {hybridSorts.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-300 text-sm rounded-lg">
                            Hybrid Algorithm
                          </span>
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Stable: {algorithm.stable}
                          </span>
                          {algorithm.adaptive && (
                            <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                              Adaptive: {algorithm.adaptive}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Time & Space Complexity</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Best Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.best)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst Case</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono mt-1">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>

                          {algorithm.whenToUse && (
                            <div className="mt-4 bg-cyan-900/20 border border-cyan-700/50 p-3 rounded-lg">
                              <p className="text-cyan-300 text-sm"><strong>When to use:</strong> {algorithm.whenToUse}</p>
                            </div>
                          )}

                          {algorithm.realWorld && (
                            <div className="mt-4 bg-green-900/20 border border-green-700/50 p-3 rounded-lg">
                              <p className="text-green-300 text-sm"><strong>Real-world:</strong> {algorithm.realWorld}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                            <code>{algorithm.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Sorts Note */}
              <div className="mt-12 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Other Notable Sorting Algorithms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {specialSorts.map((algorithm) => (
                    <div key={algorithm.id} className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">{algorithm.name}</h4>
                      <p className="text-gray-300 text-sm mb-3">{algorithm.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-400">Best:</span>
                          <span className="ml-2 text-white">{renderComplexityBadge(algorithm.complexity.best)}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400">Worst:</span>
                          <span className="ml-2 text-white">{renderComplexityBadge(algorithm.complexity.worst)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        <strong>Use case:</strong> {algorithm.whenToUse}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cheat Sheet Section */}
          {activeSection === "cheatsheet" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Sorting Algorithms Cheat Sheet</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-4 text-gray-200 text-lg font-bold">Algorithm</th>
                      <th className="pb-4 text-green-400 text-lg font-bold">Best</th>
                      <th className="pb-4 text-cyan-400 text-lg font-bold">Average</th>
                      <th className="pb-4 text-red-400 text-lg font-bold">Worst</th>
                      <th className="pb-4 text-purple-400 text-lg font-bold">Space</th>
                      <th className="pb-4 text-blue-400 text-lg font-bold">Stable</th>
                      <th className="pb-4 text-yellow-400 text-lg font-bold">In-Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cheatSheetData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-gray-700/30 transition-all duration-300"
                      >
                        <td className="py-4 text-white font-medium">{row.algorithm}</td>
                        <td className="py-4">{renderComplexityBadge(row.best)}</td>
                        <td className="py-4">{renderComplexityBadge(row.avg)}</td>
                        <td className="py-4">{renderComplexityBadge(row.worst)}</td>
                        <td className="py-4">{renderComplexityBadge(row.space)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.stable === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                            {row.stable}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.inPlace === "Yes" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                            }`}>
                            {row.inPlace}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Decision Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Small Arrays (n &lt; 50)</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Insertion Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">Simple, adaptive, works great for small datasets</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">🎯 General Purpose</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Quick Sort</strong> or <strong className="text-white">Intro Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">Excellent average performance, cache-friendly</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">🔒 Stability Required</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Merge Sort</strong> or <strong className="text-white">Tim Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">Guaranteed stable with O(n log n) time</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">💾 Memory Constrained</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Heap Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">O(n log n) time with O(1) extra space</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">⚡ Integer Range Small</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Counting Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">O(n + k) when k ≈ n, linear time</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">🔢 Fixed-Width Integers</h4>
                    <p className="text-gray-300">Use <strong className="text-white">Radix Sort</strong></p>
                    <p className="text-sm text-gray-400 mt-2">O(d(n+k)), great for large datasets</p>
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
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Beginner</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement bubble, selection, insertion sort</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Sort array of strings by length</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Find minimum swaps to sort array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement merge sort iteratively</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Intermediate</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Sort colors (Dutch National Flag)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Merge K sorted arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Count inversions in array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Kth largest element (QuickSelect)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Sort by frequency</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Advanced</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>External sorting (k-way merge)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Sort linked list in O(n log n)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Implement intro sort</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Parallel merge sort</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Common Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Common Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Conceptual</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Why is comparison-based sorting O(n log n) lower bound?</li>
                    <li>• Explain stability and why it matters</li>
                    <li>• When would you use quicksort vs merge sort?</li>
                    <li>• Can an algorithm be stable, in-place, and O(n log n)?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Implementation</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Implement 3-way quicksort</li>
                    <li>• Sort 0s, 1s, 2s in one pass</li>
                    <li>• Merge two sorted arrays in-place</li>
                    <li>• Sort nearly sorted array efficiently</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sorting;

