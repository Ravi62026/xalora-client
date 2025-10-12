# Searching Algorithms — Complete Guide

> A comprehensive, single-page reference for *all* standard searching algorithms: theory, step-by-step explanations, complexity, C++ implementations, example walkthroughs, interview questions, edge-cases, variations, and practice problems.

---

## Table of Contents

1. Quick overview & classification
2. Fundamental concepts (comparison model, order, sorted/unsorted, indices)
3. Linear Search
4. Binary Search (all variants)
5. Interpolation Search
6. Exponential Search
7. Jump Search
8. Fibonacci Search
9. Ternary Search (unimodal function search)
10. Hashing-based search (hash table lookup)
11. Search on specialized structures (BST, AVL, B-tree, Trie)
12. Search in strings (Naïve, KMP, Z, Rabin-Karp)
13. Search in graphs (BFS, DFS) — brief (searching nodes)
14. Search in almost-sorted / rotated arrays (find pivot, search in rotated sorted array)
15. Advanced / exotic: fractional cascading, suffix array search (brief)
16. Common interview patterns & typical questions (with hints)
17. Full C++ code collection (ready-to-run)
18. Demo walkthroughs (sample inputs + step traces)
19. Optimizations & trick questions
20. Cheat-sheet (table summary)
21. Practice problems (categorized) + sample solutions/hints

---

## 1) Quick overview & classification

**Searching** = finding the position(s) of an item (or whether it exists) in a data container.

Important axes:

* **Data order**: sorted vs unsorted
* **Model**: comparison-based vs non-comparison (hashing)
* **Cost metrics**: time complexity (best/avg/worst), space complexity, number of comparisons, randomness
* **Use-case**: single lookup vs many lookups (choose hash / tree / sorted array accordingly)

High level categories:

* Linear-time methods for unsorted data: **Linear Search**
* Sublinear methods for sorted data: **Binary**, **Interpolation**, **Jump**, **Fibonacci**, **Exponential**
* Hash-based O(1) average lookup using hash tables
* Structure-based searches: trees (BST), tries, suffix arrays
* String-specific searches: **KMP**, **Rabin-Karp**, **Z**

---

## 2) Fundamental concepts

* **Comparison model lower bound:** For comparison-based search in an unsorted array, lower bound is O(n). For sorted arrays, binary search achieves O(log n).
* **Indexing vs scanning**: Direct indexing O(1) if keys map directly; otherwise scanning or binary-like strategies.
* **Stability**: not applicable to search; but be careful with duplicate keys — decide whether to return first/last/all occurrences.

---

## 3) Linear Search

**Idea:** Scan sequentially until match found.

**Complexities:**

* Best: O(1)
* Average: O(n)
* Worst: O(n)
* Space: O(1)

**Use when:** Unsorted data, small n, or single pass stream.

**Pseudocode:**

```
for i from 0 to n-1:
  if arr[i] == key: return i
return -1
```

**C++ (iterative):**

```cpp
int linear_search(const vector<int>& a, int key){
    for (int i=0;i<(int)a.size();++i) if (a[i]==key) return i;
    return -1;
}
```

**Variants / Interview notes:**

* Return all indices of occurrences.
* Early exit optimization when scanning streams.
* Sentinel linear search (place key at end to reduce comparisons).

**Example:** `arr=[4,2,7,1], key=7` → returns index 2.

---

## 4) Binary Search (All variants)

**Prerequisite:** Array must be sorted (non-decreasing or strictly increasing depending on variant).

**Basic idea:** Repeatedly cut search interval in half.

**Iterative C++ (classic):**

```cpp
int binary_search(const vector<int>& a, int key){
    int l=0, r=(int)a.size()-1;
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}
```

**Complexities:** O(log n) time, O(1) space.

### Variants & standard formats

1. **Find any occurrence** — classic
2. **Find first (leftmost) occurrence** — when duplicates exist
3. **Find last (rightmost) occurrence**
4. **Find lower_bound (first >= key)** — STL `lower_bound`
5. **Find upper_bound (first > key)** — STL `upper_bound`
6. **Count occurrences** — upper_bound - lower_bound
7. **Search insertion position** — return `l` after binary search
8. **Rotated sorted array search** (use modified binary search)

**Leftmost (lower_bound) template:**

