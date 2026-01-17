import React, { useState } from "react";
import { Layout } from "../components";

const Stacks = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Stack Implementations
  const implementations = [
    {
      id: "array-based",
      name: "Array-Based Stack",
      complexity: { push: "O(1)", pop: "O(1)", peek: "O(1)", space: "O(n)" },
      description: "Stack implemented using dynamic arrays with automatic resizing",
      code: `// Array-based Stack implementation
class ArrayStack {
private:
    std::vector<int> data;
    int top;

public:
    ArrayStack() : top(-1) {}

    // Push element onto stack - O(1) amortized
    void push(int val) {
        data.push_back(val);
        top++;
    }

    // Pop element from stack - O(1)
    int pop() {
        if (isEmpty()) {
            throw std::underflow_error("Stack underflow");
        }
        int val = data[top];
        data.pop_back();
        top--;
        return val;
    }

    // Peek at top element - O(1)
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Stack is empty");
        }
        return data[top];
    }

    // Check if stack is empty - O(1)
    bool isEmpty() {
        return top == -1;
    }

    // Get stack size - O(1)
    int size() {
        return top + 1;
    }
};`
    },
    {
      id: "linked-list",
      name: "Linked List Stack",
      complexity: { push: "O(1)", pop: "O(1)", peek: "O(1)", space: "O(n)" },
      description: "Stack implemented using linked list for constant time operations",
      code: `// Linked List based Stack implementation
struct StackNode {
    int data;
    StackNode* next;

    StackNode(int val) : data(val), next(nullptr) {}
};

class LinkedListStack {
private:
    StackNode* top;
    int size;

public:
    LinkedListStack() : top(nullptr), size(0) {}

    // Push element onto stack - O(1)
    void push(int val) {
        StackNode* newNode = new StackNode(val);
        newNode->next = top;
        top = newNode;
        size++;
    }

    // Pop element from stack - O(1)
    int pop() {
        if (isEmpty()) {
            throw std::underflow_error("Stack underflow");
        }
        StackNode* temp = top;
        int val = temp->data;
        top = top->next;
        delete temp;
        size--;
        return val;
    }

    // Peek at top element - O(1)
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Stack is empty");
        }
        return top->data;
    }

    // Check if stack is empty - O(1)
    bool isEmpty() {
        return top == nullptr;
    }

    // Get stack size - O(1)
    int getSize() {
        return size;
    }
};`
    }
  ];

  // Stack Algorithms
  const algorithms = [
    {
      id: "valid-parentheses",
      name: "Valid Parentheses",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Check if parentheses are balanced using stack",
      code: `// Valid Parentheses using Stack - O(n) time, O(n) space
bool isValidParentheses(const std::string& s) {
    std::stack<char> st;

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;

            char top = st.top();
            st.pop();

            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }

    return st.empty(); // Stack should be empty for valid expression
}

// Test cases
// "()" → true
// "()[]{}" → true
// "(]" → false
// "([)]" → false
// "{[]}" → true`
    },
    {
      id: "next-greater",
      name: "Next Greater Element",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Find next greater element for each element in array",
      code: `// Next Greater Element using Stack - O(n) time, O(n) space
std::vector<int> nextGreaterElement(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> st; // Store indices

    for (int i = 0; i < n; i++) {
        // While stack is not empty and current element is greater
        // than element at stack top, pop and update result
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }

        // Push current index
        st.push(i);
    }

    return result;
}

// Example: [4, 5, 2, 25]
// Result: [5, 25, 25, -1]

// Circular version (for circular array)
std::vector<int> nextGreaterElementCircular(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> st;

    // Iterate twice for circular behavior
    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;

        while (!st.empty() && nums[idx] > nums[st.top()]) {
            int topIdx = st.top();
            st.pop();
            result[topIdx] = nums[idx];
        }

        if (i < n) st.push(idx);
    }

    return result;
}`
    },
    {
      id: "largest-rectangle",
      name: "Largest Rectangle in Histogram",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Find largest rectangular area in histogram using stack",
      code: `// Largest Rectangle in Histogram using Stack - O(n) time, O(n) space
int largestRectangleArea(const std::vector<int>& heights) {
    int n = heights.size();
    std::stack<int> st;
    int maxArea = 0;

    for (int i = 0; i <= n; i++) {
        // Current height (0 for sentinel)
        int h = (i == n) ? 0 : heights[i];

        // Pop bars from stack while current height is smaller
        while (!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()];
            st.pop();

            // Width calculation
            int width = st.empty() ? i : i - st.top() - 1;

            // Update max area
            maxArea = std::max(maxArea, height * width);
        }

        st.push(i);
    }

    return maxArea;
}

// Example: [2, 1, 5, 6, 2, 3]
// Areas: 2*1=2, 1*1=1, 5*1=5, 6*1=6, 2*5=10, 3*1=3
// Max Area: 10 (height 2, width 5 from indices 2-6)

// Optimized version with constant space for some cases
int largestRectangleAreaOptimized(const std::vector<int>& heights) {
    // Similar to above but can be optimized for specific cases
    return largestRectangleArea(heights);
}`
    },
    {
      id: "stack-sort",
      name: "Sort Stack Using Recursion",
      complexity: { time: "O(n²)", space: "O(n)" },
      description: "Sort a stack using only stack operations and recursion",
      code: `// Sort Stack using Recursion - O(n²) time, O(n) space
void sortStack(std::stack<int>& st) {
    if (st.empty()) return;

    // Remove top element
    int top = st.top();
    st.pop();

    // Sort remaining stack
    sortStack(st);

    // Insert top element in sorted order
    insertSorted(st, top);
}

// Helper function to insert element in sorted stack
void insertSorted(std::stack<int>& st, int element) {
    if (st.empty() || element > st.top()) {
        st.push(element);
        return;
    }

    // Remove top element
    int top = st.top();
    st.pop();

    // Recursively insert element
    insertSorted(st, element);

    // Push back the removed element
    st.push(top);
}

// Example usage
void demonstrateSort() {
    std::stack<int> st;
    st.push(3);
    st.push(1);
    st.push(4);
    st.push(2);

    sortStack(st);

    // Stack now contains: 1, 2, 3, 4 (top to bottom)
    while (!st.empty()) {
        std::cout << st.top() << " ";
        st.pop();
    }
    // Output: 4 3 2 1
}`
    },
    {
      id: "min-stack",
      name: "Min Stack (Stack with getMin)",
      complexity: { push: "O(1)", pop: "O(1)", getMin: "O(1)", space: "O(n)" },
      description: "Implement stack that supports get minimum element in O(1)",
      code: `// Min Stack implementation - O(1) for all operations
class MinStack {
private:
    std::stack<int> data;  // Main stack
    std::stack<int> minStack; // Stack to track minimums

public:
    MinStack() {}

    // Push element - O(1)
    void push(int val) {
        data.push(val);

        // Push to min stack if it's empty or val <= current min
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        }
    }

    // Pop element - O(1)
    void pop() {
        if (data.empty()) return;

        int val = data.top();
        data.pop();

        // If popped value is current min, pop from min stack too
        if (!minStack.empty() && val == minStack.top()) {
            minStack.pop();
        }
    }

    // Get top element - O(1)
    int top() {
        if (data.empty()) throw std::underflow_error("Stack is empty");
        return data.top();
    }

    // Get minimum element - O(1)
    int getMin() {
        if (minStack.empty()) throw std::underflow_error("Stack is empty");
        return minStack.top();
    }

    // Check if empty - O(1)
    bool isEmpty() {
        return data.empty();
    }
};

// Alternative implementation using single stack with pairs
class MinStackSingle {
private:
    std::stack<std::pair<int, int>> st; // {value, current_min}

public:
    void push(int val) {
        int currentMin = val;
        if (!st.empty()) {
            currentMin = std::min(currentMin, st.top().second);
        }
        st.push({val, currentMin});
    }

    void pop() {
        if (!st.empty()) st.pop();
    }

    int top() {
        if (st.empty()) throw std::underflow_error("Stack is empty");
        return st.top().first;
    }

    int getMin() {
        if (st.empty()) throw std::underflow_error("Stack is empty");
        return st.top().second;
    }
};`
    },
    {
      id: "evaluate-expression",
      name: "Evaluate Mathematical Expression",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Evaluate infix mathematical expressions using two stacks",
      code: `// Evaluate mathematical expression using two stacks
int evaluateExpression(const std::string& expression) {
    std::stack<int> values;   // Stack for operands
    std::stack<char> ops;     // Stack for operators

    for (size_t i = 0; i < expression.length(); i++) {
        char c = expression[i];

        if (c == ' ') continue;

        // If number, push to values stack
        if (isdigit(c)) {
            int num = 0;
            while (i < expression.length() && isdigit(expression[i])) {
                num = num * 10 + (expression[i] - '0');
                i++;
            }
            i--; // Adjust for loop increment
            values.push(num);
        }
        // If '(', push to ops stack
        else if (c == '(') {
            ops.push(c);
        }
        // If ')', solve entire expression until '('
        else if (c == ')') {
            while (!ops.empty() && ops.top() != '(') {
                int val2 = values.top(); values.pop();
                int val1 = values.top(); values.pop();
                char op = ops.top(); ops.pop();

                values.push(applyOperation(val1, val2, op));
            }
            if (!ops.empty()) ops.pop(); // Remove '('
        }
        // If operator
        else if (isOperator(c)) {
            while (!ops.empty() && precedence(ops.top()) >= precedence(c)) {
                int val2 = values.top(); values.pop();
                int val1 = values.top(); values.pop();
                char op = ops.top(); ops.pop();

                values.push(applyOperation(val1, val2, op));
            }
            ops.push(c);
        }
    }

    // Process remaining operations
    while (!ops.empty()) {
        int val2 = values.top(); values.pop();
        int val1 = values.top(); values.pop();
        char op = ops.top(); ops.pop();

        values.push(applyOperation(val1, val2, op));
    }

    return values.top();
}

// Helper functions
bool isOperator(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

int applyOperation(int a, int b, char op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b; // Assume no division by zero
    }
    return 0;
}

// Example: "3 + 5 * 2" → 13
// Example: "(3 + 5) * 2" → 16`
    }
  ];

  // Stack Applications
  const applications = [
    {
      id: "function-calls",
      name: "Function Call Stack",
      description: "Track function calls and local variables",
      useCase: "Recursion, program execution flow"
    },
    {
      id: "undo-redo",
      name: "Undo/Redo Operations",
      description: "Maintain history of operations for undo functionality",
      useCase: "Text editors, drawing applications"
    },
    {
      id: "expression-parsing",
      name: "Expression Evaluation",
      description: "Convert and evaluate mathematical expressions",
      useCase: "Calculators, compilers"
    },
    {
      id: "browser-history",
      name: "Browser Back Button",
      description: "Track navigation history",
      useCase: "Web browsers, navigation systems"
    },
    {
      id: "syntax-checking",
      name: "Syntax Validation",
      description: "Check balanced parentheses and brackets",
      useCase: "Code editors, compilers"
    },
    {
      id: "dfs-traversal",
      name: "Depth-First Search",
      description: "Implement DFS algorithm using stack",
      useCase: "Graph/tree traversal algorithms"
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Valid Parentheses",
      difficulty: "Easy",
      description: "Check if parentheses string is valid",
      hint: "Use stack, push opening, pop matching closing"
    },
    {
      name: "Min Stack",
      difficulty: "Easy",
      description: "Design stack that supports getMin in O(1)",
      hint: "Use two stacks or store min with each element"
    },
    {
      name: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      description: "Evaluate mathematical expression in RPN",
      hint: "Use stack, push numbers, pop for operations"
    },
    {
      name: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      description: "Find largest rectangular area in histogram",
      hint: "Monotonic stack approach"
    },
    {
      name: "Maximal Rectangle",
      difficulty: "Hard",
      description: "Find largest rectangle of 1's in binary matrix",
      hint: "Convert to histogram problem for each row"
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
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Stacks
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master Last-In-First-Out (LIFO) data structures and their powerful algorithms for efficient problem solving.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("theory")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "theory"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Theory
            </button>
            <button
              onClick={() => setActiveSection("implementations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementations"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Implementations
            </button>
            <button
              onClick={() => setActiveSection("algorithms")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "algorithms"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Algorithms
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Theory Section */}
          {activeSection === "theory" && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Stack Theory & Mathematical Foundations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* LIFO Principle & Abstract Data Type */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6">LIFO Principle & Abstract Data Type</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">LIFO (Last-In-First-Out) Semantics</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Stack operations follow strict temporal ordering:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">📚</span>
                              <span><strong>Temporal Ordering:</strong> Most recently added item is removed first</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">⏰</span>
                              <span><strong>Time-based Priority:</strong> Recency determines access order</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">🎯</span>
                              <span><strong>Single Access Point:</strong> All operations through one end</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Abstract Data Type Definition</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Stack as an ADT with well-defined interface:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">🔧</span>
                              <span><strong>Operations:</strong> push, pop, peek, isEmpty, size</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">📋</span>
                              <span><strong>Contract:</strong> Well-defined behavior for each operation</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 mr-2">🔒</span>
                              <span><strong>Encapsulation:</strong> Implementation details hidden</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Stack Invariants</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-green-400 font-medium mb-2">✅ Always True</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Top element is most recently pushed</li>
                            <li>• Size reflects number of elements</li>
                            <li>• Empty stack has no elements</li>
                            <li>• Operations maintain LIFO order</li>
                          </ul>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-red-400 font-medium mb-2">❌ Never True</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Random access to middle elements</li>
                            <li>• Pop from empty stack</li>
                            <li>• Peek on empty stack</li>
                            <li>• FIFO behavior</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stack vs Other ADTs */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6">Stack vs Other Abstract Data Types</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-orange-400 text-lg font-bold">Stack (LIFO)</th>
                            <th className="pb-4 text-yellow-400 text-lg font-bold">Queue (FIFO)</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">Deque</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Priority Queue</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-orange-400 transition-all duration-300">Access Pattern</td>
                            <td className="py-4 text-orange-400 font-medium">Most recent only</td>
                            <td className="py-4 text-yellow-400 font-medium">Oldest first</td>
                            <td className="py-4 text-purple-400 font-medium">Both ends</td>
                            <td className="py-4 text-blue-400 font-medium">Highest priority</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-orange-400 transition-all duration-300">Ordering</td>
                            <td className="py-4 text-orange-400 font-medium">Temporal (time-based)</td>
                            <td className="py-4 text-yellow-400 font-medium">Temporal (arrival)</td>
                            <td className="py-4 text-purple-400 font-medium">User controlled</td>
                            <td className="py-4 text-blue-400 font-medium">Priority-based</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-orange-400 transition-all duration-300">Use Cases</td>
                            <td className="py-4 text-orange-400 font-medium">Function calls, undo</td>
                            <td className="py-4 text-yellow-400 font-medium">BFS, scheduling</td>
                            <td className="py-4 text-purple-400 font-medium">Sliding windows</td>
                            <td className="py-4 text-blue-400 font-medium">Task priority</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-orange-400 transition-all duration-300">Operations</td>
                            <td className="py-4 text-orange-400 font-medium">Push, pop, peek</td>
                            <td className="py-4 text-yellow-400 font-medium">Enqueue, dequeue</td>
                            <td className="py-4 text-purple-400 font-medium">Push/pop both ends</td>
                            <td className="py-4 text-blue-400 font-medium">Insert, extract-max</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-orange-400 transition-all duration-300">Complexity</td>
                            <td className="py-4 text-green-400 font-medium">All O(1)</td>
                            <td className="py-4 text-green-400 font-medium">All O(1)</td>
                            <td className="py-4 text-green-400 font-medium">All O(1)</td>
                            <td className="py-4 text-yellow-400 font-medium">O(log n)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Stack in Computer Science */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6">Stack in Computer Science Theory</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Runtime Stack (Call Stack)</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Function Call Mechanism</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Each function call pushes activation record</li>
                              <li>• Local variables, parameters, return address</li>
                              <li>• Stack overflow when recursion too deep</li>
                              <li>• Automatic cleanup on return</li>
                            </ul>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Recursion Implementation</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Each recursive call creates new stack frame</li>
                              <li>• Unwinding on base case reached</li>
                              <li>• Tail recursion optimization possible</li>
                              <li>• Risk of stack overflow in deep recursion</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Expression Evaluation</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Infix to Postfix Conversion</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Operators pushed based on precedence</li>
                              <li>• Left parenthesis has lowest precedence</li>
                              <li>• Right parenthesis triggers popping</li>
                              <li>• Result is postfix notation</li>
                            </ul>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Postfix Evaluation</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Operands pushed directly to stack</li>
                              <li>• Operators pop two operands, apply operation</li>
                              <li>• Result pushed back to stack</li>
                              <li>• Final result is top of stack</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Stack-Based Languages</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Forth & PostScript</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Concatenative programming</li>
                            <li>• No variables, only stack</li>
                            <li>• Functions consume/produce stack values</li>
                            <li>• Reverse Polish notation</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">JVM Bytecode</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Operand stack for computations</li>
                            <li>• Load/store instructions</li>
                            <li>• Stack-based virtual machine</li>
                            <li>• Efficient for interpreters</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Analysis */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6">Mathematical Analysis of Stack Operations</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Time Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Push/Pop Operations: O(1)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Constant Time Guarantee:</strong></p>
                              <p>• Direct pointer manipulation</p>
                              <p>• No traversal or searching</p>
                              <p>• Amortized for dynamic arrays</p>
                              <p>• Independent of stack size</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-yellow-400 font-medium mb-2">Search Operation: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Linear Search Required:</strong></p>
                              <p>• Must traverse entire stack</p>
                              <p>• No random access capability</p>
                              <p>• Worst case: element not found</p>
                              <p>• Stack doesn't support efficient search</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Space Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-blue-400 font-medium mb-2">Array Implementation: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Space Usage:</strong></p>
                              <p>• Fixed capacity allocation</p>
                              <p>• No per-element overhead</p>
                              <p>• Memory efficient for known sizes</p>
                              <p>• Potential wasted space</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Linked List: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Space Overhead:</strong></p>
                              <p>• Pointer per element</p>
                              <p>• Dynamic allocation</p>
                              <p>• No size limitations</p>
                              <p>• Memory fragmentation possible</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Stack Properties & Theorems</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg mb-2">LIFO Property</div>
                          <div className="text-gray-300 text-sm">Last in, first out ordering</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-lg mb-2">Bounded Capacity</div>
                          <div className="text-gray-300 text-sm">Maximum size constraints</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold text-lg mb-2">Atomic Operations</div>
                          <div className="text-gray-300 text-sm">Indivisible push/pop actions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stack in Algorithm Design */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6">Stack in Algorithm Design & Analysis</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Algorithmic Paradigms</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Monotonic Stack</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Maintains increasing/decreasing order</p>
                              <p>• O(n) time for next greater element</p>
                              <p>• Removes elements that violate monotonicity</p>
                              <p>• Used in: Stock span, histogram problems</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Stack Simulation</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Simulates recursive processes</p>
                              <p>• Avoids recursion depth limits</p>
                              <p>• Iterative tree/graph traversals</p>
                              <p>• Memory-efficient for deep structures</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Parentheses Matching</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Validates nested structures</p>
                              <p>• Checks XML/HTML tag matching</p>
                              <p>• Compiler syntax validation</p>
                              <p>• Mathematical expression parsing</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Advanced Applications</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Expression Evaluation</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Infix to postfix conversion</p>
                              <p>• Shunting-yard algorithm</p>
                              <p>• Calculator implementations</p>
                              <p>• Compiler expression parsing</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Backtracking Algorithms</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• N-Queens problem solution</p>
                              <p>• Maze solving algorithms</p>
                              <p>• Constraint satisfaction</p>
                              <p>• State space search</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Undo/Redo Systems</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Command pattern implementation</p>
                              <p>• Text editor operations</p>
                              <p>• Transaction rollback</p>
                              <p>• Version control systems</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-green-400 mb-4">Why Stacks are Fundamental</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Computational Thinking</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• LIFO principle understanding</li>
                            <li>• Recursion and call stacks</li>
                            <li>• Expression evaluation</li>
                            <li>• Nested structure parsing</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">System Architecture</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Runtime stack management</li>
                            <li>• Memory allocation strategies</li>
                            <li>• Context switching</li>
                            <li>• Exception handling</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Stacks Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">What are Stacks?</h3>
                  <p className="text-gray-300 mb-6">
                    A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.
                    Elements are added and removed from the same end, called the "top" of the stack.
                    Think of it like a stack of plates - you can only add or remove from the top.
                  </p>

                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">📚</span>
                      <span><strong>LIFO Order:</strong> Last element added is first to be removed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">🎯</span>
                      <span><strong>Single Access Point:</strong> All operations happen at the top</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">⚡</span>
                      <span><strong>Efficient Operations:</strong> Push, pop, and peek are O(1)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">🏗️</span>
                      <span><strong>Simple Implementation:</strong> Can be built with arrays or linked lists</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-orange-400 mb-4">Basic Operations</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Push</h4>
                      <p className="text-gray-300">Add element to the top of stack</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>stack.push(5); // Add 5 to top</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Pop</h4>
                      <p className="text-gray-300">Remove and return top element</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>int val = stack.pop(); // Remove top element</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Peek/Top</h4>
                      <p className="text-gray-300">View top element without removing</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>int top = stack.peek(); // View top element</code>
                      </pre>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">isEmpty</h4>
                      <p className="text-gray-300">Check if stack is empty</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs mt-2">
                        <code>bool empty = stack.isEmpty();</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Time Complexity</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Push: O(1)</li>
                    <li>• Pop: O(1)</li>
                    <li>• Peek: O(1)</li>
                    <li>• Search: O(n)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">O(n) for storing elements</p>
                  <p className="text-sm text-gray-400 mt-2">Amortized for dynamic arrays</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Function call stack</li>
                    <li>• Expression evaluation</li>
                    <li>• Undo/redo operations</li>
                    <li>• Browser history</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementations Section */}
          {activeSection === "implementations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Stack Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {implementations.map((impl) => (
                  <div
                    key={impl.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{impl.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(impl.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-orange-900/50 text-orange-300 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{impl.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{impl.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Algorithms Section */}
          {activeSection === "algorithms" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Stack Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Time: {algorithm.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
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

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Stack Applications</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 transition-all duration-500 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-orange-400 mb-2">{app.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{app.description}</p>
                      <div className="bg-orange-900/20 border border-orange-700/50 p-3 rounded-lg">
                        <p className="text-orange-300 text-sm"><strong>Use Case:</strong> {app.useCase}</p>
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
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Stack Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement Stack using Queues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Valid Parentheses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Next Greater Element I</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Baseball Game</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Stack Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Min Stack</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Evaluate Reverse Polish Notation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Decode String</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Simplify Path</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Remove K Digits</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Stack Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Largest Rectangle in Histogram</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Maximal Rectangle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Trapping Rain Water</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Sliding Window Maximum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Basic Calculator III</span>
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

          {/* Stack Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Stack Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Push operation:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Pop operation:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Peek/Top operation:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Search operation:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Valid parentheses:</span>
                    <span className="text-green-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Next greater element:</span>
                    <span className="text-green-400 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Monotonic Stack:</div>
                    <div className="text-gray-400">Maintain increasing/decreasing order</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Two Stacks:</div>
                    <div className="text-gray-400">Implement queue, evaluate expressions</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Stack + Hash Map:</div>
                    <div className="text-gray-400">Track indices, frequencies, or mappings</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Recursive to Iterative:</div>
                    <div className="text-gray-400">Convert recursive solutions to stack-based</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Parentheses Matching:</div>
                    <div className="text-gray-400">Push opening, pop matching closing</div>
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

export default Stacks;

