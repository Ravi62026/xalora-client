import React, { useState } from "react";
import { Layout } from "../components";

const Searching = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Algorithm data extracted from the markdown
  const algorithms = [
    {
      id: "linear",
      name: "Linear Search",
      complexity: {
        best: "O(1)",
        average: "O(n)",
        worst: "O(n)",
        space: "O(1)"
      },
      description: "Scan sequentially until match found. Use when: Unsorted data, small n, or single pass stream.",
      code: `int linear_search(const vector<int>& a, int key){
    for (int i=0;i<(int)a.size();++i) if (a[i]==key) return i;
    return -1;
}`,
      whenToUse: "Unsorted data, small datasets, or single pass stream processing"
    },
    {
      id: "binary",
      name: "Binary Search",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)"
      },
      description: "Repeatedly cut search interval in half. Prerequisite: Array must be sorted.",
      code: `int binary_search(const vector<int>& a, int key){
    int l=0, r=(int)a.size()-1;
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}`,
      whenToUse: "Searching in sorted arrays or lists",
      variants: [
        "Find any occurrence",
        "Find first (leftmost) occurrence",
        "Find last (rightmost) occurrence",
        "Find lower_bound (first >= key)",
        "Find upper_bound (first > key)",
        "Count occurrences",
        "Search insertion position",
        "Rotated sorted array search"
      ],
      variantCodes: [
        "Leftmost (lower_bound) template: int lower_bound_idx(const vector<int>& a, int key){ int l=0, r=(int)a.size(); while (l<r){ int mid = l + (r-l)/2; if (a[mid] < key) l = mid+1; else r = mid; } return l; }",
        "Rightmost (upper_bound-1) template: int upper_bound_idx(const vector<int>& a, int key){ int l=0, r=(int)a.size(); while (l<r){ int mid = l + (r-l)/2; if (a[mid] <= key) l = mid+1; else r = mid; } return l; }"
      ]
    },
    {
      id: "interpolation",
      name: "Interpolation Search",
      complexity: {
        best: "O(log log n)",
        average: "O(log n)",
        worst: "O(n)",
        space: "O(1)"
      },
      description: "Estimate position using value distribution. Works best with uniformly distributed sorted data.",
      code: `int interpolation_search(const vector<int>& a, int key){
    int lo=0, hi=(int)a.size()-1;
    while (lo<=hi && key>=a[lo] && key<=a[hi]){
        if (lo==hi){
            if (a[lo]==key) return lo; else return -1;
        }
        long long pos = lo + (long long)(hi-lo)*(key - a[lo])/(a[hi]-a[lo]);
        if (a[pos]==key) return (int)pos;
        if (a[pos] < key) lo = pos+1; else hi = pos-1;
    }
    return -1;
}`,
      whenToUse: "Sorted, numeric data with roughly uniform distribution"
    },
    {
      id: "exponential",
      name: "Exponential Search",
      complexity: {
        best: "O(1)",
        average: "O(log i)",
        worst: "O(log n)",
        space: "O(1)"
      },
      description: "Find range by exponential steps (1,2,4,8...) then binary search inside range.",
      code: `int exponential_search(const vector<int>& a, int key){
    int n=a.size(); if (n==0) return -1;
    if (a[0]==key) return 0;
    int bound=1; while (bound<n && a[bound]<=key) bound*=2;
    int l = bound/2, r = min(bound, n-1);
    // binary search in [l..r]
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}`,
      whenToUse: "When target is near the beginning of a sorted array"
    },
    {
      id: "jump",
      name: "Jump Search",
      complexity: {
        best: "O(1)",
        average: "O(√n)",
        worst: "O(√n)",
        space: "O(1)"
      },
      description: "Jump by block size m = sqrt(n), then linear search inside block.",
      code: `int jump_search(const vector<int>& a, int key){
    int n=a.size();
    int step = floor(sqrt(n));
    int prev = 0;
    while (prev < n && a[min(n-1, prev+step)] < key){
        prev += step;
    }
    for (int i=prev; i<min(n, prev+step+1); ++i) if (a[i]==key) return i;
    return -1;
}`,
      whenToUse: "Sorted arrays with fast jump-forward operations"
    },
    {
      id: "fibonacci",
      name: "Fibonacci Search",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)"
      },
      description: "Use Fibonacci numbers to split ranges instead of powers of two.",
      code: `int fibonacci_search(const vector<int>& a, int key){
    int n = a.size();
    // Initialize fibonacci numbers
    int fibMMm2 = 0; // (m-2)'th Fibonacci
    int fibMMm1 = 1; // (m-1)'th Fibonacci
    int fibM = fibMMm2 + fibMMm1; // m'th Fibonacci
    while (fibM < n){
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm2 + fibMMm1;
    }
    int offset = -1;
    while (fibM > 1){
        int i = min(offset + fibMMm2, n - 1);
        if (a[i] < key){
            fibM = fibMMm1;
            fibMMm1 = fibMMm2;
            fibMMm2 = fibM - fibMMm1;
            offset = i;
        } else if (a[i] > key){
            fibM = fibMMm2;
            fibMMm1 = fibMMm1 - fibMMm2;
            fibMMm2 = fibM - fibMMm1;
        } else return i;
    }
    if (fibMMm1 && offset + 1 < n && a[offset + 1] == key) return offset + 1;
    return -1;
}`,
      whenToUse: "Historically interesting; rarely used today"
    },
    {
      id: "ternary",
      name: "Ternary Search",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)"
      },
      description: "For unimodal continuous/integer function, compare two mid points m1,m2 and narrow interval to one side. Used for finding maxima/minima of unimodal functions.",
      code: `long long ternary_search_max(int l, int r, function<long long(int)> f){
    while (r - l > 2){
        int m1 = l + (r-l)/3;
        int m2 = r - (r-l)/3;
        if (f(m1) < f(m2)) l = m1; else r = m2;
    }
    long long ans = LLONG_MIN;
    for (int i=l;i<=r;++i) ans = max(ans, f(i));
    return ans;
}`,
      whenToUse: "Finding maxima/minima of unimodal functions"
    },
    {
      id: "rotated",
      name: "Search in Rotated Array",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)"
      },
      description: "Search in rotated sorted array by combining pivot detection or comparing a[mid] with a[l] to find sorted half.",
      code: `int search_rotated(const vector<int>& a, int key){
    int l=0, r=a.size()-1;
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        if (a[l] <= a[mid]){ // left sorted
            if (key >= a[l] && key < a[mid]) r = mid-1;
            else l = mid+1;
        } else { // right sorted
            if (key > a[mid] && key <= a[r]) l = mid+1;
            else r = mid-1;
        }
    }
    return -1;
}`,
      whenToUse: "Searching in rotated sorted arrays"
    }
  ];

  const stringAlgorithms = [
    {
      id: "naive",
      name: "Naive String Search",
      complexity: {
        average: "O(n*m)",
        worst: "O(n*m)",
        space: "O(1)"
      },
      description: "Simple pattern matching by checking all possible positions.",
      code: `vector<int> naive_search(const string& s, const string& p) {
    vector<int> res;
    int n = s.size(), m = p.size();
    for (int i = 0; i <= n - m; i++) {
        bool match = true;
        for (int j = 0; j < m; j++) {
            if (s[i + j] != p[j]) {
                match = false;
                break;
            }
        }
        if (match) res.push_back(i);
    }
    return res;
}`
    },
    {
      id: "kmp",
      name: "KMP (Knuth-Morris-Pratt)",
      complexity: {
        average: "O(n + m)",
        worst: "O(n + m)",
        space: "O(m)"
      },
      description: "Precompute LPS array (longest proper prefix which is suffix).",
      code: `vector<int> compute_lps(const string& p){
    int m=p.size(); vector<int> lps(m,0);
    for (int i=1,len=0;i<m;){
        if (p[i]==p[len]) lps[i++] = ++len;
        else if (len) len = lps[len-1];
        else lps[i++] = 0;
    }
    return lps;
}

vector<int> kmp_search(const string& s, const string& p){
    vector<int> res; if (p.empty()) return res;
    auto lps = compute_lps(p);
    int i=0,j=0;
    while (i < (int)s.size()){
        if (s[i]==p[j]){ ++i; ++j; if (j==(int)p.size()){ res.push_back(i-j); j=lps[j-1]; }}
        else if (j) j = lps[j-1];
        else ++i;
    }
    return res;
}`
    },
    {
      id: "rabin-karp",
      name: "Rabin-Karp",
      complexity: {
        average: "O(n + m)",
        worst: "O(n*m)",
        space: "O(1)"
      },
      description: "Rolling hash; average O(n + m), worst-case O(n*m) if using naive collision checks.",
      code: `using ull = unsigned long long;
vector<int> rabin_karp(const string& s, const string& p){
    vector<int> ans; if (p.empty()) return ans;
    const ull base = 1315423911ULL; // or use smaller and mod
    int n = s.size(), m = p.size();
    if (m > n) return ans;
    ull hash_p = 0, hash_s = 0, powm = 1;
    const ull MOD = (1ULL<<61) - 1; // careful implementation
    for (int i=0;i<m;i++){
        hash_p = hash_p * base + (unsigned char)p[i];
        hash_s = hash_s * base + (unsigned char)s[i];
        if (i) powm *= base;
    }
    for (int i=0;i<=n-m;i++){
        if (hash_s == hash_p){
            if (s.substr(i,m) == p) ans.push_back(i); // verify to avoid collision
        }
        if (i < n-m){
            hash_s = hash_s - (unsigned char)s[i] * powm;
            hash_s = hash_s * base + (unsigned char)s[i+m];
        }
    }
    return ans;
}`
    },
    {
      id: "z-algorithm",
      name: "Z Algorithm",
      complexity: {
        average: "O(n + m)",
        worst: "O(n + m)",
        space: "O(n + m)"
      },
      description: "Builds Z-array in O(n), useful in pattern matching and multiple pattern searches.",
      code: `vector<int> z_algo(const string& s){
    int n=s.size(); vector<int> z(n); z[0]=0;
    int l=0, r=0;
    for (int i=1;i<n;++i){
        if (i<=r) z[i] = min(r-i+1, z[i-l]);
        while (i+z[i] < n && s[z[i]] == s[i+z[i]]) ++z[i];
        if (i+z[i]-1 > r){ l=i; r=i+z[i]-1; }
    }
    return z;
}

vector<int> z_search(const string& text, const string& pattern){
    string s = pattern + "#" + text;
    auto z = z_algo(s);
    vector<int> occ;
    int m = pattern.size();
    for (int i=m+1;i<(int)z.size();++i) if (z[i] >= m) occ.push_back(i - (m+1));
    return occ;
}`
    }
  ];

  const specializedStructures = [
    {
      id: "hash-table",
      name: "Hash Table Lookup",
      complexity: {
        average: "O(1)",
        worst: "O(n)",
        space: "O(n)"
      },
      description: "Use hash function to map keys to buckets. Average O(1) lookup.",
      code: `bool hash_lookup(const unordered_map<int,int>& mp, int key){
    return mp.find(key) != mp.end();
}`
    },
    {
      id: "bst",
      name: "Binary Search Tree",
      complexity: {
        average: "O(log n)",
        worst: "O(n)",
        space: "O(n)"
      },
      description: "Lookup: O(h) where h is tree height. Balanced BSTs: O(log n).",
      code: `bool bst_search(Node* root, int key){ 
    if (!root) return false; 
    if (root->key==key) return true; 
    if (key < root->key) return bst_search(root->l, key); 
    return bst_search(root->r, key); 
}`
    },
    {
      id: "trie",
      name: "Trie (Prefix Tree)",
      complexity: {
        average: "O(length of key)",
        worst: "O(ALPHABET_SIZE * key_length * N)",
        space: "O(ALPHABET_SIZE * key_length * N)"
      },
      description: "For prefix search; lookup time O(length of key) independent of number of keys.",
      code: `struct TrieNode{
    array<int,26> nxt; bool end=false; int cnt=0;
    TrieNode(){ nxt.fill(-1); end=false; cnt=0; }
};

struct Trie{
    vector<TrieNode> t;
    Trie(){ t.emplace_back(); }
    void insert(const string& s){
        int node=0; t[node].cnt++;
        for (char ch: s){
            int c = ch - 'a';
            if (t[node].nxt[c] == -1){ t[node].nxt[c] = t.size(); t.emplace_back(); }
            node = t[node].nxt[c]; t[node].cnt++;
        }
        t[node].end = true;
    }
    bool search(const string& s){
        int node=0;
        for (char ch: s){ int c=ch-'a'; if (t[node].nxt[c]==-1) return false; node=t[node].nxt[c]; }
        return t[node].end;
    }
    int starts_with_count(const string& pref){
        int node=0; for (char ch: pref){ int c=ch-'a'; if (t[node].nxt[c]==-1) return 0; node=t[node].nxt[c]; }
        return t[node].cnt;
    }
};`
    },
    {
      id: "b-tree",
      name: "B-Tree / B+ Tree",
      complexity: {
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(n)"
      },
      description: "Used in databases, disk-friendly search; multi-way nodes.",
      code: "// For database-scale indices, B-tree and B+ tree allow nodes with many children (fanout), reducing disk reads."
    }
  ];

  const graphAlgorithms = [
    {
      id: "bfs",
      name: "Breadth-First Search (BFS)",
      complexity: {
        average: "O(V + E)",
        worst: "O(V + E)",
        space: "O(V)"
      },
      description: "Use BFS for shortest path in unweighted graph.",
      code: `void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`
    },
    {
      id: "dfs",
      name: "Depth-First Search (DFS)",
      complexity: {
        average: "O(V + E)",
        worst: "O(V + E)",
        space: "O(V)"
      },
      description: "Use DFS for reachability and cycle detection.",
      code: `void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited);
        }
    }
}`
    }
  ];

  const cheatSheetData = [
    { algorithm: "Linear", sorted: "No", best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    { algorithm: "Binary", sorted: "Yes", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    { algorithm: "Interpolation", sorted: "Yes (uniform)", best: "O(log log n)", avg: "O(log n)", worst: "O(n)", space: "O(1)" },
    { algorithm: "Jump", sorted: "Yes", best: "O(√n)", avg: "O(√n)", worst: "O(√n)", space: "O(1)" },
    { algorithm: "Exponential", sorted: "Yes", best: "O(1)", avg: "O(log i)", worst: "O(log n)", space: "O(1)" },
    { algorithm: "Fibonacci", sorted: "Yes", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    { algorithm: "Ternary", sorted: "Unimodal", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    { algorithm: "Hash Table", sorted: "No", best: "O(1)", avg: "O(1)", worst: "O(n)", space: "O(n)" },
    { algorithm: "BST Search", sorted: "N/A", best: "O(log n)", avg: "O(log n)", worst: "O(n)", space: "O(1)" },
    { algorithm: "KMP (string)", sorted: "—", best: "—", avg: "O(n+m)", worst: "O(n+m)", space: "O(m)" },
    { algorithm: "Rabin-Karp", sorted: "—", best: "—", avg: "O(n+m)", worst: "O(n*m)", space: "O(1)" },
    { algorithm: "Z Algorithm", sorted: "—", best: "—", avg: "O(n+m)", worst: "O(n+m)", space: "O(n+m)" },
    { algorithm: "BFS", sorted: "N/A", best: "O(1)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    { algorithm: "DFS", sorted: "N/A", best: "O(1)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" }
  ];

  const renderComplexityBadge = (complexity) => {
    // Handle undefined or null values
    if (!complexity) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("log")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("√")) color = "bg-purple-100 text-purple-800";
    if (complexity === "O(1)") color = "bg-green-100 text-green-800";
    if (complexity.includes("n")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("n²") || complexity.includes("n log n")) color = "bg-red-100 text-red-800";

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
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Searching Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive guide to all standard searching algorithms: theory, implementations, complexity analysis, and practical use cases.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("array")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "array"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Array Search
            </button>
            <button
              onClick={() => setActiveSection("string")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "string"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              String Search
            </button>
            <button
              onClick={() => setActiveSection("structures")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "structures"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Data Structures
            </button>
            <button
              onClick={() => setActiveSection("graphs")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "graphs"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Graph Search
            </button>
            <button
              onClick={() => setActiveSection("cheatsheet")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "cheatsheet"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Cheat Sheet
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Searching Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">What is Searching?</h3>
                  <p className="text-gray-300 mb-6">
                    Searching is the process of finding the position(s) of an item (or whether it exists) in a data container.
                    The efficiency of searching algorithms varies greatly depending on the data structure and whether the data is sorted.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Key Concepts</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Comparison Model:</strong> For comparison-based search in an unsorted array, lower bound is O(n). For sorted arrays, binary search achieves O(log n).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Data Order:</strong> Sorting data can dramatically improve search efficiency from O(n) to O(log n).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Indexing vs Scanning:</strong> Direct indexing O(1) if keys map directly; otherwise scanning or binary-like strategies.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Classification</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Linear-time methods</h4>
                      <p className="text-gray-300">For unsorted data: <span className="text-white">Linear Search</span></p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Sublinear methods</h4>
                      <p className="text-gray-300">For sorted data: <span className="text-white">Binary, Interpolation, Jump, Fibonacci, Exponential</span></p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Hash-based methods</h4>
                      <p className="text-gray-300">O(1) average lookup using: <span className="text-white">Hash Tables</span></p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Specialized structures</h4>
                      <p className="text-gray-300">Trees, tries, suffix arrays: <span className="text-white">BST, Trie, Suffix Array</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Array Search Section */}
          {activeSection === "array" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Array Searching Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                            {algorithm.whenToUse ? "Use when: " + algorithm.whenToUse : "Array Search"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      {algorithm.variants && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Variants</h4>
                          <div className="flex flex-wrap gap-2">
                            {algorithm.variants.map((variant, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-lg">
                                {variant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Complexity</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Best Case</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.best)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst Case</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-purple-400 mb-3">Implementation (C++)</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{algorithm.code}</code>
                          </pre>
                          {algorithm.variantCodes && (
                            <div className="mt-4">
                              <h5 className="text-md font-semibold text-purple-300 mb-2">Variant Implementations</h5>
                              {algorithm.variantCodes.map((code, idx) => (
                                <pre key={idx} className="bg-gray-900 text-gray-300 p-3 rounded-lg overflow-x-auto text-sm mt-2">
                                  <code>{code}</code>
                                </pre>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* String Search Section */}
          {activeSection === "string" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">String Searching Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {stringAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Complexity</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Implementation (C++)</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
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

          {/* Specialized Data Structures Section */}
          {activeSection === "structures" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Search in Specialized Data Structures</h2>

              <div className="grid grid-cols-1 gap-8">
                {specializedStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{structure.name}</h3>
                      </div>

                      <p className="text-gray-300 mb-6">{structure.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-3">Complexity</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono">{renderComplexityBadge(structure.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst</p>
                              <p className="text-white font-mono">{renderComplexityBadge(structure.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono">{renderComplexityBadge(structure.complexity.space)}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-3">Implementation (C++)</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{structure.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graph Search Section */}
          {activeSection === "graphs" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Graph Search Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {graphAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Complexity</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Average</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.average)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Worst</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.worst)}</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-gray-400 text-sm">Space</p>
                              <p className="text-white font-mono">{renderComplexityBadge(algorithm.complexity.space)}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Implementation (C++)</h4>
                          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
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

          {/* Cheat Sheet Section */}
          {activeSection === "cheatsheet" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Searching Algorithms Cheat Sheet</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-4 text-gray-200 text-lg font-bold">Algorithm</th>
                      <th className="pb-4 text-purple-400 text-lg font-bold">Sorted Required?</th>
                      <th className="pb-4 text-green-400 text-lg font-bold">Best</th>
                      <th className="pb-4 text-cyan-400 text-lg font-bold">Average</th>
                      <th className="pb-4 text-yellow-400 text-lg font-bold">Worst</th>
                      <th className="pb-4 text-red-400 text-lg font-bold">Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cheatSheetData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-gray-700/30 transition-all duration-300"
                      >
                        <td className="py-4 text-white font-medium">{row.algorithm}</td>
                        <td className="py-4 text-purple-300">{row.sorted}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {row.best}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800">
                            {row.avg}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {row.worst}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            {row.space}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Key Takeaways</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">When to Use Binary Search</h4>
                    <p className="text-gray-300">Whenever you have sorted data and need efficient searching with O(log n) time complexity.</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Hash Tables for Multiple Lookups</h4>
                    <p className="text-gray-300">Use hash tables when you need many lookups and order doesn't matter - O(1) average case.</p>
                  </div>

                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Interpolation Search</h4>
                    <p className="text-gray-300">Best for uniformly distributed numeric data where you can estimate position.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice Problems */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">Beginner</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement linear search, binary search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Count occurrences of x in sorted array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Binary search variants (lower_bound, upper_bound)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement jump search</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Intermediate</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>First and last occurrence in sorted array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Search in rotated sorted array with duplicates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Implement KMP algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Rabin-Karp with double hash</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Suffix array construction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Find peak element</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">Advanced</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Median of two sorted arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Count in virtual infinite sorted array</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Suffix array based substring search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Count occurrences in rotated array with duplicates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Find k-th smallest in two sorted arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Fractional cascading</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Interview Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Basic</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Binary search implementation</li>
                    <li>• Lower/upper bound</li>
                    <li>• Count occurrences</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Rotations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Rotated sorted array</li>
                    <li>• Find pivot index</li>
                    <li>• Number of rotations</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Duplicates</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• First occurrence</li>
                    <li>• Last occurrence</li>
                    <li>• All occurrences</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Strings</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• KMP implementation</li>
                    <li>• Pattern occurrences</li>
                    <li>• Z-algorithm</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Real-world</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Product catalog search</li>
                    <li>• Database indexing</li>
                    <li>• Full-text search</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Demo Walkthroughs */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Demo Walkthroughs
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Binary Search Trace</h3>
                <p className="text-gray-300 mb-4">a=[2,4,6,8,10,12], key=10</p>
                <ul className="space-y-2 text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>l=0,r=5 → mid=2 (6) → 6&lt;10 → l=3</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>l=3,r=5 → mid=4 (10) → found at index 4</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Rotated Array Search</h3>
                <p className="text-gray-300 mb-4">a=[10,11,12,1,2,5,8], key=2</p>
                <ul className="space-y-2 text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>mid = 3 → a[mid]=1, compare halves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Choose right sorted half → narrow until found index 4</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 lg:col-span-2">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">KMP Example</h3>
                <p className="text-gray-300 mb-4">s="abababca", p="abab"</p>
                <ul className="space-y-2 text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>lps of p = [0,0,1,2], proceed with matches and avoid rechecking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Optimizations & Tips */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Optimizations & Trick Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Optimization Tips</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Use <strong>std::lower_bound / upper_bound</strong> aggressively — tested and optimized</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>For multiple lookups on static dataset, build a hash or index or keep sorted and use binary search depending on needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>For memory-limited devices, prefer binary/jump over hash</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Beware of integer overflow in index computation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Trick Questions</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Find peak element (use binary search variant)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Search in infinite-size sorted array (use exponential search)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Find median of two sorted arrays (advanced binary search on answer)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>Count occurrences of x in infinite array (combining exponential + binary)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span>For adversarial inputs, unordered_map can be attacked — use reserve() and custom hash if needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Searching;