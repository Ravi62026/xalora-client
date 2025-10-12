import React, { useState } from "react";
import { Layout } from "../components";

const TreeAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Tree Node Structure
  const treeNode = `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};`;

  // Tree Traversals
  const traversals = [
    {
      id: "inorder",
      name: "Inorder Traversal (Left → Root → Right)",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Visit left subtree, root, then right subtree. Gives nodes in sorted order for BST.",
      code: `// Recursive Inorder
void inorderRecursive(TreeNode* root) {
    if (!root) return;

    inorderRecursive(root->left);     // Left
    cout << root->val << " ";         // Root
    inorderRecursive(root->right);    // Right
}

// Iterative Inorder using Stack
void inorderIterative(TreeNode* root) {
    stack<TreeNode*> stk;
    TreeNode* curr = root;

    while (curr || !stk.empty()) {
        // Reach leftmost node
        while (curr) {
            stk.push(curr);
            curr = curr->left;
        }

        // Process current node
        curr = stk.top();
        stk.pop();
        cout << curr->val << " ";

        // Move to right subtree
        curr = curr->right;
    }
}`
    },
    {
      id: "preorder",
      name: "Preorder Traversal (Root → Left → Right)",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Visit root first, then left subtree, then right subtree. Useful for copying trees.",
      code: `// Recursive Preorder
void preorderRecursive(TreeNode* root) {
    if (!root) return;

    cout << root->val << " ";         // Root
    preorderRecursive(root->left);    // Left
    preorderRecursive(root->right);   // Right
}

// Iterative Preorder using Stack
void preorderIterative(TreeNode* root) {
    if (!root) return;

    stack<TreeNode*> stk;
    stk.push(root);

    while (!stk.empty()) {
        TreeNode* curr = stk.top();
        stk.pop();

        cout << curr->val << " "; // Process root

        // Push right first, then left (LIFO)
        if (curr->right) stk.push(curr->right);
        if (curr->left) stk.push(curr->left);
    }
}`
    },
    {
      id: "postorder",
      name: "Postorder Traversal (Left → Right → Root)",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Visit left subtree, right subtree, then root. Useful for deletion and bottom-up processing.",
      code: `// Recursive Postorder
void postorderRecursive(TreeNode* root) {
    if (!root) return;

    postorderRecursive(root->left);   // Left
    postorderRecursive(root->right);  // Right
    cout << root->val << " ";         // Root
}

// Iterative Postorder using Two Stacks
void postorderIterative(TreeNode* root) {
    if (!root) return;

    stack<TreeNode*> stk1, stk2;
    stk1.push(root);

    while (!stk1.empty()) {
        TreeNode* curr = stk1.top();
        stk1.pop();
        stk2.push(curr);

        // Push left and right children
        if (curr->left) stk1.push(curr->left);
        if (curr->right) stk1.push(curr->right);
    }

    // stk2 has postorder traversal
    while (!stk2.empty()) {
        cout << stk2.top()->val << " ";
        stk2.pop();
    }
}`
    },
    {
      id: "levelorder",
      name: "Level Order Traversal (BFS)",
      complexity: { time: "O(n)", space: "O(w)" },
      description: "Visit nodes level by level using queue. w is maximum width of tree.",
      code: `void levelOrder(TreeNode* root) {
    if (!root) return;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();

        for (int i = 0; i < levelSize; i++) {
            TreeNode* curr = q.front();
            q.pop();

            cout << curr->val << " ";

            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }
        cout << endl; // New line for each level
    }
}

// Return level order as 2D vector
vector<vector<int>> levelOrder2D(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* curr = q.front();
            q.pop();
            level.push_back(curr->val);

            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }

        result.push_back(level);
    }

    return result;
}`
    }
  ];

  // Binary Search Tree Operations
  const bstOperations = [
    {
      id: "bst-insert",
      name: "BST Insert",
      complexity: { time: "O(h)", space: "O(1)" },
      description: "Insert a value into BST while maintaining BST property.",
      code: `TreeNode* insertBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);

    if (val < root->val) {
        root->left = insertBST(root->left, val);
    } else if (val > root->val) {
        root->right = insertBST(root->right, val);
    }

    return root; // val already exists, return unchanged
}

// Iterative Insert
TreeNode* insertBSTIterative(TreeNode* root, int val) {
    TreeNode* newNode = new TreeNode(val);

    if (!root) return newNode;

    TreeNode* curr = root;
    TreeNode* parent = nullptr;

    while (curr) {
        parent = curr;
        if (val < curr->val) {
            curr = curr->left;
        } else if (val > curr->val) {
            curr = curr->right;
        } else {
            return root; // val already exists
        }
    }

    if (val < parent->val) {
        parent->left = newNode;
    } else {
        parent->right = newNode;
    }

    return root;
}`
    },
    {
      id: "bst-search",
      name: "BST Search",
      complexity: { time: "O(h)", space: "O(1)" },
      description: "Search for a value in BST. Returns node if found, null otherwise.",
      code: `TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;

    if (val < root->val) {
        return searchBST(root->left, val);
    } else {
        return searchBST(root->right, val);
    }
}

// Iterative Search
TreeNode* searchBSTIterative(TreeNode* root, int val) {
    TreeNode* curr = root;

    while (curr) {
        if (val == curr->val) {
            return curr;
        } else if (val < curr->val) {
            curr = curr->left;
        } else {
            curr = curr->right;
        }
    }

    return nullptr; // Not found
}`
    },
    {
      id: "bst-delete",
      name: "BST Delete",
      complexity: { time: "O(h)", space: "O(1)" },
      description: "Delete a node from BST while maintaining BST property.",
      code: `TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;

    if (key < root->val) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->val) {
        root->right = deleteNode(root->right, key);
    } else {
        // Node found - handle three cases

        // Case 1: No children (leaf node)
        if (!root->left && !root->right) {
            delete root;
            return nullptr;
        }

        // Case 2: One child
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }

        // Case 3: Two children - find inorder successor
        TreeNode* successor = findMin(root->right);
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }

    return root;
}

TreeNode* findMin(TreeNode* node) {
    while (node && node->left) {
        node = node->left;
    }
    return node;
}`
    }
  ];

  // Tree Properties and Calculations
  const treeProperties = [
    {
      id: "height-depth",
      name: "Height and Depth",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Height is longest path from root to leaf. Depth is path from root to node.",
      code: `// Height of tree (recursive)
int height(TreeNode* root) {
    if (!root) return -1; // or 0 depending on convention

    int leftHeight = height(root->left);
    int rightHeight = height(root->right);

    return 1 + max(leftHeight, rightHeight);
}

// Check if tree is balanced (height difference ≤ 1)
bool isBalanced(TreeNode* root) {
    return checkHeight(root) != -1;
}

int checkHeight(TreeNode* root) {
    if (!root) return 0;

    int leftHeight = checkHeight(root->left);
    if (leftHeight == -1) return -1;

    int rightHeight = checkHeight(root->right);
    if (rightHeight == -1) return -1;

    if (abs(leftHeight - rightHeight) > 1) return -1;

    return 1 + max(leftHeight, rightHeight);
}`
    },
    {
      id: "diameter",
      name: "Diameter of Tree",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Longest path between any two nodes in tree (may or may not pass through root).",
      code: `// Diameter using height calculation
int diameter(TreeNode* root) {
    int maxDiameter = 0;
    heightWithDiameter(root, maxDiameter);
    return maxDiameter;
}

int heightWithDiameter(TreeNode* root, int& maxDiameter) {
    if (!root) return 0;

    int leftHeight = heightWithDiameter(root->left, maxDiameter);
    int rightHeight = heightWithDiameter(root->right, maxDiameter);

    // Diameter through current node
    int currentDiameter = leftHeight + rightHeight;
    maxDiameter = max(maxDiameter, currentDiameter);

    // Return height
    return 1 + max(leftHeight, rightHeight);
}

// Optimized diameter calculation
pair<int, int> diameterOptimized(TreeNode* root) {
    if (!root) return {0, 0}; // {height, diameter}

    auto left = diameterOptimized(root->left);
    auto right = diameterOptimized(root->right);

    int height = 1 + max(left.first, right.first);
    int diameter = max({left.second, right.second, left.first + right.first});

    return {height, diameter};
}`
    },
    {
      id: "lowest-common-ancestor",
      name: "Lowest Common Ancestor (LCA)",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Find lowest node that has both nodes as descendants.",
      code: `// LCA in Binary Tree (not necessarily BST)
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if (left && right) return root;  // p and q in different subtrees
    return left ? left : right;      // both in same subtree
}

// LCA in BST (efficient)
TreeNode* lowestCommonAncestorBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root) return nullptr;

    // If both nodes are smaller, LCA is in left subtree
    if (p->val < root->val && q->val < root->val) {
        return lowestCommonAncestorBST(root->left, p, q);
    }

    // If both nodes are greater, LCA is in right subtree
    if (p->val > root->val && q->val > root->val) {
        return lowestCommonAncestorBST(root->right, p, q);
    }

    // Nodes are in different subtrees, root is LCA
    return root;
}`
    }
  ];

  // Advanced Tree Algorithms
  const advancedAlgorithms = [
    {
      id: "serialize-deserialize",
      name: "Serialize and Deserialize Tree",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Convert tree to string and reconstruct from string.",
      code: `// Serialize using preorder traversal
void serializeHelper(TreeNode* root, string& result) {
    if (!root) {
        result += "#,";
        return;
    }

    result += to_string(root->val) + ",";
    serializeHelper(root->left, result);
    serializeHelper(root->right, result);
}

string serialize(TreeNode* root) {
    string result;
    serializeHelper(root, result);
    return result;
}

// Deserialize from preorder string
TreeNode* deserializeHelper(queue<string>& nodes) {
    string val = nodes.front();
    nodes.pop();

    if (val == "#") return nullptr;

    TreeNode* root = new TreeNode(stoi(val));
    root->left = deserializeHelper(nodes);
    root->right = deserializeHelper(nodes);

    return root;
}

TreeNode* deserialize(string data) {
    queue<string> nodes;
    stringstream ss(data);
    string token;

    while (getline(ss, token, ',')) {
        nodes.push(token);
    }

    return deserializeHelper(nodes);
}`
    },
    {
      id: "max-path-sum",
      name: "Maximum Path Sum",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Find path with maximum sum (path can start/end anywhere).",
      code: `int maxPathSum(TreeNode* root) {
    int maxSum = INT_MIN;
    maxPathSumHelper(root, maxSum);
    return maxSum;
}

int maxPathSumHelper(TreeNode* root, int& maxSum) {
    if (!root) return 0;

    // Get maximum path sum from left and right subtrees
    int left = max(0, maxPathSumHelper(root->left, maxSum));
    int right = max(0, maxPathSumHelper(root->right, maxSum));

    // Current path sum through root
    int currentPathSum = root->val + left + right;

    // Update global maximum
    maxSum = max(maxSum, currentPathSum);

    // Return maximum path sum extending from current node
    return root->val + max(left, right);
}`
    },
    {
      id: "kth-smallest",
      name: "Kth Smallest Element in BST",
      complexity: { time: "O(h + k)", space: "O(h)" },
      description: "Find kth smallest element using inorder traversal property.",
      code: `// Using inorder traversal (iterative)
int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> stk;
    TreeNode* curr = root;
    int count = 0;

    while (curr || !stk.empty()) {
        // Go to leftmost node
        while (curr) {
            stk.push(curr);
            curr = curr->left;
        }

        // Process current node
        curr = stk.top();
        stk.pop();
        count++;

        if (count == k) return curr->val;

        // Move to right subtree
        curr = curr->right;
    }

    return -1; // k is larger than number of nodes
}

// Using Morris Traversal (O(1) space)
int kthSmallestMorris(TreeNode* root, int k) {
    TreeNode* curr = root;
    int count = 0;

    while (curr) {
        if (!curr->left) {
            count++;
            if (count == k) return curr->val;
            curr = curr->right;
        } else {
            // Find inorder predecessor
            TreeNode* pred = curr->left;
            while (pred->right && pred->right != curr) {
                pred = pred->right;
            }

            if (!pred->right) {
                // Create thread
                pred->right = curr;
                curr = curr->left;
            } else {
                // Remove thread
                pred->right = nullptr;
                count++;
                if (count == k) return curr->val;
                curr = curr->right;
            }
        }
    }

    return -1;
}`
    }
  ];

  // Binary Tree Views
  const treeViews = [
    {
      id: "right-view",
      name: "Right View of Binary Tree",
      complexity: { time: "O(n)", space: "O(h)" },
      description: "Nodes visible when viewed from right side.",
      code: `vector<int> rightSideView(TreeNode* root) {
    vector<int> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        TreeNode* rightmost = nullptr;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* curr = q.front();
            q.pop();

            rightmost = curr; // Last node in level is rightmost

            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }

        if (rightmost) result.push_back(rightmost->val);
    }

    return result;
}`
    },
    {
      id: "boundary-traversal",
      name: "Boundary Traversal",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Traverse left boundary, leaves, and right boundary.",
      code: `void addLeftBoundary(TreeNode* root, vector<int>& result) {
    TreeNode* curr = root->left;
    while (curr) {
        if (curr->left || curr->right) result.push_back(curr->val);
        if (curr->left) curr = curr->left;
        else curr = curr->right;
    }
}

void addLeaves(TreeNode* root, vector<int>& result) {
    if (!root) return;

    if (!root->left && !root->right) {
        result.push_back(root->val);
        return;
    }

    addLeaves(root->left, result);
    addLeaves(root->right, result);
}

void addRightBoundary(TreeNode* root, vector<int>& result) {
    vector<int> temp;
    TreeNode* curr = root->right;

    while (curr) {
        if (curr->left || curr->right) temp.push_back(curr->val);
        if (curr->right) curr = curr->right;
        else curr = curr->left;
    }

    reverse(temp.begin(), temp.end());
    for (int val : temp) result.push_back(val);
}

vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> result;
    if (!root) return result;

    // Root
    result.push_back(root->val);

    // Left boundary
    addLeftBoundary(root, result);

    // Leaves
    addLeaves(root->left, result);
    addLeaves(root->right, result);

    // Right boundary
    addRightBoundary(root, result);

    return result;
}`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Validate Binary Search Tree",
      difficulty: "Medium",
      description: "Check if binary tree is a valid BST",
      hint: "Inorder traversal should be sorted"
    },
    {
      name: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      description: "Find path with maximum sum",
      hint: "Track max path through each node"
    },
    {
      name: "Lowest Common Ancestor",
      difficulty: "Medium",
      description: "Find LCA of two nodes",
      hint: "Use recursion to find split point"
    },
    {
      name: "Serialize and Deserialize BST",
      difficulty: "Medium",
      description: "Convert BST to string and back",
      hint: "Preorder traversal preserves BST property"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(n)")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(h)")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(w)")) color = "bg-yellow-100 text-yellow-800";

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
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Tree Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master tree traversals, BST operations, and advanced tree algorithms for efficient tree manipulation and problem-solving.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("traversal")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "traversal"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Traversals
            </button>
            <button
              onClick={() => setActiveSection("bst")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "bst"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              BST Operations
            </button>
            <button
              onClick={() => setActiveSection("properties")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "properties"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "advanced"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Tree Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Tree Structure</h3>
                  <p className="text-gray-300 mb-6">
                    Trees are hierarchical data structures with a root node and child nodes.
                    Each node has at most two children in binary trees, making them ideal for
                    representing hierarchical relationships and enabling efficient operations.
                  </p>

                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Key Concepts</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">🌳</span>
                      <span><strong>Root:</strong> Topmost node with no parent</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">📊</span>
                      <span><strong>Height:</strong> Longest path from root to leaf</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">🔍</span>
                      <span><strong>Depth:</strong> Path length from root to node</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">📋</span>
                      <span><strong>Binary Tree:</strong> Each node has ≤ 2 children</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Algorithm Categories</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Traversals</h4>
                      <p className="text-gray-300">Inorder, Preorder, Postorder, Level-order</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">BST Operations</h4>
                      <p className="text-gray-300">Insert, Delete, Search, Validate</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Tree Properties</h4>
                      <p className="text-gray-300">Height, Diameter, LCA, Balance</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Advanced</h4>
                      <p className="text-gray-300">Serialization, Views, Path sums</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tree Node Structure */}
              <div className="mt-8 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Tree Node Structure</h3>
                <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{treeNode}</code>
                </pre>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Time Complexity</h4>
                  <p className="text-gray-300">Most operations: <strong className="text-white">O(n)</strong></p>
                  <p className="text-sm text-gray-400 mt-2">BST operations: O(h) where h is height</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">O(n) for storage</p>
                  <p className="text-sm text-gray-400 mt-2">O(h) for recursion stack</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Patterns</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Recursive traversal</li>
                    <li>• Stack for iteration</li>
                    <li>• Queue for level order</li>
                    <li>• Parent pointers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Traversals Section */}
          {activeSection === "traversal" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Tree Traversals</h2>

              <div className="grid grid-cols-1 gap-8">
                {traversals.map((traversal) => (
                  <div
                    key={traversal.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{traversal.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${traversal.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${traversal.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{traversal.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{traversal.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BST Operations Section */}
          {activeSection === "bst" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">BST Operations</h2>

              <div className="grid grid-cols-1 gap-8">
                {bstOperations.map((operation) => (
                  <div
                    key={operation.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{operation.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${operation.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${operation.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{operation.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {activeSection === "properties" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Tree Properties & Calculations</h2>

              <div className="grid grid-cols-1 gap-8">
                {treeProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{property.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {renderComplexityBadge(`Time: ${property.complexity.time}`)}
                          {renderComplexityBadge(`Space: ${property.complexity.space}`)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{property.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{property.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tree Views */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Tree Views</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {treeViews.map((view, idx) => (
                      <div key={idx} className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">{view.name}</h4>
                        <p className="text-gray-300 mb-2 text-sm">{view.description}</p>
                        <pre className="bg-gray-900 text-gray-300 p-3 rounded text-xs overflow-x-auto">
                          <code>{view.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Tree Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Tree Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Maximum Depth of Binary Tree</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Same Tree (check if identical)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Invert Binary Tree</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Path Sum (root to leaf)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Tree Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Binary Tree Level Order Traversal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Lowest Common Ancestor</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Validate Binary Search Tree</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Sum Root to Leaf Numbers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Binary Tree Right Side View</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Tree Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Binary Tree Maximum Path Sum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Serialize and Deserialize Binary Tree</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Recover Binary Search Tree</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Binary Tree Cameras</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Vertical Order Traversal</span>
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

          {/* Tree Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Tree Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Traversal Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Inorder BST:</span>
                    <span className="text-green-400 font-mono">Sorted Order</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Preorder:</span>
                    <span className="text-blue-400 font-mono">Copy Tree</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Postorder:</span>
                    <span className="text-purple-400 font-mono">Delete Tree</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Level Order:</span>
                    <span className="text-cyan-400 font-mono">BFS with Queue</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">BST Properties</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Inorder Traversal:</div>
                    <div className="text-gray-400">→ Always sorted</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Search:</div>
                    <div className="text-gray-400">→ O(h) time, O(1) space</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Insert/Delete:</div>
                    <div className="text-gray-400">→ O(h) time, O(h) space</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Balance:</div>
                    <div className="text-gray-400">→ Height difference ≤ 1</div>
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

export default TreeAlgorithms;

