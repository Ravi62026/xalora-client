import React, { useState } from "react";
import { Layout } from "../components";

const HashTables = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Hash Function Examples
  const hashFunctions = [
    {
      name: "Division Method",
      formula: "h(k) = k % m",
      code: `// Division hash function
int divisionHash(int key, int tableSize) {
    return key % tableSize;
}

// Example: key = 42, tableSize = 10
// Result: 42 % 10 = 2`,
      advantages: ["Simple to implement", "Fast computation", "Good distribution for many cases"],
      disadvantages: ["Poor performance when m is power of 2", "Clustering issues with certain patterns"]
    },
    {
      name: "Multiplication Method",
      formula: "h(k) = floor(m * (k * A % 1))",
      code: `// Multiplication hash function (Knuth's suggestion: A ≈ 0.6180339887)
int multiplicationHash(int key, int tableSize) {
    const double A = 0.6180339887; // (√5 - 1)/2
    double fractionalPart = (key * A) - floor(key * A);
    return (int)(tableSize * fractionalPart);
}

// More precise implementation
int multiplicationHash(int key, int tableSize) {
    const double A = 0.6180339887;
    return (int)(tableSize * ((key * A) - floor(key * A)));
}`,
      advantages: ["Works well for any table size", "Less sensitive to patterns in key distribution"],
      disadvantages: ["Slightly slower than division method", "Floating point operations"]
    },
    {
      name: "Universal Hashing",
      formula: "h(k) = ((a * k + b) % p) % m",
      code: `// Universal hash function
class UniversalHash {
private:
    int a, b, p, m;

public:
    UniversalHash(int tableSize) : m(tableSize) {
        // Choose large prime p > m
        p = 1000003; // Large prime

        // Random coefficients
        a = rand() % (p - 1) + 1; // a ∈ [1, p-1]
        b = rand() % p;           // b ∈ [0, p-1]
    }

    int hash(int key) {
        return ((a * (long long)key + b) % p) % m;
    }
};

// Usage
UniversalHash hashFunc(100);
int hashValue = hashFunc.hash(42);`,
      advantages: ["Provably good worst-case performance", "Randomized to avoid worst-case inputs"],
      disadvantages: ["Requires random number generation", "Slightly more complex implementation"]
    },
    {
      name: "String Hashing (djb2)",
      formula: "h = 5381 + 33 * h + c",
      code: `// djb2 string hash function
unsigned long djb2Hash(const std::string& str) {
    unsigned long hash = 5381;

    for (char c : str) {
        hash = ((hash << 5) + hash) + c; // hash * 33 + c
    }

    return hash;
}

// Alternative: sdbm hash
unsigned long sdbmHash(const std::string& str) {
    unsigned long hash = 0;

    for (char c : str) {
        hash = c + (hash << 6) + (hash << 16) - hash;
    }

    return hash;
}

// Rolling hash for substrings
class RollingHash {
private:
    std::string text;
    int base = 29; // Prime base
    long long mod = 1000000007;
    std::vector<long long> prefixHash;
    std::vector<long long> powers;

public:
    RollingHash(const std::string& s) : text(s) {
        int n = text.size();
        prefixHash.resize(n + 1, 0);
        powers.resize(n + 1, 1);

        // Precompute powers
        for (int i = 1; i <= n; i++) {
            powers[i] = (powers[i - 1] * base) % mod;
        }

        // Compute prefix hashes
        for (int i = 1; i <= n; i++) {
            prefixHash[i] = (prefixHash[i - 1] * base + (text[i - 1] - 'a' + 1)) % mod;
        }
    }

    // Get hash of substring [left, right)
    long long getHash(int left, int right) {
        long long hash = prefixHash[right] - (prefixHash[left] * powers[right - left]) % mod;
        if (hash < 0) hash += mod;
        return hash % mod;
    }
};`,
      advantages: ["Very fast for string comparison", "Good avalanche effect", "Simple implementation"],
      disadvantages: ["Collisions possible", "Not cryptographically secure", "Fixed size output"]
    }
  ];

  // Collision Resolution Techniques
  const collisionResolution = [
    {
      id: "chaining",
      name: "Separate Chaining",
      description: "Each bucket contains a linked list of all keys that hash to it",
      complexity: { insert: "O(1) average", search: "O(1) average", delete: "O(1) average", worst_case: "O(n)" },
      code: `// Separate Chaining Implementation
template<typename K, typename V>
class HashTableChaining {
private:
    struct HashNode {
        K key;
        V value;
        HashNode* next;

        HashNode(K k, V v) : key(k), value(v), next(nullptr) {}
    };

    std::vector<HashNode*> table;
    int capacity;
    int size;
    double loadFactor;

    int hashFunction(K key) {
        return std::hash<K>()(key) % capacity;
    }

    void resize() {
        int newCapacity = capacity * 2;
        std::vector<HashNode*> newTable(newCapacity, nullptr);

        // Rehash all elements
        for (int i = 0; i < capacity; i++) {
            HashNode* current = table[i];
            while (current) {
                int newIndex = std::hash<K>()(current->key) % newCapacity;

                // Insert at head of new bucket
                HashNode* next = current->next;
                current->next = newTable[newIndex];
                newTable[newIndex] = current;

                current = next;
            }
        }

        table = std::move(newTable);
        capacity = newCapacity;
    }

public:
    HashTableChaining(int cap = 16) : capacity(cap), size(0), loadFactor(0.75) {
        table.resize(capacity, nullptr);
    }

    void insert(K key, V value) {
        int index = hashFunction(key);

        // Check if key already exists
        HashNode* current = table[index];
        while (current) {
            if (current->key == key) {
                current->value = value; // Update
                return;
            }
            current = current->next;
        }

        // Insert at head
        HashNode* newNode = new HashNode(key, value);
        newNode->next = table[index];
        table[index] = newNode;
        size++;

        // Resize if load factor exceeded
        if ((double)size / capacity > loadFactor) {
            resize();
        }
    }

    V* get(K key) {
        int index = hashFunction(key);

        HashNode* current = table[index];
        while (current) {
            if (current->key == key) {
                return &current->value;
            }
            current = current->next;
        }

        return nullptr;
    }

    bool remove(K key) {
        int index = hashFunction(key);

        HashNode* current = table[index];
        HashNode* prev = nullptr;

        while (current) {
            if (current->key == key) {
                if (prev) {
                    prev->next = current->next;
                } else {
                    table[index] = current->next;
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

    int getSize() { return size; }
    double getLoadFactor() { return (double)size / capacity; }
};`,
      advantages: ["Simple implementation", "Handles collisions gracefully", "No limit on number of elements", "Good cache performance"],
      disadvantages: ["Extra space for pointers", "Worst case O(n) operations", "Memory fragmentation"],
      useCases: ["General purpose hashing", "Database indexing", "Symbol tables in compilers"]
    },
    {
      id: "probing",
      name: "Open Addressing (Linear Probing)",
      description: "Store all elements directly in the hash table array using probing sequences",
      complexity: { insert: "O(1) average", search: "O(1) average", delete: "O(1) average", worst_case: "O(n)" },
      code: `// Linear Probing Implementation
template<typename K, typename V>
class HashTableLinearProbing {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;  // true if slot is occupied
        bool deleted;   // true if slot was deleted (for lazy deletion)

        HashEntry() : occupied(false), deleted(false) {}
    };

    std::vector<HashEntry> table;
    int capacity;
    int size;
    double loadFactor;

    int hashFunction(K key) {
        return std::hash<K>()(key) % capacity;
    }

    int probe(int hash, int i) {
        return (hash + i) % capacity; // Linear probing
    }

    void resize() {
        int oldCapacity = capacity;
        capacity *= 2;
        std::vector<HashEntry> oldTable = std::move(table);

        table = std::vector<HashEntry>(capacity);
        size = 0;

        // Rehash all elements
        for (int i = 0; i < oldCapacity; i++) {
            if (oldTable[i].occupied && !oldTable[i].deleted) {
                insert(oldTable[i].key, oldTable[i].value);
            }
        }
    }

public:
    HashTableLinearProbing(int cap = 16) : capacity(cap), size(0), loadFactor(0.75) {
        table.resize(capacity);
    }

    void insert(K key, V value) {
        if ((double)size / capacity > loadFactor) {
            resize();
        }

        int hash = hashFunction(key);
        int i = 0;

        // Find empty slot using linear probing
        while (true) {
            int index = probe(hash, i);

            if (!table[index].occupied) {
                // Found empty slot
                table[index].key = key;
                table[index].value = value;
                table[index].occupied = true;
                table[index].deleted = false;
                size++;
                return;
            } else if (table[index].key == key) {
                // Key already exists, update
                table[index].value = value;
                return;
            }

            i++;

            // Prevent infinite loop
            if (i >= capacity) {
                throw std::runtime_error("Hash table is full");
            }
        }
    }

    V* get(K key) {
        int hash = hashFunction(key);
        int i = 0;

        while (true) {
            int index = probe(hash, i);

            if (!table[index].occupied) {
                // Empty slot, key not found
                return nullptr;
            } else if (!table[index].deleted && table[index].key == key) {
                // Found the key
                return &table[index].value;
            }

            i++;

            // Prevent infinite loop
            if (i >= capacity) {
                return nullptr;
            }
        }
    }

    bool remove(K key) {
        int hash = hashFunction(key);
        int i = 0;

        while (true) {
            int index = probe(hash, i);

            if (!table[index].occupied) {
                // Empty slot, key not found
                return false;
            } else if (!table[index].deleted && table[index].key == key) {
                // Found the key, mark as deleted
                table[index].deleted = true;
                size--;
                return true;
            }

            i++;

            // Prevent infinite loop
            if (i >= capacity) {
                return false;
            }
        }
    }

    int getSize() { return size; }
    double getLoadFactor() { return (double)size / capacity; }
};`,
      advantages: ["No extra space for pointers", "Better cache performance", "Simpler memory management"],
      disadvantages: ["Clustering problems", "Requires good load factor management", "Deletion is complex"],
      useCases: ["Memory-constrained systems", "Real-time systems", "Embedded systems"]
    },
    {
      id: "quadratic-probing",
      name: "Quadratic Probing",
      description: "Use quadratic function to find next probe position: h(k,i) = (h(k) + i²) % m",
      complexity: { insert: "O(1) average", search: "O(1) average", delete: "O(1) average", worst_case: "O(n)" },
      code: `// Quadratic Probing Implementation
template<typename K, typename V>
class HashTableQuadraticProbing {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;
        bool deleted;

        HashEntry() : occupied(false), deleted(false) {}
    };

    std::vector<HashEntry> table;
    int capacity;
    int size;

    int hashFunction(K key) {
        return std::hash<K>()(key) % capacity;
    }

    int probe(int hash, int i) {
        return (hash + i * i) % capacity; // Quadratic probing
    }

public:
    HashTableQuadraticProbing(int cap = 16) : capacity(cap), size(0) {
        table.resize(capacity);
    }

    void insert(K key, V value) {
        int hash = hashFunction(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(hash, i);

            if (!table[index].occupied || table[index].deleted) {
                // Found empty or deleted slot
                table[index].key = key;
                table[index].value = value;
                table[index].occupied = true;
                table[index].deleted = false;
                size++;
                return;
            } else if (table[index].key == key) {
                // Key exists, update
                table[index].value = value;
                return;
            }

            i++;
        }

        throw std::runtime_error("Hash table is full");
    }

    V* get(K key) {
        int hash = hashFunction(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(hash, i);

            if (!table[index].occupied) {
                // Empty slot, key not found
                return nullptr;
            } else if (!table[index].deleted && table[index].key == key) {
                // Found the key
                return &table[index].value;
            }

            i++;
        }

        return nullptr;
    }

    bool remove(K key) {
        int hash = hashFunction(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(hash, i);

            if (!table[index].occupied) {
                return false;
            } else if (!table[index].deleted && table[index].key == key) {
                table[index].deleted = true;
                size--;
                return true;
            }

            i++;
        }

        return false;
    }
};`,
      advantages: ["Reduces primary clustering", "Better probe sequence distribution", "Good cache performance"],
      disadvantages: ["Secondary clustering possible", "Requires careful table size selection", "May not find empty slots"],
      useCases: ["Systems needing reduced clustering", "Performance-critical applications"]
    },
    {
      id: "double-hashing",
      name: "Double Hashing",
      description: "Use two hash functions: h(k,i) = (h1(k) + i × h2(k)) % m",
      complexity: { insert: "O(1) average", search: "O(1) average", delete: "O(1) average", worst_case: "O(n)" },
      code: `// Double Hashing Implementation
template<typename K, typename V>
class HashTableDoubleHashing {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;
        bool deleted;

        HashEntry() : occupied(false), deleted(false) {}
    };

    std::vector<HashEntry> table;
    int capacity;
    int size;

    int hash1(K key) {
        return std::hash<K>()(key) % capacity;
    }

    int hash2(K key) {
        // Second hash function (must be non-zero)
        int h2 = 7 - (std::hash<K>()(key) % 7); // Prime number
        return h2;
    }

    int probe(int hash1, int hash2, int i) {
        return (hash1 + i * hash2) % capacity;
    }

public:
    HashTableDoubleHashing(int cap = 16) : capacity(cap), size(0) {
        table.resize(capacity);
    }

    void insert(K key, V value) {
        int h1 = hash1(key);
        int h2 = hash2(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(h1, h2, i);

            if (!table[index].occupied || table[index].deleted) {
                table[index].key = key;
                table[index].value = value;
                table[index].occupied = true;
                table[index].deleted = false;
                size++;
                return;
            } else if (table[index].key == key) {
                table[index].value = value;
                return;
            }

            i++;
        }

        throw std::runtime_error("Hash table is full");
    }

    V* get(K key) {
        int h1 = hash1(key);
        int h2 = hash2(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(h1, h2, i);

            if (!table[index].occupied) {
                return nullptr;
            } else if (!table[index].deleted && table[index].key == key) {
                return &table[index].value;
            }

            i++;
        }

        return nullptr;
    }

    bool remove(K key) {
        int h1 = hash1(key);
        int h2 = hash2(key);
        int i = 0;

        while (i < capacity) {
            int index = probe(h1, h2, i);

            if (!table[index].occupied) {
                return false;
            } else if (!table[index].deleted && table[index].key == key) {
                table[index].deleted = true;
                size--;
                return true;
            }

            i++;
        }

        return false;
    }
};`,
      advantages: ["Eliminates both primary and secondary clustering", "Best probe sequence distribution", "Optimal open addressing method"],
      disadvantages: ["Requires two hash functions", "More complex implementation", "Slightly slower computation"],
      useCases: ["High-performance systems", "Applications requiring minimal clustering", "Database systems"]
    }
  ];

  // Hash Table Applications
  const applications = [
    {
      id: "dictionary",
      name: "Dictionary/Symbol Table",
      description: "Fast key-value storage and retrieval",
      useCase: "Programming language symbol tables, configuration storage"
    },
    {
      id: "caching",
      name: "LRU Cache Implementation",
      description: "Least Recently Used cache with O(1) operations",
      useCase: "Web browsers, database query caching, CPU caches"
    },
    {
      id: "database-indexing",
      name: "Database Indexing",
      description: "Fast lookup for database records",
      useCase: "Primary key indexing, secondary indexing"
    },
    {
      id: "set-operations",
      name: "Set Operations",
      description: "Fast membership testing and set operations",
      useCase: "Duplicate detection, unique value storage"
    },
    {
      id: "frequency-counting",
      name: "Frequency Counting",
      description: "Count occurrences of elements efficiently",
      useCase: "Word frequency analysis, histogram generation"
    }
  ];

  // Performance Analysis
  const performanceAnalysis = [
    {
      metric: "Load Factor",
      description: "Ratio of elements to table size (n/m)",
      impact: "Higher load factor increases collisions, affects performance",
      optimal: "0.75 for separate chaining, 0.5-0.75 for open addressing"
    },
    {
      metric: "Average Probe Length",
      description: "Average number of probes needed for operations",
      impact: "Directly affects operation time complexity",
      optimal: "1-2 probes for good hash functions and load factors"
    },
    {
      metric: "Clustering Factor",
      description: "Measure of how elements cluster together",
      impact: "Poor clustering increases search time significantly",
      optimal: "Minimize clustering through good hash functions and probing"
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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hash Tables
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the fundamental data structure for O(1) average-time operations.
              Understand hash functions, collision resolution, and performance optimization.
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
              onClick={() => setActiveSection("hash-functions")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "hash-functions"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Hash Functions
            </button>
            <button
              onClick={() => setActiveSection("collision-resolution")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "collision-resolution"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Collision Resolution
            </button>
            <button
              onClick={() => setActiveSection("analysis")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "analysis"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Performance Analysis
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "applications"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Hash Tables Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">What are Hash Tables?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Hash tables are data structures that provide average O(1) time complexity for
                    insertions, deletions, and lookups. They use a hash function to map keys to
                    indices in an array, enabling extremely fast access to stored values.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Core Components</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">🔢</span>
                      <span><strong>Hash Function:</strong> Maps keys to array indices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">📊</span>
                      <span><strong>Array/Table:</strong> Stores key-value pairs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">💥</span>
                      <span><strong>Collision Resolution:</strong> Handles multiple keys mapping to same index</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">📏</span>
                      <span><strong>Load Factor:</strong> Ratio of elements to table size</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Key Characteristics</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">Average Case Performance</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Insert: O(1)</li>
                        <li>• Search: O(1)</li>
                        <li>• Delete: O(1)</li>
                        <li>• Space: O(n)</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">Worst Case Performance</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Insert: O(n)</li>
                        <li>• Search: O(n)</li>
                        <li>• Delete: O(n)</li>
                        <li>• Depends on collisions</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">Trade-offs</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Fast operations vs memory usage</li>
                        <li>• Deterministic vs probabilistic</li>
                        <li>• Simple vs complex collision handling</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Hash Function Quality</h4>
                  <p className="text-gray-300">Determines distribution and collision rate</p>
                  <p className="text-sm text-gray-400 mt-2">Critical for performance</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Load Factor Management</h4>
                  <p className="text-gray-300">Controls when to resize the table</p>
                  <p className="text-sm text-gray-400 mt-2">Balances time and space</p>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Collision Handling</h4>
                  <p className="text-gray-300">Strategy for hash conflicts</p>
                  <p className="text-sm text-gray-400 mt-2">Affects worst-case behavior</p>
                </div>
              </div>
            </div>
          )}

          {/* Hash Functions Section */}
          {activeSection === "hash-functions" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Function Design</h2>

              <div className="grid grid-cols-1 gap-8">
                {hashFunctions.map((hashFunc, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{hashFunc.name}</h3>
                        <div className="bg-purple-900/50 px-4 py-2 rounded-lg">
                          <code className="text-purple-300 font-mono text-sm">{hashFunc.formula}</code>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Advantages</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {hashFunc.advantages.map((adv, i) => (
                              <li key={i}>• {adv}</li>
                            ))}
                          </ul>

                          <h4 className="text-lg font-semibold text-red-400 mt-4 mb-3">Disadvantages</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {hashFunc.disadvantages.map((dis, i) => (
                              <li key={i}>• {dis}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{hashFunc.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collision Resolution Section */}
          {activeSection === "collision-resolution" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Collision Resolution Techniques</h2>

              <div className="grid grid-cols-1 gap-8">
                {collisionResolution.map((technique) => (
                  <div
                    key={technique.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">{technique.name}</h3>
                      <p className="text-gray-300 mb-6">{technique.description}</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Time Complexity</h4>
                          <div className="space-y-2">
                            {Object.entries(technique.complexity).map(([op, comp]) => (
                              <div key={op} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                                <span className="text-gray-300 capitalize">{op}:</span>
                                {renderComplexityBadge(comp)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Advantages</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            {technique.advantages.map((adv, i) => (
                              <li key={i}>• {adv}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-red-400 mb-3">Disadvantages</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {technique.disadvantages.map((dis, i) => (
                            <li key={i}>• {dis}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-yellow-400 mb-3">Use Cases</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {technique.useCases.map((use, i) => (
                            <li key={i}>• {use}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{technique.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Analysis Section */}
          {activeSection === "analysis" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Performance Analysis & Optimization</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Performance Metrics */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">Key Performance Metrics</h3>

                    <div className="grid grid-cols-1 gap-6">
                      {performanceAnalysis.map((metric, idx) => (
                        <div key={idx} className="bg-gray-700/50 p-6 rounded-xl">
                          <h4 className="text-xl font-semibold text-cyan-400 mb-3">{metric.metric}</h4>
                          <p className="text-gray-300 mb-3">{metric.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-yellow-400 font-medium mb-2">Impact</h5>
                              <p className="text-gray-300 text-sm">{metric.impact}</p>
                            </div>
                            <div>
                              <h5 className="text-green-400 font-medium mb-2">Optimal Range</h5>
                              <p className="text-gray-300 text-sm">{metric.optimal}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Load Factor Analysis */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">Load Factor Impact Analysis</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-700/50 p-6 rounded-xl">
                        <h4 className="text-cyan-400 mb-4">Separate Chaining</h4>
                        <div className="space-y-3 text-sm text-gray-300">
                          <p>• Load factor can exceed 1.0</p>
                          <p>• Performance degrades gracefully</p>
                          <p>• Average case: O(1 + α) where α = load factor</p>
                          <p>• Worst case: O(n) for single bucket</p>
                          <p>• Typical threshold: 0.75 for resizing</p>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-6 rounded-xl">
                        <h4 className="text-cyan-400 mb-4">Open Addressing</h4>
                        <div className="space-y-3 text-sm text-gray-300">
                          <p>• Load factor must stay &lt; 1.0</p>
                          <p>• Performance degrades rapidly above 0.8</p>
                          <p>• Clustering affects probe sequences</p>
                          <p>• Typical threshold: 0.5-0.75 for resizing</p>
                          <p>• Memory overhead for deleted slots</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-yellow-400 mb-4">Mathematical Analysis</h4>
                      <div className="space-y-3 text-sm text-gray-300">
                        <p><strong>Expected Probe Length (Linear Probing):</strong></p>
                        <p>• Successful search: (1/2) × (1 + 1/(1-α)²)</p>
                        <p>• Unsuccessful search: (1/2) × (1 + 1/(1-α))</p>
                        <p>• Where α is the load factor</p>

                        <p className="mt-3"><strong>Separate Chaining Cost:</strong></p>
                        <p>• Average: O(1 + α) for uniform hashing</p>
                        <p>• Worst case: O(n) when all keys hash to same bucket</p>
                        <p>• α = n/m (load factor)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hash Table vs Other Structures */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">Hash Tables vs Other Data Structures</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Operation</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">Hash Table</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Balanced BST</th>
                            <th className="pb-4 text-green-400 text-lg font-bold">Sorted Array</th>
                            <th className="pb-4 text-orange-400 text-lg font-bold">Skip List</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Search</td>
                            <td className="py-4 text-green-400 font-medium">O(1) avg</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n) avg</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Insert</td>
                            <td className="py-4 text-green-400 font-medium">O(1) avg</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n) avg</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Delete</td>
                            <td className="py-4 text-green-400 font-medium">O(1) avg</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n) avg</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Space</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                            <td className="py-4 text-green-400 font-medium">O(n)</td>
                            <td className="py-4 text-red-400 font-medium">O(n log n)</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Ordered Ops</td>
                            <td className="py-4 text-red-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">Yes</td>
                            <td className="py-4 text-green-400 font-medium">Yes</td>
                            <td className="py-4 text-green-400 font-medium">Yes</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-purple-400 transition-all duration-300">Worst Case</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Hash Table Applications</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-purple-400 mb-2">{app.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{app.description}</p>
                      <div className="bg-purple-900/20 border border-purple-700/50 p-3 rounded-lg">
                        <p className="text-purple-300 text-sm"><strong>Use Case:</strong> {app.useCase}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Hash Problems</h3>
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
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Hash Problems</h3>
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
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Hash Problems</h3>
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
                    <span>Longest Substring Without Repeating Characters</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Hash Table Design</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• How would you implement a hash table?</li>
                    <li>• Explain collision resolution strategies</li>
                    <li>• Design a hash function for strings</li>
                    <li>• Handle resizing and load factor</li>
                    <li>• Thread-safe hash table design</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Performance & Analysis</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Average vs worst case complexity</li>
                    <li>• Impact of load factor on performance</li>
                    <li>• Compare with other data structures</li>
                    <li>• Memory overhead analysis</li>
                    <li>• Cache performance considerations</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Concepts</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Universal hashing properties</li>
                    <li>• Cuckoo hashing advantages</li>
                    <li>• Perfect hashing applications</li>
                    <li>• Consistent hashing in distributed systems</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Real-World Applications</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Database indexing strategies</li>
                    <li>• Compiler symbol table implementation</li>
                    <li>• Cache replacement policies</li>
                    <li>• Distributed hash tables (DHT)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hash Table Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Hash Table Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Time Complexities</h3>
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
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Key Concepts</h3>
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
                    <div className="text-cyan-400 font-medium mb-1">Universal Hashing:</div>
                    <div className="text-gray-400">Randomized hash functions with guarantees</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Rehashing:</div>
                    <div className="text-gray-400">Resize table and redistribute elements</div>
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

export default HashTables;

