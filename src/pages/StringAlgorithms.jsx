import React, { useState } from "react";
import { Layout } from "../components";

const StringAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // String Pattern Matching
  const patternMatching = [
    {
      id: "naive",
      name: "Naive String Matching",
      complexity: { time: "O((n-m+1) × m)", space: "O(1)" },
      description: "Check every possible position in text for pattern match.",
      code: `vector<int> naiveSearch(string text, string pattern) {
    vector<int> positions;
    int n = text.length();
    int m = pattern.length();

    for (int i = 0; i <= n - m; i++) {
        int j = 0;

        // Check for pattern match
        while (j < m && text[i + j] == pattern[j]) {
            j++;
        }

        if (j == m) {
            positions.push_back(i); // Pattern found at position i
        }
    }

    return positions;
}`
    },
    {
      id: "kmp",
      name: "KMP (Knuth-Morris-Pratt) Algorithm",
      complexity: { time: "O(n + m)", space: "O(m)" },
      description: "Uses prefix table to avoid re-checking already matched characters.",
      code: `// Build prefix table (LPS array)
vector<int> buildLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0;
    int i = 1;

    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}

// KMP Search
vector<int> KMPSearch(string text, string pattern) {
    vector<int> positions;
    int n = text.length();
    int m = pattern.length();

    vector<int> lps = buildLPS(pattern);

    int i = 0; // text index
    int j = 0; // pattern index

    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }

        if (j == m) {
            positions.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return positions;
}`
    },
    {
      id: "rabin-karp",
      name: "Rabin-Karp Algorithm",
      complexity: { time: "O(n + m)", space: "O(1)" },
      description: "Uses hashing to find pattern. Rolling hash avoids recomputation.",
      code: `const int PRIME = 101; // Prime number for hashing

long long calculateHash(string str, int len) {
    long long hash = 0;
    for (int i = 0; i < len; i++) {
        hash = (hash * 256 + str[i]) % PRIME;
    }
    return hash;
}

long long recalculateHash(string str, int oldIndex, int newIndex,
                         long long oldHash, int patternLen) {
    long long newHash = oldHash - str[oldIndex];
    newHash = newHash / 256;
    newHash += str[newIndex] * pow(256, patternLen - 1);
    return newHash % PRIME;
}

vector<int> rabinKarp(string text, string pattern) {
    vector<int> positions;
    int n = text.length();
    int m = pattern.length();

    long long patternHash = calculateHash(pattern, m);
    long long textHash = calculateHash(text, m);

    for (int i = 0; i <= n - m; i++) {
        if (patternHash == textHash) {
            // Verify match (handle collisions)
            bool match = true;
            for (int j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) positions.push_back(i);
        }

        if (i < n - m) {
            textHash = recalculateHash(text, i, i + m, textHash, m);
        }
    }

    return positions;
}`
    },
    {
      id: "z-algorithm",
      name: "Z-Algorithm",
      complexity: { time: "O(n + m)", space: "O(n + m)" },
      description: "Finds all occurrences of pattern in text using Z-array.",
      code: `// Z-array: z[i] = length of longest substring starting at i
// that matches prefix of the string
vector<int> buildZArray(string str) {
    int n = str.length();
    vector<int> z(n, 0);

    int left = 0, right = 0;
    for (int i = 1; i < n; i++) {
        if (i < right) {
            z[i] = min(right - i, z[i - left]);
        }

        while (i + z[i] < n && str[z[i]] == str[i + z[i]]) {
            z[i]++;
        }

        if (i + z[i] > right) {
            left = i;
            right = i + z[i];
        }
    }

    return z;
}

vector<int> zAlgorithmSearch(string text, string pattern) {
    string concat = pattern + "$" + text;
    vector<int> z = buildZArray(concat);

    vector<int> positions;
    int patternLen = pattern.length();

    for (int i = patternLen + 1; i < concat.length(); i++) {
        if (z[i] == patternLen) {
            positions.push_back(i - patternLen - 1);
        }
    }

    return positions;
}`
    }
  ];

  // String Manipulation
  const stringManipulation = [
    {
      id: "longest-palindromic",
      name: "Longest Palindromic Substring",
      complexity: { time: "O(n²)", space: "O(n²)" },
      description: "Find longest substring that reads same forwards and backwards.",
      code: `string longestPalindrome(string s) {
    int n = s.length();
    if (n == 0) return "";

    vector<vector<bool>> dp(n, vector<bool>(n, false));
    int start = 0, maxLen = 1;

    // All single characters are palindromes
    for (int i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // Check for length 2
    for (int i = 0; i < n - 1; i++) {
        if (s[i] == s[i + 1]) {
            dp[i][i + 1] = true;
            start = i;
            maxLen = 2;
        }
    }

    // Check for lengths > 2
    for (int len = 3; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;

            if (s[i] == s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                if (len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }

    return s.substr(start, maxLen);
}`
    },
    {
      id: "longest-common-substring",
      name: "Longest Common Substring",
      complexity: { time: "O(m × n)", space: "O(m × n)" },
      description: "Find longest substring present in both strings.",
      code: `string longestCommonSubstring(string s1, string s2) {
    int m = s1.length(), n = s2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    int maxLen = 0, endIndex = 0;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;

                if (dp[i][j] > maxLen) {
                    maxLen = dp[i][j];
                    endIndex = i - 1;
                }
            }
        }
    }

    if (maxLen == 0) return "";

    return s1.substr(endIndex - maxLen + 1, maxLen);
}`
    },
    {
      id: "longest-common-subsequence",
      name: "Longest Common Subsequence",
      complexity: { time: "O(m × n)", space: "O(m × n)" },
      description: "Find longest subsequence present in both strings (not necessarily contiguous).",
      code: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

// Reconstruct LCS
string reconstructLCS(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    // Fill DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Reconstruct LCS
    string lcs = "";
    int i = m, j = n;

    while (i > 0 && j > 0) {
        if (text1[i - 1] == text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return lcs;
}`
    },
    {
      id: "edit-distance",
      name: "Edit Distance (Levenshtein)",
      complexity: { time: "O(m × n)", space: "O(m × n)" },
      description: "Minimum operations (insert, delete, replace) to convert string A to string B.",
      code: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));

    // Initialize base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i; // deletions
    for (int j = 0; j <= n; j++) dp[0][j] = j; // insertions

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]; // no operation
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j],      // delete
                                   dp[i][j - 1],      // insert
                                   dp[i - 1][j - 1]}); // replace
            }
        }
    }

    return dp[m][n];
}`
    }
  ];

  // String Hashing
  const stringHashing = [
    {
      id: "rolling-hash",
      name: "Rolling Hash (Rabin-Karp)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Efficient substring search using polynomial rolling hash.",
      code: `class RollingHash {
private:
    string s;
    int n, base, mod;
    vector<long long> prefixHash, power;

public:
    RollingHash(string str, int b = 29, int m = 1e9 + 7) {
        s = str;
        n = s.length();
        base = b;
        mod = m;

        prefixHash.resize(n + 1, 0);
        power.resize(n + 1, 1);

        // Precompute prefix hashes and powers
        for (int i = 1; i <= n; i++) {
            prefixHash[i] = (prefixHash[i - 1] * base + (s[i - 1] - 'a' + 1)) % mod;
            power[i] = (power[i - 1] * base) % mod;
        }
    }

    // Get hash of substring s[l..r-1]
    long long getHash(int l, int r) {
        long long hash = prefixHash[r] - prefixHash[l] * power[r - l] % mod;
        if (hash < 0) hash += mod;
        return hash % mod;
    }

    // Check if substrings s[a..a+len-1] and s[b..b+len-1] are equal
    bool areEqual(int a, int b, int len) {
        return getHash(a, a + len) == getHash(b, b + len);
    }
};

// Example usage
bool containsDuplicateSubstring(string s, int len) {
    if (len >= s.length()) return false;

    RollingHash rh(s);
    unordered_set<long long> seen;

    for (int i = 0; i <= s.length() - len; i++) {
        long long hash = rh.getHash(i, i + len);
        if (seen.count(hash)) {
            return true; // Potential duplicate
        }
        seen.insert(hash);
    }

    return false;
}`
    },
    {
      id: "double-hash",
      name: "Double Hashing",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Use two different hash functions to reduce collision probability.",
      code: `class DoubleHash {
private:
    string s;
    int n;
    vector<long long> h1, h2, p1, p2;
    int mod1 = 1e9 + 7, mod2 = 1e9 + 9;
    int base1 = 131, base2 = 137;

public:
    DoubleHash(string str) {
        s = str;
        n = s.length();

        h1.assign(n + 1, 0);
        h2.assign(n + 1, 0);
        p1.assign(n + 1, 1);
        p2.assign(n + 1, 1);

        for (int i = 1; i <= n; i++) {
            h1[i] = (h1[i - 1] * base1 + (s[i - 1] - 'a' + 1)) % mod1;
            h2[i] = (h2[i - 1] * base2 + (s[i - 1] - 'a' + 1)) % mod2;
            p1[i] = p1[i - 1] * base1 % mod1;
            p2[i] = p2[i - 1] * base2 % mod2;
        }
    }

    pair<long long, long long> getHash(int l, int r) {
        long long hash1 = (h1[r] - h1[l] * p1[r - l] % mod1 + mod1) % mod1;
        long long hash2 = (h2[r] - h2[l] * p2[r - l] % mod2 + mod2) % mod2;
        return {hash1, hash2};
    }

    bool areEqual(int a, int b, int len) {
        auto hash1 = getHash(a, a + len);
        auto hash2 = getHash(b, b + len);
        return hash1 == hash2;
    }
};`
    }
  ];

  // Advanced String Algorithms
  const advancedAlgorithms = [
    {
      id: "manacher",
      name: "Manacher's Algorithm",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Find all palindromic substrings in linear time using symmetric expansion.",
      code: `string longestPalindromicSubstring(string s) {
    int n = s.length();
    if (n == 0) return "";

    // Transform string: aba -> #a#b#a#
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";

    int m = t.length();
    vector<int> p(m, 0); // palindrome radii
    int center = 0, right = 0;
    int maxLen = 0, centerIndex = 0;

    for (int i = 1; i < m - 1; i++) {
        int mirror = 2 * center - i;

        if (i < right) {
            p[i] = min(right - i, p[mirror]);
        }

        // Expand palindrome centered at i
        while (t[i - (1 + p[i])] == t[i + (1 + p[i])]) {
            p[i]++;
        }

        // Update center and right boundary
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }

        // Track maximum length palindrome
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIndex = i;
        }
    }

    // Extract original palindrome
    int start = (centerIndex - maxLen) / 2;
    return s.substr(start, maxLen);
}`
    },
    {
      id: "suffix-array",
      name: "Suffix Array",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Sorted array of all suffixes. Useful for substring search and LCP.",
      code: `vector<int> buildSuffixArray(string s) {
    int n = s.length();
    vector<int> sa(n), rank(n), temp(n);

    // Initialize ranks
    for (int i = 0; i < n; i++) {
        sa[i] = i;
        rank[i] = s[i];
    }

    for (int k = 1; k < n; k *= 2) {
        // Comparator for sorting
        auto cmp = [&](int i, int j) {
            if (rank[i] != rank[j]) return rank[i] < rank[j];
            int ri = i + k < n ? rank[i + k] : -1;
            int rj = j + k < n ? rank[j + k] : -1;
            return ri < rj;
        };

        sort(sa.begin(), sa.end(), cmp);

        // Assign new ranks
        temp[sa[0]] = 0;
        for (int i = 1; i < n; i++) {
            temp[sa[i]] = temp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) ? 1 : 0);
        }

        rank = temp;
    }

    return sa;
}

// Find longest repeated substring using suffix array
string longestRepeatedSubstring(string s) {
    vector<int> sa = buildSuffixArray(s);
    int n = s.length();
    string result = "";
    int maxLen = 0;

    // Build LCP array (simplified)
    vector<int> lcp(n, 0);
    vector<int> rank(n);
    for (int i = 0; i < n; i++) rank[sa[i]] = i;

    int h = 0;
    for (int i = 0; i < n; i++) {
        if (rank[i] == n - 1) {
            h = 0;
            continue;
        }

        int j = sa[rank[i] + 1];
        while (i + h < n && j + h < n && s[i + h] == s[j + h]) h++;

        lcp[rank[i]] = h;

        if (h > maxLen) {
            maxLen = h;
            result = s.substr(i, h);
        }

        h = max(maxLen, h - 1);
    }

    return result;
}`
    },
    {
      id: "aho-corasick",
      name: "Aho-Corasick Algorithm",
      complexity: { time: "O(n + m + z)", space: "O(m)" },
      description: "Multi-pattern string matching algorithm. Builds trie with failure links.",
      code: `struct AhoCorasick {
    struct Node {
        map<char, int> children;
        int fail = 0;
        vector<int> output; // Pattern indices ending here
    };

    vector<Node> trie;
    vector<string> patterns;

    AhoCorasick(vector<string>& pats) : patterns(pats) {
        trie.emplace_back(); // Root node

        // Build trie
        for (int i = 0; i < patterns.size(); i++) {
            int node = 0;
            for (char c : patterns[i]) {
                if (trie[node].children.find(c) == trie[node].children.end()) {
                    trie[node].children[c] = trie.size();
                    trie.emplace_back();
                }
                node = trie[node].children[c];
            }
            trie[node].output.push_back(i);
        }

        // Build failure links using BFS
        queue<int> q;
        for (auto& p : trie[0].children) {
            int child = p.second;
            trie[child].fail = 0;
            q.push(child);
        }

        while (!q.empty()) {
            int current = q.front();
            q.pop();

            for (auto& p : trie[current].children) {
                char c = p.first;
                int child = p.second;
                int fail = trie[current].fail;

                while (fail != 0 && trie[fail].children.find(c) == trie[fail].children.end()) {
                    fail = trie[fail].fail;
                }

                if (trie[fail].children.find(c) != trie[fail].children.end()) {
                    fail = trie[fail].children[c];
                }

                trie[child].fail = fail;

                // Merge outputs
                for (int pattern : trie[fail].output) {
                    trie[child].output.push_back(pattern);
                }

                q.push(child);
            }
        }
    }

    vector<pair<int, int>> search(string text) {
        vector<pair<int, int>> results; // {position, pattern_index}
        int node = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text[i];

            while (node != 0 && trie[node].children.find(c) == trie[node].children.end()) {
                node = trie[node].fail;
            }

            if (trie[node].children.find(c) != trie[node].children.end()) {
                node = trie[node].children[c];
            }

            for (int pattern : trie[node].output) {
                results.push_back({i - patterns[pattern].length() + 1, pattern});
            }
        }

        return results;
    }
};`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Valid Anagram",
      difficulty: "Easy",
      description: "Check if two strings are anagrams",
      hint: "Sort both strings or use frequency count"
    },
    {
      name: "Group Anagrams",
      difficulty: "Medium",
      description: "Group strings that are anagrams",
      hint: "Use sorted string as key in map"
    },
    {
      name: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description: "Find longest substring with unique characters",
      hint: "Sliding window with set or map"
    },
    {
      name: "String to Integer (atoi)",
      difficulty: "Medium",
      description: "Convert string to 32-bit integer",
      hint: "Handle overflow, whitespace, signs"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(n)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(n log n)")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(n²)") || complexity.includes("O(m × n)")) color = "bg-yellow-100 text-yellow-800";
    if (complexity.includes("O(m)") || complexity.includes("O(n + m)")) color = "bg-red-100 text-red-800";

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
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                String Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master efficient string processing, pattern matching, and manipulation algorithms for text analysis and search problems.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("pattern")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "pattern"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Pattern Matching
            </button>
            <button
              onClick={() => setActiveSection("manipulation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "manipulation"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Manipulation
            </button>
            <button
              onClick={() => setActiveSection("hashing")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "hashing"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Hashing
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "advanced"
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">String Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">Why String Algorithms Matter</h3>
                  <p className="text-gray-300 mb-6">
                    Strings are fundamental data structures in programming. Efficient string algorithms
                    are crucial for text processing, search engines, data compression, bioinformatics,
                    and many real-world applications involving text analysis.
                  </p>

                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">Algorithm Categories</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">🔍</span>
                      <span><strong>Pattern Matching:</strong> Find patterns in text efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">✂️</span>
                      <span><strong>Manipulation:</strong> Edit, compare, and transform strings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">🔐</span>
                      <span><strong>Hashing:</strong> Fast string comparison and search</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">⚡</span>
                      <span><strong>Advanced:</strong> Suffix arrays, Aho-Corasick, Manacher</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-pink-400 mb-4">Common Challenges</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Time Complexity Issues</h4>
                      <p className="text-gray-300">Naive approaches often O(n²) - need efficient algorithms</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Space Constraints</h4>
                      <p className="text-gray-300">Large texts require O(1) or O(min(n,m)) space solutions</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Edge Cases</h4>
                      <p className="text-gray-300">Empty strings, unicode, case sensitivity, overlapping patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-pink-400 mb-3">Performance</h4>
                  <p className="text-gray-300">From O(n²) naive to O(n) optimal</p>
                  <p className="text-sm text-gray-400 mt-2">KMP, Z-algorithm achieve linear time</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Real Applications</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Text editors (search/replace)</li>
                    <li>• Search engines</li>
                    <li>• DNA sequence analysis</li>
                    <li>• Data compression</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Key Techniques</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Prefix/Suffix arrays</li>
                    <li>• Rolling hash functions</li>
                    <li>• Automata construction</li>
                    <li>• Dynamic programming</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Pattern Matching Section */}
          {activeSection === "pattern" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Pattern Matching Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {patternMatching.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20"
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

          {/* String Manipulation Section */}
          {activeSection === "manipulation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">String Manipulation Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {stringManipulation.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-500/20"
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

          {/* String Hashing Section */}
          {activeSection === "hashing" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">String Hashing Techniques</h2>

              <div className="grid grid-cols-1 gap-8">
                {stringHashing.map((technique) => (
                  <div
                    key={technique.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{technique.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${technique.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${technique.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{technique.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{technique.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Algorithms Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced String Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20"
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

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy String Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Reverse String (in-place)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Valid Palindrome</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>First Unique Character</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement strStr()</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium String Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Longest Palindromic Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Zigzag Conversion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Minimum Window Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Word Ladder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Decode Ways</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard String Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Regular Expression Matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Wildcard Matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Distinct Subsequences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Shortest Palindrome</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Word Break II</span>
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

          {/* String Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              String Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-400 mb-4">Pattern Matching</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Naive:</span>
                    <span className="text-red-400 font-mono">O((n-m+1)×m)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">KMP:</span>
                    <span className="text-green-400 font-mono">O(n+m)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Rabin-Karp:</span>
                    <span className="text-blue-400 font-mono">O(n+m)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Z-Algorithm:</span>
                    <span className="text-purple-400 font-mono">O(n+m)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-400 mb-4">Common Problems</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Anagrams:</div>
                    <div className="text-gray-400">→ Sort or frequency count</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Palindromes:</div>
                    <div className="text-gray-400">→ Two pointers or DP</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Substrings:</div>
                    <div className="text-gray-400">→ Sliding window</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Pattern Search:</div>
                    <div className="text-gray-400">→ KMP or Rabin-Karp</div>
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

export default StringAlgorithms;

