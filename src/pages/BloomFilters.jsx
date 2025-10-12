import React, { useState } from "react";
import { Layout } from "../components";

const BloomFilters = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Bloom Filter Implementation
  const bloomFilterImplementation = {
    basic: `// Basic Bloom Filter Implementation
#include <vector>
#include <functional>
#include <cmath>

class BloomFilter {
private:
    std::vector<bool> bitArray;
    size_t size;                    // Size of bit array (m)
    size_t numHashes;              // Number of hash functions (k)
    size_t numElements;            // Expected number of elements (n)

    // Hash function combiner - creates k different hashes from 2 base hashes
    size_t hash(size_t hash1, size_t hash2, size_t i) const {
        return (hash1 + i * hash2) % size;
    }

    // Simple hash functions (in practice, use better hash functions)
    size_t hash1(const std::string& key) const {
        size_t hash = 0;
        for (char c : key) {
            hash = (hash * 31 + c) % size;
        }
        return hash;
    }

    size_t hash2(const std::string& key) const {
        size_t hash = 5381;
        for (char c : key) {
            hash = ((hash << 5) + hash) + c; // hash * 33 + c
        }
        return hash % size;
    }

public:
    // Constructor with optimal parameters
    BloomFilter(size_t expectedElements, double falsePositiveRate) {
        numElements = expectedElements;

        // Calculate optimal size: m = - (n * ln(p)) / (ln(2))^2
        size = std::ceil(-(expectedElements * std::log(falsePositiveRate)) /
                        (std::log(2) * std::log(2)));

        // Calculate optimal number of hash functions: k = (m/n) * ln(2)
        numHashes = std::round((size / expectedElements) * std::log(2));

        bitArray.resize(size, false);

        std::cout << "Bloom Filter created:" << std::endl;
        std::cout << "  Expected elements: " << expectedElements << std::endl;
        std::cout << "  Bit array size: " << size << std::endl;
        std::cout << "  Number of hash functions: " << numHashes << std::endl;
        std::cout << "  Expected false positive rate: " << falsePositiveRate << std::endl;
    }

    // Add element to filter
    void add(const std::string& key) {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);

        for (size_t i = 0; i < numHashes; ++i) {
            size_t bitIndex = hash(h1, h2, i);
            bitArray[bitIndex] = true;
        }
    }

    // Check if element might be in set (false positives possible)
    bool contains(const std::string& key) const {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);

        for (size_t i = 0; i < numHashes; ++i) {
            size_t bitIndex = hash(h1, h2, i);
            if (!bitArray[bitIndex]) {
                return false; // Definitely not in set
            }
        }

        return true; // Might be in set (or false positive)
    }

    // Get statistics
    double getFalsePositiveRate() const {
        // Approximation: (1 - e^(-k*n/m))^k
        double exponent = -static_cast<double>(numHashes * numElements) / size;
        return std::pow(1 - std::exp(exponent), numHashes);
    }

    size_t getBitArraySize() const { return size; }
    size_t getNumHashes() const { return numHashes; }
    size_t getNumBitsSet() const {
        size_t count = 0;
        for (bool bit : bitArray) {
            if (bit) count++;
        }
        return count;
    }

    double getLoadFactor() const {
        return static_cast<double>(getNumBitsSet()) / size;
    }
};

// Usage example
void demonstrateBloomFilter() {
    // Create Bloom filter for 1000 elements with 1% false positive rate
    BloomFilter filter(1000, 0.01);

    // Add some elements
    std::vector<std::string> words = {"apple", "banana", "cherry", "date", "elderberry"};
    for (const auto& word : words) {
        filter.add(word);
    }

    // Test membership
    std::cout << "Testing membership:" << std::endl;
    for (const auto& word : words) {
        bool result = filter.contains(word);
        std::cout << word << ": " << (result ? "YES" : "NO") << std::endl;
    }

    // Test with non-existing words (possible false positives)
    std::vector<std::string> testWords = {"grape", "fig", "xyz123", "nonexistent"};
    std::cout << "\\nTesting non-existing words:" << std::endl;
    for (const auto& word : testWords) {
        bool result = filter.contains(word);
        std::cout << word << ": " << (result ? "POSSIBLE" : "NO") << std::endl;
    }

    // Print statistics
    std::cout << "\\nStatistics:" << std::endl;
    std::cout << "False positive rate: " << filter.getFalsePositiveRate() << std::endl;
    std::cout << "Load factor: " << filter.getLoadFactor() << std::endl;
    std::cout << "Bits set: " << filter.getNumBitsSet() << " / " << filter.getBitArraySize() << std::endl;
}`,
    counting: `// Counting Bloom Filter - supports deletions
#include <vector>
#include <functional>

class CountingBloomFilter {
private:
    std::vector<size_t> counterArray; // Use counters instead of bits
    size_t size;                     // Size of counter array
    size_t numHashes;               // Number of hash functions

    size_t hash(size_t hash1, size_t hash2, size_t i) const {
        return (hash1 + i * hash2) % size;
    }

    size_t hash1(const std::string& key) const {
        size_t hash = 0;
        for (char c : key) {
            hash = (hash * 31 + c) % size;
        }
        return hash;
    }

    size_t hash2(const std::string& key) const {
        size_t hash = 5381;
        for (char c : key) {
            hash = ((hash << 5) + hash) + c;
        }
        return hash % size;
    }

public:
    CountingBloomFilter(size_t expectedElements, double falsePositiveRate, size_t maxCounterValue = 15) {
        // Calculate optimal size
        size = std::ceil(-(expectedElements * std::log(falsePositiveRate)) /
                        (std::log(2) * std::log(2)));

        // Calculate optimal number of hash functions
        numHashes = std::round((size / expectedElements) * std::log(2));

        counterArray.resize(size, 0);
    }

    // Add element (increment counters)
    void add(const std::string& key) {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);

        for (size_t i = 0; i < numHashes; ++i) {
            size_t index = hash(h1, h2, i);
            if (counterArray[index] < 255) { // Prevent overflow
                counterArray[index]++;
            }
        }
    }

    // Remove element (decrement counters)
    void remove(const std::string& key) {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);

        for (size_t i = 0; i < numHashes; ++i) {
            size_t index = hash(h1, h2, i);
            if (counterArray[index] > 0) {
                counterArray[index]--;
            }
        }
    }

    // Check membership
    bool contains(const std::string& key) const {
        size_t h1 = hash1(key);
        size_t h2 = hash2(key);

        for (size_t i = 0; i < numHashes; ++i) {
            size_t index = hash(h1, h2, i);
            if (counterArray[index] == 0) {
                return false;
            }
        }

        return true;
    }

    // Get counter value at a specific index (for analysis)
    size_t getCounter(size_t index) const {
        if (index < size) {
            return counterArray[index];
        }
        return 0;
    }

    size_t getSize() const { return size; }
    size_t getNumHashes() const { return numHashes; }
};

// Usage example
void demonstrateCountingBloomFilter() {
    CountingBloomFilter filter(1000, 0.01);

    // Add elements multiple times
    filter.add("apple");
    filter.add("apple"); // Add twice
    filter.add("banana");

    std::cout << "After adding elements:" << std::endl;
    std::cout << "apple: " << (filter.contains("apple") ? "YES" : "NO") << std::endl;
    std::cout << "banana: " << (filter.contains("banana") ? "YES" : "NO") << std::endl;
    std::cout << "cherry: " << (filter.contains("cherry") ? "YES" : "NO") << std::endl;

    // Remove one instance of apple
    filter.remove("apple");

    std::cout << "\\nAfter removing one instance of apple:" << std::endl;
    std::cout << "apple: " << (filter.contains("apple") ? "YES" : "NO") << std::endl;

    // Remove second instance of apple
    filter.remove("apple");

    std::cout << "\\nAfter removing second instance of apple:" << std::endl;
    std::cout << "apple: " << (filter.contains("apple") ? "YES" : "NO") << std::endl;
}`,
    scalable: `// Scalable Bloom Filter - automatically adds new filters as needed
#include <vector>
#include <memory>

class ScalableBloomFilter {
private:
    std::vector<std::unique_ptr<BloomFilter>> filters;
    size_t currentCapacity;
    double falsePositiveRate;
    double growthFactor; // How much to grow each new filter

    // Create a new filter with tighter false positive rate
    std::unique_ptr<BloomFilter> createNewFilter() {
        // Tighter false positive rate for new filters
        double tighterFPR = falsePositiveRate / std::pow(growthFactor, filters.size() + 1);
        size_t newCapacity = currentCapacity * growthFactor;

        currentCapacity = newCapacity;
        return std::make_unique<BloomFilter>(newCapacity, tighterFPR);
    }

public:
    ScalableBloomFilter(size_t initialCapacity, double initialFPR, double growth = 2.0)
        : currentCapacity(initialCapacity), falsePositiveRate(initialFPR), growthFactor(growth) {
        filters.push_back(std::make_unique<BloomFilter>(initialCapacity, initialFPR));
    }

    void add(const std::string& key) {
        // Always add to the last (most recent) filter
        filters.back()->add(key);

        // Check if we need to add a new filter
        if (filters.back()->getLoadFactor() > 0.8) { // High load factor
            filters.push_back(createNewFilter());
        }
    }

    bool contains(const std::string& key) const {
        // Check all filters (from newest to oldest)
        for (auto it = filters.rbegin(); it != filters.rend(); ++it) {
            if ((*it)->contains(key)) {
                return true;
            }
        }
        return false;
    }

    // Get overall false positive rate
    double getFalsePositiveRate() const {
        if (filters.empty()) return 0.0;

        // Overall FPR is approximately the FPR of the loosest filter
        double overallFPR = 0.0;
        for (const auto& filter : filters) {
            overallFPR = std::max(overallFPR, filter->getFalsePositiveRate());
        }
        return overallFPR;
    }

    size_t getNumFilters() const { return filters.size(); }
    size_t getTotalBits() const {
        size_t total = 0;
        for (const auto& filter : filters) {
            total += filter->getBitArraySize();
        }
        return total;
    }
};

// Usage example
void demonstrateScalableBloomFilter() {
    ScalableBloomFilter filter(1000, 0.01);

    std::cout << "Initial state:" << std::endl;
    std::cout << "Filters: " << filter.getNumFilters() << std::endl;
    std::cout << "Total bits: " << filter.getTotalBits() << std::endl;

    // Add many elements
    for (int i = 0; i < 2000; ++i) {
        filter.add("element" + std::to_string(i));
    }

    std::cout << "\\nAfter adding 2000 elements:" << std::endl;
    std::cout << "Filters: " << filter.getNumFilters() << std::endl;
    std::cout << "Total bits: " << filter.getTotalBits() << std::endl;
    std::cout << "Overall FPR: " << filter.getFalsePositiveRate() << std::endl;

    // Test some queries
    bool exists1 = filter.contains("element500");
    bool exists2 = filter.contains("nonexistent");

    std::cout << "\\nQueries:" << std::endl;
    std::cout << "element500: " << (exists1 ? "FOUND" : "NOT FOUND") << std::endl;
    std::cout << "nonexistent: " << (exists2 ? "POSSIBLE" : "NOT FOUND") << std::endl;
}`
  };

  // Bloom Filter Applications
  const applications = [
    {
      id: "spell-checking",
      name: "Spell Checking & Auto-complete",
      description: "Fast preliminary check before expensive dictionary lookup",
      example: "Browser spell checkers, word processors",
      code: `class SpellChecker {
private:
    BloomFilter wordFilter;
    std::unordered_set<std::string> dictionary; // Backup for false positives

public:
    SpellChecker(size_t expectedWords, double fpr) : wordFilter(expectedWords, fpr) {
        // Load dictionary and add to filter
        std::vector<std::string> words = {"hello", "world", "computer", "science"};
        for (const auto& word : words) {
            wordFilter.add(word);
            dictionary.insert(word);
        }
    }

    bool isCorrectlySpelled(const std::string& word) {
        // Quick Bloom filter check
        if (!wordFilter.contains(word)) {
            return false; // Definitely misspelled
        }

        // Handle false positive - check actual dictionary
        return dictionary.count(word) > 0;
    }
};

void demonstrateSpellChecker() {
    SpellChecker checker(10000, 0.001);

    std::vector<std::string> testWords = {"hello", "world", "xyz123", "science"};
    for (const auto& word : testWords) {
        bool isCorrect = checker.isCorrectlySpelled(word);
        std::cout << word << ": " << (isCorrect ? "CORRECT" : "INCORRECT") << std::endl;
    }
}`
    },
    {
      id: "web-crawling",
      name: "Web Crawling & URL Deduplication",
      description: "Avoid recrawling already visited URLs",
      example: "Search engine crawlers, web scrapers",
      code: `class WebCrawler {
private:
    BloomFilter visitedUrls;
    std::queue<std::string> urlQueue;

public:
    WebCrawler(size_t expectedUrls, double fpr) : visitedUrls(expectedUrls, fpr) {}

    void addUrl(const std::string& url) {
        if (!visitedUrls.contains(url)) {
            visitedUrls.add(url);
            urlQueue.push(url);
        }
    }

    std::string getNextUrl() {
        if (urlQueue.empty()) return "";

        std::string url = urlQueue.front();
        urlQueue.pop();
        return url;
    }

    // Check if URL might have been visited (with false positives)
    bool mightHaveVisited(const std::string& url) {
        return visitedUrls.contains(url);
    }
};

void demonstrateWebCrawler() {
    WebCrawler crawler(100000, 0.001);

    std::vector<std::string> urls = {
        "https://example.com/page1",
        "https://example.com/page2",
        "https://example.com/page1", // Duplicate
        "https://example.com/page3"
    };

    for (const auto& url : urls) {
        crawler.addUrl(url);
    }

    std::cout << "URLs to crawl:" << std::endl;
    std::string url;
    while (!(url = crawler.getNextUrl()).empty()) {
        std::cout << "Crawling: " << url << std::endl;
        // Simulate crawling...
    }
}`
    },
    {
      id: "database-caching",
      name: "Database Query Caching",
      description: "Quick check if query result might be cached",
      example: "Database systems, query optimizers",
      code: `class QueryCache {
private:
    BloomFilter cachedQueries;
    std::unordered_map<std::string, std::string> actualCache;

public:
    QueryCache(size_t expectedQueries, double fpr) : cachedQueries(expectedQueries, fpr) {}

    void storeResult(const std::string& query, const std::string& result) {
        cachedQueries.add(query);
        actualCache[query] = result;
    }

    std::string getCachedResult(const std::string& query) {
        // Quick check with Bloom filter
        if (!cachedQueries.contains(query)) {
            return ""; // Definitely not cached
        }

        // Check actual cache (handles false positives)
        auto it = actualCache.find(query);
        return (it != actualCache.end()) ? it->second : "";
    }
};

void demonstrateQueryCache() {
    QueryCache cache(10000, 0.001);

    // Store some query results
    cache.storeResult("SELECT * FROM users", "user_data...");
    cache.storeResult("SELECT * FROM products", "product_data...");

    // Test cache lookups
    std::vector<std::string> queries = {
        "SELECT * FROM users",           // Should find
        "SELECT * FROM nonexistent",     // Definitely not cached
        "SELECT * FROM orders"           // Might be false positive
    };

    for (const auto& query : queries) {
        std::string result = cache.getCachedResult(query);
        if (!result.empty()) {
            std::cout << "CACHE HIT: " << query << std::endl;
        } else {
            std::cout << "CACHE MISS: " << query << std::endl;
        }
    }
}`
    },
    {
      id: "network-security",
      name: "Network Security & Intrusion Detection",
      description: "Fast lookup of malicious IP addresses or domains",
      example: "Firewall rules, spam filters, intrusion detection systems",
      code: `class NetworkFilter {
private:
    BloomFilter maliciousIPs;
    BloomFilter maliciousDomains;
    std::unordered_set<std::string> confirmedMalicious; // For accuracy

public:
    NetworkFilter(size_t expectedEntries, double fpr)
        : maliciousIPs(expectedEntries, fpr), maliciousDomains(expectedEntries, fpr) {}

    void addMaliciousIP(const std::string& ip) {
        maliciousIPs.add(ip);
        confirmedMalicious.insert("IP:" + ip);
    }

    void addMaliciousDomain(const std::string& domain) {
        maliciousDomains.add(domain);
        confirmedMalicious.insert("DOMAIN:" + domain);
    }

    bool shouldBlockIP(const std::string& ip) {
        if (!maliciousIPs.contains(ip)) {
            return false; // Definitely safe
        }

        // Handle false positive - check confirmed list
        return confirmedMalicious.count("IP:" + ip) > 0;
    }

    bool shouldBlockDomain(const std::string& domain) {
        if (!maliciousDomains.contains(domain)) {
            return false; // Definitely safe
        }

        // Handle false positive
        return confirmedMalicious.count("DOMAIN:" + domain) > 0;
    }
};

void demonstrateNetworkFilter() {
    NetworkFilter filter(100000, 0.001);

    // Add some malicious entries
    filter.addMaliciousIP("192.168.1.100");
    filter.addMaliciousDomain("malicious-site.com");

    // Test some connections
    std::vector<std::pair<std::string, std::string>> connections = {
        {"192.168.1.100", "IP"},
        {"192.168.1.101", "IP"},
        {"malicious-site.com", "DOMAIN"},
        {"legitimate-site.com", "DOMAIN"}
    };

    for (const auto& [target, type] : connections) {
        bool shouldBlock = (type == "IP") ?
            filter.shouldBlockIP(target) :
            filter.shouldBlockDomain(target);

        std::cout << type << " " << target << ": "
                  << (shouldBlock ? "BLOCKED" : "ALLOWED") << std::endl;
    }
}`
    }
  ];

  // Mathematical Analysis
  const mathematicalAnalysis = [
    {
      title: "Optimal Parameters Calculation",
      content: `// Mathematical formulas for optimal Bloom filter parameters

// Given:
// n = expected number of elements
// p = desired false positive rate (e.g., 0.01 = 1%)

// Optimal number of bits (m):
// m = - (n * ln(p)) / (ln(2))^2

double calculateOptimalBits(size_t n, double p) {
    return -static_cast<double>(n) * std::log(p) / (std::log(2) * std::log(2));
}

// Optimal number of hash functions (k):
// k = (m/n) * ln(2)

size_t calculateOptimalHashes(size_t m, size_t n) {
    return std::round(static_cast<double>(m) / n * std::log(2));
}

// Actual false positive rate for given parameters:
// p_actual = (1 - e^(-k*n/m))^k

double calculateActualFPR(size_t k, size_t n, size_t m) {
    double exponent = -static_cast<double>(k * n) / m;
    return std::pow(1 - std::exp(exponent), k);
}`,
      explanation: "Mathematical formulas for calculating optimal Bloom filter parameters"
    },
    {
      title: "False Positive Probability Analysis",
      content: `// False positive probability analysis

// For a single element:
// P(false positive) = (1 - e^(-k*n/m))^k

// For multiple elements, the probability increases, but the formula
// gives a good approximation.

// Example calculation:
// n = 1000 elements
// m = 10000 bits
// k = 7 hash functions
//
// False positive rate ≈ (1 - e^(-7*1000/10000))^7
//                     = (1 - e^(-0.7))^7
//                     = (1 - 0.4966)^7
//                     = 0.5034^7
//                     = 0.0081 (0.81%)

double analyzeFalsePositiveRate() {
    size_t n = 1000;  // elements
    size_t m = 10000; // bits
    size_t k = 7;     // hash functions

    double ratio = static_cast<double>(k * n) / m; // k*n/m = 0.7
    double exponent = -ratio;                       // -0.7
    double e_term = std::exp(exponent);             // e^(-0.7) ≈ 0.4966
    double base = 1 - e_term;                       // 1 - 0.4966 = 0.5034
    double fpr = std::pow(base, k);                 // 0.5034^7 ≈ 0.0081

    return fpr;
}`,
      explanation: "Analysis of false positive probabilities and their mathematical basis"
    },
    {
      title: "Space-Time Trade-offs",
      content: `// Space-time trade-offs in Bloom filters

// Space complexity: O(m) where m = number of bits
// Time complexity: O(k) where k = number of hash functions

// Trade-off analysis:
// - Smaller m → higher false positive rate
// - Larger m → lower false positive rate but more memory
// - Smaller k → faster operations but higher false positive rate
// - Larger k → more accurate but slower operations

// Optimal balance:
// - k is typically between 3-10
// - m/n ratio is typically 8-16 bits per element
// - False positive rate between 0.1% - 1%

struct BloomFilterConfig {
    size_t bitsPerElement;     // m/n ratio
    size_t hashFunctions;      // k
    double falsePositiveRate;  // expected p

    // Common configurations
    static BloomFilterConfig lowMemory() {
        return {8, 5, 0.03};   // 8 bits/element, 3% FPR
    }

    static BloomFilterConfig balanced() {
        return {12, 7, 0.008}; // 12 bits/element, 0.8% FPR
    }

    static BloomFilterConfig highAccuracy() {
        return {16, 9, 0.002}; // 16 bits/element, 0.2% FPR
    }
};`,
      explanation: "Understanding the trade-offs between space, time, and accuracy in Bloom filters"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(1)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(k)") || complexity.includes("O(log n)")) color = "bg-blue-100 text-blue-800";
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
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Bloom Filters
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Probabilistic data structures for fast membership testing with controlled false positives.
              Master space-efficient approximate set membership algorithms.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-rose-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "implementation"
                  ? "bg-rose-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Implementation
            </button>
            <button
              onClick={() => setActiveSection("mathematical")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "mathematical"
                  ? "bg-rose-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Mathematical Analysis
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "applications"
                  ? "bg-rose-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Bloom Filters Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-rose-400 mb-4">What are Bloom Filters?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Bloom filters are space-efficient probabilistic data structures that can tell you
                    with certainty whether an element is NOT in a set, but can only tell you that an
                    element MIGHT BE in the set. They use multiple hash functions and a bit array
                    to achieve this with minimal memory usage.
                  </p>

                  <h3 className="text-2xl font-semibold text-rose-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">🔍</span>
                      <span><strong>Fast Membership Testing:</strong> O(k) time complexity where k is number of hash functions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">💾</span>
                      <span><strong>Space Efficient:</strong> Uses ~10 bits per element for 1% false positive rate</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">❌</span>
                      <span><strong>No False Negatives:</strong> If filter says "not present", element is definitely not in set</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">⚠️</span>
                      <span><strong>False Positives Possible:</strong> Filter may claim element is present when it's not</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-400 mr-2">🚫</span>
                      <span><strong>No Deletions:</strong> Standard Bloom filters don't support element removal</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-rose-400 mb-4">How Bloom Filters Work</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">1. Initialization</h4>
                      <p className="text-gray-300 text-sm">Create a bit array of size m, all bits set to 0</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">2. Adding Elements</h4>
                      <p className="text-gray-300 text-sm">Use k hash functions to set k bits to 1 for each element</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">3. Testing Membership</h4>
                      <p className="text-gray-300 text-sm">Check if all k corresponding bits are 1</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">4. Probabilistic Nature</h4>
                      <p className="text-gray-300 text-sm">All 1s = "might be present" (possible false positive)</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-cyan-400 mb-2">5. Optimal Parameters</h4>
                      <p className="text-gray-300 text-sm">k ≈ (m/n) × ln(2), m ≈ - (n × ln(p)) / (ln(2))²</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-rose-900/20 to-pink-900/20 border border-rose-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-rose-400 mb-3">Advantages</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Extremely space efficient</li>
                    <li>• Very fast operations</li>
                    <li>• No false negatives</li>
                    <li>• Simple implementation</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Limitations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• False positives possible</li>
                    <li>• No element deletion</li>
                    <li>• No element retrieval</li>
                    <li>• Fixed false positive rate</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Spell checking</li>
                    <li>• Web crawling</li>
                    <li>• Database caching</li>
                    <li>• Network security</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Section */}
          {activeSection === "implementation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Bloom Filter Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Basic Bloom Filter */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-rose-400 mb-4">Basic Bloom Filter</h3>
                    <p className="text-gray-300 mb-6">
                      The fundamental Bloom filter implementation with optimal parameter calculation
                      and support for membership testing.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Optimal parameter calculation</li>
                          <li>• Multiple hash functions</li>
                          <li>• False positive rate estimation</li>
                          <li>• Memory usage statistics</li>
                          <li>• No false negatives guarantee</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Complexity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Add:</span>
                            {renderComplexityBadge("O(k)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Query:</span>
                            {renderComplexityBadge("O(k)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Space:</span>
                            {renderComplexityBadge("O(m)")}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{bloomFilterImplementation.basic}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Counting Bloom Filter */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-rose-400 mb-4">Counting Bloom Filter</h3>
                    <p className="text-gray-300 mb-6">
                      Extended Bloom filter that supports element deletion by using counters
                      instead of single bits.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Supports element deletion</li>
                          <li>• Uses counters instead of bits</li>
                          <li>• Handles multiple insertions</li>
                          <li>• More memory intensive</li>
                          <li>• Still allows false positives</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Advantages</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Deletions are possible</li>
                          <li>• Handles frequency counting</li>
                          <li>• More flexible than basic version</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{bloomFilterImplementation.counting}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scalable Bloom Filter */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-rose-400 mb-4">Scalable Bloom Filter</h3>
                    <p className="text-gray-300 mb-6">
                      Automatically growing Bloom filter that maintains false positive rate
                      by adding new filters as needed.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Automatically scales with data</li>
                          <li>• Maintains false positive rate</li>
                          <li>• Multiple filter layers</li>
                          <li>• Progressive tightening</li>
                          <li>• No size limits</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Benefits</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Handles growing datasets</li>
                          <li>• Predictable performance</li>
                          <li>• Automatic optimization</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{bloomFilterImplementation.scalable}</code>
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
                      <h3 className="text-2xl font-bold text-rose-400 mb-4">{analysis.title}</h3>
                      <p className="text-gray-300 mb-6">{analysis.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Mathematical Details</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{analysis.content}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Performance Comparison */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-rose-400 mb-6">Bloom Filter vs Other Data Structures</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-rose-400 text-lg font-bold">Bloom Filter</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Hash Set</th>
                            <th className="pb-4 text-green-400 text-lg font-bold">Binary Search</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">Trie</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">Time Complexity</td>
                            <td className="py-4 text-green-400 font-medium">O(k)</td>
                            <td className="py-4 text-green-400 font-medium">O(1) avg</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(m)</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">Space Complexity</td>
                            <td className="py-4 text-green-400 font-medium">O(m)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(n)</td>
                            <td className="py-4 text-red-400 font-medium">O(n)</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">False Positives</td>
                            <td className="py-4 text-red-400 font-medium">Yes</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">False Negatives</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">No</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">Supports Deletion</td>
                            <td className="py-4 text-red-400 font-medium">No*</td>
                            <td className="py-4 text-green-400 font-medium">Yes</td>
                            <td className="py-4 text-red-400 font-medium">No</td>
                            <td className="py-4 text-green-400 font-medium">Yes</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-rose-400 transition-all duration-300">Use Case</td>
                            <td className="py-4 text-rose-400 font-medium">Large datasets, speed critical</td>
                            <td className="py-4 text-blue-400 font-medium">Exact membership</td>
                            <td className="py-4 text-green-400 font-medium">Sorted data lookup</td>
                            <td className="py-4 text-purple-400 font-medium">Prefix matching</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 text-sm text-gray-400">
                      * Basic Bloom filters don't support deletion, but Counting Bloom filters do
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Bloom Filter Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-rose-400 mb-4">{app.name}</h3>
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement Basic Bloom Filter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Check String Membership</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>False Positive Rate Calculation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Counting Bloom Filter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Optimal Parameter Calculation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Bloom Filter for Spell Checking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Scalable Bloom Filter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Cache Filtering System</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Spectral Bloom Filter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Compressed Bloom Filter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Distributed Bloom Filters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Multi-set Bloom Filters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Bloom Filter with Cryptographic Properties</span>
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
                    <li>• How does a Bloom filter work?</li>
                    <li>• What are false positives and false negatives?</li>
                    <li>• Why are Bloom filters space efficient?</li>
                    <li>• What are the limitations of Bloom filters?</li>
                    <li>• How do you choose optimal parameters?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Topics</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Explain Counting Bloom filters</li>
                    <li>• How do Scalable Bloom filters work?</li>
                    <li>• Mathematical analysis of false positive rates</li>
                    <li>• Bloom filters vs hash tables comparison</li>
                    <li>• Real-world applications and trade-offs</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Design Problems</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Design a spell checker using Bloom filters</li>
                    <li>• Implement a web crawler deduplication system</li>
                    <li>• Design a cache filtering mechanism</li>
                    <li>• Build a network security filter</li>
                    <li>• Create a distributed Bloom filter system</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Mathematical Questions</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Derive optimal number of hash functions</li>
                    <li>• Calculate false positive probability</li>
                    <li>• Analyze space-time trade-offs</li>
                    <li>• Understand the birthday problem connection</li>
                    <li>• Probability analysis of multiple elements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bloom Filter Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Bloom Filter Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-rose-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Add Operation:</span>
                    <span className="text-blue-400 font-mono">O(k)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Query Operation:</span>
                    <span className="text-blue-400 font-mono">O(k)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Space Complexity:</span>
                    <span className="text-yellow-400 font-mono">O(m)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Optimal Hash Functions:</span>
                    <span className="text-purple-400 font-mono">k = (m/n) × ln(2)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Optimal Bit Array Size:</span>
                    <span className="text-purple-400 font-mono">m = -(n × ln p) / (ln 2)²</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-rose-400 mb-4">Key Concepts</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">No False Negatives:</div>
                    <div className="text-gray-400">If filter says "no", element is definitely not present</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Possible False Positives:</div>
                    <div className="text-gray-400">Filter may say "yes" for elements not actually present</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Space Efficient:</div>
                    <div className="text-gray-400">~10 bits per element for 1% false positive rate</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Multiple Hash Functions:</div>
                    <div className="text-gray-400">k hash functions reduce false positive probability</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Bit Array:</div>
                    <div className="text-gray-400">Compact representation using individual bits</div>
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

export default BloomFilters;