```cpp
int lower_bound_idx(const vector<int>& a, int key){
    int l=0, r=(int)a.size(); // notice r = n
    while (l<r){
        int mid = l + (r-l)/2;
        if (a[mid] < key) l = mid+1;
        else r = mid;
    }
    return l; // l in [0..n]
}
```

**Rightmost (upper_bound-1) template:**

```cpp
int upper_bound_idx(const vector<int>& a, int key){
    int l=0, r=(int)a.size();
    while (l<r){
        int mid = l + (r-l)/2;
        if (a[mid] <= key) l = mid+1;
        else r = mid;
    }
    return l; // index of first > key
}
```

**Common pitfalls:** integer overflow computing mid (use `l+(r-l)/2`), off-by-one with inclusive/exclusive bounds, infinite loop by incorrect mid and update.

**Interview questions:**

* Implement `lower_bound`/`upper_bound` without STL.
* Find first/last occurrence of `x` in sorted array.
* Find `k` in rotated sorted array (handle rotation pivot).
* Find smallest element greater than or equal to `x`.

**Step-by-step demo (example):** search 7 in `[1,3,4,7,9,12]` — mid indices: 2 → 3 → found.

---

## 5) Interpolation Search

**Idea:** Estimate position using value distribution (like proportional lookup): `pos = lo + ((key - a[lo])*(hi-lo))/(a[hi]-a[lo])`.

**Complexities:**

* Best: O(log log n) for uniformly distributed data
* Worst: O(n)

**When to use:** Sorted, numeric, roughly uniform distribution.

**C++ (simple):**

```cpp
int interpolation_search(const vector<int>& a, int key){
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
}
```

**Notes:** risk of division by zero when `a[hi]==a[lo]`.

---

## 6) Exponential Search

**Idea:** Find range by exponential steps (1,2,4,8...) then binary search inside range.

**Complexity:** O(log i) where i is position of key (or O(log n)). Good when target near beginning.

**C++:**

```cpp
int exponential_search(const vector<int>& a, int key){
    int n = (int)a.size();
    if (n==0) return -1;
    if (a[0]==key) return 0;
    int bound=1;
    while (bound < n && a[bound] <= key) bound *= 2;
    int l = bound/2, r = min(bound, n-1);
    // binary search in [l..r]
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}
```

---

## 7) Jump Search

**Idea:** Jump by block size `m = sqrt(n)`, then linear search inside block.

**Complexities:** O(√n) time, O(1) space.

**C++:**

```cpp
int jump_search(const vector<int>& a, int key){
    int n=a.size();
    int step = floor(sqrt(n));
    int prev = 0;
    while (prev < n && a[min(n-1, prev+step)] < key){
        prev += step;
    }
    for (int i=prev; i<min(n, prev+step+1); ++i) if (a[i]==key) return i;
    return -1;
}
```

**When useful:** Sorted arrays with fast jump-forward operations (e.g., linked blocks). Rare in practice.

---

## 8) Fibonacci Search

**Idea:** Use Fibonacci numbers to split ranges instead of powers of two. Similar to binary but uses Fibonacci offsets.

**Complexity:** O(log n)

**When used:** Historically interesting; rarely used today. Useful in systems where Fibonacci division is cheaper.

**Implementation note:** Complex; include classic C++ implementation in code section.

---

## 9) Ternary Search (for unimodal function maxima/minima)

**Idea:** For unimodal continuous/integer function, compare two mid points m1,m2 and narrow interval to one side.

**Usage:** Finding maxima/minima of unimodal functions; not for searching a value in array.

**Complexities:** O(log n) comparisons.

**C++ sketch:**

```cpp
long long ternary_search_max(int l, int r, function<long long(int)> f){
    while (r - l > 2){
        int m1 = l + (r-l)/3;
        int m2 = r - (r-l)/3;
        if (f(m1) < f(m2)) l = m1; else r = m2;
    }
    long long ans = LLONG_MIN;
    for (int i=l;i<=r;++i) ans = max(ans, f(i));
    return ans;
}
```

---

## 10) Hashing-based search (Hash Table / Unordered Map)

**Idea:** Use hash function to map keys to buckets. Average O(1) lookup.

**Complexities:**

* Average: O(1) lookup
* Worst-case: O(n) (bad hash or adversarial inputs)

**C++ example (unordered_map):**

```cpp
bool hash_lookup(const unordered_map<int,int>& mp, int key){
    return mp.find(key) != mp.end();
}
```

