import React, { useState } from "react";
import { Layout } from "../components";

const GraphAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Graph Representations
  const representations = [
    {
      name: "Adjacency Matrix",
      description: "2D array where matrix[i][j] = 1 if edge exists between i and j",
      timeComplexity: {
        space: "O(V²)",
        checkEdge: "O(1)",
        findNeighbors: "O(V)",
        addEdge: "O(1)"
      },
      code: `class GraphMatrix {
private:
    vector<vector<int>> adj;
    int V;

public:
    GraphMatrix(int vertices) : V(vertices) {
        adj.assign(V, vector<int>(V, 0));
    }

    void addEdge(int u, int v) {
        adj[u][v] = 1;
        adj[v][u] = 1; // undirected
    }

    bool hasEdge(int u, int v) {
        return adj[u][v] == 1;
    }

    vector<int> getNeighbors(int u) {
        vector<int> neighbors;
        for (int v = 0; v < V; v++) {
            if (adj[u][v]) neighbors.push_back(v);
        }
        return neighbors;
    }
};`
    },
    {
      name: "Adjacency List",
      description: "Array of lists where each list contains neighbors of a vertex",
      timeComplexity: {
        space: "O(V + E)",
        checkEdge: "O(degree(u))",
        findNeighbors: "O(degree(u))",
        addEdge: "O(1)"
      },
      code: `class GraphList {
private:
    vector<vector<int>> adj;
    int V;

public:
    GraphList(int vertices) : V(vertices) {
        adj.resize(V);
    }

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u); // undirected
    }

    bool hasEdge(int u, int v) {
        for (int neighbor : adj[u]) {
            if (neighbor == v) return true;
        }
        return false;
    }

    vector<int> getNeighbors(int u) {
        return adj[u];
    }
};`
    }
  ];

  // Traversal Algorithms
  const traversals = [
    {
      id: "bfs",
      name: "Breadth-First Search (BFS)",
      complexity: { time: "O(V + E)", space: "O(V)" },
      description: "Level-order traversal using a queue. Finds shortest path in unweighted graphs.",
      applications: ["Shortest path in unweighted graphs", "Web crawling", "Finding connected components", "Level-order tree traversal"],
      code: `void BFS(vector<vector<int>>& graph, int start) {
    int V = graph.size();
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    cout << "BFS Traversal: ";

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";

        // Visit all unvisited neighbors
        for (int v : graph[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    cout << endl;
}

// Shortest path in unweighted graph
vector<int> shortestPathUnweighted(vector<vector<int>>& graph, int start, int end) {
    int V = graph.size();
    vector<int> dist(V, -1);
    vector<int> parent(V, -1);
    queue<int> q;

    dist[start] = 0;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : graph[u]) {
            if (dist[v] == -1) { // not visited
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }

    // Reconstruct path
    vector<int> path;
    if (dist[end] != -1) {
        for (int at = end; at != -1; at = parent[at]) {
            path.push_back(at);
        }
        reverse(path.begin(), path.end());
    }

    return path;
}`
    },
    {
      id: "dfs",
      name: "Depth-First Search (DFS)",
      complexity: { time: "O(V + E)", space: "O(V)" },
      description: "Explores as far as possible along each branch before backtracking. Uses recursion or stack.",
      applications: ["Topological sorting", "Finding connected components", "Solving mazes", "Cycle detection"],
      code: `// Recursive DFS
void DFSRecursive(vector<vector<int>>& graph, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";

    for (int v : graph[u]) {
        if (!visited[v]) {
            DFSRecursive(graph, v, visited);
        }
    }
}

// Iterative DFS using stack
void DFSIterative(vector<vector<int>>& graph, int start) {
    int V = graph.size();
    vector<bool> visited(V, false);
    stack<int> stk;

    stk.push(start);
    cout << "DFS Traversal: ";

    while (!stk.empty()) {
        int u = stk.top();
        stk.pop();

        if (!visited[u]) {
            visited[u] = true;
            cout << u << " ";

            // Push neighbors in reverse order for correct order
            for (int i = graph[u].size() - 1; i >= 0; i--) {
                int v = graph[u][i];
                if (!visited[v]) {
                    stk.push(v);
                }
            }
        }
    }
    cout << endl;
}

// Cycle detection in directed graph
bool hasCycleDFS(vector<vector<int>>& graph, int u, vector<int>& state) {
    // state: 0 = not visited, 1 = visiting, 2 = visited
    state[u] = 1; // visiting

    for (int v : graph[u]) {
        if (state[v] == 1) return true; // cycle found
        if (state[v] == 0 && hasCycleDFS(graph, v, state)) return true;
    }

    state[u] = 2; // visited
    return false;
}`
    }
  ];

  // Shortest Path Algorithms
  const shortestPaths = [
    {
      id: "dijkstra",
      name: "Dijkstra's Algorithm",
      complexity: { time: "O((V + E) log V)", space: "O(V)" },
      description: "Finds shortest path from source to all vertices in graphs with non-negative weights.",
      code: `vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int source) {
    int V = graph.size();
    vector<int> dist(V, INT_MAX);
    dist[source] = 0;

    // Min-heap: {distance, vertex}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, source});

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        // Skip if we found a better path already
        if (d > dist[u]) continue;

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
    },
    {
      id: "bellman-ford",
      name: "Bellman-Ford Algorithm",
      complexity: { time: "O(V × E)", space: "O(V)" },
      description: "Handles negative weights and detects negative cycles. Slower than Dijkstra but more general.",
      code: `vector<int> bellmanFord(vector<vector<tuple<int, int, int>>>& edges, int V, int source) {
    vector<int> dist(V, INT_MAX);
    dist[source] = 0;

    // Relax all edges V-1 times
    for (int i = 1; i < V; i++) {
        for (auto& edge : edges) {
            int u, v, w;
            tie(u, v, w) = edge;

            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // Check for negative cycles (Vth iteration)
    for (auto& edge : edges) {
        int u, v, w;
        tie(u, v, w) = edge;

        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            cout << "Graph contains negative cycle!" << endl;
            return {}; // negative cycle detected
        }
    }

    return dist;
}`
    },
    {
      id: "floyd-warshall",
      name: "Floyd-Warshall Algorithm",
      complexity: { time: "O(V³)", space: "O(V²)" },
      description: "All-pairs shortest paths. Works with negative weights (no negative cycles).",
      code: `vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
    int V = graph.size();
    vector<vector<int>> dist = graph; // copy graph

    // Initialize unreachable paths
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][j] == 0 && i != j) {
                dist[i][j] = INT_MAX / 2; // large number
            }
        }
    }

    // Floyd-Warshall algorithm
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX / 2 && dist[k][j] != INT_MAX / 2) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    // Check for negative cycles
    for (int i = 0; i < V; i++) {
        if (dist[i][i] < 0) {
            cout << "Negative cycle detected!" << endl;
            return {};
        }
    }

    return dist;
}`
    }
  ];

  // Minimum Spanning Tree
  const mstAlgorithms = [
    {
      id: "kruskal",
      name: "Kruskal's Algorithm",
      complexity: { time: "O(E log E)", space: "O(E + V)" },
      description: "Sort edges by weight, add to MST if no cycle created. Uses Union-Find.",
      code: `class UnionFind {
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
            parent[x] = find(parent[x]); // path compression
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

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

vector<Edge> kruskalMST(vector<Edge>& edges, int V) {
    sort(edges.begin(), edges.end()); // sort by weight
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
      description: "Grow MST from single vertex by adding minimum weight edge to existing tree.",
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

    // Convert to edges
    vector<Edge> mst;
    for (int i = 1; i < V; i++) {
        if (parent[i] != -1) {
            // Find weight between parent[i] and i
            for (auto& neighbor : graph[parent[i]]) {
                if (neighbor.first == i) {
                    mst.push_back({parent[i], i, neighbor.second});
                    break;
                }
            }
        }
    }

    return mst;
}`
    }
  ];

  // Advanced Graph Algorithms
  const advancedAlgorithms = [
    {
      id: "topological-sort",
      name: "Topological Sort",
      complexity: { time: "O(V + E)", space: "O(V)" },
      description: "Linear ordering of vertices such that for every directed edge u→v, u comes before v.",
      prerequisite: "Directed Acyclic Graph (DAG)",
      code: `// Kahn's algorithm (BFS-based)
vector<int> topologicalSort(vector<vector<int>>& graph) {
    int V = graph.size();
    vector<int> indegree(V, 0);

    // Calculate indegrees
    for (int u = 0; u < V; u++) {
        for (int v : graph[u]) {
            indegree[v]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    vector<int> result;

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);

        for (int v : graph[u]) {
            if (--indegree[v] == 0) {
                q.push(v);
            }
        }
    }

    // Check for cycle
    if (result.size() != V) {
        cout << "Graph contains cycle!" << endl;
        return {};
    }

    return result;
}

// DFS-based topological sort
void topologicalSortDFS(vector<vector<int>>& graph, int u,
                       vector<bool>& visited, stack<int>& stk) {
    visited[u] = true;

    for (int v : graph[u]) {
        if (!visited[v]) {
            topologicalSortDFS(graph, v, visited, stk);
        }
    }

    stk.push(u);
}

vector<int> topologicalSortDFS(vector<vector<int>>& graph) {
    int V = graph.size();
    vector<bool> visited(V, false);
    stack<int> stk;

    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            topologicalSortDFS(graph, i, visited, stk);
        }
    }

    vector<int> result;
    while (!stk.empty()) {
        result.push_back(stk.top());
        stk.pop();
    }

    return result;
}`
    },
    {
      id: "strongly-connected",
      name: "Strongly Connected Components",
      complexity: { time: "O(V + E)", space: "O(V)" },
      description: "Maximal sets of vertices where every pair is mutually reachable.",
      algorithm: "Kosaraju's or Tarjan's algorithm",
      code: `// Kosaraju's Algorithm - Two DFS passes
