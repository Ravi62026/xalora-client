import React, { useState } from "react";
import { Layout } from "../components";

const Queues = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Queue Implementations
  const implementations = [
    {
      id: "array-queue",
      name: "Array-Based Queue (Circular)",
      complexity: { enqueue: "O(1)", dequeue: "O(1)", peek: "O(1)", space: "O(n)" },
      description: "Queue implemented using circular array for efficient operations",
      code: `// Circular Array Queue implementation
class ArrayQueue {
private:
    std::vector<int> data;
    int front, rear, size, capacity;

public:
    ArrayQueue(int cap = 1000) : capacity(cap), front(0), size(0) {
        data.resize(capacity);
        rear = capacity - 1;
    }

    // Enqueue - O(1)
    void enqueue(int val) {
        if (isFull()) {
            throw std::overflow_error("Queue is full");
        }

        rear = (rear + 1) % capacity;
        data[rear] = val;
        size++;
    }

    // Dequeue - O(1)
    int dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }

        int val = data[front];
        front = (front + 1) % capacity;
        size--;
        return val;
    }

    // Peek front element - O(1)
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        return data[front];
    }

    // Check if empty - O(1)
    bool isEmpty() {
        return size == 0;
    }

    // Check if full - O(1)
    bool isFull() {
        return size == capacity;
    }

    // Get current size - O(1)
    int getSize() {
        return size;
    }
};`
    },
    {
      id: "linked-list-queue",
      name: "Linked List Queue",
      complexity: { enqueue: "O(1)", dequeue: "O(1)", peek: "O(1)", space: "O(n)" },
      description: "Queue implemented using linked list for dynamic sizing",
      code: `// Linked List Queue implementation
struct QueueNode {
    int data;
    QueueNode* next;

    QueueNode(int val) : data(val), next(nullptr) {}
};

class LinkedListQueue {
private:
    QueueNode* front;
    QueueNode* rear;
    int size;

public:
    LinkedListQueue() : front(nullptr), rear(nullptr), size(0) {}

    // Enqueue - O(1)
    void enqueue(int val) {
        QueueNode* newNode = new QueueNode(val);

        if (isEmpty()) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }

        size++;
    }

    // Dequeue - O(1)
    int dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }

        QueueNode* temp = front;
        int val = temp->data;

        front = front->next;

        if (front == nullptr) {
            rear = nullptr; // Queue became empty
        }

        delete temp;
        size--;
        return val;
    }

    // Peek front element - O(1)
    int peek() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        return front->data;
    }

    // Check if empty - O(1)
    bool isEmpty() {
        return front == nullptr;
    }

    // Get current size - O(1)
    int getSize() {
        return size;
    }
};`
    },
    {
      id: "deque",
      name: "Deque (Double-Ended Queue)",
      complexity: { push_front: "O(1)", push_back: "O(1)", pop_front: "O(1)", pop_back: "O(1)", space: "O(n)" },
      description: "Queue that allows insertion and deletion from both ends",
      code: `// Deque implementation using doubly linked list
struct DequeNode {
    int data;
    DequeNode* prev;
    DequeNode* next;

    DequeNode(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class Deque {
private:
    DequeNode* front;
    DequeNode* rear;
    int size;

public:
    Deque() : front(nullptr), rear(nullptr), size(0) {}

    // Push front - O(1)
    void pushFront(int val) {
        DequeNode* newNode = new DequeNode(val);

        if (isEmpty()) {
            front = rear = newNode;
        } else {
            newNode->next = front;
            front->prev = newNode;
            front = newNode;
        }

        size++;
    }

    // Push back - O(1)
    void pushBack(int val) {
        DequeNode* newNode = new DequeNode(val);

        if (isEmpty()) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            newNode->prev = rear;
            rear = newNode;
        }

        size++;
    }

    // Pop front - O(1)
    int popFront() {
        if (isEmpty()) {
            throw std::underflow_error("Deque is empty");
        }

        DequeNode* temp = front;
        int val = temp->data;

        front = front->next;

        if (front == nullptr) {
            rear = nullptr; // Deque became empty
        } else {
            front->prev = nullptr;
        }

        delete temp;
        size--;
        return val;
    }

    // Pop back - O(1)
    int popBack() {
        if (isEmpty()) {
            throw std::underflow_error("Deque is empty");
        }

        DequeNode* temp = rear;
        int val = temp->data;

        rear = rear->prev;

        if (rear == nullptr) {
            front = nullptr; // Deque became empty
        } else {
            rear->next = nullptr;
        }

        delete temp;
        size--;
        return val;
    }

    // Peek front/back - O(1)
    int peekFront() {
        if (isEmpty()) throw std::underflow_error("Deque is empty");
        return front->data;
    }

    int peekBack() {
        if (isEmpty()) throw std::underflow_error("Deque is empty");
        return rear->data;
    }

    bool isEmpty() { return size == 0; }
    int getSize() { return size; }
};`
    }
  ];

  // Queue Algorithms
  const algorithms = [
    {
      id: "sliding-window-maximum",
      name: "Sliding Window Maximum",
      complexity: { time: "O(n)", space: "O(k)" },
      description: "Find maximum in each sliding window of size k",
      code: `// Sliding Window Maximum using Deque - O(n) time
std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::vector<int> result;
    std::deque<int> dq; // Store indices

    for (int i = 0; i < nums.size(); i++) {
        // Remove elements outside current window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // Remove smaller elements from back
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }

        // Add current element
        dq.push_back(i);

        // Add maximum for current window
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}

// Example: nums = [1,3,-1,-3,5,3,6,7], k = 3
// Result: [3,3,5,5,6,7]`
    },
    {
      id: "first-negative",
      name: "First Negative in Window",
      complexity: { time: "O(n)", space: "O(k)" },
      description: "Find first negative number in each window of size k",
      code: `// First Negative in Every Window of Size K - O(n) time
std::vector<int> firstNegativeInWindow(const std::vector<int>& arr, int k) {
    std::vector<int> result;
    std::deque<int> dq; // Store indices of negative numbers

    for (int i = 0; i < arr.size(); i++) {
        // Remove elements outside current window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // Add current element if negative
        if (arr[i] < 0) {
            dq.push_back(i);
        }

        // Add result for current window
        if (i >= k - 1) {
            if (!dq.empty()) {
                result.push_back(arr[dq.front()]);
            } else {
                result.push_back(0); // No negative found
            }
        }
    }

    return result;
}

// Example: arr = [12, -1, -7, 8, -15, 30, 16, 28], k = 3
// Result: [-1, -1, -7, -15, -15, 0]`
    },
    {
      id: "generate-binary-numbers",
      name: "Generate Binary Numbers",
      complexity: { time: "O(n)", space: "O(n)" },
      description: "Generate first n binary numbers using queue",
      code: `// Generate First N Binary Numbers using Queue
std::vector<std::string> generateBinaryNumbers(int n) {
    std::vector<std::string> result;
    std::queue<std::string> q;

    // Start with "1"
    q.push("1");

    for (int i = 0; i < n; i++) {
        // Get front element
        std::string curr = q.front();
        q.pop();

        result.push_back(curr);

        // Add "0" and "1" to current number
        q.push(curr + "0");
        q.push(curr + "1");
    }

    return result;
}

// Example: n = 5
// Result: ["1", "10", "11", "100", "101"]

// Alternative: Generate numbers from 1 to n, convert to binary
std::vector<std::string> generateBinaryNumbersAlt(int n) {
    std::vector<std::string> result;

    for (int i = 1; i <= n; i++) {
        std::string binary = "";
        int num = i;

        while (num > 0) {
            binary = std::to_string(num % 2) + binary;
            num /= 2;
        }

        result.push_back(binary);
    }

    return result;
}`
    },
    {
      id: "rotting-oranges",
      name: "Rotting Oranges (BFS)",
      complexity: { time: "O(rows × cols)", space: "O(rows × cols)" },
      description: "Find minimum time for all oranges to rot using BFS",
      code: `// Rotting Oranges using BFS - O(R*C) time
int orangesRotting(std::vector<std::vector<int>>& grid) {
    int rows = grid.size();
    int cols = grid[0].size();

    std::queue<std::pair<int, int>> q;
    int freshOranges = 0;
    int time = 0;

    // Find all rotten oranges and count fresh ones
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == 2) {
                q.push({i, j});
            } else if (grid[i][j] == 1) {
                freshOranges++;
            }
        }
    }

    // Directions for adjacent cells
    std::vector<std::pair<int, int>> directions = {
        {-1, 0}, {1, 0}, {0, -1}, {0, 1}
    };

    // BFS to rot adjacent fresh oranges
    while (!q.empty() && freshOranges > 0) {
        int size = q.size();
        time++;

        for (int i = 0; i < size; i++) {
            auto [row, col] = q.front();
            q.pop();

            // Check all adjacent cells
            for (auto& dir : directions) {
                int newRow = row + dir.first;
                int newCol = col + dir.second;

                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] == 1) {

                    grid[newRow][newCol] = 2; // Rot the orange
                    freshOranges--;
                    q.push({newRow, newCol});
                }
            }
        }
    }

    return freshOranges == 0 ? time : -1;
}

// Example grid:
// [[2,1,1],  →  [[2,2,1],
//  [1,1,0],       [2,2,0],
//  [0,1,1]]       [0,1,1]]
// Time: 4`
    }
  ];

  // Queue Applications
  const applications = [
    {
      id: "breadth-first-search",
      name: "Breadth-First Search (BFS)",
      description: "Level-order traversal in graphs and trees",
      useCase: "Finding shortest path, web crawling"
    },
    {
      id: "task-scheduling",
      name: "Task Scheduling",
      description: "Process tasks in order of arrival",
      useCase: "CPU scheduling, printer queues"
    },
    {
      id: "buffer-management",
      name: "Buffer Management",
      description: "Handle data streams and buffering",
      useCase: "Network packets, audio/video streaming"
    },
    {
      id: "cache-replacement",
      name: "Cache Replacement",
      description: "Implement FIFO cache replacement policy",
      useCase: "Memory management, database caching"
    },
    {
      id: "message-queues",
      name: "Message Queues",
      description: "Asynchronous communication between systems",
      useCase: "Distributed systems, microservices"
    },
    {
      id: "sliding-window",
      name: "Sliding Window Problems",
      description: "Process elements in moving windows",
      useCase: "Array problems, network protocols"
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Implement Queue using Stacks",
      difficulty: "Easy",
      description: "Implement queue operations using two stacks",
      hint: "Use one stack for enqueue, another for dequeue"
    },
    {
      name: "Sliding Window Maximum",
      difficulty: "Hard",
      description: "Find maximum in each sliding window",
      hint: "Use deque to maintain decreasing order"
    },
    {
      name: "Rotting Oranges",
      difficulty: "Medium",
      description: "Find time for all oranges to rot",
      hint: "Multi-source BFS starting from rotten oranges"
    },
    {
      name: "First Unique Character in String",
      difficulty: "Easy",
      description: "Find first non-repeating character",
      hint: "Use queue to maintain order, hash map for frequency"
    },
    {
      name: "Number of Islands",
      difficulty: "Medium",
      description: "Count connected components in grid",
      hint: "BFS or DFS from each unvisited land cell"
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
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Queues
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master First-In-First-Out (FIFO) data structures and their powerful algorithms for efficient processing.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("theory")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "theory"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Theory
            </button>
            <button
              onClick={() => setActiveSection("implementations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementations"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Implementations
            </button>
            <button
              onClick={() => setActiveSection("algorithms")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "algorithms"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Algorithms
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Theory Section */}
          {activeSection === "theory" && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Queue Theory & Mathematical Foundations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* FIFO Principle & Abstract Data Type */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6">FIFO Principle & Abstract Data Type</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">FIFO (First-In-First-Out) Semantics</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Queue operations follow strict temporal ordering based on arrival time:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">⏰</span>
                              <span><strong>Temporal Ordering:</strong> First element added is first to be removed</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">📅</span>
                              <span><strong>Arrival-based Priority:</strong> Age determines access order</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">🎯</span>
                              <span><strong>Two Access Points:</strong> Insertion at rear, removal from front</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Abstract Data Type Definition</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Queue as an ADT with well-defined interface:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">🔧</span>
                              <span><strong>Operations:</strong> enqueue, dequeue, peek, isEmpty, size</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">📋</span>
                              <span><strong>Contract:</strong> Well-defined behavior for each operation</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-amber-700 mr-2">🔒</span>
                              <span><strong>Encapsulation:</strong> Implementation details hidden</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-semibold text-amber-700 mb-4">Queue Invariants</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="text-green-700 font-medium mb-2">✅ Always True</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Front element is oldest (first enqueued)</li>
                            <li>• Rear element is newest (last enqueued)</li>
                            <li>• Size reflects number of elements</li>
                            <li>• Operations maintain FIFO order</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="text-red-700 font-medium mb-2">❌ Never True</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Random access to middle elements</li>
                            <li>• Dequeue from empty queue</li>
                            <li>• Peek on empty queue</li>
                            <li>• LIFO behavior</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue vs Other ADTs */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6">Queue vs Other Abstract Data Types</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="pb-4 text-gray-700 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-amber-700 text-lg font-bold">Queue (FIFO)</th>
                            <th className="pb-4 text-orange-700 text-lg font-bold">Stack (LIFO)</th>
                            <th className="pb-4 text-purple-700 text-lg font-bold">Deque</th>
                            <th className="pb-4 text-indigo-600 text-lg font-bold">Priority Queue</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-900 font-medium">Access Pattern</td>
                            <td className="py-4 text-amber-700 font-medium">Oldest first</td>
                            <td className="py-4 text-orange-700 font-medium">Most recent only</td>
                            <td className="py-4 text-purple-700 font-medium">Both ends</td>
                            <td className="py-4 text-blue-700 font-medium">Highest priority</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-900 font-medium">Ordering</td>
                            <td className="py-4 text-amber-700 font-medium">Temporal (arrival)</td>
                            <td className="py-4 text-orange-700 font-medium">Temporal (time-based)</td>
                            <td className="py-4 text-purple-700 font-medium">User controlled</td>
                            <td className="py-4 text-blue-700 font-medium">Priority-based</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-900 font-medium">Use Cases</td>
                            <td className="py-4 text-amber-700 font-medium">BFS, scheduling</td>
                            <td className="py-4 text-orange-700 font-medium">Function calls, undo</td>
                            <td className="py-4 text-purple-700 font-medium">Sliding windows</td>
                            <td className="py-4 text-blue-700 font-medium">Task priority</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-900 font-medium">Operations</td>
                            <td className="py-4 text-amber-700 font-medium">Enqueue, dequeue</td>
                            <td className="py-4 text-orange-700 font-medium">Push, pop</td>
                            <td className="py-4 text-purple-700 font-medium">Push/pop both ends</td>
                            <td className="py-4 text-blue-700 font-medium">Insert, extract-max</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 text-gray-900 font-medium">Complexity</td>
                            <td className="py-4 text-green-700 font-medium">All O(1)</td>
                            <td className="py-4 text-green-700 font-medium">All O(1)</td>
                            <td className="py-4 text-green-700 font-medium">All O(1)</td>
                            <td className="py-4 text-amber-700 font-medium">O(log n)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Queue in Computer Science */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6">Queue in Computer Science Theory</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Breadth-First Search (BFS)</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Level-Order Traversal</h5>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• Processes nodes level by level</li>
                              <li>• Shortest path in unweighted graphs</li>
                              <li>• Uses queue to maintain processing order</li>
                              <li>• O(V + E) time complexity</li>
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Graph Algorithms</h5>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• Finding shortest paths</li>
                              <li>• Connected components</li>
                              <li>• Web crawling algorithms</li>
                              <li>• Social network analysis</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Operating System Concepts</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-orange-700 font-medium mb-2">Process Scheduling</h5>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• First-Come-First-Served (FCFS)</li>
                              <li>• Round Robin scheduling</li>
                              <li>• Print job queues</li>
                              <li>• CPU task management</li>
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-orange-700 font-medium mb-2">I/O Buffer Management</h5>
                            <ul className="text-gray-700 text-sm space-y-1">
                              <li>• Keyboard input buffering</li>
                              <li>• Network packet queues</li>
                              <li>• Disk I/O scheduling</li>
                              <li>• Producer-consumer problems</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-semibold text-amber-700 mb-4">Queue-Based Data Structures</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-indigo-600 font-medium mb-3">Priority Queues</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Elements have priorities</li>
                            <li>• Highest priority served first</li>
                            <li>• Implemented with heaps</li>
                            <li>• Dijkstra's algorithm</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-indigo-600 font-medium mb-3">Circular Queues</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Fixed-size circular buffer</li>
                            <li>• Wrap-around indexing</li>
                            <li>• No wasted space</li>
                            <li>• Clock algorithms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Analysis */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6">Mathematical Analysis of Queue Operations</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Time Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-green-700 font-medium mb-2">Enqueue/Dequeue: O(1)</h5>
                            <div className="text-gray-700 text-sm space-y-2">
                              <p><strong>Constant Time Operations:</strong></p>
                              <p>• Direct pointer manipulation</p>
                              <p>• No traversal required</p>
                              <p>• Front and rear pointers maintained</p>
                              <p>• Independent of queue size</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-amber-700 font-medium mb-2">Search Operation: O(n)</h5>
                            <div className="text-gray-700 text-sm space-y-2">
                              <p><strong>Linear Traversal Required:</strong></p>
                              <p>• Must examine all elements</p>
                              <p>• No random access capability</p>
                              <p>• Front-to-rear sequential search</p>
                              <p>• Worst case: element not found</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Space Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-indigo-600 font-medium mb-2">Circular Array: O(n)</h5>
                            <div className="text-gray-700 text-sm space-y-2">
                              <p><strong>Fixed Space Allocation:</strong></p>
                              <p>• Pre-allocated array of size n</p>
                              <p>• No per-element overhead</p>
                              <p>• Efficient for known maximum sizes</p>
                              <p>• Potential space waste</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Linked List: O(n)</h5>
                            <div className="text-gray-700 text-sm space-y-2">
                              <p><strong>Dynamic Space Usage:</strong></p>
                              <p>• Per-element pointer overhead</p>
                              <p>• Dynamic memory allocation</p>
                              <p>• No size restrictions</p>
                              <p>• Memory fragmentation possible</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-semibold text-amber-700 mb-4">Queue Properties & Theorems</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg mb-2">FIFO Property</div>
                          <div className="text-gray-700 text-sm">First in, first out ordering</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-lg mb-2">Bounded Capacity</div>
                          <div className="text-gray-700 text-sm">Maximum size constraints</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold text-lg mb-2">Sequential Access</div>
                          <div className="text-gray-700 text-sm">Front and rear operations only</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Queue in Algorithm Design */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-indigo-600 mb-6">Queue in Algorithm Design & Analysis</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Algorithmic Paradigms</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Breadth-First Search</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• Level-order graph/tree traversal</p>
                              <p>• Shortest path in unweighted graphs</p>
                              <p>• Finding connected components</p>
                              <p>• O(V + E) time complexity</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Sliding Window Techniques</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• Deque for monotonic queues</p>
                              <p>• Maximum in sliding windows</p>
                              <p>• O(n) time for array problems</p>
                              <p>• Used in string matching</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-purple-700 font-medium mb-2">Multi-source BFS</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• Multiple starting points</p>
                              <p>• Minimum time problems</p>
                              <p>• Rotting oranges, shortest bridge</p>
                              <p>• Distance calculations</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-indigo-600 mb-4">Advanced Applications</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-orange-700 font-medium mb-2">Task Scheduling</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• CPU job scheduling</p>
                              <p>• Print queue management</p>
                              <p>• Network packet routing</p>
                              <p>• Operating system kernels</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-orange-700 font-medium mb-2">Cache Replacement</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• FIFO cache policy</p>
                              <p>• Page replacement algorithms</p>
                              <p>• Memory management</p>
                              <p>• Database buffer pools</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="text-orange-700 font-medium mb-2">Message Passing</h5>
                            <div className="text-gray-700 text-sm">
                              <p>• Asynchronous communication</p>
                              <p>• Producer-consumer patterns</p>
                              <p>• Thread-safe data sharing</p>
                              <p>• Inter-process communication</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-xl font-semibold text-green-700 mb-4">Why Queues are Fundamental</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-indigo-600 font-medium mb-3">Algorithmic Foundations</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Graph traversal algorithms</li>
                            <li>• Shortest path problems</li>
                            <li>• Level-order processing</li>
                            <li>• Breadth-first paradigms</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-indigo-600 font-medium mb-3">System Design</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• Operating system scheduling</li>
                            <li>• Network buffer management</li>
                            <li>• Asynchronous processing</li>
                            <li>• Load balancing systems</li>
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Queues Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">What are Queues?</h3>
                  <p className="text-gray-700 mb-6">
                    A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.
                    Elements are added at the rear (enqueue) and removed from the front (dequeue).
                    Think of it like a line at a ticket counter - first person in line gets served first.
                  </p>

                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">📋</span>
                      <span><strong>FIFO Order:</strong> First element added is first to be removed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">🔄</span>
                      <span><strong>Two Operations:</strong> Enqueue (add) and dequeue (remove)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">⚡</span>
                      <span><strong>Efficient Operations:</strong> O(1) for both ends in linked list implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">🎯</span>
                      <span><strong>Sequential Access:</strong> Only front and rear elements accessible</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Basic Operations</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">Enqueue</h4>
                      <p className="text-gray-700">Add element to the rear of queue</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2 border border-gray-700">
                        <code>queue.enqueue(5); // Add 5 to rear</code>
                      </pre>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">Dequeue</h4>
                      <p className="text-gray-700">Remove and return front element</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2 border border-gray-700">
                        <code>int val = queue.dequeue(); // Remove front</code>
                      </pre>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">Peek/Front</h4>
                      <p className="text-gray-700">View front element without removing</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2 border border-gray-700">
                        <code>int front = queue.peek(); // View front</code>
                      </pre>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-indigo-600 mb-2">isEmpty</h4>
                      <p className="text-gray-700">Check if queue is empty</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2 border border-gray-700">
                        <code>bool empty = queue.isEmpty();</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-amber-700 mb-3">Time Complexity</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Enqueue: O(1)</li>
                    <li>• Dequeue: O(1)</li>
                    <li>• Peek: O(1)</li>
                    <li>• Search: O(n)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-3">Space Complexity</h4>
                  <p className="text-gray-700">O(n) for storing elements</p>
                  <p className="text-sm text-gray-600 mt-2">Fixed or dynamic sizing</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-700 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• BFS traversal</li>
                    <li>• Task scheduling</li>
                    <li>• Message queues</li>
                    <li>• Cache replacement</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementations Section */}
          {activeSection === "implementations" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Queue Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {implementations.map((impl) => (
                  <div
                    key={impl.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{impl.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(impl.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6">{impl.description}</p>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-indigo-600 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Queue Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-sm rounded-lg">
                            Time: {algorithm.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-sm rounded-lg">
                            Space: {algorithm.complexity.space}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-indigo-600 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Queue Applications</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-indigo-600 mb-2">{app.name}</h3>
                      <p className="text-gray-700 text-sm mb-3">{app.description}</p>
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <p className="text-amber-700 text-sm"><strong>Use Case:</strong> {app.useCase}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border border-gray-600">
                <h3 className="text-xl font-semibold text-green-700 mb-3">🟢 Easy Queue Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-700 mr-2">•</span>
                    <span>Implement Queue using Stacks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-700 mr-2">•</span>
                    <span>First Unique Character in String</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-700 mr-2">•</span>
                    <span>Number of Students Unable to Eat Lunch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-700 mr-2">•</span>
                    <span>Time Needed to Buy Tickets</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border border-gray-600">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">🟡 Medium Queue Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span>Rotting Oranges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span>Open the Lock</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span>Perfect Squares</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span>Word Ladder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span>Surrounded Regions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border border-gray-600">
                <h3 className="text-xl font-semibold text-red-700 mb-3">🔴 Hard Queue Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2">•</span>
                    <span>Sliding Window Maximum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2">•</span>
                    <span>Minimum Window Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2">•</span>
                    <span>Course Schedule II</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2">•</span>
                    <span>Bus Routes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2">•</span>
                    <span>Shortest Path in Binary Matrix</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewProblems.map((problem, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-indigo-600 font-semibold">{problem.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{problem.description}</p>
                    <p className="text-xs text-gray-600 italic">{problem.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Queue Cheat Sheet */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Queue Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-amber-700 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">Enqueue operation:</span>
                    <span className="text-green-700 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">Dequeue operation:</span>
                    <span className="text-green-700 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">Peek/Front operation:</span>
                    <span className="text-green-700 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">Search operation:</span>
                    <span className="text-amber-700 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">BFS traversal:</span>
                    <span className="text-green-700 font-mono">O(V + E)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-700">Sliding window:</span>
                    <span className="text-green-700 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-amber-700 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-indigo-600 font-medium mb-1">Level-Order Traversal:</div>
                    <div className="text-gray-600">Process nodes level by level</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-indigo-600 font-medium mb-1">Monotonic Queue:</div>
                    <div className="text-gray-600">Maintain increasing/decreasing order</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-indigo-600 font-medium mb-1">BFS Implementation:</div>
                    <div className="text-gray-600">Shortest path in unweighted graphs</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-indigo-600 font-medium mb-1">Producer-Consumer:</div>
                    <div className="text-gray-600">Thread-safe data sharing pattern</div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-indigo-600 font-medium mb-1">Circular Buffer:</div>
                    <div className="text-gray-600">Fixed-size queue with wrap-around</div>
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

export default Queues;