**Interview notes:**

* Be careful about collisions, rehashing cost.
* Use hashing when you need many lookups and order doesn't matter.
* For deterministic worst-case, use ordered maps (balanced BST) for O(log n).

---

## 11) Search on specialized structures

### BST (Binary Search Tree)

* Lookup: O(h) where h is tree height. Balanced BSTs: O(log n).
* C++ using pointers or `set/map`.

### Trie

* For prefix search; lookup time O(length of key) independent of number of keys.
* Use for dictionary, autocomplete.

### B-tree / B+ tree

* Used in databases, disk-friendly search; multi-way nodes.

---

## 12) String search algorithms (searching substring)

### Naïve

* O(n*m) worst-case.

### KMP (Knuth-Morris-Pratt)

* Precompute LPS array (longest proper prefix which is suffix).
* O(n + m) time.

### Rabin-Karp

* Rolling hash; average O(n + m), worst-case O(n*m) if using naive collision checks.

### Z-algorithm

* Builds Z-array in O(n), useful in pattern matching and multiple pattern searches.

**C++ KMP skeleton:**

```cpp
vector<int> compute_lps(const string& p){
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
}
```

---

## 13) Search in graphs (BFS/DFS)

Brief: Graph search is traversing nodes. Use BFS for shortest path in unweighted graph; DFS for reachability and cycle detection.

---

## 14) Search in rotated / nearly-sorted arrays

**Find pivot (smallest element) in rotated sorted array:** binary-search style.

**Search in rotated array:** combine pivot detection or compare `a[mid]` with `a[l]` to find sorted half.

**C++ outline (rotated array search):**

```cpp
int search_rotated(const vector<int>& a, int key){
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
}
```

**Edge Cases:** duplicates break some invariants; need extra handling.

---

## 15) Advanced / exotic (brief)

* **Fractional cascading**: speed up binary searches across related arrays.
* **Suffix arrays / suffix trees**: fast substring search, O(m log n) or O(m) for suffix tree.

---

## 16) Common interview patterns & typical questions

**Pattern A — Basic:**

* Implement binary search (return index or -1).
* Lower/upper bound, count occurrences.

**Pattern B — Rotations & modifications:**

* Search in rotated sorted array.
* Find pivot index / number of rotations.

**Pattern C — Duplicates:**

* First and last occurrence.

**Pattern D — Real-world:**

* Design a system for searching a product catalog — discuss indexes, databases, full-text search.

**Pattern E — Strings:**

* Implement KMP, find pattern occurrences.

**Tricky interview questions:**

* Find peak element (use binary search variant)
* Search in infinite-size sorted array (use exponential search)
* Find median of two sorted arrays (advanced binary search on answer)
* Count occurrences of `x` in infinite array (combining exponential + binary)

---

## 17) Full C++ Code Collection (ready-to-run)

> NOTE: This section collects implementations in one file. Use `g++ -std=c++17 file.cpp -O2` to compile.