class KosarajuSCC {
private:
    void DFS1(vector<vector<int>>& graph, int u, vector<bool>& visited, stack<int>& stk) {
        visited[u] = true;
        for (int v : graph[u]) {
            if (!visited[v]) {
                DFS1(graph, v, visited, stk);
            }
        }
        stk.push(u);
    }

    void DFS2(vector<vector<int>>& transpose, int u, vector<bool>& visited, vector<int>& component) {
        visited[u] = true;
        component.push_back(u);

        for (int v : transpose[u]) {
            if (!visited[v]) {
                DFS2(transpose, v, visited, component);
            }
        }
    }

public:
    vector<vector<int>> findSCC(vector<vector<int>>& graph) {
        int V = graph.size();
        vector<bool> visited(V, false);
        stack<int> stk;

        // First DFS: fill stack with finishing times
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                DFS1(graph, i, visited, stk);
            }
        }

        // Create transpose graph
        vector<vector<int>> transpose(V);
        for (int u = 0; u < V; u++) {
            for (int v : graph[u]) {
                transpose[v].push_back(u);
            }
        }

        // Second DFS: process in decreasing finish time order
        fill(visited.begin(), visited.end(), false);
        vector<vector<int>> scc;

        while (!stk.empty()) {
            int u = stk.top();
            stk.pop();

            if (!visited[u]) {
                vector<int> component;
                DFS2(transpose, u, visited, component);
                scc.push_back(component);
            }
        }

        return scc;
    }
};`
    },
    {
      id: "max-flow",
      name: "Maximum Flow (Ford-Fulkerson)",
      complexity: { time: "O(Flow × E)", space: "O(V + E)" },
      description: "Maximum amount of flow that can be sent from source to sink.",
      applications: ["Network flow problems", "Bipartite matching", "Circulation problems"],
      code: `class FordFulkerson {
private:
    int V;
    vector<vector<int>> capacity;
    vector<vector<int>> flow;

    bool bfs(vector<vector<int>>& residual, int source, int sink, vector<int>& parent) {
        vector<bool> visited(V, false);
        queue<int> q;

        q.push(source);
        visited[source] = true;
        parent[source] = -1;

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int v = 0; v < V; v++) {
                // If not visited and there is residual capacity
                if (!visited[v] && residual[u][v] > 0) {
                    q.push(v);
                    parent[v] = u;
                    visited[v] = true;

                    if (v == sink) return true;
                }
            }
        }

        return false;
    }

