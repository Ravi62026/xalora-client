import React, { useState } from "react";
import { Layout } from "../components";

const GreedyAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Greedy Fundamentals
  const fundamentals = [
    {
      id: "greedy-choice",
      name: "Greedy Choice Property",
      description: "A globally optimal solution can be arrived at by making a locally optimal choice at each stage.",
      examples: ["Activity Selection", "Huffman Coding", "Dijkstra's Algorithm"],
      code: `// Activity Selection Problem
// Greedy choice: Always pick the activity that finishes earliest
vector<int> activitySelection(vector<pair<int, int>>& activities) {
    // Sort activities by finish time
    sort(activities.begin(), activities.end(),
         [](const auto& a, const auto& b) {
             return a.second < b.second; // finish time
         });

    vector<int> selected;
    selected.push_back(0); // First activity

    int lastFinish = activities[0].second;

    for (int i = 1; i < activities.size(); i++) {
        if (activities[i].first >= lastFinish) {
            selected.push_back(i);
            lastFinish = activities[i].second;
        }
    }

    return selected;
}`
    },
    {
      id: "optimal-substructure",
      name: "Optimal Substructure",
      description: "An optimal solution to the problem contains optimal solutions to subproblems.",
      examples: ["Fractional Knapsack", "Minimum Spanning Tree", "Shortest Path"],
      code: `// Fractional Knapsack - Shows optimal substructure
// If we take fraction x of item i, then remaining capacity
// should be filled optimally from remaining items

double fractionalKnapsack(vector<pair<double, int>>& items, int capacity) {
    // Sort by value/weight ratio (greedy choice)
    sort(items.rbegin(), items.rend()); // descending order

    double totalValue = 0.0;

    for (auto& item : items) {
        if (capacity >= item.second) {
            // Take whole item
            totalValue += item.first;
            capacity -= item.second;
        } else {
            // Take fraction
            totalValue += item.first * (double)capacity / item.second;
            break;
        }
    }

    return totalValue;
}`
    }
  ];

  // Classic Greedy Problems
  const classicProblems = [
    {
      id: "activity-selection",
      name: "Activity Selection Problem",
      complexity: { time: "O(n log n)", space: "O(1)" },
      description: "Select maximum number of non-overlapping activities from given set of activities.",
      code: `vector<pair<int, int>> activitySelection(vector<pair<int, int>>& activities) {
    // Sort by finish time
    sort(activities.begin(), activities.end(),
         [](const auto& a, const auto& b) {
             return a.second < b.second;
         });

    vector<pair<int, int>> selected;
    if (!activities.empty()) {
        selected.push_back(activities[0]);
        int lastFinish = activities[0].second;

        for (size_t i = 1; i < activities.size(); i++) {
            if (activities[i].first >= lastFinish) {
                selected.push_back(activities[i]);
                lastFinish = activities[i].second;
            }
        }
    }

    return selected;
}`
    },
    {
      id: "fractional-knapsack",
      name: "Fractional Knapsack",
      complexity: { time: "O(n log n)", space: "O(1)" },
      description: "Maximum value that can be put in knapsack of capacity W, allowing fractional items.",
      code: `struct Item {
    int value, weight;
    double ratio;
};

double fractionalKnapsack(vector<Item>& items, int capacity) {
    // Sort by value/weight ratio in descending order
    sort(items.begin(), items.end(),
         [](const Item& a, const Item& b) {
             return a.ratio > b.ratio;
         });

    double totalValue = 0.0;

    for (auto& item : items) {
        if (capacity >= item.weight) {
            totalValue += item.value;
            capacity -= item.weight;
        } else {
            totalValue += item.value * ((double)capacity / item.weight);
            break;
        }
    }

    return totalValue;
}`
    },
    {
      id: "huffman-coding",
      name: "Huffman Coding",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Variable-length prefix code that minimizes expected message length.",
      code: `struct HuffmanNode {
    char data;
    int freq;
    HuffmanNode *left, *right;

    HuffmanNode(char d, int f) : data(d), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};

void generateCodes(HuffmanNode* root, string code, map<char, string>& codes) {
    if (!root) return;

    if (!root->left && !root->right) {
        codes[root->data] = code;
        return;
    }

    generateCodes(root->left, code + "0", codes);
    generateCodes(root->right, code + "1", codes);
}

map<char, string> buildHuffmanTree(vector<pair<char, int>>& freq) {
    priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> pq;

    for (auto& p : freq) {
        pq.push(new HuffmanNode(p.first, p.second));
    }

    while (pq.size() > 1) {
        HuffmanNode* left = pq.top(); pq.pop();
        HuffmanNode* right = pq.top(); pq.pop();

        HuffmanNode* parent = new HuffmanNode('$', left->freq + right->freq);
        parent->left = left;
        parent->right = right;

        pq.push(parent);
    }

    map<char, string> codes;
    generateCodes(pq.top(), "", codes);
    return codes;
}`
    },
    {
      id: "job-sequencing",
      name: "Job Sequencing with Deadlines",
      complexity: { time: "O(n²)", space: "O(n)" },
      description: "Schedule jobs to maximize profit with deadline constraints.",
      code: `struct Job {
    char id;
    int deadline, profit;
};

bool compareJobs(const Job& a, const Job& b) {
    return a.profit > b.profit; // Sort by profit descending
}

vector<char> jobSequencing(vector<Job>& jobs) {
    sort(jobs.begin(), jobs.end(), compareJobs);

    int n = jobs.size();
    vector<bool> slot(n, false); // Track available time slots
    vector<char> result(n, '\0');

    for (auto& job : jobs) {
        // Find latest available slot before deadline
        for (int j = min(n, job.deadline) - 1; j >= 0; j--) {
            if (!slot[j]) {
                result[j] = job.id;
                slot[j] = true;
                break;
            }
        }
    }

    return result;
}`
    }
  ];

  // Graph Greedy Algorithms
  const graphGreedy = [
    {
      id: "kruskal",
      name: "Kruskal's Algorithm",
      complexity: { time: "O(E log E)", space: "O(E + V)" },
      description: "Find Minimum Spanning Tree using greedy approach - sort edges and add if no cycle.",
      code: `struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class UnionFind {
private:
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;

        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else {
            parent[py] = px;
            if (rank[px] == rank[py]) rank[px]++;
        }
        return true;
    }
};

vector<Edge> kruskalMST(vector<Edge>& edges, int V) {
    sort(edges.begin(), edges.end()); // Sort edges by weight
    UnionFind uf(V);
    vector<Edge> mst;

    for (auto& edge : edges) {
        if (uf.unite(edge.u, edge.v)) {
            mst.push_back(edge);
            if (mst.size() == V - 1) break; // MST complete
        }
    }

    return mst;
}`
    },
    {
      id: "prim",
      name: "Prim's Algorithm",
      complexity: { time: "O(E log V)", space: "O(V)" },
      description: "Find Minimum Spanning Tree by growing tree from single vertex.",
      code: `vector<Edge> primMST(vector<vector<pair<int, int>>>& graph) {
    int V = graph.size();
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    vector<bool> inMST(V, false);

    key[0] = 0; // Start from vertex 0

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, 0}); // {weight, vertex}

    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();

        if (inMST[u]) continue;
        inMST[u] = true;

        // Check all adjacent vertices
        for (auto& neighbor : graph[u]) {
            int v = neighbor.first;
            int weight = neighbor.second;

            if (!inMST[v] && weight < key[v]) {
                key[v] = weight;
                parent[v] = u;
                pq.push({key[v], v});
            }
        }
    }

    // Convert parent array to edges
    vector<Edge> mst;
    for (int i = 1; i < V; i++) {
        if (parent[i] != -1) {
            mst.push_back({parent[i], i, key[i]});
        }
    }

    return mst;
}`
    },
    {
      id: "dijkstra",
      name: "Dijkstra's Algorithm",
      complexity: { time: "O(V²) or O((V+E) log V)", space: "O(V)" },
      description: "Find shortest path from source to all vertices in graph with non-negative weights.",
      code: `vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int source) {
    int V = graph.size();
    vector<int> dist(V, INT_MAX);
    dist[source] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, source}); // {distance, vertex}

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) continue; // Skip if we found better path

        for (auto& neighbor : graph[u]) {
            int v = neighbor.first;
            int weight = neighbor.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}`
    }
  ];

  // Advanced Greedy Problems
  const advancedProblems = [
    {
      id: "egyptian-fraction",
      name: "Egyptian Fraction",
      complexity: { time: "O(log n)", space: "O(log n)" },
      description: "Represent fraction as sum of distinct unit fractions.",
      code: `vector<int> egyptianFraction(int numerator, int denominator) {
    vector<int> result;

    while (numerator > 0) {
        // Find smallest unit fraction >= numerator/denominator
        int unitDenom = ceil((double)denominator / numerator);

        result.push_back(unitDenom);

        // Update numerator and denominator
        numerator = numerator * unitDenom - denominator;
        denominator = denominator * unitDenom;

        // Simplify fraction
        int gcd = __gcd(abs(numerator), denominator);
        numerator /= gcd;
        denominator /= gcd;
    }

    return result;
}`
    },
    {
      id: "optimal-merge",
      name: "Optimal Merge Pattern",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Merge n sorted files with minimum total cost.",
      code: `int optimalMergeCost(vector<int>& files) {
    priority_queue<int, vector<int>, greater<int>> pq(files.begin(), files.end());

    int totalCost = 0;

    while (pq.size() > 1) {
        int first = pq.top(); pq.pop();
        int second = pq.top(); pq.pop();

        int mergeCost = first + second;
        totalCost += mergeCost;

        pq.push(mergeCost);
    }

    return totalCost;
}`
    },
    {
      id: "gas-station",
      name: "Gas Station Problem",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Find starting gas station to complete circular route.",
      code: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int n = gas.size();
    int totalGas = 0, currentGas = 0;
    int start = 0;

    for (int i = 0; i < n; i++) {
        int netGas = gas[i] - cost[i];
        totalGas += netGas;
        currentGas += netGas;

        // If current gas becomes negative, reset start
        if (currentGas < 0) {
            start = i + 1;
            currentGas = 0;
        }
    }

    // If total gas is negative, impossible to complete circuit
    return totalGas >= 0 ? start : -1;
}`
    }
  ];

  // When Greedy Works vs Doesn't Work
  const greedyAnalysis = [
    {
      name: "When Greedy Works",
      examples: [
        "Activity Selection - Local optimal (earliest finish) gives global optimal",
        "Huffman Coding - Greedy choice builds optimal prefix code",
        "Dijkstra's - Always choose closest unvisited vertex",
        "Kruskal's MST - Add smallest edge that doesn't create cycle"
      ]
    },
    {
      name: "When Greedy Fails",
      examples: [
        "0/1 Knapsack - Can't take fractions, need DP",
        "Coin Change - May not work with arbitrary coin denominations",
        "Longest Path - Greedy doesn't work, need DP or exponential",
        "Traveling Salesman - Greedy gives approximation, not optimal"
      ]
    }
  ];

  // Interview Questions
  const interviewProblems = [
    {
      name: "Jump Game",
      difficulty: "Medium",
      description: "Can reach last index with given jump lengths",
      hint: "Greedily track farthest reachable position"
    },
    {
      name: "Candy Distribution",
      difficulty: "Hard",
      description: "Minimum candies to distribute satisfying rating constraints",
      hint: "Two passes: left to right, then right to left"
    },
    {
      name: "Task Scheduler",
      difficulty: "Medium",
      description: "Minimum time to complete tasks with cooldown",
      hint: "Count frequencies, find most frequent task"
    },
    {
      name: "Lemonade Change",
      difficulty: "Easy",
      description: "Can provide correct change for all customers",
      hint: "Track available bills, prefer larger denominations"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("log")) color = "bg-blue-100 text-blue-800";
    if (complexity === "O(1)") color = "bg-green-100 text-green-800";
    if (complexity.includes("n") && !complexity.includes("log")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("n²") || complexity.includes("V²")) color = "bg-red-100 text-red-800";

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
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Greedy Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the art of making locally optimal choices that lead to globally optimal solutions.
              Learn when greedy works and when it doesn't.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("fundamentals")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "fundamentals"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Fundamentals
            </button>
            <button
              onClick={() => setActiveSection("classic")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "classic"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Classic Problems
            </button>
            <button
              onClick={() => setActiveSection("graphs")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "graphs"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Graph Algorithms
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "advanced"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Greedy Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-teal-400 mb-4">What are Greedy Algorithms?</h3>
                  <p className="text-gray-300 mb-6">
                    Greedy algorithms make the optimal choice at each step, hoping that these local optimal
                    choices will lead to a global optimal solution. They are simple, efficient, and work
                    for many important problems.
                  </p>

                  <h3 className="text-2xl font-semibold text-teal-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">🎯</span>
                      <span><strong>Greedy Choice Property:</strong> Local optimal choice leads to global optimal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">⚡</span>
                      <span><strong>Efficient:</strong> Usually O(n log n) or better time complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">🔧</span>
                      <span><strong>Simple Implementation:</strong> Easy to understand and code</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-400 mr-2">❓</span>
                      <span><strong>Not Always Correct:</strong> Need to prove greedy choice works</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-teal-400 mb-4">When to Use Greedy</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">✅ Greedy Works</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Activity Selection Problem</li>
                        <li>• Huffman Coding</li>
                        <li>• Minimum Spanning Tree (Kruskal/Prim)</li>
                        <li>• Shortest Path (Dijkstra)</li>
                        <li>• Fractional Knapsack</li>
                      </ul>
                    </div>

                    <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">❌ Greedy Fails</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• 0/1 Knapsack (need DP)</li>
                        <li>• Coin Change (may need DP)</li>
                        <li>• Longest Path in Graph</li>
                        <li>• Traveling Salesman Problem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border border-teal-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-teal-400 mb-3">Advantages</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Simple and intuitive</li>
                    <li>• Efficient time complexity</li>
                    <li>• Low space requirements</li>
                    <li>• Easy to implement</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-yellow-400 mb-3">Limitations</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• May not give optimal solution</li>
                    <li>• Hard to prove correctness</li>
                    <li>• No standard greedy approach</li>
                    <li>• Problem-specific design</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Proof Strategy</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Prove greedy choice property</li>
                    <li>• Show optimal substructure</li>
                    <li>• Use exchange argument</li>
                    <li>• Mathematical induction</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Fundamentals Section */}
          {activeSection === "fundamentals" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Greedy Fundamentals</h2>

              <div className="grid grid-cols-1 gap-8">
                {fundamentals.map((concept) => (
                  <div
                    key={concept.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{concept.name}</h3>
                        <span className="px-3 py-1 bg-teal-900/50 text-teal-300 text-sm rounded-lg">
                          Core Concept
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6">{concept.description}</p>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-teal-400 mb-3">Examples</h4>
                        <div className="flex flex-wrap gap-2">
                          {concept.examples.map((example, idx) => (
                            <span key={idx} className="px-3 py-1 bg-teal-900/50 text-teal-300 text-sm rounded-lg">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{concept.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classic Problems Section */}
          {activeSection === "classic" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Classic Greedy Problems</h2>

              <div className="grid grid-cols-1 gap-8">
                {classicProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${problem.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${problem.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graph Algorithms Section */}
          {activeSection === "graphs" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Graph Greedy Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {graphGreedy.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${algorithm.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${algorithm.complexity.space}`)}
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

          {/* Advanced Problems Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Greedy Problems</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${problem.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${problem.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{problem.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{problem.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Greedy Analysis Section */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">When Greedy Works vs Doesn't Work</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {greedyAnalysis.map((analysis, idx) => (
                      <div key={idx} className={`p-4 rounded-xl ${analysis.name.includes("Works")
                          ? "bg-green-900/20 border border-green-700/50"
                          : "bg-red-900/20 border border-red-700/50"
                        }`}>
                        <h4 className={`text-lg font-semibold mb-3 ${analysis.name.includes("Works") ? "text-green-400" : "text-red-400"
                          }`}>
                          {analysis.name}
                        </h4>
                        <ul className="space-y-2 text-gray-300">
                          {analysis.examples.map((example, i) => (
                            <li key={i} className="flex items-start">
                              <span className={`mr-2 ${analysis.name.includes("Works") ? "text-green-400" : "text-red-400"
                                }`}>
                                {analysis.name.includes("Works") ? "✓" : "✗"}
                              </span>
                              <span className="text-sm">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Greedy</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Assign Cookies (greedy assignment)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Is Subsequence (two pointers)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Maximum Units on a Truck</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Queue Reconstruction by Height</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Greedy</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Jump Game II (minimum jumps)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Non-overlapping Intervals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Minimum Number of Arrows to Burst Balloons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Two City Scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Reorganize String</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Greedy</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Create Maximum Number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>IPO (Initial Public Offering)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Sliding Window Maximum (monotonic stack)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Remove K Digits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Minimum Cost to Hire K Workers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Common Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewProblems.map((problem, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyan-400 font-semibold">{problem.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
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

          {/* Greedy Mastery Checklist */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Greedy Mastery Checklist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Fundamentals</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Greedy choice property</li>
                  <li>• Optimal substructure</li>
                  <li>• When greedy works/fails</li>
                  <li>• Proof techniques</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">🎯 Classic Problems</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Activity selection</li>
                  <li>• Fractional knapsack</li>
                  <li>• Huffman coding</li>
                  <li>• Job sequencing</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">🔗 Graph Algorithms</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Kruskal's MST</li>
                  <li>• Prim's MST</li>
                  <li>• Dijkstra's shortest path</li>
                  <li>• Union-Find data structure</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-red-400 mb-2">🚀 Interview Ready</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Prove greedy correctness</li>
                  <li>• Handle edge cases</li>
                  <li>• Time/space optimization</li>
                  <li>• Alternative approaches</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GreedyAlgorithms;

