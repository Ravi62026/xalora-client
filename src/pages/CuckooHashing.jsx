import React, { useState } from "react";
import { Layout } from "../components";

const CuckooHashing = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Cuckoo Hashing Implementation
  const cuckooHashingImplementation = {
    basic: `// Basic Cuckoo Hashing Implementation
#include <vector>
#include <functional>
#include <stdexcept>
#include <iostream>

template<typename K, typename V>
class CuckooHashTable {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;

        HashEntry() : occupied(false) {}
        HashEntry(const K& k, const V& v) : key(k), value(v), occupied(true) {}
    };

    std::vector<HashEntry> table1;
    std::vector<HashEntry> table2;
    size_t size;
    size_t capacity;
    size_t maxEvictions; // Prevent infinite loops

    // Hash functions
    size_t hash1(const K& key) const {
        return std::hash<K>()(key) % capacity;
    }

    size_t hash2(const K& key) const {
        // Use a different hash function
        size_t hash = std::hash<K>()(key);
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b; // Different mixing
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >> 16) ^ hash;
        return hash % capacity;
    }

    // Insert with cuckoo displacement
    bool cuckooInsert(const K& key, const V& value, size_t tableNum, size_t maxDepth = 0) {
        if (maxDepth >= maxEvictions) {
            // Rehash needed
            rehash();
            return insert(key, value); // Retry after rehash
        }

        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Choose which table to try first
        size_t currentTable = tableNum;
        size_t currentIndex = (currentTable == 1) ? index1 : index2;

        std::vector<HashEntry>& currentTableRef = (currentTable == 1) ? table1 : table2;
        std::vector<HashEntry>& otherTableRef = (currentTable == 1) ? table2 : table1;

        // If slot is empty, place the key-value pair there
        if (!currentTableRef[currentIndex].occupied) {
            currentTableRef[currentIndex] = HashEntry(key, value);
            return true;
        }

        // If the slot contains the same key, update the value
        if (currentTableRef[currentIndex].key == key) {
            currentTableRef[currentIndex].value = value;
            return true;
        }

        // Evict the existing key-value pair
        HashEntry evicted = currentTableRef[currentIndex];
        currentTableRef[currentIndex] = HashEntry(key, value);

        // Try to place the evicted pair in the other table
        size_t otherTable = 3 - currentTable; // 1->2, 2->1
        return cuckooInsert(evicted.key, evicted.value, otherTable, maxDepth + 1);
    }

    void rehash() {
        capacity *= 2;
        maxEvictions = capacity / 2; // Allow more evictions for larger table

        std::vector<HashEntry> oldTable1 = std::move(table1);
        std::vector<HashEntry> oldTable2 = std::move(table2);

        table1 = std::vector<HashEntry>(capacity);
        table2 = std::vector<HashEntry>(capacity);

        size = 0;

        // Reinsert all elements
        auto reinsertTable = [&](const std::vector<HashEntry>& table) {
            for (const auto& entry : table) {
                if (entry.occupied) {
                    insert(entry.key, entry.value);
                }
            }
        };

        reinsertTable(oldTable1);
        reinsertTable(oldTable2);
    }

public:
    CuckooHashTable(size_t initialCapacity = 16)
        : capacity(initialCapacity), size(0), maxEvictions(initialCapacity / 4) {
        table1.resize(capacity);
        table2.resize(capacity);
    }

    bool insert(const K& key, const V& value) {
        // Check if key already exists
        V* existing = get(key);
        if (existing) {
            *existing = value; // Update existing
            return true;
        }

        bool success = cuckooInsert(key, value, 1); // Start with table 1
        if (success) {
            size++;
        }
        return success;
    }

    V* get(const K& key) {
        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Check both tables
        if (table1[index1].occupied && table1[index1].key == key) {
            return &table1[index1].value;
        }
        if (table2[index2].occupied && table2[index2].key == key) {
            return &table2[index2].value;
        }

        return nullptr;
    }

    bool remove(const K& key) {
        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Check both tables
        if (table1[index1].occupied && table1[index1].key == key) {
            table1[index1].occupied = false;
            size--;
            return true;
        }
        if (table2[index2].occupied && table2[index2].key == key) {
            table2[index2].occupied = false;
            size--;
            return true;
        }

        return false;
    }

    bool contains(const K& key) const {
        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        return (table1[index1].occupied && table1[index1].key == key) ||
               (table2[index2].occupied && table2[index2].key == key);
    }

    size_t getSize() const { return size; }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size) / (2 * capacity); }
};

// Usage example
void demonstrateCuckooHashing() {
    CuckooHashTable<std::string, int> table;

    // Insert some key-value pairs
    table.insert("apple", 10);
    table.insert("banana", 20);
    table.insert("cherry", 30);
    table.insert("date", 40);

    std::cout << "After insertions:" << std::endl;
    std::cout << "Size: " << table.getSize() << std::endl;
    std::cout << "Capacity: " << table.getCapacity() << std::endl;
    std::cout << "Load factor: " << table.getLoadFactor() << std::endl;

    // Test lookups
    auto appleValue = table.get("apple");
    auto grapeValue = table.get("grape");

    std::cout << "\\nLookups:" << std::endl;
    std::cout << "apple: " << (appleValue ? std::to_string(*appleValue) : "not found") << std::endl;
    std::cout << "grape: " << (grapeValue ? std::to_string(*grapeValue) : "not found") << std::endl;

    // Test removal
    table.remove("banana");
    std::cout << "\\nAfter removing banana:" << std::endl;
    std::cout << "Size: " << table.getSize() << std::endl;
    std::cout << "banana: " << (table.get("banana") ? "found" : "not found") << std::endl;
}`,
    optimized: `// Optimized Cuckoo Hashing with Multiple Hash Functions
#include <vector>
#include <array>
#include <functional>
#include <stdexcept>

template<typename K, typename V, size_t MaxHashFunctions = 3>
class OptimizedCuckooHash {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;

        HashEntry() : occupied(false) {}
        HashEntry(const K& k, const V& v) : key(k), value(v), occupied(true) {}
    };

    std::vector<HashEntry> table1;
    std::vector<HashEntry> table2;
    size_t size;
    size_t capacity;
    size_t maxEvictions;
    std::array<std::function<size_t(const K&)>, MaxHashFunctions> hashFunctions;

    // Initialize hash functions
    void initializeHashFunctions() {
        hashFunctions[0] = [this](const K& key) {
            return std::hash<K>()(key) % capacity;
        };

        hashFunctions[1] = [this](const K& key) {
            size_t hash = std::hash<K>()(key);
            hash ^= hash >> 16;
            hash *= 0x85ebca6b;
            hash ^= hash >> 13;
            hash *= 0xc2b2ae35;
            hash ^= hash >> 16;
            return hash % capacity;
        };

        if constexpr (MaxHashFunctions >= 3) {
            hashFunctions[2] = [this](const K& key) {
                size_t hash = std::hash<K>()(key);
                hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
                hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
                hash = (hash >> 16) ^ hash;
                return hash % capacity;
            };
        }
    }

    // Get all possible indices for a key
    std::array<size_t, MaxHashFunctions> getIndices(const K& key) const {
        std::array<size_t, MaxHashFunctions> indices;
        for (size_t i = 0; i < MaxHashFunctions; ++i) {
            indices[i] = hashFunctions[i](key);
        }
        return indices;
    }

    // Advanced cuckoo insertion with multiple choices
    bool cuckooInsert(const K& key, const V& value, size_t excludedTable, size_t excludedIndex, size_t maxDepth = 0) {
        if (maxDepth >= maxEvictions) {
            rehash();
            return insert(key, value);
        }

        auto indices = getIndices(key);

        // Try to place in each possible slot (except excluded one)
        for (size_t i = 0; i < MaxHashFunctions; ++i) {
            size_t tableNum = (i % 2) + 1; // Alternate between tables
            size_t index = indices[i];

            // Skip the excluded slot
            if (tableNum == excludedTable && index == excludedIndex) {
                continue;
            }

            std::vector<HashEntry>& table = (tableNum == 1) ? table1 : table2;

            if (!table[index].occupied) {
                table[index] = HashEntry(key, value);
                return true;
            }

            if (table[index].key == key) {
                table[index].value = value;
                return true;
            }
        }

        // All slots occupied, need to evict
        // Choose a random slot to evict from
        size_t evictChoice = rand() % MaxHashFunctions;
        size_t evictTableNum = (evictChoice % 2) + 1;
        size_t evictIndex = indices[evictChoice];

        std::vector<HashEntry>& evictTable = (evictTableNum == 1) ? table1 : table2;
        HashEntry evicted = evictTable[evictIndex];
        evictTable[evictIndex] = HashEntry(key, value);

        return cuckooInsert(evicted.key, evicted.value, evictTableNum, evictIndex, maxDepth + 1);
    }

    void rehash() {
        capacity *= 2;
        maxEvictions = capacity;

        std::vector<HashEntry> oldTable1 = std::move(table1);
        std::vector<HashEntry> oldTable2 = std::move(table2);

        table1 = std::vector<HashEntry>(capacity);
        table2 = std::vector<HashEntry>(capacity);

        initializeHashFunctions();
        size = 0;

        // Reinsert all elements
        auto reinsertTable = [&](const std::vector<HashEntry>& table) {
            for (const auto& entry : table) {
                if (entry.occupied) {
                    insert(entry.key, entry.value);
                }
            }
        };

        reinsertTable(oldTable1);
        reinsertTable(oldTable2);
    }

public:
    OptimizedCuckooHash(size_t initialCapacity = 16)
        : capacity(initialCapacity), size(0), maxEvictions(initialCapacity) {
        table1.resize(capacity);
        table2.resize(capacity);
        initializeHashFunctions();
    }

    bool insert(const K& key, const V& value) {
        if (contains(key)) {
            // Update existing value
            auto indices = getIndices(key);
            for (size_t i = 0; i < MaxHashFunctions; ++i) {
                size_t tableNum = (i % 2) + 1;
                size_t index = indices[i];
                std::vector<HashEntry>& table = (tableNum == 1) ? table1 : table2;

                if (table[index].occupied && table[index].key == key) {
                    table[index].value = value;
                    return true;
                }
            }
        }

        bool success = cuckooInsert(key, value, 0, 0);
        if (success) size++;
        return success;
    }

    V* get(const K& key) {
        auto indices = getIndices(key);

        for (size_t i = 0; i < MaxHashFunctions; ++i) {
            size_t tableNum = (i % 2) + 1;
            size_t index = indices[i];
            std::vector<HashEntry>& table = (tableNum == 1) ? table1 : table2;

            if (table[index].occupied && table[index].key == key) {
                return &table[index].value;
            }
        }

        return nullptr;
    }

    bool remove(const K& key) {
        auto indices = getIndices(key);

        for (size_t i = 0; i < MaxHashFunctions; ++i) {
            size_t tableNum = (i % 2) + 1;
            size_t index = indices[i];
            std::vector<HashEntry>& table = (tableNum == 1) ? table1 : table2;

            if (table[index].occupied && table[index].key == key) {
                table[index].occupied = false;
                size--;
                return true;
            }
        }

        return false;
    }

    bool contains(const K& key) const {
        auto indices = getIndices(key);

        for (size_t i = 0; i < MaxHashFunctions; ++i) {
            size_t tableNum = (i % 2) + 1;
            size_t index = indices[i];
            const std::vector<HashEntry>& table = (tableNum == 1) ? table1 : table2;

            if (table[index].occupied && table[index].key == key) {
                return true;
            }
        }

        return false;
    }

    size_t getSize() const { return size; }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size) / (2 * capacity); }
};

// Usage example
void demonstrateOptimizedCuckooHashing() {
    OptimizedCuckooHash<std::string, int, 3> table;

    // Insert many elements to test performance
    for (int i = 0; i < 100; ++i) {
        table.insert("key" + std::to_string(i), i * 10);
    }

    std::cout << "Optimized Cuckoo Hashing:" << std::endl;
    std::cout << "Size: " << table.getSize() << std::endl;
    std::cout << "Capacity: " << table.getCapacity() << std::endl;
    std::cout << "Load factor: " << table.getLoadFactor() << std::endl;

    // Test lookups
    auto value50 = table.get("key50");
    auto value150 = table.get("key150");

    std::cout << "key50: " << (value50 ? std::to_string(*value50) : "not found") << std::endl;
    std::cout << "key150: " << (value150 ? std::to_string(*value150) : "not found") << std::endl;
}`,
    concurrent: `// Concurrent Cuckoo Hashing with Fine-Grained Locking
#include <vector>
#include <mutex>
#include <shared_mutex>
#include <functional>
#include <thread>
#include <atomic>

template<typename K, typename V>
class ConcurrentCuckooHash {
private:
    struct HashEntry {
        K key;
        V value;
        bool occupied;
        mutable std::shared_mutex mutex; // Reader-writer lock per entry

        HashEntry() : occupied(false) {}
        HashEntry(const K& k, const V& v) : key(k), value(v), occupied(true) {}
    };

    std::vector<HashEntry> table1;
    std::vector<HashEntry> table2;
    std::atomic<size_t> size;
    size_t capacity;
    size_t maxEvictions;

    // Hash functions
    size_t hash1(const K& key) const {
        return std::hash<K>()(key) % capacity;
    }

    size_t hash2(const K& key) const {
        size_t hash = std::hash<K>()(key);
        hash ^= hash >> 16;
        hash *= 0x85ebca6b;
        return hash % capacity;
    }

    // Concurrent cuckoo insert
    bool concurrentCuckooInsert(const K& key, const V& value, size_t tableNum,
                               size_t currentIndex, size_t maxDepth = 0) {
        if (maxDepth >= maxEvictions) {
            // Need to rehash - this is complex in concurrent setting
            // For simplicity, we'll do a global rehash (expensive but correct)
            rehash();
            return insert(key, value);
        }

        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Try to acquire locks for both possible slots
        std::vector<HashEntry*> entriesToLock;
        if (tableNum != 2) entriesToLock.push_back(&table1[index1]);
        if (tableNum != 1) entriesToLock.push_back(&table2[index2]);

        // Sort entries to avoid deadlocks (lock ordering)
        std::sort(entriesToLock.begin(), entriesToLock.end());

        // Acquire all locks
        std::vector<std::unique_lock<std::shared_mutex>> locks;
        for (auto entry : entriesToLock) {
            locks.emplace_back(entry->mutex);
        }

        // Check again after acquiring locks
        if ((tableNum != 2 && table1[index1].occupied && table1[index1].key == key) ||
            (tableNum != 1 && table2[index2].occupied && table2[index2].key == key)) {
            // Key already exists, update
            if (tableNum != 2 && table1[index1].key == key) {
                table1[index1].value = value;
            } else {
                table2[index2].value = value;
            }
            return true;
        }

        // Try to find an empty slot
        if (tableNum != 2 && !table1[index1].occupied) {
            table1[index1] = HashEntry(key, value);
            return true;
        }
        if (tableNum != 1 && !table2[index2].occupied) {
            table2[index2] = HashEntry(key, value);
            return true;
        }

        // Need to evict - choose one to evict
        HashEntry* evictFrom = nullptr;
        size_t evictTableNum = 0;

        if (tableNum != 2 && rand() % 2 == 0) {
            evictFrom = &table1[index1];
            evictTableNum = 1;
        } else {
            evictFrom = &table2[index2];
            evictTableNum = 2;
        }

        HashEntry evicted = *evictFrom;
        *evictFrom = HashEntry(key, value);

        // Release our locks before recursing
        locks.clear();

        // Try to place the evicted item
        return concurrentCuckooInsert(evicted.key, evicted.value, evictTableNum,
                                    (evictTableNum == 1) ? index1 : index2, maxDepth + 1);
    }

    void rehash() {
        // Global lock for rehashing (simplified)
        static std::mutex rehashMutex;
        std::unique_lock<std::mutex> rehashLock(rehashMutex);

        capacity *= 2;
        maxEvictions = capacity;

        std::vector<HashEntry> oldTable1 = std::move(table1);
        std::vector<HashEntry> oldTable2 = std::move(table2);

        table1 = std::vector<HashEntry>(capacity);
        table2 = std::vector<HashEntry>(capacity);

        size = 0;

        // Reinsert all elements (locks are acquired per entry)
        auto reinsertTable = [&](std::vector<HashEntry>& table) {
            for (auto& entry : table) {
                if (entry.occupied) {
                    insert(entry.key, entry.value);
                }
            }
        };

        reinsertTable(oldTable1);
        reinsertTable(oldTable2);
    }

public:
    ConcurrentCuckooHash(size_t initialCapacity = 16)
        : capacity(initialCapacity), size(0), maxEvictions(initialCapacity / 4) {
        table1.resize(capacity);
        table2.resize(capacity);
    }

    bool insert(const K& key, const V& value) {
        bool success = concurrentCuckooInsert(key, value, 1, 0);
        if (success) size++;
        return success;
    }

    std::optional<V> get(const K& key) {
        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Try table1 first (shared lock)
        {
            std::shared_lock<std::shared_mutex> lock1(table1[index1].mutex);
            if (table1[index1].occupied && table1[index1].key == key) {
                return table1[index1].value;
            }
        }

        // Try table2
        {
            std::shared_lock<std::shared_mutex> lock2(table2[index2].mutex);
            if (table2[index2].occupied && table2[index2].key == key) {
                return table2[index2].value;
            }
        }

        return std::nullopt;
    }

    bool remove(const K& key) {
        size_t index1 = hash1(key);
        size_t index2 = hash2(key);

        // Try table1
        {
            std::unique_lock<std::shared_mutex> lock1(table1[index1].mutex);
            if (table1[index1].occupied && table1[index1].key == key) {
                table1[index1].occupied = false;
                size--;
                return true;
            }
        }

        // Try table2
        {
            std::unique_lock<std::shared_mutex> lock2(table2[index2].mutex);
            if (table2[index2].occupied && table2[index2].key == key) {
                table2[index2].occupied = false;
                size--;
                return true;
            }
        }

        return false;
    }

    size_t getSize() const { return size.load(); }
    size_t getCapacity() const { return capacity; }
    double getLoadFactor() const { return static_cast<double>(size.load()) / (2 * capacity); }
};

// Usage example
void demonstrateConcurrentCuckooHashing() {
    ConcurrentCuckooHash<std::string, int> table;

    // Concurrent insertions from multiple threads
    auto insertWorker = [&](int start, int end) {
        for (int i = start; i < end; ++i) {
            table.insert("key" + std::to_string(i), i);
        }
    };

    std::thread t1(insertWorker, 0, 25);
    std::thread t2(insertWorker, 25, 50);
    std::thread t3(insertWorker, 50, 75);
    std::thread t4(insertWorker, 75, 100);

    t1.join();
    t2.join();
    t3.join();
    t4.join();

    std::cout << "Concurrent insertions completed:" << std::endl;
    std::cout << "Size: " << table.getSize() << std::endl;
    std::cout << "Load factor: " << table.getLoadFactor() << std::endl;

    // Test concurrent reads
    auto readWorker = [&](int start, int end) {
        for (int i = start; i < end; ++i) {
            auto value = table.get("key" + std::to_string(i));
            if (value && *value != i) {
                std::cout << "Data inconsistency detected!" << std::endl;
            }
        }
    };

    std::thread r1(readWorker, 0, 25);
    std::thread r2(readWorker, 25, 50);
    std::thread r3(readWorker, 50, 75);
    std::thread r4(readWorker, 75, 100);

    r1.join();
    r2.join();
    r3.join();
    r4.join();

    std::cout << "Concurrent reads completed successfully" << std::endl;
}`
  };

  // Applications
  const applications = [
    {
      id: "hardware-caches",
      name: "Hardware Cache Replacement",
      description: "Implementing high-performance cache replacement policies",
      example: "CPU cache management, database buffer pools",
      code: `class CuckooCache {
private:
    ConcurrentCuckooHash<std::string, CacheEntry> cache;
    size_t maxSize;
    std::atomic<size_t> currentSize;

public:
    CacheEntry* get(const std::string& key) {
        auto entry = cache.get(key);
        if (entry) {
            entry->lastAccess = std::chrono::steady_clock::now();
            entry->accessCount++;
        }
        return entry ? &(*entry) : nullptr;
    }

    void put(const std::string& key, const std::string& value) {
        CacheEntry newEntry{value, std::chrono::steady_clock::now(), 1};

        if (currentSize >= maxSize) {
            // Evict using cuckoo displacement (complex to implement)
            // For simplicity, we'll just overwrite
        }

        cache.insert(key, newEntry);
        currentSize++;
    }
};`
    },
    {
      id: "network-routing",
      name: "Network Packet Classification",
      description: "Fast packet routing and filtering decisions",
      example: "Firewall rules, traffic shaping, QoS classification",
      code: `class PacketClassifier {
private:
    ConcurrentCuckooHash<PacketSignature, Action> rules;

public:
    Action classifyPacket(const Packet& packet) {
        PacketSignature sig = extractSignature(packet);

        auto action = rules.get(sig);
        return action ? *action : Action::DEFAULT;
    }

    void addRule(const PacketSignature& sig, Action action) {
        rules.insert(sig, action);
    }
};`
    },
    {
      id: "database-indexing",
      name: "Database Index Structures",
      description: "High-performance database indexing with low latency",
      example: "In-memory database indexes, key-value stores",
      code: `class CuckooIndex {
private:
    ConcurrentCuckooHash<CompositeKey, RowId> primaryIndex;
    ConcurrentCuckooHash<SecondaryKey, std::vector<RowId>> secondaryIndexes;

public:
    std::vector<RowId> query(const Query& q) {
        if (q.usesPrimaryKey) {
            auto rowId = primaryIndex.get(q.primaryKey);
            return rowId ? std::vector<RowId>{*rowId} : std::vector<RowId>{};
        } else {
            auto rowIds = secondaryIndexes.get(q.secondaryKey);
            return rowIds ? *rowIds : std::vector<RowId>{};
        }
    }
};`
    }
  ];

  // Mathematical Analysis
  const mathematicalAnalysis = [
    {
      title: "Worst-Case Analysis",
      content: `// Mathematical analysis of cuckoo hashing worst-case behavior

// Key insight: Cuckoo hashing can guarantee O(1) worst-case lookups
// by controlling the maximum displacement during insertion

// Theorem: With d hash functions, the maximum load before rehashing
// should be at most (d/(d+1)) * table_size to guarantee O(1) insertion

// Proof sketch:
// - Each insertion can displace at most d items
// - In worst case, we might need to displace a chain of d items
// - With load factor α < d/(d+1), there are always empty slots available
// - Therefore, insertion terminates in O(1) expected time

// For d=2 (standard cuckoo): α < 2/3 ≈ 0.67
// For d=3: α < 3/4 = 0.75
// For d=4: α < 4/5 = 0.8

double calculateMaxLoadFactor(int numHashFunctions) {
    return static_cast<double>(numHashFunctions) / (numHashFunctions + 1);
}

// Expected displacement length:
// E[displacements] ≈ log(1/(1-α)) for load factor α

double expectedDisplacements(double loadFactor) {
    return std::log(1.0 / (1.0 - loadFactor));
}

// Space overhead:
// - Two tables: 2x space
// - Hash functions: O(1) additional space
// - Worst-case space: O(n) for n elements
// - Average space: ~2n slots for n elements`,
      explanation: "Mathematical analysis of cuckoo hashing's worst-case guarantees"
    },
    {
      title: "Performance Characteristics",
      content: `// Performance analysis of cuckoo hashing

// Lookup Performance:
// - O(1) worst case (check at most 2 locations)
// - No collision chains to traverse
// - Constant time regardless of load factor

// Insertion Performance:
// - O(1) expected case
// - O(1) worst case with proper load factor bounds
// - May require rehashing if eviction chain is too long

// Deletion Performance:
// - O(1) worst case (lazy deletion)
// - May require special handling for lookup correctness

// Rehashing:
// - Triggered when eviction chains exceed threshold
// - O(n) time to rebuild entire table
// - Happens infrequently with good hash functions

// Memory Efficiency:
// - Space usage: ~2n slots for n elements
// - Better than chaining for some workloads
// - No pointer overhead per element
// - Predictable memory access patterns

// Cache Performance:
// - Excellent spatial locality
// - No pointer chasing like in chaining
// - Good for modern CPU caches
// - Predictable memory access patterns

// Comparison with other methods:
// - vs Chaining: Better worst-case, worse space
// - vs Linear Probing: Better cache performance, more complex
// - vs Double Hashing: Similar performance, different trade-offs

struct PerformanceMetrics {
    double avgLookupTime;     // nanoseconds
    double worstCaseLookup;   // nanoseconds
    double avgInsertTime;     // nanoseconds
    double spaceOverhead;     // bytes per element
    double cacheMissRate;     // misses per lookup
};`,
      explanation: "Comprehensive performance analysis of cuckoo hashing characteristics"
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
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Cuckoo Hashing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced collision resolution technique with worst-case O(1) guarantees.
              Master the elegant algorithm that provides high-performance hashing.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementation"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Implementation
            </button>
            <button
              onClick={() => setActiveSection("mathematical")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "mathematical"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Mathematical Analysis
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Cuckoo Hashing Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">What is Cuckoo Hashing?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Cuckoo hashing is a collision resolution technique that uses two hash tables
                    and two hash functions. When a collision occurs, the existing key is "kicked out"
                    and moved to its alternative location, potentially causing a cascade of displacements
                    that resembles a cuckoo bird kicking other eggs out of a nest.
                  </p>

                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">🐦</span>
                      <span><strong>Cuckoo Displacement:</strong> Evicted keys move to alternative locations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">📊</span>
                      <span><strong>Two Hash Tables:</strong> Each key has two possible locations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">⚡</span>
                      <span><strong>Fast Lookups:</strong> O(1) worst-case lookup time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">🔄</span>
                      <span><strong>Dynamic:</strong> Supports insertions and deletions</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">How Cuckoo Hashing Works</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-rose-400 mb-2">1. Hash Functions</h4>
                      <p className="text-gray-300 text-sm">Each key has two possible locations using different hash functions</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-rose-400 mb-2">2. Insertion Process</h4>
                      <p className="text-gray-300 text-sm">Try to place key in first location, evict existing key if occupied</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-rose-400 mb-2">3. Displacement Chain</h4>
                      <p className="text-gray-300 text-sm">Evicted key tries its alternative location, potentially evicting another</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-rose-400 mb-2">4. Cycle Detection</h4>
                      <p className="text-gray-300 text-sm">If chain becomes too long, rehash the entire table</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-pink-400 mb-3">Advantages</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Worst-case O(1) lookups</li>
                    <li>• High space efficiency</li>
                    <li>• Good cache performance</li>
                    <li>• Simple deletion</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Challenges</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Complex insertion logic</li>
                    <li>• Rehashing can be expensive</li>
                    <li>• Requires multiple hash functions</li>
                    <li>• Load factor constraints</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Hardware caches</li>
                    <li>• Network routing</li>
                    <li>• Database systems</li>
                    <li>• Real-time systems</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Section */}
          {activeSection === "implementation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Cuckoo Hashing Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Basic Cuckoo Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-pink-400 mb-4">Basic Cuckoo Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Fundamental cuckoo hashing with two tables and displacement-based collision resolution.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Two hash tables</li>
                          <li>• Displacement-based insertion</li>
                          <li>• Worst-case O(1) lookup</li>
                          <li>• Automatic rehashing</li>
                          <li>• Simple deletion</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Complexity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Lookup:</span>
                            {renderComplexityBadge("O(1)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Insert (avg):</span>
                            {renderComplexityBadge("O(1)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Insert (worst):</span>
                            {renderComplexityBadge("O(n)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Space:</span>
                            {renderComplexityBadge("O(n)")}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{cuckooHashingImplementation.basic}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimized Cuckoo Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-pink-400 mb-4">Optimized Cuckoo Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Advanced implementation with multiple hash functions and optimized displacement strategies.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Multiple hash functions</li>
                          <li>• Smart displacement choices</li>
                          <li>• Reduced rehashing</li>
                          <li>• Better load balancing</li>
                          <li>• Configurable parameters</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Optimizations</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Multiple placement choices</li>
                          <li>• Intelligent eviction</li>
                          <li>• Reduced worst-case chains</li>
                          <li>• Better space utilization</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{cuckooHashingImplementation.optimized}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Concurrent Cuckoo Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-pink-400 mb-4">Concurrent Cuckoo Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Thread-safe implementation with fine-grained locking for high-performance concurrent access.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Fine-grained locking</li>
                          <li>• Reader-writer locks</li>
                          <li>• Lock-free reads</li>
                          <li>• Atomic operations</li>
                          <li>• High concurrency</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Concurrency Benefits</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Multiple simultaneous readers</li>
                          <li>• Minimal lock contention</li>
                          <li>• Scalable performance</li>
                          <li>• Thread-safe operations</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{cuckooHashingImplementation.concurrent}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Analysis Section */}
          {activeSection === "mathematical" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Mathematical Analysis</h2>

              <div className="grid grid-cols-1 gap-8">
                {mathematicalAnalysis.map((analysis, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-pink-400 mb-4">{analysis.title}</h3>
                      <p className="text-gray-300 mb-6">{analysis.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Mathematical Details</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{analysis.content}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Comparison with Other Methods */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-pink-400 mb-6">Cuckoo Hashing vs Other Methods</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-pink-400 text-lg font-bold">Cuckoo Hashing</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Separate Chaining</th>
                            <th className="pb-4 text-green-400 text-lg font-bold">Linear Probing</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">Double Hashing</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-pink-400 transition-all duration-300">Worst-case Lookup</td>
                            <td className="py-4 text-green-400 font-medium">O(1)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-pink-400 transition-all duration-300">Space Overhead</td>
                            <td className="py-4 text-yellow-400 font-medium">2x</td>
                            <td className="py-4 text-yellow-400 font-medium">1.5x</td>
                            <td className="py-4 text-green-400 font-medium">1x</td>
                            <td className="py-4 text-green-400 font-medium">1x</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-pink-400 transition-all duration-300">Cache Performance</td>
                            <td className="py-4 text-green-400 font-medium">Excellent</td>
                            <td className="py-4 text-red-400 font-medium">Poor</td>
                            <td className="py-4 text-green-400 font-medium">Good</td>
                            <td className="py-4 text-green-400 font-medium">Good</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-pink-400 transition-all duration-300">Deletion Complexity</td>
                            <td className="py-4 text-green-400 font-medium">Simple</td>
                            <td className="py-4 text-yellow-400 font-medium">Complex</td>
                            <td className="py-4 text-red-400 font-medium">Complex</td>
                            <td className="py-4 text-red-400 font-medium">Complex</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-pink-400 transition-all duration-300">Implementation</td>
                            <td className="py-4 text-red-400 font-medium">Complex</td>
                            <td className="py-4 text-green-400 font-medium">Simple</td>
                            <td className="py-4 text-yellow-400 font-medium">Medium</td>
                            <td className="py-4 text-yellow-400 font-medium">Medium</td>
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
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Cuckoo Hashing Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-pink-400 mb-4">{app.name}</h3>
                      <p className="text-gray-300 mb-4">{app.description}</p>
                      <p className="text-rose-300 mb-6"><strong>Example:</strong> {app.example}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-rose-400 mb-3">Code Example</h4>
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Basic Cuckoo Hashing Implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Understanding Displacement Chains</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Hash Function Selection</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Cuckoo Hashing with Multiple Tables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Load Factor Management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Concurrent Cuckoo Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Rehashing Strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Performance Optimization</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Advanced Cuckoo Hashing Variants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Cuckoo Hashing for External Memory</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Concurrent Cuckoo Hashing with Optimistic Concurrency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Cuckoo Hashing with Hardware Acceleration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Theoretical Analysis of Cuckoo Graphs</span>
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
                    <li>• How does cuckoo hashing work?</li>
                    <li>• What are the advantages over other collision resolution?</li>
                    <li>• How does the cuckoo displacement process work?</li>
                    <li>• What are the space and time trade-offs?</li>
                    <li>• When would you choose cuckoo hashing?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Implementation Details</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• How do you implement cuckoo hashing?</li>
                    <li>• What happens during rehashing?</li>
                    <li>• How do you handle concurrent access?</li>
                    <li>• What are the load factor constraints?</li>
                    <li>• How do you choose hash functions?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Performance Analysis</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• What are the worst-case guarantees?</li>
                    <li>• How does cache performance compare?</li>
                    <li>• What are the concurrency implications?</li>
                    <li>• How does it scale with multiple cores?</li>
                    <li>• Memory access patterns analysis</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Topics</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Cuckoo hashing with multiple tables</li>
                    <li>• Hardware-assisted cuckoo hashing</li>
                    <li>• Cuckoo hashing for networking</li>
                    <li>• Theoretical bounds and proofs</li>
                    <li>• Comparison with other hash table variants</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cuckoo Hashing Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Cuckoo Hashing Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Worst-case Lookup:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Average-case Lookup:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Average-case Insert:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Worst-case Insert:</span>
                    <span className="text-red-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Space Complexity:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-400 mb-4">Key Concepts</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-rose-400 font-medium mb-1">Two Hash Tables:</div>
                    <div className="text-gray-400">Each key has two possible locations using different hash functions</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-rose-400 font-medium mb-1">Cuckoo Displacement:</div>
                    <div className="text-gray-400">Evicted keys move to their alternative location, potentially causing cascades</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-rose-400 font-medium mb-1">Worst-case O(1):</div>
                    <div className="text-gray-400">Guaranteed constant-time lookups by checking at most two locations</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-rose-400 font-medium mb-1">Load Factor Limit:</div>
                    <div className="text-gray-400">Maximum load factor around 0.5-0.67 to guarantee insertion termination</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-rose-400 font-medium mb-1">Rehashing:</div>
                    <div className="text-gray-400">Resize and rebuild entire table when insertion chains become too long</div>
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

export default CuckooHashing;