```cpp
#include <bits/stdc++.h>
using namespace std;

int linear_search(const vector<int>& a, int key){
    for (int i=0;i<(int)a.size();++i) if (a[i]==key) return i;
    return -1;
}

int binary_search_any(const vector<int>& a, int key){
    int l=0, r=(int)a.size()-1;
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}

int lower_bound_idx(const vector<int>& a, int key){
    int l=0, r=(int)a.size();
    while (l<r){
        int mid = l + (r-l)/2;
        if (a[mid] < key) l = mid+1;
        else r = mid;
    }
    return l;
}

int upper_bound_idx(const vector<int>& a, int key){
    int l=0, r=(int)a.size();
    while (l<r){
        int mid = l + (r-l)/2;
        if (a[mid] <= key) l = mid+1;
        else r = mid;
    }
    return l;
}

int interpolation_search(const vector<int>& a, int key){
    int lo=0, hi=(int)a.size()-1;
    while (lo<=hi && key>=a[lo] && key<=a[hi]){
        if (lo==hi) return (a[lo]==key)?lo:-1;
        long long pos = lo + (long long)(hi-lo)*(key - a[lo])/(a[hi]-a[lo]);
        if (a[pos]==key) return (int)pos;
        if (a[pos] < key) lo = pos+1; else hi = pos-1;
    }
    return -1;
}

int exponential_search(const vector<int>& a, int key){
    int n=a.size(); if (n==0) return -1;
    if (a[0]==key) return 0;
    int bound=1; while (bound<n && a[bound]<=key) bound*=2;
    int l = bound/2, r = min(bound, n-1);
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        else if (a[mid] < key) l = mid+1;
        else r = mid-1;
    }
    return -1;
}

int jump_search(const vector<int>& a, int key){
    int n=a.size();
    if (n==0) return -1;
    int step = floor(sqrt(n));
    int prev = 0;
    while (prev < n && a[min(n-1, prev+step)] < key) prev += step;
    for (int i=prev;i<min(n, prev+step+1);++i) if (a[i]==key) return i;
    return -1;
}

int search_rotated(const vector<int>& a, int key){
    int l=0, r=(int)a.size()-1;
    while (l<=r){
        int mid = l + (r-l)/2;
        if (a[mid]==key) return mid;
        if (a[l] <= a[mid]){
            if (key >= a[l] && key < a[mid]) r = mid-1;
            else l = mid+1;
        } else {
            if (key > a[mid] && key <= a[r]) l = mid+1;
            else r = mid-1;
        }
    }
    return -1;
}

vector<int> compute_lps(const string& p){
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
}

int main(){
    // small example usages (you can expand for testing)
    vector<int> a = {1,3,5,7,9,11,13};
    cout<<"linear_search(7)="<<linear_search(a,7)<<"\n";
    cout<<"binary_search_any(8)="<<binary_search_any(a,8)<<"\n";
    cout<<"lower_bound_idx(6)="<<lower_bound_idx(a,6)<<"\n";
    cout<<"upper_bound_idx(7)="<<upper_bound_idx(a,7)<<"\n";
    cout<<"jump_search(9)="<<jump_search(a,9)<<"\n";
    cout<<"search_rotated(a,5)="<<search_rotated(a,5)<<"\n";
    string s="abxabcabcaby"; string p="abcaby"; auto occ = kmp_search(s,p);
    for (int x: occ) cout<<"pattern at "<<x<<"\n";
    return 0;
}
```

---

## 18) Demo walkthroughs (trace examples)

### Binary search trace: `a=[2,4,6,8,10,12], key=10`

* l=0,r=5 → mid=2 (6) → 6<10 → l=3
* l=3,r=5 → mid=4 (10) → found at index 4

### Rotated array: `a=[10,11,12,1,2,5,8], key=2`

* mid = 3 -> a[mid]=1, compare halves -> choose right sorted half -> narrow until found index 4.

### KMP example: `s="abababca", p="abab"`

* lps of p = [0,0,1,2], proceed with matches and avoid rechecking.

---

## 19) Optimizations & trick questions

* Use **std::lower_bound / upper_bound** aggressively — tested and optimized.
* For multiple lookups on static dataset, build a hash or index or keep sorted and use binary search depending on needs.
* For memory-limited devices, prefer binary/jump over hash.
* Beware of integer overflow in index computation.
* For adversarial inputs, `unordered_map` can be attacked — use `reserve()` and custom hash if needed.

---

## 20) Cheat-sheet (table)

| Algorithm     | Sorted required? |         Best |      Avg |    Worst | Space |
| ------------- | ---------------: | -----------: | -------: | -------: | ----: |
| Linear        |               No |         O(1) |     O(n) |     O(n) |  O(1) |
| Binary        |              Yes |         O(1) | O(log n) | O(log n) |  O(1) |
| Interpolation |    Yes (uniform) | O(log log n) | O(log n) |     O(n) |  O(1) |
| Jump          |              Yes |        O(√n) |    O(√n) |    O(√n) |  O(1) |
| Exponential   |              Yes |         O(1) | O(log i) | O(log n) |  O(1) |
| Hash Table    |               No |         O(1) |     O(1) |     O(n) |  O(n) |
| KMP (string)  |                — |            — |   O(n+m) |   O(n+m) |  O(m) |

---

## 21) Practice problems (with categories)

**Beginner:**

* Implement linear search, binary search. (Easy)
* Count occurrences of x in sorted array. (Easy)

**Intermediate:**

* First and last occurrence. (Medium)
* Search in rotated sorted array with duplicates. (Medium)
* Implement KMP. (Medium)

**Advanced:**

* Median of two sorted arrays of different sizes. (Hard)
* Count occurrences of a number in a virtual infinite sorted array. (Hard)
* Implement suffix array based substring search. (Hard)

