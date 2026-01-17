import React, { useState } from "react";
import { Layout } from "../components";

const HashSets = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // HashSet Implementations
  const implementations = [
    {
      id: "stl-unordered-set",
      name: "STL unordered_set",
      description: "C++ standard library hash set implementation with automatic memory management",
      complexity: { insert: "O(1) avg", contains: "O(1) avg", erase: "O(1) avg", size: "O(1)" },
      features: ["Automatic resizing", "Memory management", "Iterator support", "Standard interface"],
      code: `// STL unordered_set usage
#include <unordered_set>
#include <string>
#include <iostream>

void demonstrateUnorderedSet() {
    // Create unordered_set with string elements
    std::unordered_set<std::string> names;

    // Insert elements
    names.insert("Alice");
    names.insert("Bob");
    names.emplace("Charlie");

    // Check if element exists
    if (names.find("Alice") != names.end()) {
        std::cout << "Alice found" << std::endl;
    }

    // Count elements (0 or 1 for sets)
    if (names.count("Bob") > 0) {
        std::cout << "Bob exists" << std::endl;
    }

    // Iterate through all elements
    std::cout << "All names:" << std::endl;
    for (const auto& name : names) {
        std::cout << name << std::endl;
    }

    // Erase elements
    names.erase("Charlie");

    // Size and capacity
    std::cout << "Size: " << names.size() << std::endl;
    std::cout << "Bucket count: " << names.bucket_count() << std::endl;
    std::cout << "Load factor: " << names.load_factor() << std::endl;

    // Clear all elements
    names.clear();
}`,
      advantages: ["Easy to use", "Automatic memory management", "Rich API", "Standard library support"],
      disadvantages: ["Less control over internals", "Overhead of standard library", "May not be optimal for specific use cases"]
    },
    {
      id: "custom-hashset",
      name: "Custom HashSet Implementation",
      description: "Complete custom implementation with separate chaining for educational purposes",
      complexity: { insert: "O(1) avg", contains: "O(1) avg", erase: "O(1) avg", size: "O(1)" },
      features: ["Full control over implementation", "Educational value", "Customizable hash functions", "Memory efficient"],
      code: `// Custom HashSet with separate chaining
template<typename T>
class CustomHashSet {
private:
    struct HashNode {
        T data;
        HashNode* next;

        HashNode(const T& value) : data(value), next(nullptr) {}
    };

    std::vector<HashNode*> buckets;
    size_t capacity;
    size_t size;
    double loadFactorThreshold;

    size_t hashFunction(const T& key) const {
        return std::hash<T>()(key) % capacity;
    }

    void resize(size_t newCapacity) {
        std::vector<HashNode*> newBuckets(newCapacity, nullptr);

        // Rehash all existing elements
        for (size_t i = 0; i < capacity; ++i) {
            HashNode* current = buckets[i];
            while (current) {
                size_t newIndex = std::hash<T>()(current->data) % newCapacity;

                // Move to new bucket (maintain original links)
                HashNode* next = current->next;
                current->next = newBuckets[newIndex];
                newBuckets[newIndex] = current;

                current = next;
            }
        }

        buckets = std::move(newBuckets);
        capacity = newCapacity;
    }

public:
    CustomHashSet(size_t initialCapacity = 16, double threshold = 0.75)
        : capacity(initialCapacity), size(0), loadFactorThreshold(threshold) {
        buckets.resize(capacity, nullptr);
    }

    ~CustomHashSet() {
        clear();
    }

    // Insert element - returns true if inserted, false if already exists
    bool insert(const T& value) {
        size_t index = hashFunction(value);
        HashNode* current = buckets[index];

        // Check if element already exists
        while (current) {
            if (current->data == value) {
                return false; // Already exists
            }
            current = current->next;
        }

        // Insert at head
        HashNode* newNode = new HashNode(value);
        newNode->next = buckets[index];
        buckets[index] = newNode;
        size++;

        // Check load factor and resize if needed
        if (static_cast<double>(size) / capacity > loadFactorThreshold) {
            resize(capacity * 2);
        }

        return true;
    }

    // Check if element exists
    bool contains(const T& value) const {
        size_t index = hashFunction(value);
        HashNode* current = buckets[index];

        while (current) {
            if (current->data == value) {
                return true;
            }
            current = current->next;
        }

        return false;
    }

    // Remove element - returns true if removed, false if not found
    bool erase(const T& value) {
        size_t index = hashFunction(value);
        HashNode* current = buckets[index];
        HashNode* prev = nullptr;

        while (current) {
            if (current->data == value) {
                if (prev) {
                    prev->next = current->next;
                } else {
                    buckets[index] = current->next;
                }

                delete current;
                size--;
                return true;
            }

            prev = current;
            current = current->next;
        }

        return false;
    }

    // Get all elements
    std::vector<T> elements() const {
        std::vector<T> result;
        result.reserve(size);

        for (size_t i = 0; i < capacity; ++i) {
            HashNode* current = buckets[i];
            while (current) {
                result.push_back(current->data);
                current = current->next;
            }
        }

        return result;
    }

    // Clear all elements
    void clear() {
        for (size_t i = 0; i < capacity; ++i) {
            HashNode* current = buckets[i];
            while (current) {
                HashNode* temp = current;
                current = current->next;
                delete temp;
            }
            buckets[i] = nullptr;
        }
        size = 0;
    }

    // Set operations
    CustomHashSet<T> setUnion(const CustomHashSet<T>& other) const {
        CustomHashSet<T> result(capacity);

        // Add all elements from this set
        for (const auto& elem : elements()) {
            result.insert(elem);
        }

        // Add all elements from other set
        for (const auto& elem : other.elements()) {
            result.insert(elem);
        }

        return result;
    }

    CustomHashSet<T> setIntersection(const CustomHashSet<T>& other) const {
        CustomHashSet<T> result(capacity);

        // Add elements that exist in both sets
        for (const auto& elem : elements()) {
            if (other.contains(elem)) {
                result.insert(elem);
            }
        }

        return result;
    }

    CustomHashSet<T> setDifference(const CustomHashSet<T>& other) const {
        CustomHashSet<T> result(capacity);

        // Add elements that exist in this set but not in other
        for (const auto& elem : elements()) {
            if (!other.contains(elem)) {
                result.insert(elem);
            }
        }

        return result;
    }

    // Utility functions
    size_t getSize() const { return size; }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size) / capacity; }
    bool isEmpty() const { return size == 0; }
};`,
      advantages: ["Complete control over implementation", "Educational value", "Memory efficient", "Customizable behavior"],
      disadvantages: ["Manual memory management", "More complex to implement", "Potential for bugs"]
    }
  ];

  // HashSet Operations
  const operations = [
    {
      id: "basic-operations",
      name: "Basic Set Operations",
      description: "Core operations for adding, removing, and checking elements",
      code: `// Basic HashSet operations
std::unordered_set<std::string> fruits;

// Insert elements
fruits.insert("apple");
fruits.insert("banana");
fruits.emplace("cherry");  // More efficient for complex types

// Check existence
bool hasApple = fruits.count("apple") > 0;     // Returns 0 or 1
bool hasOrange = fruits.contains("orange");     // C++20, cleaner

// Find element
auto it = fruits.find("banana");
if (it != fruits.end()) {
    std::cout << "Found: " << *it << std::endl;
}

// Erase elements
fruits.erase("cherry");                    // Erase by value
auto it2 = fruits.find("apple");
if (it2 != fruits.end()) {
    fruits.erase(it2);                     // Erase by iterator
}

// Size operations
std::cout << "Size: " << fruits.size() << std::endl;
std::cout << "Empty: " << fruits.empty() << std::endl;
std::cout << "Max size: " << fruits.max_size() << std::endl;

// Clear all elements
fruits.clear();

// Bulk operations
std::vector<std::string> moreFruits = {"date", "elderberry", "fig"};
fruits.insert(moreFruits.begin(), moreFruits.end());`,
      explanation: "HashSet provides efficient operations for membership testing and unique element storage."
    },
    {
      id: "iteration",
      name: "Iteration and Traversal",
      description: "Different ways to iterate through hash set elements",
      code: `// HashSet iteration methods
std::unordered_set<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// Method 1: Range-based for loop (recommended)
std::cout << "Range-based iteration:" << std::endl;
for (const auto& num : numbers) {
    std::cout << num << " ";
}
std::cout << std::endl;

// Method 2: Iterator-based loop
std::cout << "Iterator-based iteration:" << std::endl;
for (auto it = numbers.begin(); it != numbers.end(); ++it) {
    std::cout << *it << " ";
}
std::cout << std::endl;

// Method 3: Reverse iteration
std::cout << "Reverse iteration:" << std::endl;
for (auto it = numbers.rbegin(); it != numbers.rend(); ++it) {
    std::cout << *it << " ";
}
std::cout << std::endl;

// Method 4: Bucket-wise iteration (for debugging)
std::cout << "Bucket-wise iteration:" << std::endl;
for (size_t i = 0; i < numbers.bucket_count(); ++i) {
    std::cout << "Bucket " << i << ": ";
    for (auto it = numbers.begin(i); it != numbers.end(i); ++it) {
        std::cout << "(" << *it << ") ";
    }
    std::cout << std::endl;
}

// Conditional operations during iteration
std::cout << "Even numbers:" << std::endl;
for (const auto& num : numbers) {
    if (num % 2 == 0) {
        std::cout << num << " ";
    }
}
std::cout << std::endl;

// Transform and collect
std::vector<int> squared;
for (const auto& num : numbers) {
    squared.push_back(num * num);
}
std::cout << "Squared numbers: ";
for (int sq : squared) {
    std::cout << sq << " ";
}
std::cout << std::endl;`,
      explanation: "HashSet supports various iteration patterns including bucket-wise iteration for performance analysis."
    },
    {
      id: "set-operations",
      name: "Set Operations",
      description: "Mathematical set operations like union, intersection, and difference",
      code: `// Set operations with unordered_set
std::unordered_set<int> setA = {1, 2, 3, 4, 5};
std::unordered_set<int> setB = {4, 5, 6, 7, 8};

// Union: elements in setA OR setB
std::unordered_set<int> unionSet;
unionSet.insert(setA.begin(), setA.end());
unionSet.insert(setB.begin(), setB.end());

std::cout << "Union: ";
for (int x : unionSet) std::cout << x << " ";
std::cout << std::endl;

// Intersection: elements in setA AND setB
std::unordered_set<int> intersectionSet;
for (int x : setA) {
    if (setB.count(x)) {
        intersectionSet.insert(x);
    }
}

std::cout << "Intersection: ";
for (int x : intersectionSet) std::cout << x << " ";
std::cout << std::endl;

// Difference: elements in setA but NOT in setB
std::unordered_set<int> differenceSet;
for (int x : setA) {
    if (setB.count(x) == 0) {
        differenceSet.insert(x);
    }
}

std::cout << "Difference (A - B): ";
for (int x : differenceSet) std::cout << x << " ";
std::cout << std::endl;

// Symmetric difference: elements in setA XOR setB
std::unordered_set<int> symmetricDiff;
for (int x : setA) {
    if (setB.count(x) == 0) {
        symmetricDiff.insert(x);
    }
}
for (int x : setB) {
    if (setA.count(x) == 0) {
        symmetricDiff.insert(x);
    }
}

std::cout << "Symmetric difference: ";
for (int x : symmetricDiff) std::cout << x << " ";
std::cout << std::endl;

// Subset check
bool isSubset = true;
for (int x : setA) {
    if (setB.count(x) == 0) {
        isSubset = false;
        break;
    }
}
std::cout << "A is subset of B: " << (isSubset ? "true" : "false") << std::endl;

// Equality check
bool areEqual = (setA.size() == setB.size());
if (areEqual) {
    for (int x : setA) {
        if (setB.count(x) == 0) {
            areEqual = false;
            break;
        }
    }
}
std::cout << "Sets are equal: " << (areEqual ? "true" : "false") << std::endl;`,
      explanation: "HashSet enables efficient mathematical set operations due to fast membership testing."
    },
    {
      id: "advanced-operations",
      name: "Advanced Operations",
      description: "Complex operations and performance monitoring",
      code: `// Advanced HashSet operations
std::unordered_set<std::string> words = {"apple", "banana", "cherry", "date"};

// Performance monitoring
std::cout << "=== Performance Statistics ===" << std::endl;
std::cout << "Size: " << words.size() << std::endl;
std::cout << "Bucket count: " << words.bucket_count() << std::endl;
std::cout << "Load factor: " << words.load_factor() << std::endl;
std::cout << "Max load factor: " << words.max_load_factor() << std::endl;

// Bucket analysis
std::cout << "=== Bucket Analysis ===" << std::endl;
for (size_t i = 0; i < words.bucket_count(); ++i) {
    size_t bucketSize = words.bucket_size(i);
    if (bucketSize > 0) {
        std::cout << "Bucket " << i << ": " << bucketSize << " elements" << std::endl;
    }
}

// Manual rehashing
words.rehash(32); // Force resize to 32 buckets
std::cout << "After rehash - Bucket count: " << words.bucket_count() << std::endl;

// Reserve capacity
words.reserve(64); // Reserve space for at least 64 elements
std::cout << "After reserve - Bucket count: " << words.bucket_count() << std::endl;

// Custom hash function for complex types
struct Person {
    std::string name;
    int age;

    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

struct PersonHash {
    size_t operator()(const Person& p) const {
        return std::hash<std::string>()(p.name) ^
               std::hash<int>()(p.age);
    }
};

std::unordered_set<Person, PersonHash> people;
people.insert({"Alice", 30});
people.insert({"Bob", 25});
people.insert({"Alice", 30}); // Duplicate, won't be inserted

std::cout << "People count: " << people.size() << std::endl; // 2

// Using custom equality function (alternative approach)
struct PersonEqual {
    bool operator()(const Person& a, const Person& b) const {
        return a.name == b.name && a.age == b.age;
    }
};

// With both custom hash and equality
std::unordered_set<Person, PersonHash, PersonEqual> people2;
people2.insert({"Charlie", 35});

// Set algorithms
std::cout << "=== Set Algorithms ===" << std::endl;
std::unordered_set<int> set1 = {1, 2, 3, 4, 5};
std::unordered_set<int> set2 = {4, 5, 6, 7, 8};

// Check if element exists in any set
auto existsInEither = [](const auto& s1, const auto& s2, auto value) {
    return s1.count(value) || s2.count(value);
};

std::cout << "5 exists in set1 or set2: "
          << (existsInEither(set1, set2, 5) ? "yes" : "no") << std::endl;

// Find unique elements across multiple sets
std::unordered_set<int> allUnique;
for (int x : set1) allUnique.insert(x);
for (int x : set2) allUnique.insert(x);

std::cout << "Unique elements across both sets: ";
for (int x : allUnique) std::cout << x << " ";
std::cout << std::endl;`,
      explanation: "Advanced operations including performance monitoring, custom types, and set algorithms."
    }
  ];

  // HashSet Applications
  const applications = [
    {
      id: "duplicate-detection",
      name: "Duplicate Detection",
      description: "Fast detection of duplicate elements in collections",
      example: "Finding unique elements, removing duplicates from arrays",
      code: `std::vector<int> removeDuplicates(const std::vector<int>& arr) {
    std::unordered_set<int> seen;
    std::vector<int> result;

    for (int num : arr) {
        if (seen.insert(num).second) { // insert returns pair<iterator, bool>
            result.push_back(num);     // Only add if not already present
        }
    }

    return result;
}

// Example usage
std::vector<int> arr = {1, 2, 2, 3, 4, 4, 5};
auto unique = removeDuplicates(arr);
// Result: {1, 2, 3, 4, 5}`
    },
    {
      id: "membership-testing",
      name: "Fast Membership Testing",
      description: "Quickly check if an element belongs to a collection",
      example: "Dictionary word validation, IP address filtering",
      code: `class WordDictionary {
private:
    std::unordered_set<std::string> words;

public:
    void addWord(const std::string& word) {
        words.insert(word);
    }

    bool isValidWord(const std::string& word) const {
        return words.count(word) > 0;
    }

    std::vector<std::string> getSuggestions(const std::string& prefix) {
        std::vector<std::string> suggestions;
        for (const auto& word : words) {
            if (word.substr(0, prefix.length()) == prefix) {
                suggestions.push_back(word);
            }
        }
        return suggestions;
    }
};

// Usage
WordDictionary dict;
dict.addWord("apple");
dict.addWord("application");
dict.addWord("apply");

bool isValid = dict.isValidWord("apple"); // true
auto suggestions = dict.getSuggestions("app"); // {"application", "apply"}`
    },
    {
      id: "graph-algorithms",
      name: "Graph Algorithms Support",
      description: "Support for graph traversal and connectivity algorithms",
      example: "BFS/DFS visited tracking, connected components",
      code: `// Graph traversal with visited set
class Graph {
private:
    std::unordered_map<int, std::vector<int>> adjacencyList;

public:
    void addEdge(int u, int v) {
        adjacencyList[u].push_back(v);
        adjacencyList[v].push_back(u); // Undirected
    }

    // BFS traversal
    std::vector<int> bfs(int start) {
        std::vector<int> result;
        std::queue<int> q;
        std::unordered_set<int> visited;

        q.push(start);
        visited.insert(start);

        while (!q.empty()) {
            int current = q.front();
            q.pop();
            result.push_back(current);

            for (int neighbor : adjacencyList[current]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }

        return result;
    }

    // Check if graph is connected
    bool isConnected() {
        if (adjacencyList.empty()) return true;

        auto firstVertex = adjacencyList.begin()->first;
        auto bfsResult = bfs(firstVertex);

        return bfsResult.size() == adjacencyList.size();
    }
};

// Usage
Graph g;
g.addEdge(0, 1);
g.addEdge(1, 2);
g.addEdge(2, 3);

auto traversal = g.bfs(0); // {0, 1, 2, 3}
bool connected = g.isConnected(); // true`
    },
    {
      id: "frequency-analysis",
      name: "Frequency Analysis",
      description: "Count occurrences and analyze frequency distributions",
      example: "Word frequency in text, character counting, analytics",
      code: `std::unordered_map<char, int> getCharacterFrequency(const std::string& text) {
    std::unordered_map<char, int> frequency;

    for (char c : text) {
        if (isalnum(c)) { // Only count alphanumeric characters
            frequency[c]++;
        }
    }

    return frequency;
}

// Find most frequent character
char findMostFrequentChar(const std::string& text) {
    auto frequency = getCharacterFrequency(text);

    char mostFrequent = '\0';
    int maxCount = 0;

    for (const auto& pair : frequency) {
        if (pair.second > maxCount) {
            maxCount = pair.second;
            mostFrequent = pair.first;
        }
    }

    return mostFrequent;
}

// Check if all characters are unique
bool hasUniqueCharacters(const std::string& text) {
    std::unordered_set<char> seen;

    for (char c : text) {
        if (seen.count(c)) {
            return false; // Duplicate found
        }
        seen.insert(c);
    }

    return true;
}

// Example usage
std::string text = "hello world";
auto freq = getCharacterFrequency(text);
// Result: {'h':1, 'e':1, 'l':3, 'o':2, ' ':1, 'w':1, 'r':1, 'd':1}

char mostFreq = findMostFrequentChar(text); // 'l'
bool unique = hasUniqueCharacters("abc"); // true`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Contains Duplicate",
      difficulty: "Easy",
      description: "Check if array contains duplicate elements",
      hint: "Use hash set to track seen elements"
    },
    {
      name: "Single Number",
      difficulty: "Easy",
      description: "Find element that appears only once",
      hint: "Hash set or XOR, but hash set is straightforward"
    },
    {
      name: "Intersection of Two Arrays",
      difficulty: "Easy",
      description: "Find common elements in two arrays",
      hint: "Convert one array to hash set, check other array"
    },
    {
      name: "Happy Number",
      difficulty: "Easy",
      description: "Determine if number is happy",
      hint: "Use hash set to detect cycles"
    },
    {
      name: "Valid Sudoku",
      difficulty: "Medium",
      description: "Check if Sudoku board is valid",
      hint: "Use hash sets for rows, columns, and boxes"
    }
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
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Hash Sets
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Efficient data structures for fast membership testing and unique element storage.
              Master O(1) average-time operations for set operations.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementations"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Implementations
            </button>
            <button
              onClick={() => setActiveSection("operations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "operations"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hash Sets Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">What are Hash Sets?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Hash Sets are data structures that store unique elements with fast O(1) average-time
                    operations for insertion, deletion, and membership testing. They use hash functions
                    to map elements to positions in an underlying array, ensuring efficient operations
                    without storing duplicate values.
                  </p>

                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">🔍</span>
                      <span><strong>Fast Lookup:</strong> O(1) average time membership testing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">🚫</span>
                      <span><strong>Unique Elements:</strong> No duplicate values allowed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">📊</span>
                      <span><strong>Unordered:</strong> Elements are not stored in sorted order</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">⚡</span>
                      <span><strong>Efficient Operations:</strong> Insert, delete, search in O(1) average</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">Core Operations</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">insert(element)</h4>
                      <p className="text-gray-300">Add element to set if not already present</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>bool added = set.insert("apple");</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">contains(element)</h4>
                      <p className="text-gray-300">Check if element exists in set</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>bool exists = set.contains("apple");</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">erase(element)</h4>
                      <p className="text-gray-300">Remove element from set</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>bool removed = set.erase("apple");</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">size()</h4>
                      <p className="text-gray-300">Get number of elements in set</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>size_t count = set.size();</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-emerald-400 mb-3">Average Performance</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Insert: O(1)</li>
                    <li>• Search: O(1)</li>
                    <li>• Delete: O(1)</li>
                    <li>• Space: O(n)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Worst Case Performance</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Insert: O(n)</li>
                    <li>• Search: O(n)</li>
                    <li>• Delete: O(n)</li>
                    <li>• Depends on collisions</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Duplicate detection</li>
                    <li>• Membership testing</li>
                    <li>• Unique element storage</li>
                    <li>• Set operations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementations Section */}
          {activeSection === "implementations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Set Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {implementations.map((impl) => (
                  <div
                    key={impl.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{impl.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(impl.complexity).map(([op, comp]) => (
                            <span key={op} className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-lg">
                              {op.toUpperCase()}: {comp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{impl.description}</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Features</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {impl.features.map((feature, i) => (
                              <li key={i}>• {feature}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-3">Advantages</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {impl.advantages.map((adv, i) => (
                              <li key={i}>• {adv}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-red-400 mb-3">Disadvantages</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {impl.disadvantages.map((dis, i) => (
                            <li key={i}>• {dis}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{impl.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operations Section */}
          {activeSection === "operations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Set Operations</h2>

              <div className="grid grid-cols-1 gap-8">
                {operations.map((operation, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">{operation.name}</h3>
                      <p className="text-gray-300 mb-6">{operation.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Set Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-emerald-400 mb-4">{app.name}</h3>
                      <p className="text-gray-300 mb-4">{app.description}</p>
                      <p className="text-cyan-300 mb-6"><strong>Example:</strong> {app.example}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Code Example</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{app.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Two Sum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Contains Duplicate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Single Number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Intersection of Two Arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Happy Number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Missing Number</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Valid Sudoku</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Longest Consecutive Sequence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Find All Duplicates in Array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Top K Frequent Elements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Group Anagrams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>4Sum II</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Maximum Size Subarray Sum Equals k</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Count of Subarrays with Sum Divisible by K</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>All O`one Data Structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Design In-Memory File System</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Minimum Window Substring</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Implementation Details</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• How does hash set work internally?</li>
                    <li>• Why are hash sets unordered?</li>
                    <li>• How does load factor affect performance?</li>
                    <li>• What happens when hash set resizes?</li>
                    <li>• Difference between hash set and hash map?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Performance & Design</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• When should you use hash set over other sets?</li>
                    <li>• How to handle hash collisions?</li>
                    <li>• Memory vs time trade-offs in hash sets</li>
                    <li>• Choosing between different collision resolution</li>
                    <li>• Impact of poor hash functions</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Concepts</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Thread-safe hash set implementations</li>
                    <li>• Concurrent hash sets and lock striping</li>
                    <li>• Memory-efficient hash sets</li>
                    <li>• Bloom filters and approximate sets</li>
                    <li>• Perfect hashing for static sets</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Real-World Applications</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Database indexing and query optimization</li>
                    <li>• Compiler symbol table management</li>
                    <li>• Network routing table implementations</li>
                    <li>• Cache replacement policies</li>
                    <li>• Distributed hash tables (DHT)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hash Set Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Hash Set Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Average Insert:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Average Search:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Average Delete:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Worst Case (all operations):</span>
                    <span className="text-red-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Space Complexity:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key Concepts</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Hash Function:</div>
                    <div className="text-gray-400">Maps elements to array indices uniformly</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Load Factor:</div>
                    <div className="text-gray-400">n/m ratio, triggers resizing (0.75 typical)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Collision Resolution:</div>
                    <div className="text-gray-400">Separate chaining, linear/quadratic/double hashing</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Uniqueness:</div>
                    <div className="text-gray-400">No duplicate elements allowed</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Unordered:</div>
                    <div className="text-gray-400">Elements not stored in sorted order</div>
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

export default HashSets;