public:
    FordFulkerson(int vertices) : V(vertices) {
        capacity.assign(V, vector<int>(V, 0));
        flow.assign(V, vector<int>(V, 0));
    }

    void addEdge(int u, int v, int cap) {
        capacity[u][v] = cap;
    }

    int maxFlow(int source, int sink) {
        vector<vector<int>> residual = capacity; // residual = capacity - flow
        vector<int> parent(V);
        int max_flow = 0;

        while (bfs(residual, source, sink, parent)) {
            // Find minimum residual capacity along path
            int path_flow = INT_MAX;
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                path_flow = min(path_flow, residual[u][v]);
            }

            // Update residual capacities
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                residual[u][v] -= path_flow;
                residual[v][u] += path_flow;
                flow[u][v] += path_flow;
            }

            max_flow += path_flow;
        }

        return max_flow;
    }
};`
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("log")) color = "bg-blue-100 text-blue-800";
    if (complexity === "O(V + E)") color = "bg-green-100 text-green-800";
    if (complexity.includes("V²") || complexity.includes("V × E")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("V³") || complexity.includes("E log")) color = "bg-red-100 text-red-800";

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
              <span className="bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                Graph Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the fundamental algorithms for traversing, searching, and optimizing graphs.
              From traversals to advanced flow networks.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("representation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "representation"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Representation
            </button>
            <button
              onClick={() => setActiveSection("traversal")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "traversal"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Traversal
            </button>
            <button
              onClick={() => setActiveSection("shortest-path")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "shortest-path"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Shortest Path
            </button>
            <button
              onClick={() => setActiveSection("mst")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "mst"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              MST
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "advanced"
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Graph Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-lime-400 mb-4">What are Graphs?</h3>
                  <p className="text-gray-300 mb-6">
                    Graphs are fundamental data structures consisting of vertices (nodes) connected by edges.
                    They model relationships between objects and are used to solve real-world problems in
                    networking, social networks, transportation, and many other domains.
                  </p>

                  <h3 className="text-2xl font-semibold text-lime-400 mb-4">Graph Types</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-lime-400 mr-2">📍</span>
                      <span><strong>Directed:</strong> Edges have direction (one-way)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lime-400 mr-2">🔄</span>
                      <span><strong>Undirected:</strong> Edges are bidirectional</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lime-400 mr-2">🏷️</span>
                      <span><strong>Weighted:</strong> Edges have associated costs/weights</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lime-400 mr-2">🌳</span>
                      <span><strong>Trees:</strong> Acyclic connected graphs</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-lime-400 mb-4">Algorithm Categories</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Traversal & Search</h4>
                      <p className="text-gray-300">BFS, DFS - explore graph structure</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Shortest Paths</h4>
                      <p className="text-gray-300">Dijkstra, Bellman-Ford, Floyd-Warshall</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Spanning Trees</h4>
                      <p className="text-gray-300">Kruskal, Prim - minimum cost subgraphs</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Advanced Topics</h4>
                      <p className="text-gray-300">Flow networks, matching, connectivity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-lime-900/20 to-green-900/20 border border-lime-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-lime-400 mb-3">Time Complexity</h4>
                  <p className="text-gray-300">Most graph algorithms: <strong className="text-white">O(V + E)</strong></p>
                  <p className="text-sm text-gray-400 mt-2">V = vertices, E = edges</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">Adjacency list: <strong className="text-white">O(V + E)</strong></p>
                  <p className="text-sm text-gray-400 mt-2">Matrix: O(V²)</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Visited arrays</li>
                    <li>• Parent pointers</li>
                    <li>• Distance tracking</li>
                    <li>• Cycle detection</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Graph Representation Section */}
          {activeSection === "representation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Graph Representations</h2>

              <div className="grid grid-cols-1 gap-8">
                {representations.map((rep, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-lime-500 hover:shadow-2xl hover:shadow-lime-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{rep.name}</h3>
                        <span className="px-3 py-1 bg-lime-900/50 text-lime-300 text-sm rounded-lg">
                          Representation
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6">{rep.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-lime-400 mb-3">Time Complexity</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Space:</span>
                              <span className="text-white">{rep.timeComplexity.space}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Check Edge:</span>
                              <span className="text-white">{rep.timeComplexity.checkEdge}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Find Neighbors:</span>
                              <span className="text-white">{rep.timeComplexity.findNeighbors}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Add Edge:</span>
                              <span className="text-white">{rep.timeComplexity.addEdge}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-700/50 p-4 rounded-xl">
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">When to Use</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• {rep.name === "Adjacency Matrix" ? "Dense graphs, quick edge checks" : "Sparse graphs, traversal algorithms"}</li>
                            <li>• {rep.name === "Adjacency Matrix" ? "Small number of vertices" : "Large sparse graphs"}</li>
                            <li>• {rep.name === "Adjacency Matrix" ? "Floyd-Warshall algorithm" : "Most graph algorithms"}</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{rep.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traversal Section */}
          {activeSection === "traversal" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Graph Traversal Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {traversals.map((algorithm) => (
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

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-green-400 mb-3">Applications</h4>
                        <div className="flex flex-wrap gap-2">
                          {algorithm.applications.map((app, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

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

          {/* Shortest Path Section */}
          {activeSection === "shortest-path" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Shortest Path Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {shortestPaths.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            Time: {algorithm.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-300 text-sm rounded-lg">
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

          {/* MST Section */}
          {activeSection === "mst" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Minimum Spanning Tree Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {mstAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
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

          {/* Advanced Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Graph Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
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

                      {algorithm.prerequisite && (
                        <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded-lg mb-4">
                          <p className="text-yellow-300 text-sm"><strong>Prerequisite:</strong> {algorithm.prerequisite}</p>
                        </div>
                      )}

                      {algorithm.applications && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-red-400 mb-3">Applications</h4>
                          <div className="flex flex-wrap gap-2">
                            {algorithm.applications.map((app, idx) => (
                              <span key={idx} className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-lg">
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {algorithm.algorithm && (
                        <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded-lg mb-4">
                          <p className="text-blue-300 text-sm"><strong>Algorithm:</strong> {algorithm.algorithm}</p>
                        </div>
                      )}

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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-lime-500 hover:shadow-2xl hover:shadow-lime-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Graph Traversal</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Number of islands (DFS/BFS)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Clone graph with DFS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Course schedule (topological sort)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Surrounded regions (DFS flood fill)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Shortest Paths</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Network delay time (Dijkstra)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Cheapest flights within K stops</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Path with minimum effort</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Minimum cost to connect cities (MST)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Advanced Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Critical connections (articulation points)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Alien dictionary (topological sort)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Word ladder (BFS with transformations)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Maximum flow (Ford-Fulkerson)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Patterns */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Common Graph Interview Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Traversal Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Level-order traversal (BFS)</li>
                    <li>• Depth-first exploration (DFS)</li>
                    <li>• Connected components</li>
                    <li>• Cycle detection</li>
                    <li>• Topological ordering</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Optimization Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Shortest path problems</li>
                    <li>• Minimum spanning trees</li>
                    <li>• Maximum flow networks</li>
                    <li>• Graph coloring</li>
                    <li>• Matching problems</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Implementation Tips</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Use adjacency list for sparse graphs</li>
                    <li>• Track visited nodes to avoid cycles</li>
                    <li>• Consider both recursive and iterative</li>
                    <li>• Handle disconnected graphs</li>
                    <li>• Use appropriate data structures</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Edge Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Empty graph</li>
                    <li>• Single node</li>
                    <li>• Disconnected components</li>
                    <li>• Self-loops and parallel edges</li>
                    <li>• Negative weights/cycles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Graph Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-lime-400 mb-4">Algorithm Complexity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">BFS/DFS:</span>
                    <span className="text-green-400 font-mono">O(V + E)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Dijkstra:</span>
                    <span className="text-blue-400 font-mono">O((V+E) log V)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Bellman-Ford:</span>
                    <span className="text-yellow-400 font-mono">O(V × E)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Floyd-Warshall:</span>
                    <span className="text-red-400 font-mono">O(V³)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Kruskal/Prim:</span>
                    <span className="text-purple-400 font-mono">O(E log V)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-lime-400 mb-4">When to Use Which Algorithm</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Unweighted shortest path:</div>
                    <div className="text-gray-400">→ BFS O(V + E)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Non-negative weights:</div>
                    <div className="text-gray-400">→ Dijkstra O((V+E) log V)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Negative weights:</div>
                    <div className="text-gray-400">→ Bellman-Ford O(V × E)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">All-pairs shortest paths:</div>
                    <div className="text-gray-400">→ Floyd-Warshall O(V³)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Minimum spanning tree:</div>
                    <div className="text-gray-400">→ Kruskal or Prim O(E log V)</div>
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

export default GraphAlgorithms;