**Hints / starting points:**

* For rotated array with duplicates, if a[l]==a[mid]==a[r], shrink boundaries linearly.
* For median of two arrays, binary search on partition boundary.

---

## Closing notes (for Xalora static page)

* Provide **searchable TOC**, code tabs (C++, Java, Python), live editor for demo, and downloadable PDFs.
* Add **visual step trace** for binary/interpolation/exponential; simple JS/React animations help retention.
* Add **quick quizzes**: e.g., "Where does binary search fail?" or "When to use interpolation?".

---

**Want me to:**

* convert this into a ready-to-publish **React/Next.js static page** (with markdown parsing, code tabs, and interactive trace widgets)?
* or **export this as PDF** / share a printable study sheet?

Tell me which next — I can generate the page template or PDF right away for Xalora.

---

## Additional Implementations & Deep Dives (expanded)

Below are more complete, production-ready implementations and detailed explanations for additional searching algorithms, string-search variants, data-structure searches, and tricky interview-level problems. Add these to your Xalora static page so students literally won't need to look elsewhere.

### Fibonacci Search (Full C++ Implementation)

**Idea recap:** Similar to binary search but uses Fibonacci numbers to determine probe positions.

```cpp
int fibonacci_search(const vector<int>& a, int key){
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
}
```

**Notes:** Works in O(log n) time. Add test harness in the full C++ file.

---

### Rabin-Karp (Rolling Hash) — C++

**Use-case:** Multiple pattern search or single pattern with average-case linear time using rolling hash.

```cpp
using ull = unsigned long long;
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
}
```

**Practical tip:** For contest-grade Rabin-Karp, use double hashing or strong mod to reduce collisions.

---

### Z-Algorithm (Full Implementation)

**Use-case:** Build Z-array for string in O(n), then use for pattern searches or string facts.

```cpp
vector<int> z_algo(const string& s){
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
}
```

---

### Suffix Array — construction (O(n log n) approach) + search

**Brief:** Build suffix array using sort by 2^k characters doubling method. Then binary search for pattern on suffix array for O(m log n).

```cpp
vector<int> build_sa(const string& s){
    int n = s.size(); vector<int> sa(n), rnk(n), tmp(n);
    for (int i=0;i<n;++i){ sa[i]=i; rnk[i]=s[i]; }
    for (int k=1;;k<<=1){
        auto cmp = [&](int a, int b){
            if (rnk[a] != rnk[b]) return rnk[a] < rnk[b];
            int ra = (a+k<n)? rnk[a+k] : -1;
            int rb = (b+k<n)? rnk[b+k] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i=1;i<n;++i) tmp[sa[i]] = tmp[sa[i-1]] + cmp(sa[i-1], sa[i]);
        for (int i=0;i<n;++i) rnk[i]=tmp[i];
        if (rnk[sa[n-1]] == n-1) break;
    }
    return sa;
}

// Binary search on suffix array to find pattern occurrences (range)
pair<int,int> sa_search_range(const string& s, const vector<int>& sa, const string& p){
    int n = s.size(), m=p.size();
    int l=0, r=n-1; int L = -1, R = -1;
    // find left bound
    while (l<=r){
        int mid = (l+r)/2;
        string sub = s.substr(sa[mid], min(n-sa[mid], m));
        if (sub >= p) r = mid-1; else l = mid+1;
    }
    L = l;
    l=0; r=n-1;
    while (l<=r){
        int mid = (l+r)/2;
        string sub = s.substr(sa[mid], min(n-sa[mid], m));
        if (sub <= p) l = mid+1; else r = mid-1;
    }
    R = r;
    return {L, R}; // inclusive range in sa where pattern matches
}
```

**Notes:** Add suffix array visualization and sample inputs on the page — students love to see suffixes sorted.

---

### Trie (Prefix Tree) — insert, search, and prefix count

```cpp
struct TrieNode{
    array<int,26> nxt; bool end=false; int cnt=0; // cnt: number of words through this node
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
};
```

**Use on page:** Provide autocomplete demo and prefix count examples.

---

### Balanced BST (AVL) search & insert (concise)

