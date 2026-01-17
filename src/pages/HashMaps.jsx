import React, { useState } from "react";
import { Layout } from "../components";

const HashMaps = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // HashMap Implementations
  const implementations = [
    {
      id: "stl-unordered-map",
      name: "STL unordered_map",
      description: "C++ standard library hash map implementation with automatic memory management",
      complexity: { insert: "O(1) avg", access: "O(1) avg", delete: "O(1) avg", search: "O(1) avg" },
      features: ["Automatic resizing", "Memory management", "Iterator support", "Standard interface"],
      code: `// STL unordered_map usage
#include <unordered_map>
#include <string>
#include <iostream>

void demonstrateUnorderedMap() {
    // Create unordered_map with string keys and int values
    std::unordered_map<std::string, int> studentGrades;

    // Insert elements
    studentGrades["Alice"] = 95;
    studentGrades["Bob"] = 87;
    studentGrades.insert({"Charlie", 92});
    studentGrades.emplace("Diana", 88);

    // Access elements
    std::cout << "Alice's grade: " << studentGrades["Alice"] << std::endl;

    // Check if key exists
    if (studentGrades.find("Bob") != studentGrades.end()) {
        std::cout << "Bob found with grade: " << studentGrades["Bob"] << std::endl;
    }

    // Iterate through all elements
    std::cout << "All grades:" << std::endl;
    for (const auto& pair : studentGrades) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }

    // Erase elements
    studentGrades.erase("Charlie");

    // Size and capacity
    std::cout << "Size: " << studentGrades.size() << std::endl;
    std::cout << "Bucket count: " << studentGrades.bucket_count() << std::endl;
    std::cout << "Load factor: " << studentGrades.load_factor() << std::endl;

    // Clear all elements
    studentGrades.clear();
}`,
      advantages: ["Easy to use", "Automatic memory management", "Rich API", "Standard library support"],
      disadvantages: ["Less control over internals", "Overhead of standard library", "May not be optimal for specific use cases"]
    },
    {
      id: "custom-hashmap",
      name: "Custom HashMap Implementation",
      description: "Complete custom implementation with separate chaining for educational purposes",
      complexity: { insert: "O(1) avg", access: "O(1) avg", delete: "O(1) avg", search: "O(1) avg" },
      features: ["Full control over implementation", "Educational value", "Customizable hash functions", "Memory efficient"],
      code: `// Custom HashMap with separate chaining
template<typename K, typename V>
class CustomHashMap {
private:
    struct KeyValuePair {
        K key;
        V value;
        KeyValuePair* next;

        KeyValuePair(K k, V v) : key(k), value(v), next(nullptr) {}
    };

    std::vector<KeyValuePair*> buckets;
    size_t capacity;
    size_t size;
    double loadFactorThreshold;

    size_t hashFunction(const K& key) const {
        return std::hash<K>()(key) % capacity;
    }

    void resize(size_t newCapacity) {
        std::vector<KeyValuePair*> newBuckets(newCapacity, nullptr);

        // Rehash all existing elements
        for (size_t i = 0; i < capacity; ++i) {
            KeyValuePair* current = buckets[i];
            while (current) {
                size_t newIndex = std::hash<K>()(current->key) % newCapacity;

                // Move to new bucket (maintain original links)
                KeyValuePair* next = current->next;
                current->next = newBuckets[newIndex];
                newBuckets[newIndex] = current;

                current = next;
            }
        }

        buckets = std::move(newBuckets);
        capacity = newCapacity;
    }

public:
    CustomHashMap(size_t initialCapacity = 16, double threshold = 0.75)
        : capacity(initialCapacity), size(0), loadFactorThreshold(threshold) {
        buckets.resize(capacity, nullptr);
    }

    ~CustomHashMap() {
        clear();
    }

    // Insert or update key-value pair
    void put(const K& key, const V& value) {
        size_t index = hashFunction(key);
        KeyValuePair* current = buckets[index];

        // Check if key already exists
        while (current) {
            if (current->key == key) {
                current->value = value; // Update existing
                return;
            }
            current = current->next;
        }

        // Key doesn't exist, insert at head
        KeyValuePair* newPair = new KeyValuePair(key, value);
        newPair->next = buckets[index];
        buckets[index] = newPair;
        size++;

        // Check load factor and resize if needed
        if (static_cast<double>(size) / capacity > loadFactorThreshold) {
            resize(capacity * 2);
        }
    }

    // Get value by key
    V* get(const K& key) {
        size_t index = hashFunction(key);
        KeyValuePair* current = buckets[index];

        while (current) {
            if (current->key == key) {
                return &current->value;
            }
            current = current->next;
        }

        return nullptr; // Key not found
    }

    // Remove key-value pair
    bool remove(const K& key) {
        size_t index = hashFunction(key);
        KeyValuePair* current = buckets[index];
        KeyValuePair* prev = nullptr;

        while (current) {
            if (current->key == key) {
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

        return false; // Key not found
    }

    // Check if key exists
    bool containsKey(const K& key) const {
        size_t index = hashFunction(key);
        KeyValuePair* current = buckets[index];

        while (current) {
            if (current->key == key) {
                return true;
            }
            current = current->next;
        }

        return false;
    }

    // Get all keys
    std::vector<K> keys() const {
        std::vector<K> keyList;
        keyList.reserve(size);

        for (size_t i = 0; i < capacity; ++i) {
            KeyValuePair* current = buckets[i];
            while (current) {
                keyList.push_back(current->key);
                current = current->next;
            }
        }

        return keyList;
    }

    // Clear all elements
    void clear() {
        for (size_t i = 0; i < capacity; ++i) {
            KeyValuePair* current = buckets[i];
            while (current) {
                KeyValuePair* temp = current;
                current = current->next;
                delete temp;
            }
            buckets[i] = nullptr;
        }
        size = 0;
    }

    // Utility functions
    size_t getSize() const { return size; }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size) / capacity; }
    bool isEmpty() const { return size == 0; }
};`,
      advantages: ["Complete control over implementation", "Educational value", "Memory efficient", "Customizable behavior"],
      disadvantages: ["Manual memory management", "More complex to implement", "Potential for bugs"]
    },
    {
      id: "concurrent-hashmap",
      name: "Concurrent HashMap",
      description: "Thread-safe hash map implementation for concurrent access",
      complexity: { insert: "O(1) avg", access: "O(1) avg", delete: "O(1) avg", search: "O(1) avg" },
      features: ["Thread safety", "Lock striping", "Atomic operations", "Concurrent access"],
      code: `// Concurrent HashMap with lock striping
#include <vector>
#include <mutex>
#include <shared_mutex>

template<typename K, typename V>
class ConcurrentHashMap {
private:
    struct KeyValuePair {
        K key;
        V value;
        KeyValuePair* next;
        mutable std::mutex mutex; // Per-node lock

        KeyValuePair(K k, V v) : key(k), value(v), next(nullptr) {}
    };

    std::vector<KeyValuePair*> buckets;
    std::vector<std::shared_mutex> bucketLocks; // Reader-writer locks
    size_t capacity;
    std::atomic<size_t> size;
    double loadFactorThreshold;

    size_t hashFunction(const K& key) const {
        return std::hash<K>()(key) % capacity;
    }

    void resize() {
        size_t newCapacity = capacity * 2;
        std::vector<KeyValuePair*> newBuckets(newCapacity, nullptr);
        std::vector<std::shared_mutex> newBucketLocks(newCapacity);

        // Acquire all locks for resizing
        std::vector<std::unique_lock<std::shared_mutex>> locks;
        for (auto& lock : bucketLocks) {
            locks.emplace_back(lock);
        }

        // Rehash all elements
        for (size_t i = 0; i < capacity; ++i) {
            KeyValuePair* current = buckets[i];
            while (current) {
                size_t newIndex = std::hash<K>()(current->key) % newCapacity;

                KeyValuePair* next = current->next;
                current->next = newBuckets[newIndex];
                newBuckets[newIndex] = current;

                current = next;
            }
        }

        buckets = std::move(newBuckets);
        bucketLocks = std::move(newBucketLocks);
        capacity = newCapacity;

        // Locks are automatically released here
    }

public:
    ConcurrentHashMap(size_t initialCapacity = 16, double threshold = 0.75)
        : capacity(initialCapacity), size(0), loadFactorThreshold(threshold) {
        buckets.resize(capacity, nullptr);
        bucketLocks.resize(capacity);
    }

    ~ConcurrentHashMap() {
        for (size_t i = 0; i < capacity; ++i) {
            std::unique_lock<std::shared_mutex> lock(bucketLocks[i]);
            KeyValuePair* current = buckets[i];
            while (current) {
                KeyValuePair* temp = current;
                current = current->next;
                delete temp;
            }
        }
    }

    // Thread-safe put operation
    void put(const K& key, const V& value) {
        size_t index = hashFunction(key);
        std::unique_lock<std::shared_mutex> lock(bucketLocks[index]);

        KeyValuePair* current = buckets[index];

        // Check if key exists
        while (current) {
            if (current->key == key) {
                current->value = value;
                return;
            }
            current = current->next;
        }

        // Insert new key-value pair
        KeyValuePair* newPair = new KeyValuePair(key, value);
        newPair->next = buckets[index];
        buckets[index] = newPair;
        size++;

        // Check load factor (not thread-safe, but acceptable for demo)
        if (static_cast<double>(size.load()) / capacity > loadFactorThreshold) {
            lock.unlock(); // Release lock before resizing
            resize(); // This will acquire all locks
        }
    }

    // Thread-safe get operation
    std::optional<V> get(const K& key) {
        size_t index = hashFunction(key);
        std::shared_lock<std::shared_mutex> lock(bucketLocks[index]);

        KeyValuePair* current = buckets[index];
        while (current) {
            if (current->key == key) {
                return current->value;
            }
            current = current->next;
        }

        return std::nullopt;
    }

    // Thread-safe remove operation
    bool remove(const K& key) {
        size_t index = hashFunction(key);
        std::unique_lock<std::shared_mutex> lock(bucketLocks[index]);

        KeyValuePair* current = buckets[index];
        KeyValuePair* prev = nullptr;

        while (current) {
            if (current->key == key) {
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

    // Thread-safe contains check
    bool containsKey(const K& key) {
        size_t index = hashFunction(key);
        std::shared_lock<std::shared_mutex> lock(bucketLocks[index]);

        KeyValuePair* current = buckets[index];
        while (current) {
            if (current->key == key) {
                return true;
            }
            current = current->next;
        }

        return false;
    }

    size_t getSize() const { return size.load(); }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size.load()) / capacity; }
};

// Usage example
void concurrentExample() {
    ConcurrentHashMap<std::string, int> map;

    // These operations can be performed concurrently from multiple threads
    map.put("key1", 100);
    auto value = map.get("key1");
    bool exists = map.containsKey("key1");
    map.remove("key1");
}`,
      advantages: ["Thread-safe operations", "High concurrency", "Scalable for multiple threads"],
      disadvantages: ["Increased memory overhead", "Complex implementation", "Potential lock contention"]
    }
  ];

  // HashMap Operations
  const operations = [
    {
      id: "insertion",
      name: "Insertion Operations",
      description: "Adding key-value pairs to the hash map",
      code: `// Different insertion methods
std::unordered_map<std::string, int> map;

// Method 1: Using operator[]
map["apple"] = 10;        // Creates or updates
map["banana"] = 20;

// Method 2: Using insert()
auto result1 = map.insert({"cherry", 30});  // Returns pair<iterator, bool>
if (result1.second) {
    std::cout << "Inserted successfully" << std::endl;
} else {
    std::cout << "Key already exists" << std::endl;
}

// Method 3: Using insert() with hint
auto it = map.find("banana");
auto result2 = map.insert(it, {"date", 40}); // Hint for insertion position

// Method 4: Using emplace() - more efficient
map.emplace("elderberry", 50); // Constructs in-place

// Method 5: Using try_emplace() - only if key doesn't exist
auto result3 = map.try_emplace("fig", 60); // C++17 feature

// Bulk insertion
std::vector<std::pair<std::string, int>> items = {
    {"grape", 70}, {"honeydew", 80}
};
map.insert(items.begin(), items.end());

// Insert or assign (C++17)
map.insert_or_assign("apple", 15); // Always updates/inserts`,
      explanation: "HashMap provides multiple methods for inserting key-value pairs with different behaviors."
    },
    {
      id: "access",
      name: "Access Operations",
      description: "Retrieving values and checking key existence",
      code: `// Access operations
std::unordered_map<std::string, int> map = {
    {"apple", 10}, {"banana", 20}, {"cherry", 30}
};

// Method 1: Using operator[] - unsafe for non-existing keys
int value1 = map["apple"];        // OK: 10
int value2 = map["nonexistent"];  // Creates entry with default value (0)

// Method 2: Using at() - throws exception for non-existing keys
try {
    int value3 = map.at("banana");      // OK: 20
    int value4 = map.at("nonexistent"); // Throws std::out_of_range
} catch (const std::out_of_range& e) {
    std::cout << "Key not found: " << e.what() << std::endl;
}

// Method 3: Using find() - returns iterator
auto it = map.find("cherry");
if (it != map.end()) {
    std::cout << "Found: " << it->first << " -> " << it->second << std::endl;
} else {
    std::cout << "Key not found" << std::endl;
}

// Method 4: Using count() - returns 0 or 1
if (map.count("apple") > 0) {
    std::cout << "Apple exists" << std::endl;
}

// Method 5: Using contains() - C++20 feature
if (map.contains("banana")) {  // Cleaner than count()
    std::cout << "Banana exists" << std::endl;
}

// Safe access with default value
auto getWithDefault = [](const auto& map, const auto& key, auto defaultValue) {
    auto it = map.find(key);
    return it != map.end() ? it->second : defaultValue;
};

int safeValue = getWithDefault(map, "nonexistent", -1); // Returns -1`,
      explanation: "Multiple ways to access hash map elements with different safety guarantees."
    },
    {
      id: "iteration",
      name: "Iteration and Traversal",
      description: "Iterating through hash map elements",
      code: `// Iteration methods
std::unordered_map<std::string, int> map = {
    {"apple", 10}, {"banana", 20}, {"cherry", 30},
    {"date", 40}, {"elderberry", 50}
};

// Method 1: Range-based for loop (recommended)
std::cout << "Range-based iteration:" << std::endl;
for (const auto& pair : map) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}

// Method 2: Iterator-based loop
std::cout << "Iterator-based iteration:" << std::endl;
for (auto it = map.begin(); it != map.end(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// Method 3: Using structured bindings (C++17)
std::cout << "Structured bindings:" << std::endl;
for (const auto& [key, value] : map) {
    std::cout << key << ": " << value << std::endl;
}

// Method 4: Reverse iteration
std::cout << "Reverse iteration:" << std::endl;
for (auto it = map.rbegin(); it != map.rend(); ++it) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// Bucket iteration (for debugging/performance analysis)
std::cout << "Bucket-wise iteration:" << std::endl;
for (size_t i = 0; i < map.bucket_count(); ++i) {
    std::cout << "Bucket " << i << ": ";
    for (auto it = map.begin(i); it != map.end(i); ++it) {
        std::cout << "(" << it->first << "," << it->second << ") ";
    }
    std::cout << std::endl;
}

// Conditional iteration (find elements matching criteria)
std::cout << "Elements with value > 25:" << std::endl;
for (const auto& [key, value] : map) {
    if (value > 25) {
        std::cout << key << ": " << value << std::endl;
    }
}

// Transform while iterating
std::cout << "Transformed values:" << std::endl;
for (auto& [key, value] : map) {
    value *= 2; // Modify values in-place
    std::cout << key << ": " << value << std::endl;
}`,
      explanation: "HashMap supports various iteration patterns including bucket-wise iteration for performance analysis."
    },
    {
      id: "advanced-ops",
      name: "Advanced Operations",
      description: "Complex operations like merging, extracting, and custom operations",
      code: `// Advanced HashMap operations
std::unordered_map<std::string, int> map1 = {{"a", 1}, {"b", 2}, {"c", 3}};
std::unordered_map<std::string, int> map2 = {{"b", 20}, {"c", 30}, {"d", 40}};

// Merge operation (C++17)
std::cout << "Before merge:" << std::endl;
for (const auto& [k, v] : map1) std::cout << k << ":" << v << " ";
std::cout << std::endl;

map1.merge(map2); // Move elements from map2 to map1 (no duplicates)

std::cout << "After merge:" << std::endl;
for (const auto& [k, v] : map1) std::cout << k << ":" << v << " ";
std::cout << std::endl;

for (const auto& [k, v] : map2) std::cout << k << ":" << v << " ";
std::cout << std::endl;

// Extract operation (C++17)
auto node = map1.extract("b"); // Extract node from map
if (!node.empty()) {
    std::cout << "Extracted: " << node.key() << " -> " << node.mapped() << std::endl;

    // Modify and re-insert
    node.mapped() = 999;
    map1.insert(std::move(node));
}

std::cout << "After extract and re-insert:" << std::endl;
for (const auto& [k, v] : map1) std::cout << k << ":" << v << " ";
std::cout << std::endl;

// Custom hash and equality for complex keys
struct Person {
    std::string name;
    int age;

    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

struct PersonHash {
    size_t operator()(const Person& p) const {
        return std::hash<std::string>()(p.name) ^ std::hash<int>()(p.age);
    }
};

std::unordered_map<Person, std::string, PersonHash> personMap;
personMap[{ "Alice", 30 }] = "Engineer";
personMap[{ "Bob", 25 }] = "Designer";

for (const auto& [person, job] : personMap) {
    std::cout << person.name << " (" << person.age << "): " << job << std::endl;
}

// Using lambda as hash function (C++11)
auto stringHash = [](const std::string& s) {
    size_t hash = 0;
    for (char c : s) {
        hash = hash * 31 + c; // djb2-like hash
    }
    return hash;
};

std::unordered_map<std::string, int, decltype(stringHash)> customHashMap(10, stringHash);
customHashMap["hello"] = 1;
customHashMap["world"] = 2;

// Performance monitoring
std::cout << "Load factor: " << customHashMap.load_factor() << std::endl;
std::cout << "Bucket count: " << customHashMap.bucket_count() << std::endl;
std::cout << "Max load factor: " << customHashMap.max_load_factor() << std::endl;

// Manual rehashing
customHashMap.rehash(20); // Force resize to 20 buckets
std::cout << "After rehash - Bucket count: " << customHashMap.bucket_count() << std::endl;`,
      explanation: "Advanced operations including merging, extracting, custom types, and performance monitoring."
    }
  ];

  // HashMap Applications
  const applications = [
    {
      id: "frequency-counting",
      name: "Frequency Counting",
      description: "Count occurrences of elements efficiently",
      example: "Word frequency analysis, character counting in strings",
      code: `std::unordered_map<char, int> charCount;
std::string text = "hello world";
for (char c : text) {
    charCount[c]++;
}
// Result: 'l':3, 'o':2, 'h':1, 'e':1, ' ':1, 'w':1, 'r':1, 'd':1`
    },
    {
      id: "caching",
      name: "LRU Cache Implementation",
      description: "Implement least recently used cache",
      example: "Web browser caches, database query caching",
      code: `class LRUCache {
private:
    int capacity;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;
    std::list<std::pair<int, int>> lruList;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;

        // Move to front (most recently used)
        lruList.splice(lruList.begin(), lruList, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = map.find(key);

        if (it != map.end()) {
            // Update existing
            it->second->second = value;
            lruList.splice(lruList.begin(), lruList, it->second);
        } else {
            // Add new
            if (map.size() == capacity) {
                // Remove least recently used
                auto last = lruList.back();
                map.erase(last.first);
                lruList.pop_back();
            }

            lruList.emplace_front(key, value);
            map[key] = lruList.begin();
        }
    }
};`
    },
    {
      id: "two-sum",
      name: "Two Sum Problem",
      description: "Find two numbers that add up to target",
      example: "Array problems, complement finding",
      code: `std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> numMap;

    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        auto it = numMap.find(complement);

        if (it != numMap.end()) {
            return {it->second, i};
        }

        numMap[nums[i]] = i;
    }

    return {}; // No solution found
}`
    },
    {
      id: "group-anagrams",
      name: "Group Anagrams",
      description: "Group strings that are anagrams of each other",
      example: "String processing, pattern recognition",
      code: `std::vector<std::vector<std::string>> groupAnagrams(const std::vector<std::string>& strs) {
    std::unordered_map<std::string, std::vector<std::string>> groups;

    for (const std::string& str : strs) {
        std::string key = str;
        std::sort(key.begin(), key.end());
        groups[key].push_back(str);
    }

    std::vector<std::vector<std::string>> result;
    for (auto& pair : groups) {
        result.push_back(std::move(pair.second));
    }

    return result;
}`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Two Sum",
      difficulty: "Easy",
      description: "Find two numbers that add up to target",
      hint: "Use hash map to store complements"
    },
    {
      name: "Group Anagrams",
      difficulty: "Medium",
      description: "Group strings that are anagrams",
      hint: "Sort strings as keys in hash map"
    },
    {
      name: "LRU Cache",
      difficulty: "Medium",
      description: "Implement least recently used cache",
      hint: "Hash map + doubly linked list"
    },
    {
      name: "Top K Frequent Elements",
      difficulty: "Medium",
      description: "Find k most frequent elements",
      hint: "Hash map for counting, priority queue for top k"
    },
    {
      name: "Subarray Sum Equals K",
      difficulty: "Medium",
      description: "Count subarrays with sum equal to k",
      hint: "Prefix sum + hash map"
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
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Hash Maps (Hash Tables)
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced key-value data structures with O(1) average-time operations.
              Master hash map implementations, operations, and applications.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementations"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Implementations
            </button>
            <button
              onClick={() => setActiveSection("operations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "operations"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hash Maps Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">What are Hash Maps?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Hash Maps (also called Hash Tables) are data structures that implement
                    associative arrays with key-value pairs. They use hash functions to map
                    keys to indices in an underlying array, providing average O(1) time complexity
                    for insertions, deletions, and lookups.
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🔑</span>
                      <span><strong>Key-Value Pairs:</strong> Associate keys with values</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🎯</span>
                      <span><strong>Fast Operations:</strong> O(1) average time complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🔄</span>
                      <span><strong>Dynamic Sizing:</strong> Automatic resizing based on load</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🚫</span>
                      <span><strong>No Ordering:</strong> Keys are not stored in sorted order</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Core Operations</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">put(key, value)</h4>
                      <p className="text-gray-300">Insert or update key-value pair</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>map.put("apple", 10);</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">get(key)</h4>
                      <p className="text-gray-300">Retrieve value associated with key</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>int value = map.get("apple");</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">containsKey(key)</h4>
                      <p className="text-gray-300">Check if key exists in map</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>bool exists = map.containsKey("apple");</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">remove(key)</h4>
                      <p className="text-gray-300">Remove key-value pair from map</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>map.remove("apple");</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-indigo-400 mb-3">Average Performance</h4>
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
                    <li>• Caching systems</li>
                    <li>• Frequency counting</li>
                    <li>• Database indexing</li>
                    <li>• Symbol tables</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementations Section */}
          {activeSection === "implementations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Map Implementations</h2>

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
                            <span key={op} className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-lg">
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
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Map Operations</h2>

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
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Map Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-indigo-400 mb-4">{app.name}</h3>
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10">
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
                    <span>Roman to Integer</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Group Anagrams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Valid Anagram</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Top K Frequent Elements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>4Sum II</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Subarray Sum Equals K</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Longest Consecutive Sequence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>LRU Cache</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Minimum Window Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Substring with Concatenation of All Words</span>
                  </li>
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
                    <li>• How does hash map work internally?</li>
                    <li>• Explain collision resolution strategies</li>
                    <li>• What is load factor and why is it important?</li>
                    <li>• How does resizing work in hash maps?</li>
                    <li>• Compare different collision resolution methods</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Performance & Design</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Why is average O(1) but worst case O(n)?</li>
                    <li>• How to choose a good hash function?</li>
                    <li>• What happens with poor hash functions?</li>
                    <li>• Design considerations for custom key types</li>
                    <li>• Memory vs time trade-offs</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Concepts</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Thread-safe hash map implementations</li>
                    <li>• Concurrent hash maps and lock striping</li>
                    <li>• Memory-efficient hash maps</li>
                    <li>• Perfect hashing and static hash tables</li>
                    <li>• Cuckoo hashing and its advantages</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Real-World Applications</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Database indexing and query optimization</li>
                    <li>• Compiler symbol table management</li>
                    <li>• Network routing table implementations</li>
                    <li>• Cache systems and replacement policies</li>
                    <li>• Distributed hash tables (DHT)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hash Map Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Hash Map Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">Time Complexities</h3>
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
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">Key Concepts</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Hash Function:</div>
                    <div className="text-gray-400">Maps keys to array indices uniformly</div>
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
                    <div className="text-cyan-400 font-medium mb-1">Rehashing:</div>
                    <div className="text-gray-400">Resize table and redistribute elements</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Universal Hashing:</div>
                    <div className="text-gray-400">Randomized functions with worst-case guarantees</div>
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

export default HashMaps;

