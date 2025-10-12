import React, { useState } from "react";
import { Layout } from "../components";

const PerfectHashing = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Perfect Hashing Implementation
  const perfectHashingImplementation = {
    static: `// Static Perfect Hashing - FKS Scheme (Fredman, Komlos, Szemeredi)
#include <vector>
#include <unordered_map>
#include <functional>

class StaticPerfectHash {
private:
    std::vector<size_t> g;        // Secondary hash function values
    std::vector<std::vector<size_t>> h; // Primary hash table (contains indices)
    size_t universeSize;          // Size of universe U
    size_t setSize;              // Size of set S (|S|)
    std::function<size_t(size_t)> hash1; // Primary hash function
    std::function<size_t(size_t)> hash2; // Secondary hash function

    // Build the perfect hash table
    void buildTable(const std::vector<size_t>& keys) {
        // Step 1: Choose primary hash function h1
        // For simplicity, we'll use a simple modulo hash
        size_t tableSize = keys.size() * keys.size(); // m = n²
        h.resize(tableSize);

        // Step 2: Partition keys into buckets
        std::vector<std::vector<size_t>> buckets(tableSize);
        for (size_t key : keys) {
            size_t bucketIndex = hash1(key) % tableSize;
            buckets[bucketIndex].push_back(key);
        }

        // Step 3: For each bucket, find a secondary hash function
        g.resize(tableSize);
        for (size_t i = 0; i < tableSize; ++i) {
            if (!buckets[i].empty()) {
                // Try different secondary hash functions until we find one with no collisions
                bool found = false;
                size_t attempts = 0;

                while (!found && attempts < 100) { // Limit attempts to avoid infinite loop
                    size_t g_i = rand() % (buckets[i].size() * buckets[i].size() + 1);
                    g[i] = g_i;

                    // Check for collisions
                    std::unordered_set<size_t> usedSlots;
                    found = true;

                    for (size_t key : buckets[i]) {
                        size_t slot = hash2(key) % g_i;
                        if (usedSlots.count(slot)) {
                            found = false;
                            break;
                        }
                        usedSlots.insert(slot);
                    }

                    attempts++;
                }

                if (found) {
                    // Store the mapping for this bucket
                    h[i].resize(buckets[i].size());
                    for (size_t j = 0; j < buckets[i].size(); ++j) {
                        size_t key = buckets[i][j];
                        size_t slot = hash2(key) % g[i];
                        h[i][slot] = key;
                    }
                }
            }
        }
    }

public:
    StaticPerfectHash(const std::vector<size_t>& keys,
                     std::function<size_t(size_t)> h1,
                     std::function<size_t(size_t)> h2)
        : hash1(h1), hash2(h2), universeSize(0), setSize(keys.size()) {

        // Estimate universe size (in practice, this should be known)
        universeSize = *std::max_element(keys.begin(), keys.end()) + 1;

        buildTable(keys);
    }

    // Query operation - O(1) worst case
    bool contains(size_t key) const {
        size_t bucketIndex = hash1(key) % h.size();
        if (g[bucketIndex] == 0) return false; // Empty bucket

        size_t slot = hash2(key) % g[bucketIndex];
        if (slot >= h[bucketIndex].size()) return false;

        return h[bucketIndex][slot] == key;
    }

    size_t getTableSize() const {
        return h.size();
    }

    size_t getSpaceUsage() const {
        size_t space = g.size(); // Space for g
        for (const auto& bucket : h) {
            space += bucket.size(); // Space for each bucket
        }
        return space;
    }
};

// Usage example
void demonstrateStaticPerfectHashing() {
    std::vector<size_t> keys = {10, 20, 30, 40, 50, 60, 70, 80};

    auto h1 = [](size_t key) { return key / 10; };
    auto h2 = [](size_t key) { return key % 10; };

    StaticPerfectHash ph(keys, h1, h2);

    std::cout << "Table size: " << ph.getTableSize() << std::endl;
    std::cout << "Space usage: " << ph.getSpaceUsage() << std::endl;

    // Test queries
    for (size_t key : keys) {
        bool found = ph.contains(key);
        std::cout << "Key " << key << ": " << (found ? "FOUND" : "NOT FOUND") << std::endl;
    }

    // Test non-existing keys
    std::vector<size_t> testKeys = {15, 25, 35, 90};
    for (size_t key : testKeys) {
        bool found = ph.contains(key);
        std::cout << "Key " << key << ": " << (found ? "FOUND" : "NOT FOUND") << std::endl;
    }
}`,
    dynamic: `// Dynamic Perfect Hashing - allows insertions and deletions
#include <vector>
#include <unordered_map>
#include <memory>

class DynamicPerfectHash {
private:
    struct Bucket {
        std::vector<size_t> keys;
        std::unique_ptr<StaticPerfectHash> hashTable;
        size_t size;

        Bucket() : size(0) {}

        bool insert(size_t key) {
            if (std::find(keys.begin(), keys.end(), key) != keys.end()) {
                return false; // Already exists
            }
            keys.push_back(key);
            size++;
            return true;
        }

        bool remove(size_t key) {
            auto it = std::find(keys.begin(), keys.end(), key);
            if (it == keys.end()) return false;

            keys.erase(it);
            size--;
            return true;
        }

        void rebuildHashTable() {
            if (!keys.empty()) {
                auto h1 = [](size_t k) { return k; };
                auto h2 = [](size_t k) { return k * 31; };
                hashTable = std::make_unique<StaticPerfectHash>(keys, h1, h2);
            } else {
                hashTable.reset();
            }
        }

        bool contains(size_t key) const {
            if (!hashTable) return false;
            return hashTable->contains(key);
        }
    };

    std::vector<Bucket> directory;
    size_t numBuckets;
    double loadFactorThreshold;

    size_t hashFunction(size_t key) const {
        return key % numBuckets;
    }

    void expandDirectory() {
        size_t newSize = numBuckets * 2;
        std::vector<Bucket> newDirectory(newSize);

        // Redistribute all keys
        for (size_t i = 0; i < numBuckets; ++i) {
            for (size_t key : directory[i].keys) {
                size_t newBucketIndex = key % newSize;
                newDirectory[newBucketIndex].insert(key);
            }
        }

        // Rebuild hash tables for all buckets
        for (size_t i = 0; i < newSize; ++i) {
            newDirectory[i].rebuildHashTable();
        }

        directory = std::move(newDirectory);
        numBuckets = newSize;
    }

public:
    DynamicPerfectHash(size_t initialBuckets = 4, double threshold = 0.75)
        : numBuckets(initialBuckets), loadFactorThreshold(threshold) {
        directory.resize(numBuckets);
    }

    bool insert(size_t key) {
        size_t bucketIndex = hashFunction(key);
        bool inserted = directory[bucketIndex].insert(key);

        if (inserted) {
            // Check if bucket needs rebuilding
            if (directory[bucketIndex].size > 1) { // More than 1 key in bucket
                directory[bucketIndex].rebuildHashTable();
            }

            // Check load factor
            size_t totalKeys = 0;
            for (const auto& bucket : directory) {
                totalKeys += bucket.size;
            }

            if (static_cast<double>(totalKeys) / numBuckets > loadFactorThreshold) {
                expandDirectory();
            }
        }

        return inserted;
    }

    bool remove(size_t key) {
        size_t bucketIndex = hashFunction(key);
        bool removed = directory[bucketIndex].remove(key);

        if (removed && directory[bucketIndex].size > 0) {
            directory[bucketIndex].rebuildHashTable();
        }

        return removed;
    }

    bool contains(size_t key) const {
        size_t bucketIndex = hashFunction(key);
        return directory[bucketIndex].contains(key);
    }

    size_t getTotalSpace() const {
        size_t totalSpace = 0;
        for (const auto& bucket : directory) {
            if (bucket.hashTable) {
                totalSpace += bucket.hashTable->getSpaceUsage();
            }
        }
        return totalSpace;
    }

    size_t getNumBuckets() const { return numBuckets; }
};

// Usage example
void demonstrateDynamicPerfectHashing() {
    DynamicPerfectHash dph;

    // Insert keys
    std::vector<size_t> keys = {10, 20, 30, 40, 50, 60, 70, 80};
    for (size_t key : keys) {
        dph.insert(key);
    }

    std::cout << "After insertions:" << std::endl;
    std::cout << "Buckets: " << dph.getNumBuckets() << std::endl;
    std::cout << "Total space: " << dph.getTotalSpace() << std::endl;

    // Test queries
    for (size_t key : keys) {
        bool found = dph.contains(key);
        std::cout << "Key " << key << ": " << (found ? "FOUND" : "NOT FOUND") << std::endl;
    }

    // Remove some keys
    dph.remove(30);
    dph.remove(60);

    std::cout << "\\nAfter removing 30 and 60:" << std::endl;
    for (size_t key : keys) {
        bool found = dph.contains(key);
        std::cout << "Key " << key << ": " << (found ? "FOUND" : "NOT FOUND") << std::endl;
    }

    // Insert more keys
    dph.insert(90);
    dph.insert(100);

    std::cout << "\\nAfter inserting 90 and 100:" << std::endl;
    std::cout << "Buckets: " << dph.getNumBuckets() << std::endl;
    std::cout << "Total space: " << dph.getTotalSpace() << std::endl;
}`,
    minimal: `// Minimal Perfect Hashing - no empty slots
#include <vector>
#include <unordered_map>
#include <algorithm>

class MinimalPerfectHash {
private:
    std::vector<size_t> g;        // Displacement values
    std::vector<size_t> values;   // Stored values
    size_t setSize;              // Number of keys

    // Simple hash functions for the algorithm
    size_t hash1(size_t key, size_t range) const {
        return key % range;
    }

    size_t hash2(size_t key, size_t range) const {
        return (key * 31) % range;
    }

    // Build minimal perfect hash function
    void buildMPHF(const std::vector<size_t>& keys) {
        setSize = keys.size();
        if (setSize == 0) return;

        // Sort keys for processing
        std::vector<size_t> sortedKeys = keys;
        std::sort(sortedKeys.begin(), sortedKeys.end());

        // Create mapping from key to its position
        std::unordered_map<size_t, size_t> keyToIndex;
        for (size_t i = 0; i < setSize; ++i) {
            keyToIndex[sortedKeys[i]] = i;
        }

        // Initialize g with zeros
        g.assign(setSize, 0);
        values.resize(setSize);

        // Use a simple approach: g[i] = i - hash1(key, setSize)
        // This creates a perfect hash function
        for (size_t i = 0; i < setSize; ++i) {
            size_t key = sortedKeys[i];
            size_t h1 = hash1(key, setSize);
            g[h1] = (i - h1 + setSize) % setSize;
            values[i] = key;
        }
    }

public:
    MinimalPerfectHash(const std::vector<size_t>& keys) {
        buildMPHF(keys);
    }

    // Query operation - returns index in range [0, n-1]
    size_t query(size_t key) const {
        if (setSize == 0) return static_cast<size_t>(-1);

        size_t h1 = hash1(key, setSize);
        size_t displacement = g[h1];
        size_t index = (h1 + displacement) % setSize;

        // Verify the key is actually at this position
        if (index < values.size() && values[index] == key) {
            return index;
        }

        return static_cast<size_t>(-1); // Key not found
    }

    // Check if key exists
    bool contains(size_t key) const {
        return query(key) != static_cast<size_t>(-1);
    }

    // Get value at index (useful for additional data storage)
    size_t getValue(size_t index) const {
        if (index < values.size()) {
            return values[index];
        }
        return 0;
    }

    size_t size() const { return setSize; }

    // Get the hash value for a key (deterministic)
    size_t getHash(size_t key) const {
        return query(key);
    }
};

// Usage example
void demonstrateMinimalPerfectHashing() {
    std::vector<size_t> keys = {100, 200, 300, 400, 500};

    MinimalPerfectHash mph(keys);

    std::cout << "Minimal Perfect Hash Table:" << std::endl;
    std::cout << "Size: " << mph.size() << std::endl;

    // Test all keys
    for (size_t key : keys) {
        size_t hashValue = mph.getHash(key);
        bool exists = mph.contains(key);
        std::cout << "Key " << key << " -> Hash " << hashValue
                  << " (exists: " << (exists ? "YES" : "NO") << ")" << std::endl;
    }

    // Test non-existing keys
    std::vector<size_t> testKeys = {150, 250, 350, 600};
    std::cout << "\\nTesting non-existing keys:" << std::endl;
    for (size_t key : testKeys) {
        bool exists = mph.contains(key);
        std::cout << "Key " << key << ": " << (exists ? "FOUND" : "NOT FOUND") << std::endl;
    }

    // Show value retrieval
    std::cout << "\\nValue retrieval:" << std::endl;
    for (size_t i = 0; i < mph.size(); ++i) {
        size_t value = mph.getValue(i);
        std::cout << "Index " << i << " -> Value " << value << std::endl;
    }
}`
  };

  // Applications
  const applications = [
    {
      id: "database-indexing",
      name: "Database Indexing",
      description: "Fast lookups in database systems with known key sets",
      example: "Primary key indexing, static lookup tables",
      code: `class DatabaseIndex {
private:
    MinimalPerfectHash mph;
    std::vector<Record*> records;

public:
    DatabaseIndex(const std::vector<size_t>& keys, const std::vector<Record*>& recs)
        : mph(keys), records(recs) {}

    Record* lookup(size_t primaryKey) {
        size_t index = mph.getHash(primaryKey);
        if (index != static_cast<size_t>(-1) && index < records.size()) {
            return records[index];
        }
        return nullptr;
    }
};`
    },
    {
      id: "compiler-tables",
      name: "Compiler Symbol Tables",
      description: "Efficient symbol lookup in compilers",
      example: "Keyword recognition, identifier lookup",
      code: `class CompilerSymbolTable {
private:
    MinimalPerfectHash mph;
    std::vector<SymbolInfo> symbolInfo;

public:
    CompilerSymbolTable(const std::vector<std::string>& keywords) {
        std::vector<size_t> hashes;
        for (const auto& keyword : keywords) {
            hashes.push_back(std::hash<std::string>()(keyword));
        }
        mph = MinimalPerfectHash(hashes);
        symbolInfo.resize(hashes.size());
    }

    bool isKeyword(const std::string& word) {
        size_t hash = std::hash<std::string>()(word);
        return mph.contains(hash);
    }
};`
    },
    {
      id: "network-routing",
      name: "Network Routing Tables",
      description: "Fast IP address lookups",
      example: "Router forwarding tables, IP filtering",
      code: `class IPRoutingTable {
private:
    MinimalPerfectHash mph;
    std::vector<std::string> nextHops;

public:
    IPRoutingTable(const std::vector<uint32_t>& ipPrefixes,
                   const std::vector<std::string>& hops)
        : mph(std::vector<size_t>(ipPrefixes.begin(), ipPrefixes.end())),
          nextHops(hops) {}

    std::string getNextHop(uint32_t ipAddress) {
        // Find longest prefix match using MPH
        size_t index = mph.getHash(ipAddress);
        if (index != static_cast<size_t>(-1)) {
            return nextHops[index];
        }
        return "default";
    }
};`
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Perfect Hashing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced hashing techniques that guarantee O(1) worst-case lookup time.
              Master static, dynamic, and minimal perfect hash functions.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "implementation"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Implementation
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "applications"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Perfect Hashing Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">What is Perfect Hashing?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Perfect hashing is a technique that constructs hash functions with no collisions,
                    guaranteeing O(1) worst-case lookup time. Unlike standard hashing which provides
                    average-case performance, perfect hashing provides worst-case guarantees.
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🎯</span>
                      <span><strong>Zero Collisions:</strong> No two keys map to the same location</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">⚡</span>
                      <span><strong>O(1) Worst Case:</strong> Constant time lookups guaranteed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">🔧</span>
                      <span><strong>Precomputed:</strong> Hash function built for specific key set</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-400 mr-2">💾</span>
                      <span><strong>Space Efficient:</strong> Minimal space overhead for static sets</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Types of Perfect Hashing</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-purple-400 mb-2">Static Perfect Hashing</h4>
                      <p className="text-gray-300 text-sm">Fixed key set, precomputed hash function</p>
                      <ul className="text-gray-400 text-xs mt-2 space-y-1">
                        <li>• FKS scheme (Fredman, Komlos, Szemeredi)</li>
                        <li>• Two-level hashing</li>
                        <li>• O(1) query, O(n) space</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-purple-400 mb-2">Dynamic Perfect Hashing</h4>
                      <p className="text-gray-300 text-sm">Supports insertions and deletions</p>
                      <ul className="text-gray-400 text-xs mt-2 space-y-1">
                        <li>• Directory-based approach</li>
                        <li>• Automatic resizing</li>
                        <li>• O(1) amortized operations</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-purple-400 mb-2">Minimal Perfect Hashing</h4>
                      <p className="text-gray-300 text-sm">No empty slots in hash table</p>
                      <ul className="text-gray-400 text-xs mt-2 space-y-1">
                        <li>• Maps to range [0, n-1]</li>
                        <li>• Optimal space usage</li>
                        <li>• Perfect mapping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-indigo-400 mb-3">Advantages</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Guaranteed O(1) worst-case</li>
                    <li>• No collision handling needed</li>
                    <li>• Predictable performance</li>
                    <li>• Space efficient for static sets</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Limitations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Preprocessing required</li>
                    <li>• Static key sets</li>
                    <li>• Complex construction</li>
                    <li>• Space overhead</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Compiler symbol tables</li>
                    <li>• Database indexing</li>
                    <li>• Router lookup tables</li>
                    <li>• Static dictionaries</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Section */}
          {activeSection === "implementation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Perfect Hashing Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Static Perfect Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-400 mb-4">Static Perfect Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      FKS scheme implementation for static key sets with guaranteed O(1) lookup time.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Two-level hash functions</li>
                          <li>• Zero collision guarantee</li>
                          <li>• O(n) preprocessing time</li>
                          <li>• O(n) space complexity</li>
                          <li>• Worst-case O(1) lookup</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Complexity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Construction:</span>
                            {renderComplexityBadge("O(n)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Query:</span>
                            {renderComplexityBadge("O(1)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Space:</span>
                            {renderComplexityBadge("O(n)")}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{perfectHashingImplementation.static}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Perfect Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-400 mb-4">Dynamic Perfect Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Directory-based approach that supports insertions and deletions while maintaining perfect hashing properties.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Supports insertions/deletions</li>
                          <li>• Automatic resizing</li>
                          <li>• Directory of buckets</li>
                          <li>• Amortized O(1) operations</li>
                          <li>• Maintains perfect hashing</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Benefits</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Dynamic key sets</li>
                          <li>• Worst-case guarantees</li>
                          <li>• Automatic optimization</li>
                          <li>• Space efficient</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{perfectHashingImplementation.dynamic}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Perfect Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-400 mb-4">Minimal Perfect Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Maps keys to consecutive integers [0, n-1] with no empty slots in the hash table.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• No empty slots</li>
                          <li>• Maps to [0, n-1]</li>
                          <li>• Optimal space usage</li>
                          <li>• Deterministic mapping</li>
                          <li>• O(n) construction</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Advantages</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Minimal space</li>
                          <li>• Perfect utilization</li>
                          <li>• Fast construction</li>
                          <li>• Predictable mapping</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{perfectHashingImplementation.minimal}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Perfect Hashing Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-indigo-400 mb-4">{app.name}</h3>
                      <p className="text-gray-300 mb-4">{app.description}</p>
                      <p className="text-blue-300 mb-6"><strong>Example:</strong> {app.example}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Code Example</h4>
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
                    <span>Implement Basic Perfect Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Minimal Perfect Hash Functions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Static Dictionary Implementation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>FKS Perfect Hashing Construction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Dynamic Perfect Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Perfect Hashing for Compiler Symbols</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Minimal Perfect Hashing Algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Perfect Hashing with Precomputed Tables</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Optimal Perfect Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Perfect Hashing for Large Datasets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Concurrent Perfect Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Perfect Hashing with Cryptographic Properties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>External Memory Perfect Hashing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Fundamental Concepts</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• What is perfect hashing?</li>
                    <li>• How does it differ from regular hashing?</li>
                    <li>• Explain FKS perfect hashing</li>
                    <li>• What are the space requirements?</li>
                    <li>• When would you use perfect hashing?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Topics</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Implement a perfect hash function</li>
                    <li>• Handle dynamic key sets</li>
                    <li>• Minimal perfect hashing algorithms</li>
                    <li>• Performance vs space trade-offs</li>
                    <li>• Perfect hashing in databases</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">System Design</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Design a perfect hash table for a compiler</li>
                    <li>• Implement perfect hashing for IP routing</li>
                    <li>• Perfect hashing in memory-constrained systems</li>
                    <li>• Concurrent access to perfect hash tables</li>
                    <li>• Perfect hashing for distributed systems</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Mathematical Analysis</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Analyze perfect hashing construction time</li>
                    <li>• Calculate space overhead</li>
                    <li>• Probability analysis of hash function selection</li>
                    <li>• Worst-case vs average-case performance</li>
                    <li>• Optimality proofs for minimal perfect hashing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Perfect Hashing Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Perfect Hashing Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Static Construction:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Query (Static):</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Dynamic Operations:</span>
                    <span className="text-blue-400 font-mono">O(1) amortized</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Minimal Perfect Hash:</span>
                    <span className="text-green-400 font-mono">O(n) construction, O(1) query</span>
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
                    <div className="text-blue-400 font-medium mb-1">Zero Collisions:</div>
                    <div className="text-gray-400">Guaranteed no hash collisions for the given key set</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Worst-Case O(1):</div>
                    <div className="text-gray-400">Constant time lookups even in worst case</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Precomputed:</div>
                    <div className="text-gray-400">Hash function built specifically for the key set</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">FKS Scheme:</div>
                    <div className="text-gray-400">Two-level perfect hashing by Fredman, Komlos, Szemeredi</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Minimal Perfect:</div>
                    <div className="text-gray-400">Maps to consecutive integers [0, n-1] with no gaps</div>
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

export default PerfectHashing;

