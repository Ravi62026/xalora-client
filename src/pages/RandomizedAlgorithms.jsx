import React, { useState } from "react";
import { Layout } from "../components";

const RandomizedAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Monte Carlo Methods
  const monteCarlo = [
    {
      id: "pi-estimation",
      name: "π Estimation (Monte Carlo)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Estimate π by randomly sampling points in a square and counting those inside a quarter circle.",
      code: `#include <random>
#include <iostream>
#include <cmath>

double estimatePi(int numPoints) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(0.0, 1.0);

    int pointsInside = 0;

    for (int i = 0; i < numPoints; i++) {
        double x = dis(gen);
        double y = dis(gen);

        // Check if point is inside quarter circle
        if (x * x + y * y <= 1.0) {
            pointsInside++;
        }
    }

    // π/4 ≈ pointsInside / numPoints
    // π ≈ 4 * pointsInside / numPoints
    return 4.0 * pointsInside / numPoints;
}

int main() {
    int numPoints = 1000000;
    double pi = estimatePi(numPoints);
    std::cout << "Estimated π: " << pi << std::endl;
    std::cout << "Actual π: " << M_PI << std::endl;
    return 0;
}`
    },
    {
      id: "integration",
      name: "Numerical Integration (Monte Carlo)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Approximate definite integrals using random sampling.",
      code: `double monteCarloIntegration(double (*f)(double), double a, double b, int numPoints) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(a, b);

    double sum = 0.0;

    for (int i = 0; i < numPoints; i++) {
        double x = dis(gen);
        sum += f(x);
    }

    // Approximate integral = (b-a) * average function value
    double average = sum / numPoints;
    return (b - a) * average;
}

// Example: integrate x² from 0 to 1
double f(double x) {
    return x * x;
}

int main() {
    auto result = monteCarloIntegration(f, 0.0, 1.0, 100000);
    std::cout << "∫x² dx from 0 to 1 ≈ " << result << std::endl;
    std::cout << "Exact result: 1/3 ≈ " << 1.0/3.0 << std::endl;
    return 0;
}`
    }
  ];

  // Las Vegas Algorithms
  const lasVegas = [
    {
      id: "quickselect",
      name: "Quickselect (Randomized Selection)",
      complexity: { average: "O(n)", worst: "O(n²)" },
      description: "Find kth smallest element using randomized partitioning like quicksort.",
      code: `int randomizedPartition(vector<int>& arr, int low, int high) {
    // Randomly choose pivot
    int randomIndex = low + rand() % (high - low + 1);
    swap(arr[randomIndex], arr[high]);

    int pivot = arr[high];
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

int quickselect(vector<int>& arr, int low, int high, int k) {
    if (low <= high) {
        int pivotIndex = randomizedPartition(arr, low, high);

        if (pivotIndex == k) {
            return arr[pivotIndex];
        } else if (pivotIndex > k) {
            return quickselect(arr, low, pivotIndex - 1, k);
        } else {
            return quickselect(arr, pivotIndex + 1, high, k);
        }
    }

    return -1; // Error
}

int findKthSmallest(vector<int> arr, int k) {
    // k is 1-based (1st smallest, 2nd smallest, etc.)
    return quickselect(arr, 0, arr.size() - 1, k - 1);
}`
    },
    {
      id: "skip-list",
      name: "Skip List",
      complexity: { search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
      description: "Probabilistic data structure that allows fast search with linked list structure.",
      code: `class SkipListNode {
public:
    int value;
    vector<SkipListNode*> next;

    SkipListNode(int val, int level) : value(val), next(level + 1, nullptr) {}
};

class SkipList {
private:
    int maxLevel;
    float probability;
    int currentLevel;
    SkipListNode* header;

    int randomLevel() {
        int level = 0;
        while ((rand() / (double)RAND_MAX) < probability && level < maxLevel) {
            level++;
        }
        return level;
    }

public:
    SkipList(int maxLvl = 16, float prob = 0.5)
        : maxLevel(maxLvl), probability(prob), currentLevel(0) {
        header = new SkipListNode(-1, maxLevel);
    }

    void insert(int value) {
        vector<SkipListNode*> update(maxLevel + 1);
        SkipListNode* current = header;

        // Find position to insert
        for (int i = currentLevel; i >= 0; i--) {
            while (current->next[i] && current->next[i]->value < value) {
                current = current->next[i];
            }
            update[i] = current;
        }

        // Generate random level
        int newLevel = randomLevel();
        if (newLevel > currentLevel) {
            for (int i = currentLevel + 1; i <= newLevel; i++) {
                update[i] = header;
            }
            currentLevel = newLevel;
        }

        // Insert new node
        SkipListNode* newNode = new SkipListNode(value, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->next[i] = update[i]->next[i];
            update[i]->next[i] = newNode;
        }
    }

    bool search(int value) {
        SkipListNode* current = header;

        for (int i = currentLevel; i >= 0; i--) {
            while (current->next[i] && current->next[i]->value < value) {
                current = current->next[i];
            }
        }

        current = current->next[0];
        return current && current->value == value;
    }
};`
    }
  ];

  // Randomized Algorithms
  const randomizedAlgorithms = [
    {
      id: "karger-mincut",
      name: "Karger's Min-Cut Algorithm",
      complexity: { time: "O(V²)", space: "O(V + E)" },
      description: "Find minimum cut in undirected graph using randomized contractions.",
      code: `class KargerMinCut {
private:
    vector<vector<int>> graph;
    int vertices;

    int findMinCut() {
        vector<vector<int>> adj = graph; // Copy graph
        vector<int> vertex(vertices);
        for (int i = 0; i < vertices; i++) vertex[i] = i;

        // Contract until 2 vertices remain
        while (vertices > 2) {
            // Pick random edge
            int u = rand() % vertices;
            int v = rand() % vertices;

            // Ensure u != v and edge exists
            while (u == v || adj[u][v] == 0) {
                u = rand() % vertices;
                v = rand() % vertices;
            }

            // Contract v into u
            // Add edges from v to u
            for (int i = 0; i < vertices; i++) {
                adj[u][i] += adj[v][i];
                adj[i][u] = adj[u][i];
            }

            // Remove self-loops
            adj[u][u] = 0;

            // Remove v's row and column
            for (int i = 0; i < vertices; i++) {
                adj[i][v] = adj[vertices - 1][i];
                adj[v][i] = adj[i][vertices - 1];
            }

            vertices--;
        }

        // Count edges between remaining two vertices
        int minCut = 0;
        for (int i = 0; i < adj[0].size(); i++) {
            minCut += adj[0][i];
        }

        return minCut;
    }

public:
    KargerMinCut(vector<vector<int>>& g) : graph(g), vertices(g.size()) {}

    int findMinimumCut() {
        int minCut = INT_MAX;

        // Run multiple times for better probability
        for (int i = 0; i < 100; i++) { // n² iterations typically
            minCut = min(minCut, findMinCut());
        }

        return minCut;
    }
};`
    },
    {
      id: "floyd-sample",
      name: "Floyd's Cycle Detection (Random Sampling)",
      complexity: { time: "O(μ + λ)", space: "O(1)" },
      description: "Detect cycles in sequences using two pointers with random starting points.",
      code: `// Floyd's cycle detection with random start
pair<int, int> detectCycle(const vector<int>& nums) {
    if (nums.empty()) return {-1, -1};

    // Random starting point
    int start = rand() % nums.size();
    int slow = start, fast = start;

    // Phase 1: Detect cycle
    do {
        slow = nums[slow];
        if (fast < nums.size()) fast = nums[fast];
        else return {-1, -1}; // Out of bounds

        if (fast < nums.size()) fast = nums[fast];
        else return {-1, -1};

        if (slow == fast) break;
    } while (slow != fast);

    if (slow != fast) return {-1, -1}; // No cycle

    // Phase 2: Find cycle start
    slow = start;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }

    // Phase 3: Find cycle length
    int cycleStart = slow;
    int cycleLength = 1;
    fast = nums[slow];
    while (fast != slow) {
        fast = nums[fast];
        cycleLength++;
    }

    return {cycleStart, cycleLength};
}

// Enhanced with multiple random starts for better detection
pair<int, int> robustCycleDetection(const vector<int>& nums, int maxTries = 10) {
    for (int i = 0; i < maxTries; i++) {
        auto result = detectCycle(nums);
        if (result.first != -1) {
            return result;
        }
    }
    return {-1, -1}; // No cycle found
}`
    },
    {
      id: "reservoir-sampling",
      name: "Reservoir Sampling",
      complexity: { time: "O(n)", space: "O(k)" },
      description: "Randomly sample k items from stream of n items where n is unknown.",
      code: `vector<int> reservoirSampling(const vector<int>& stream, int k) {
    int n = stream.size();
    if (n < k) return stream;

    vector<int> reservoir(k);

    // Fill first k elements
    for (int i = 0; i < k; i++) {
        reservoir[i] = stream[i];
    }

    // For remaining elements
    for (int i = k; i < n; i++) {
        // Generate random number from 0 to i
        int j = rand() % (i + 1);

        // If random number is within reservoir size, replace
        if (j < k) {
            reservoir[j] = stream[i];
        }
    }

    return reservoir;
}

// For streaming data (unknown size)
class ReservoirSampler {
private:
    vector<int> reservoir;
    int k, count;

public:
    ReservoirSampler(int size) : k(size), count(0) {
        reservoir.resize(k);
    }

    void add(int item) {
        count++;

        if (count <= k) {
            reservoir[count - 1] = item;
        } else {
            // Generate random number from 0 to count-1
            int j = rand() % count;

            if (j < k) {
                reservoir[j] = item;
            }
        }
    }

    vector<int> getSample() {
        return reservoir;
    }
};

// Usage for streaming data
ReservoirSampler sampler(10);
for (int item : dataStream) {
    sampler.add(item);
}
auto sample = sampler.getSample();`
    }
  ];

  // Probabilistic Algorithms
  const probabilisticAlgorithms = [
    {
      id: "miller-rabin",
      name: "Miller-Rabin Primality Test",
      complexity: { time: "O(k × log³ n)", space: "O(1)" },
      description: "Probabilistic primality test with high accuracy for large numbers.",
      code: `// Modular exponentiation
long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;

    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }

    return result;
}

// Write n-1 as 2^r * d
pair<int, long long> writeAsPower(long long n) {
    long long d = n - 1;
    int r = 0;

    while (d % 2 == 0) {
        d /= 2;
        r++;
    }

    return {r, d};
}

// Miller-Rabin test with one witness
bool millerRabinTest(long long n, long long a) {
    if (n == 2 || n == 3) return true;
    if (n < 2 || n % 2 == 0) return false;

    auto [r, d] = writeAsPower(n);

    // x = a^d mod n
    long long x = modPow(a, d, n);
    if (x == 1 || x == n - 1) return true;

    // Check x^(2^i) for i = 1 to r-1
    for (int i = 1; i < r; i++) {
        x = (x * x) % n;
        if (x == n - 1) return true;
    }

    return false;
}

// Deterministic Miller-Rabin for n < 2^64
bool isPrime(long long n) {
    if (n < 2) return false;

    // Witness set for n < 2^64
    vector<long long> witnesses = {2, 3, 5, 7, 11, 13, 23, 29, 31, 37};

    for (long long a : witnesses) {
        if (n == a) return true;
        if (n > a && !millerRabinTest(n, a)) {
            return false;
        }
    }

    return true;
}`
    },
    {
      id: "bloom-filter",
      name: "Bloom Filter",
      complexity: { insert: "O(k)", lookup: "O(k)", space: "O(m)" },
      description: "Space-efficient probabilistic data structure for set membership testing.",
      code: `class BloomFilter {
private:
    vector<bool> bits;
    int size;
    int hashCount;
    vector<long long> seeds;

    // Hash functions using different seeds
    int hash(int key, int seed) {
        return ((long long)key * seeds[seed]) % size;
    }

public:
    BloomFilter(int expectedItems, double falsePositiveRate) {
        // Calculate optimal size and hash functions
        double ln2 = 0.693147;
        size = -(expectedItems * log(falsePositiveRate)) / (ln2 * ln2);
        hashCount = (size * ln2) / expectedItems;

        bits.assign(size, false);

        // Generate random seeds for hash functions
        seeds.resize(hashCount);
        for (int i = 0; i < hashCount; i++) {
            seeds[i] = rand() % 1000000007 + 1; // Large prime
        }
    }

    void insert(int key) {
        for (int i = 0; i < hashCount; i++) {
            int index = hash(key, i);
            bits[index] = true;
        }
    }

    bool contains(int key) {
        for (int i = 0; i < hashCount; i++) {
            int index = hash(key, i);
            if (!bits[index]) return false;
        }
        return true; // May be false positive
    }

    // Get false positive probability
    double getFalsePositiveRate() {
        return pow(1 - exp(-(double)hashCount * 1 / size), hashCount);
    }
};

// Usage example
BloomFilter bf(1000000, 0.01); // 1M items, 1% false positive rate
bf.insert(42);
if (bf.contains(42)) {
    cout << "42 is in the set (or false positive)" << endl;
}
if (!bf.contains(999)) {
    cout << "999 is definitely not in the set" << endl;
}`
    }
  ];

  // Randomized Data Structures
  const randomizedDataStructures = [
    {
      id: "treap",
      name: "Treap (Randomized BST)",
      complexity: { average: "O(log n)", worst: "O(n)" },
      description: "Balanced BST using random priorities instead of rotations.",
      code: `struct TreapNode {
    int key, priority;
    TreapNode *left, *right;

    TreapNode(int k) : key(k), priority(rand()), left(nullptr), right(nullptr) {}
};

class Treap {
private:
    TreapNode* root;

    // Right rotation
    TreapNode* rotateRight(TreapNode* node) {
        TreapNode* leftChild = node->left;
        node->left = leftChild->right;
        leftChild->right = node;
        return leftChild;
    }

    // Left rotation
    TreapNode* rotateLeft(TreapNode* node) {
        TreapNode* rightChild = node->right;
        node->right = rightChild->left;
        rightChild->left = node;
        return rightChild;
    }

    // Insert with heap property maintenance
    TreapNode* insert(TreapNode* node, int key) {
        if (!node) return new TreapNode(key);

        if (key < node->key) {
            node->left = insert(node->left, key);

            // Maintain heap property
            if (node->left->priority > node->priority) {
                node = rotateRight(node);
            }
        } else {
            node->right = insert(node->right, key);

            if (node->right->priority > node->priority) {
                node = rotateLeft(node);
            }
        }

        return node;
    }

    // Delete operation
    TreapNode* deleteNode(TreapNode* node, int key) {
        if (!node) return nullptr;

        if (key < node->key) {
            node->left = deleteNode(node->left, key);
        } else if (key > node->key) {
            node->right = deleteNode(node->right, key);
        } else {
            // Node found - handle deletion
            if (!node->left) {
                TreapNode* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                TreapNode* temp = node->left;
                delete node;
                return temp;
            }

            // Two children - rotate based on priority
            if (node->left->priority > node->right->priority) {
                node = rotateRight(node);
                node->right = deleteNode(node->right, key);
            } else {
                node = rotateLeft(node);
                node->left = deleteNode(node->left, key);
            }
        }

        return node;
    }

public:
    Treap() : root(nullptr) { srand(time(0)); }

    void insert(int key) {
        root = insert(root, key);
    }

    void remove(int key) {
        root = deleteNode(root, key);
    }

    bool search(int key) {
        TreapNode* current = root;
        while (current) {
            if (key == current->key) return true;
            current = key < current->key ? current->left : current->right;
        }
        return false;
    }
};`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Random Pick with Weight",
      difficulty: "Medium",
      description: "Pick index randomly with probability proportional to weight",
      hint: "Prefix sum array and binary search"
    },
    {
      name: "Shuffle an Array",
      difficulty: "Medium",
      description: "Randomly shuffle array in-place",
      hint: "Fisher-Yates algorithm"
    },
    {
      name: "Random Pick Index",
      difficulty: "Medium",
      description: "Pick random index of target in array",
      hint: "Reservoir sampling for multiple occurrences"
    },
    {
      name: "Linked List Random Node",
      difficulty: "Medium",
      description: "Get random node from singly linked list",
      hint: "Reservoir sampling with unknown size"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(n)") && !complexity.includes("n²")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(log")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(k)") || complexity.includes("O(n²)")) color = "bg-yellow-100 text-yellow-800";

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
              <span className="bg-gradient-to-r from-slate-400 to-gray-400 bg-clip-text text-transparent">
                Randomized Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore algorithms that use randomness to achieve efficiency, probabilistic guarantees, and elegant solutions to complex problems.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("monte-carlo")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "monte-carlo"
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Monte Carlo
            </button>
            <button
              onClick={() => setActiveSection("las-vegas")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "las-vegas"
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Las Vegas
            </button>
            <button
              onClick={() => setActiveSection("probabilistic")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "probabilistic"
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Probabilistic
            </button>
            <button
              onClick={() => setActiveSection("randomized")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "randomized"
                  ? "bg-slate-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Randomized
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Randomized Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-400 mb-4">What are Randomized Algorithms?</h3>
                  <p className="text-gray-300 mb-6">
                    Randomized algorithms use randomness as a tool to achieve better performance,
                    simpler implementation, or probabilistic guarantees. They make random choices
                    during execution and can be classified by their correctness guarantees.
                  </p>

                  <h3 className="text-2xl font-semibold text-slate-400 mb-4">Algorithm Types</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-2">🎲</span>
                      <span><strong>Las Vegas:</strong> Always correct, running time varies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-2">🎯</span>
                      <span><strong>Monte Carlo:</strong> Fixed time, probabilistic correctness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-2">⚡</span>
                      <span><strong>Probabilistic:</strong> Use randomness for efficiency</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-2">🔄</span>
                      <span><strong>Randomized Data Structures:</strong> Use randomness for balance</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-slate-400 mb-4">Advantages & Applications</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Speed</h4>
                      <p className="text-gray-300">Expected O(n) vs worst-case O(n²)</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Simplicity</h4>
                      <p className="text-gray-300">Often simpler than deterministic alternatives</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Real Applications</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Primality testing (Miller-Rabin)</li>
                        <li>• Load balancing</li>
                        <li>• Cryptography</li>
                        <li>• Approximate algorithms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900/20 to-gray-900/20 border border-slate-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-slate-400 mb-3">Expected vs Worst Case</h4>
                  <p className="text-gray-300">Often O(n) expected time</p>
                  <p className="text-sm text-gray-400 mt-2">vs O(n²) worst case for deterministic</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Probabilistic Guarantees</h4>
                  <p className="text-gray-300">High probability of correctness</p>
                  <p className="text-sm text-gray-400 mt-2">Can be made arbitrarily high</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Randomness Sources</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• System time</li>
                    <li>• Hardware entropy</li>
                    <li>• Pseudorandom generators</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Monte Carlo Section */}
          {activeSection === "monte-carlo" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Monte Carlo Methods</h2>

              <div className="grid grid-cols-1 gap-8">
                {monteCarlo.map((method) => (
                  <div
                    key={method.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{method.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-slate-900/50 text-slate-300 text-sm rounded-lg">
                            Time: {method.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-gray-900/50 text-gray-300 text-sm rounded-lg">
                            Space: {method.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{method.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{method.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Las Vegas Section */}
          {activeSection === "las-vegas" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Las Vegas Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {lasVegas.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-gray-500 hover:shadow-2xl hover:shadow-gray-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-gray-900/50 text-gray-300 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
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

          {/* Probabilistic Algorithms Section */}
          {activeSection === "probabilistic" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Probabilistic Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {probabilisticAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key}>
                              {renderComplexityBadge(`${key.toUpperCase()}: ${value}`)}
                            </span>
                          ))}
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

                {/* Randomized Data Structures */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Randomized Data Structures</h3>

                  <div className="grid grid-cols-1 gap-6">
                    {randomizedDataStructures.map((structure) => (
                      <div key={structure.id} className="bg-gray-700/50 p-4 rounded-xl">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-cyan-400">{structure.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(structure.complexity).map(([key, value]) => (
                              <span key={key}>
                                {renderComplexityBadge(`${key}: ${value}`)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">{structure.description}</p>
                        <pre className="bg-gray-900 text-gray-300 p-3 rounded text-xs overflow-x-auto">
                          <code>{structure.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Randomized Algorithms Section */}
          {activeSection === "randomized" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Randomized Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {randomizedAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-lg">
                            Time: {algorithm.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-orange-900/50 text-orange-300 text-sm rounded-lg">
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

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Randomized</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Random Pick Index</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Shuffle Array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Linked List Random Node</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Random Point in Circle</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Randomized</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Random Pick with Weight</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Generate Random Point in Triangle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Reservoir Sampling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Randomized Quickselect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Skip List Implementation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Advanced Randomized</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Karger's Min-Cut Algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Miller-Rabin Primality Test</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Bloom Filter Implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Treap (Randomized BST)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Monte Carlo Integration</span>
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

          {/* Randomized Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Randomized Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-400 mb-4">Algorithm Classification</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Las Vegas:</span>
                    <span className="text-green-400 font-mono">Always correct, variable time</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Monte Carlo:</span>
                    <span className="text-blue-400 font-mono">Fixed time, probabilistic</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Probabilistic:</span>
                    <span className="text-purple-400 font-mono">Uses randomness for efficiency</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Expected Case:</span>
                    <span className="text-cyan-400 font-mono">Average performance over randomness</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-400 mb-4">Common Techniques</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Randomized Partitioning:</div>
                    <div className="text-gray-400">→ Quickselect, Quicksort</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Reservoir Sampling:</div>
                    <div className="text-gray-400">→ Sample k from stream</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Random Priorities:</div>
                    <div className="text-gray-400">→ Treaps, Skip Lists</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Monte Carlo Sampling:</div>
                    <div className="text-gray-400">→ π estimation, integration</div>
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

export default RandomizedAlgorithms;

