import React, { useState } from "react";
import { Layout } from "../components";

const LinkedLists = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Linked List Types
  const listTypes = [
    {
      id: "singly",
      name: "Singly Linked List",
      description: "Each node points to the next node in sequence",
      complexity: { access: "O(n)", insert_head: "O(1)", insert_tail: "O(n)", delete_head: "O(1)", delete_tail: "O(n)" },
      code: `// Singly Linked List Node
struct Node {
    int data;
    Node* next;

    Node(int val) : data(val), next(nullptr) {}
};

// Singly Linked List Class
class SinglyLinkedList {
private:
    Node* head;
    int size;

public:
    SinglyLinkedList() : head(nullptr), size(0) {}

    // Insert at head - O(1)
    void insertAtHead(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
        size++;
    }

    // Insert at tail - O(n)
    void insertAtTail(int val) {
        if (!head) {
            insertAtHead(val);
            return;
        }

        Node* temp = head;
        while (temp->next) {
            temp = temp->next;
        }

        temp->next = new Node(val);
        size++;
    }

    // Delete from head - O(1)
    void deleteFromHead() {
        if (!head) return;

        Node* temp = head;
        head = head->next;
        delete temp;
        size--;
    }

    // Print list - O(n)
    void print() {
        Node* temp = head;
        while (temp) {
            std::cout << temp->data << " -> ";
            temp = temp->next;
        }
        std::cout << "NULL" << std::endl;
    }
};`
    },
    {
      id: "doubly",
      name: "Doubly Linked List",
      description: "Each node has pointers to both previous and next nodes",
      complexity: { access: "O(n)", insert_head: "O(1)", insert_tail: "O(1)", delete_head: "O(1)", delete_tail: "O(1)" },
      code: `// Doubly Linked List Node
struct DoublyNode {
    int data;
    DoublyNode* prev;
    DoublyNode* next;

    DoublyNode(int val) : data(val), prev(nullptr), next(nullptr) {}
};

// Doubly Linked List Class
class DoublyLinkedList {
private:
    DoublyNode* head;
    DoublyNode* tail;
    int size;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}

    // Insert at head - O(1)
    void insertAtHead(int val) {
        DoublyNode* newNode = new DoublyNode(val);

        if (!head) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        size++;
    }

    // Insert at tail - O(1)
    void insertAtTail(int val) {
        DoublyNode* newNode = new DoublyNode(val);

        if (!tail) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        size++;
    }

    // Delete from head - O(1)
    void deleteFromHead() {
        if (!head) return;

        DoublyNode* temp = head;
        head = head->next;

        if (head) {
            head->prev = nullptr;
        } else {
            tail = nullptr;
        }

        delete temp;
        size--;
    }

    // Delete from tail - O(1)
    void deleteFromTail() {
        if (!tail) return;

        DoublyNode* temp = tail;
        tail = tail->prev;

        if (tail) {
            tail->next = nullptr;
        } else {
            head = nullptr;
        }

        delete temp;
        size--;
    }
};`
    },
    {
      id: "circular",
      name: "Circular Linked List",
      description: "Last node points back to the first node, forming a circle",
      complexity: { access: "O(n)", insert_head: "O(1)", insert_tail: "O(1)", delete_head: "O(1)", delete_tail: "O(1)" },
      code: `// Circular Linked List
class CircularLinkedList {
private:
    Node* head;
    int size;

public:
    CircularLinkedList() : head(nullptr), size(0) {}

    // Insert at head - O(1)
    void insertAtHead(int val) {
        Node* newNode = new Node(val);

        if (!head) {
            head = newNode;
            head->next = head; // Point to itself
        } else {
            Node* temp = head;
            while (temp->next != head) {
                temp = temp->next;
            }
            temp->next = newNode;
            newNode->next = head;
            head = newNode;
        }
        size++;
    }

    // Insert at tail - O(1) with tail pointer
    void insertAtTail(int val) {
        insertAtHead(val);
        head = head->next; // Rotate to keep head at beginning
    }

    // Delete from head - O(1)
    void deleteFromHead() {
        if (!head) return;

        if (head->next == head) {
            delete head;
            head = nullptr;
        } else {
            Node* temp = head;
            while (temp->next != head) {
                temp = temp->next;
            }
            temp->next = head->next;
            delete head;
            head = temp->next;
        }
        size--;
    }
};`
    }
  ];

  // Linked List Algorithms
  const algorithms = [
    {
      id: "reverse",
      name: "Reverse Linked List",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Reverse the direction of links in a linked list",
      code: `// Reverse singly linked list - Iterative - O(n) time, O(1) space
Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    Node* next = nullptr;

    while (curr) {
        next = curr->next;  // Store next node
        curr->next = prev;  // Reverse current node's pointer
        prev = curr;        // Move pointers one position ahead
        curr = next;
    }

    return prev; // New head
}

// Recursive reverse
Node* reverseListRecursive(Node* head) {
    // Base case
    if (!head || !head->next) {
        return head;
    }

    // Reverse rest of the list
    Node* rest = reverseListRecursive(head->next);

    // Put first element at the end
    head->next->next = head;
    head->next = nullptr;

    return rest;
}`
    },
    {
      id: "cycle-detection",
      name: "Cycle Detection (Floyd's Tortoise and Hare)",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Detect if a linked list has a cycle using two pointers",
      code: `// Floyd's Cycle Detection Algorithm - O(n) time, O(1) space
bool hasCycle(Node* head) {
    if (!head || !head->next) return false;

    Node* slow = head;
    Node* fast = head;

    while (fast && fast->next) {
        slow = slow->next;           // Move slow by 1
        fast = fast->next->next;     // Move fast by 2

        if (slow == fast) {          // Cycle detected
            return true;
        }
    }

    return false;
}

// Find cycle start node
Node* detectCycle(Node* head) {
    if (!head || !head->next) return nullptr;

    Node* slow = head;
    Node* fast = head;

    // Find meeting point
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;

        if (slow == fast) break;
    }

    if (!fast || !fast->next) return nullptr; // No cycle

    // Reset slow to head, keep fast at meeting point
    slow = head;

    // Move both at same speed
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }

    return slow; // Cycle start
}`
    },
    {
      id: "merge-two-sorted",
      name: "Merge Two Sorted Linked Lists",
      complexity: { time: "O(m + n)", space: "O(1)" },
      description: "Merge two sorted linked lists into one sorted list",
      code: `// Merge two sorted linked lists - O(m + n) time, O(1) space
Node* mergeTwoLists(Node* list1, Node* list2) {
    // Dummy node to handle edge cases
    Node* dummy = new Node(0);
    Node* curr = dummy;

    while (list1 && list2) {
        if (list1->data <= list2->data) {
            curr->next = list1;
            list1 = list1->next;
        } else {
            curr->next = list2;
            list2 = list2->next;
        }
        curr = curr->next;
    }

    // Attach remaining nodes
    if (list1) curr->next = list1;
    if (list2) curr->next = list2;

    Node* result = dummy->next;
    delete dummy;
    return result;
}

// Recursive merge
Node* mergeTwoListsRecursive(Node* list1, Node* list2) {
    if (!list1) return list2;
    if (!list2) return list1;

    if (list1->data <= list2->data) {
        list1->next = mergeTwoListsRecursive(list1->next, list2);
        return list1;
    } else {
        list2->next = mergeTwoListsRecursive(list1, list2->next);
        return list2;
    }
}`
    },
    {
      id: "remove-nth-from-end",
      name: "Remove Nth Node From End",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Remove the nth node from the end of a linked list",
      code: `// Remove Nth node from end - O(n) time, O(1) space
Node* removeNthFromEnd(Node* head, int n) {
    // Dummy node to handle edge cases
    Node* dummy = new Node(0);
    dummy->next = head;

    Node* fast = dummy;
    Node* slow = dummy;

    // Move fast pointer n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        if (!fast) return head; // n is larger than list length
        fast = fast->next;
    }

    // Move both pointers until fast reaches end
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }

    // Remove the nth node from end
    Node* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;

    return dummy->next;
}`
    },
    {
      id: "intersection",
      name: "Find Intersection Point",
      complexity: { time: "O(m + n)", space: "O(1)" },
      description: "Find the intersection point of two linked lists",
      code: `// Find intersection point of two linked lists - O(m + n) time, O(1) space
Node* getIntersectionNode(Node* headA, Node* headB) {
    if (!headA || !headB) return nullptr;

    Node* ptrA = headA;
    Node* ptrB = headB;

    // Traverse both lists
    while (ptrA != ptrB) {
        ptrA = ptrA ? ptrA->next : headB;
        ptrB = ptrB ? ptrB->next : headA;
    }

    return ptrA; // Intersection point or nullptr
}

// Using hash set - O(m + n) time, O(m) space
Node* getIntersectionNodeHash(Node* headA, Node* headB) {
    std::unordered_set<Node*> nodes;

    // Store all nodes of list A
    Node* curr = headA;
    while (curr) {
        nodes.insert(curr);
        curr = curr->next;
    }

    // Check for intersection in list B
    curr = headB;
    while (curr) {
        if (nodes.find(curr) != nodes.end()) {
            return curr;
        }
        curr = curr->next;
    }

    return nullptr;
}`
    }
  ];

  // Advanced Problems
  const advancedProblems = [
    {
      id: "palindrome",
      name: "Palindrome Linked List",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Check if a linked list is a palindrome",
      code: `// Check if linked list is palindrome - O(n) time, O(1) space
bool isPalindrome(Node* head) {
    if (!head || !head->next) return true;

    // Find middle of the list
    Node* slow = head;
    Node* fast = head;

    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    // Reverse second half
    Node* secondHalf = reverseList(slow->next);
    Node* firstHalf = head;

    // Compare first and second half
    Node* secondHalfCopy = secondHalf;
    bool result = true;

    while (secondHalf) {
        if (firstHalf->data != secondHalf->data) {
            result = false;
            break;
        }
        firstHalf = firstHalf->next;
        secondHalf = secondHalf->next;
    }

    // Restore the list (optional)
    slow->next = reverseList(secondHalfCopy);

    return result;
}`
    },
    {
      id: "reorder-list",
      name: "Reorder List",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Reorder list as L0→Ln→L1→Ln-1→L2→Ln-2→...",
      code: `// Reorder list - O(n) time, O(1) space
void reorderList(Node* head) {
    if (!head || !head->next) return;

    // Find middle of the list
    Node* slow = head;
    Node* fast = head;

    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    // Reverse second half
    Node* secondHalf = reverseList(slow->next);
    slow->next = nullptr; // Split the list

    // Merge two halves
    Node* firstHalf = head;
    Node* curr = head;

    while (secondHalf) {
        Node* temp1 = firstHalf->next;
        Node* temp2 = secondHalf->next;

        curr->next = secondHalf;
        curr = curr->next;
        curr->next = temp1;
        curr = curr->next;

        firstHalf = temp1;
        secondHalf = temp2;
    }
}`
    },
    {
      id: "flatten-multilevel",
      name: "Flatten Multilevel Doubly Linked List",
      complexity: { time: "O(n)", space: "O(1)" },
      description: "Flatten a multilevel doubly linked list",
      code: `// Flatten multilevel doubly linked list
class MultilevelNode {
public:
    int val;
    MultilevelNode* prev;
    MultilevelNode* next;
    MultilevelNode* child;
};

MultilevelNode* flatten(MultilevelNode* head) {
    if (!head) return head;

    MultilevelNode* curr = head;

    while (curr) {
        if (curr->child) {
            // Find the end of child list
            MultilevelNode* childEnd = curr->child;
            while (childEnd->next) {
                childEnd = childEnd->next;
            }

            // Connect child list
            childEnd->next = curr->next;
            if (curr->next) {
                curr->next->prev = childEnd;
            }

            // Connect to current node
            curr->next = curr->child;
            curr->child->prev = curr;
            curr->child = nullptr;
        }
        curr = curr->next;
    }

    return head;
}`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Reverse Linked List",
      difficulty: "Easy",
      description: "Reverse a singly linked list",
      hint: "Iterative or recursive approach, track prev/curr/next pointers"
    },
    {
      name: "Merge Two Sorted Lists",
      difficulty: "Easy",
      description: "Merge two sorted linked lists",
      hint: "Use dummy node, compare values and build new list"
    },
    {
      name: "Linked List Cycle",
      difficulty: "Easy",
      description: "Determine if linked list has a cycle",
      hint: "Floyd's tortoise and hare algorithm"
    },
    {
      name: "Remove Nth Node From End",
      difficulty: "Medium",
      description: "Remove nth node from end of list",
      hint: "Two pointers - fast and slow"
    },
    {
      name: "Reorder List",
      difficulty: "Medium",
      description: "Reorder list: L0→Ln→L1→Ln-1→...",
      hint: "Find middle, reverse second half, merge"
    },
    {
      name: "Copy List with Random Pointer",
      difficulty: "Medium",
      description: "Deep copy list with random pointers",
      hint: "Hash map or interweave nodes approach"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Linked Lists
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master dynamic data structures with flexible memory allocation and efficient insertions/deletions.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("theory")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "theory"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Theory
            </button>
            <button
              onClick={() => setActiveSection("types")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "types"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              List Types
            </button>
            <button
              onClick={() => setActiveSection("algorithms")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "algorithms"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Algorithms
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "advanced"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Theory Section */}
          {activeSection === "theory" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Linked List Theory & Deep Concepts</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Memory Layout & Pointer Overhead */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">Memory Layout & Pointer Overhead</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Scattered Memory Allocation</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Linked lists allocate memory dynamically across the heap:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">🔗</span>
                              <span><strong>Non-contiguous:</strong> Nodes scattered across memory addresses</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">📍</span>
                              <span><strong>Dynamic Allocation:</strong> malloc/new for each node</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2">🎯</span>
                              <span><strong>Fragmentation:</strong> Memory holes from deallocation patterns</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Pointer Overhead Analysis</h4>
                        <div className="space-y-4 text-gray-300">
                          <p>
                            Each node carries pointer overhead:
                          </p>
                          <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">📏</span>
                              <span><strong>Singly Linked:</strong> 1 pointer (8 bytes on 64-bit)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">🔄</span>
                              <span><strong>Doubly Linked:</strong> 2 pointers (16 bytes on 64-bit)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">📊</span>
                              <span><strong>Space Usage:</strong> (data + pointers) × n nodes</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Cache Performance Issues</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-red-400 font-medium mb-2">❌ Poor Spatial Locality</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Nodes scattered in memory</li>
                            <li>• Cache misses on traversal</li>
                            <li>• Prefetcher ineffective</li>
                            <li>• Poor branch prediction</li>
                          </ul>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-green-400 font-medium mb-2">✅ Sequential Access Benefits</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Predictable access pattern</li>
                            <li>• Good for streaming data</li>
                            <li>• Iterator-based algorithms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked List vs Arrays Comparison */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">Linked Lists vs Arrays: Theoretical Comparison</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Characteristic</th>
                            <th className="pb-4 text-blue-400 text-lg font-bold">Arrays</th>
                            <th className="pb-4 text-green-400 text-lg font-bold">Linked Lists</th>
                            <th className="pb-4 text-purple-400 text-lg font-bold">When to Choose</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Memory Layout</td>
                            <td className="py-4 text-blue-400 font-medium">Contiguous blocks</td>
                            <td className="py-4 text-green-400 font-medium">Scattered nodes</td>
                            <td className="py-4 text-purple-400 font-medium">Arrays for cache performance</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Size Flexibility</td>
                            <td className="py-4 text-red-400 font-medium">Fixed/static</td>
                            <td className="py-4 text-green-400 font-medium">Dynamic</td>
                            <td className="py-4 text-purple-400 font-medium">Lists for variable sizes</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Access Pattern</td>
                            <td className="py-4 text-green-400 font-medium">Random access</td>
                            <td className="py-4 text-red-400 font-medium">Sequential only</td>
                            <td className="py-4 text-purple-400 font-medium">Arrays for indexed access</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Insert/Delete</td>
                            <td className="py-4 text-red-400 font-medium">O(n) worst case</td>
                            <td className="py-4 text-green-400 font-medium">O(1) with pointer</td>
                            <td className="py-4 text-purple-400 font-medium">Lists for frequent mutations</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Memory Overhead</td>
                            <td className="py-4 text-green-400 font-medium">None</td>
                            <td className="py-4 text-red-400 font-medium">High (pointers)</td>
                            <td className="py-4 text-purple-400 font-medium">Arrays for memory efficiency</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Cache Performance</td>
                            <td className="py-4 text-green-400 font-medium">Excellent</td>
                            <td className="py-4 text-red-400 font-medium">Poor</td>
                            <td className="py-4 text-purple-400 font-medium">Arrays for performance</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-green-400 transition-all duration-300">Use Cases</td>
                            <td className="py-4 text-blue-400 font-medium">Static data, matrices</td>
                            <td className="py-4 text-green-400 font-medium">Dynamic lists, stacks</td>
                            <td className="py-4 text-purple-400 font-medium">Choose based on access patterns</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Linked List Variants Analysis */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">Linked List Variants: Theoretical Analysis</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Singly Linked Lists</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Advantages</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Minimal memory overhead (1 pointer per node)</li>
                              <li>• Simple implementation</li>
                              <li>• Efficient for stack operations</li>
                              <li>• Good for forward iteration only</li>
                            </ul>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-red-400 font-medium mb-2">Limitations</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• No backward traversal</li>
                              <li>• O(n) access to arbitrary positions</li>
                              <li>• Cannot efficiently remove last element</li>
                              <li>• No efficient reverse iteration</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Doubly Linked Lists</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Advantages</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Bidirectional traversal</li>
                              <li>• Efficient deletion of known nodes</li>
                              <li>• Can implement deque efficiently</li>
                              <li>• Better for complex data structures</li>
                            </ul>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-red-400 font-medium mb-2">Trade-offs</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Higher memory overhead (2 pointers)</li>
                              <li>• More complex pointer management</li>
                              <li>• Additional book-keeping required</li>
                              <li>• Slightly slower insertions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Circular Linked Lists</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Advantages</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Endless traversal capability</li>
                            <li>• Efficient for circular buffers</li>
                            <li>• No null pointer checks needed</li>
                            <li>• Good for round-robin scheduling</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Use Cases</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• CPU scheduling algorithms</li>
                            <li>• Music playlist (repeat)</li>
                            <li>• Token ring networks</li>
                            <li>• Circular buffer implementations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Analysis */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">Mathematical Analysis of Linked List Operations</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Time Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-green-400 font-medium mb-2">Head Operations: O(1)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Mathematical Basis:</strong></p>
                              <p>• Direct pointer manipulation</p>
                              <p>• No traversal required</p>
                              <p>• Constant time regardless of list size</p>
                              <p>• Fundamental property of linked structures</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-yellow-400 font-medium mb-2">Search Operation: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Traversal Required:</strong></p>
                              <p>• Must visit each node sequentially</p>
                              <p>• Linear time proportional to size</p>
                              <p>• No random access capability</p>
                              <p>• Worst case: element not found</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Space Complexity Analysis</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-blue-400 font-medium mb-2">Singly Linked: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Space Usage:</strong></p>
                              <p>• Data: n × element_size</p>
                              <p>• Pointers: n × pointer_size</p>
                              <p>• Overhead: ~50-100% for pointers</p>
                              <p>• Dynamic allocation per node</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Doubly Linked: O(n)</h5>
                            <div className="text-gray-300 text-sm space-y-2">
                              <p><strong>Increased Overhead:</strong></p>
                              <p>• Data: n × element_size</p>
                              <p>• Pointers: 2n × pointer_size</p>
                              <p>• Overhead: ~100-200% for pointers</p>
                              <p>• Better functionality trade-off</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-yellow-400 mb-4">Asymptotic Analysis Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg mb-2">O(1) Operations</div>
                          <div className="text-gray-300 text-sm">Insert/Delete head, Push/Pop</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-lg mb-2">O(n) Operations</div>
                          <div className="text-gray-300 text-sm">Search, Access by index, Traverse</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold text-lg mb-2">O(k) Operations</div>
                          <div className="text-gray-300 text-sm">Insert/Delete at position k</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Lists in Algorithms */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">Linked Lists in Algorithm Design</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Algorithmic Applications</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Stack Implementation</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• LIFO behavior naturally</p>
                              <p>• O(1) push/pop operations</p>
                              <p>• Dynamic sizing capability</p>
                              <p>• Used in: Recursion, undo systems</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Queue Implementation</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• FIFO with head/tail pointers</p>
                              <p>• O(1) enqueue/dequeue</p>
                              <p>• Used in: BFS, task scheduling</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-purple-400 font-medium mb-2">Hash Table Collision Resolution</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Separate chaining method</p>
                              <p>• Handles collisions gracefully</p>
                              <p>• Load factor management</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">Advanced Techniques</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Fast/Slow Pointers</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Cycle detection in O(n) time</p>
                              <p>• Finding middle element</p>
                              <p>• Floyd's tortoise and hare</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">In-Place Reversal</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• O(n) time, O(1) space</p>
                              <p>• Pointer manipulation only</p>
                              <p>• No extra memory allocation</p>
                            </div>
                          </div>

                          <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h5 className="text-orange-400 font-medium mb-2">Dummy Node Technique</h5>
                            <div className="text-gray-300 text-sm">
                              <p>• Simplifies edge case handling</p>
                              <p>• Eliminates null pointer checks</p>
                              <p>• Cleaner algorithm implementation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-green-400 mb-4">Why Linked Lists Matter</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">Algorithm Foundations</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Dynamic memory management</li>
                            <li>• Pointer manipulation skills</li>
                            <li>• Recursive algorithm thinking</li>
                            <li>• Memory leak awareness</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-cyan-400 font-medium mb-3">System Programming</h5>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Understanding heap allocation</li>
                            <li>• Manual memory management</li>
                            <li>• Cache-unfriendly patterns</li>
                            <li>• When to avoid linked structures</li>
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
              <h2 className="text-3xl font-bold text-white mb-6">Linked Lists Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-4">What are Linked Lists?</h3>
                  <p className="text-gray-300 mb-6">
                    Linked lists are dynamic data structures where elements are stored in nodes,
                    and each node contains a reference (pointer) to the next node in the sequence.
                    Unlike arrays, linked lists don't require contiguous memory allocation.
                  </p>

                  <h3 className="text-2xl font-semibold text-green-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">🔗</span>
                      <span><strong>Dynamic Size:</strong> Can grow/shrink at runtime</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">💾</span>
                      <span><strong>Non-contiguous:</strong> Elements scattered in memory</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">⚡</span>
                      <span><strong>Efficient Insertions:</strong> O(1) at head with proper implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">🎯</span>
                      <span><strong>Sequential Access:</strong> No random access, O(n) to reach element</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-4">Types of Linked Lists</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Singly Linked List</h4>
                      <p className="text-gray-300">Each node points to next node only</p>
                      <div className="text-sm text-gray-400 mt-2">
                        <strong>Pros:</strong> Simple, memory efficient<br/>
                        <strong>Cons:</strong> Can't traverse backwards
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Doubly Linked List</h4>
                      <p className="text-gray-300">Each node has prev and next pointers</p>
                      <div className="text-sm text-gray-400 mt-2">
                        <strong>Pros:</strong> Bidirectional traversal<br/>
                        <strong>Cons:</strong> More memory overhead
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Circular Linked List</h4>
                      <p className="text-gray-300">Last node points back to first node</p>
                      <div className="text-sm text-gray-400 mt-2">
                        <strong>Pros:</strong> Endless traversal<br/>
                        <strong>Cons:</strong> Careful with cycle detection
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-green-400 mb-3">Operations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Insert: O(1) to O(n)</li>
                    <li>• Delete: O(1) to O(n)</li>
                    <li>• Search: O(n)</li>
                    <li>• Access: O(n)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">O(n) for elements</p>
                  <p className="text-sm text-gray-400 mt-2">+ O(1) per node overhead</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Dynamic memory allocation</li>
                    <li>• Implementing stacks/queues</li>
                    <li>• Symbol tables</li>
                    <li>• Undo functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* List Types Section */}
          {activeSection === "types" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Linked List Types</h2>

              <div className="grid grid-cols-1 gap-8">
                {listTypes.map((listType) => (
                  <div
                    key={listType.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{listType.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(listType.complexity).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                              {key.toUpperCase()}: {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{listType.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{listType.code}</code>
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
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Linked List Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/20"
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

          {/* Advanced Problems Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Linked List Problems</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{problem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                            Time: {problem.complexity.time}
                          </span>
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-lg">
                            Space: {problem.complexity.space}
                          </span>
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

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Linked List Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Remove Linked List Elements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Merge Two Sorted Lists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Linked List Cycle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Intersection of Two Linked Lists</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Linked List Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Add Two Numbers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Remove Nth Node From End</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Reorder List</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Palindrome Linked List</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Copy List with Random Pointer</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Linked List Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Merge K Sorted Lists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Reverse Nodes in k-Group</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>LFU Cache (using DLL)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Flatten Multilevel Doubly LL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>LRU Cache (using HashMap + DLL)</span>
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

          {/* Linked List Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Linked List Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Access by index:</span>
                    <span className="text-red-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Search element:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Insert at head:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Insert in middle:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Delete from head:</span>
                    <span className="text-green-400 font-mono">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Delete from middle:</span>
                    <span className="text-yellow-400 font-mono">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Common Patterns</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Dummy Node:</div>
                    <div className="text-gray-400">Handle edge cases (empty list, single node)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Two Pointers:</div>
                    <div className="text-gray-400">Fast/slow pointers for cycle detection</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Reverse List:</div>
                    <div className="text-gray-400">Iterative (3 pointers) or recursive approach</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Find Middle:</div>
                    <div className="text-gray-400">Slow/fast pointers to find middle node</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Cycle Detection:</div>
                    <div className="text-gray-400">Floyd's algorithm: slow + fast pointers</div>
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

export default LinkedLists;