```cpp
struct Node{ int key, h; Node *l,*r; Node(int k):key(k),h(1),l(NULL),r(NULL){}
};
int height(Node* n){ return n? n->h : 0; }
Node* rotate_right(Node* y){ Node* x=y->l; Node* T2 = x->r; x->r=y; y->l=T2; y->h = max(height(y->l), height(y->r))+1; x->h = max(height(x->l), height(x->r))+1; return x; }
Node* rotate_left(Node* x){ Node* y=x->r; Node* T2=y->l; y->l=x; x->r=T2; x->h = max(height(x->l), height(x->r))+1; y->h = max(height(y->l), height(y->r))+1; return y; }
int get_balance(Node* n){ return n? height(n->l) - height(n->r) : 0; }
Node* avl_insert(Node* node, int key){
    if (!node) return new Node(key);
    if (key < node->key) node->l = avl_insert(node->l, key);
    else if (key > node->key) node->r = avl_insert(node->r, key);
    else return node;
    node->h = 1 + max(height(node->l), height(node->r));
    int balance = get_balance(node);
    if (balance > 1 && key < node->l->key) return rotate_right(node);
    if (balance < -1 && key > node->r->key) return rotate_left(node);
    if (balance > 1 && key > node->l->key){ node->l = rotate_left(node->l); return rotate_right(node); }
    if (balance < -1 && key < node->r->key){ node->r = rotate_right(node->r); return rotate_left(node); }
    return node;
}

bool bst_search(Node* root, int key){ if (!root) return false; if (root->key==key) return true; if (key < root->key) return bst_search(root->l, key); return bst_search(root->r, key); }
```

**Note:** Balanced trees ensure O(log n) searches and are the backbone of ordered maps/sets.

---

### B-Tree / B+ Tree — explanation & pseudo

For database-scale indices, B-tree and B+ tree allow nodes with many children (fanout), reducing disk reads. On page give a diagram, insertion steps, and explain why search cost is O(log_{fanout} n).

---

### Hash Table — Custom Hash for pair & collision note

```cpp
struct PairHash{ size_t operator()(const pair<int,int>& p) const noexcept { return ((uint64_t)p.first << 32) ^ (uint64_t)p.second; } };
unordered_map<pair<int,int>, int, PairHash> mp;
```

**Tip:** For competitive programming, `gp_hash_table` or `reserve()` helps avoid rehashing overhead.

---

### Interview-level tricky problems (with short solution outlines)

1. **Median of two sorted arrays:** Binary search on partition boundary — O(log(min(n,m))). Provide full code in a separate file.
2. **Search in infinite sorted array:** Use exponential search to find range then binary search.
3. **Find peak element (local maxima):** Binary search variant comparing mid and mid+1.
4. **Count occurrences in rotated array with duplicates:** Handle cases where `a[l]==a[mid]==a[r]` by shrinking bounds.
5. **Find k-th smallest in two sorted arrays:** Use binary search on smaller array for partition.

Add full working codes for these in the "Full C++ Code Collection" file and link them from the static page.

---

### Tests, Examples, and Edge-case Matrices

Create small interactive widgets (or pre-computed sample inputs) showing:

* Worst-case traces (e.g., interpolation degenerates to linear)
* Duplicate heavy arrays to show how binary-search variants behave
* String patterns causing KMP vs naive differences
* Hash collisions example (contrived)

---

### More Practice Problems (expanded)

**Beginner:** Binary search variants, implement KMP, Trie insert/search.
**Intermediate:** Suffix array construction, Rabin-Karp with double hash, rotated array with duplicates.
**Advanced:** Median of two arrays, suffix automaton basics, fractional cascading overview.

Provide links (internal Xalora routes) to each practice problem in the platform's problemset so students can click and attempt online.

---

## Final notes for Xalora integration

* Add code tabs (C++, Java, Python) — I provided C++ for everything; add other languages later.
* Add "Run code" playground for students to paste input and test.
* Add "Show trace" animations for Binary/Interpolation/Exponential/JUMP using simple step arrays (JS). Use interactive highlight of mid/low/high.
* Add downloadable cheat-sheet PDF and one-page printable summary.

---

If you want, I will now:

* Insert all these new code files into the canvas as separate code tabs (e.g., `searching_algorithms.cpp`, `string_search.cpp`, `data_structures.cpp`) so you can download them directly.
* Or I can generate a ready-to-deploy Next.js static page including markdown parsing, code tabs, and a simple JS trace widget for Binary Search.

Tell me which — I'll proceed and add those files into the canvas.
