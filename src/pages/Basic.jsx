import React, { useState } from "react";
import { Layout } from "../components";
import { useNavigate } from "react-router-dom";

const Basic = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  // Basic Data Structures
  const basicStructures = [
    {
      id: "variables",
      name: "Variables & Memory",
      description: "Understanding data storage, memory allocation, and primitive types",
      icon: "💾",
      route: null, // No separate page, covered here
      complexity: { access: "O(1)", assignment: "O(1)" },
      features: ["Memory Allocation", "Data Types", "Scope & Lifetime", "Primitive Types"]
    },
    {
      id: "arrays",
      name: "Arrays",
      description: "Contiguous memory blocks storing elements of same type",
      icon: "📊",
      route: "/data-structures/arrays",
      complexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
      features: ["Random Access", "Cache Friendly", "Fixed Size", "Simple Implementation"]
    },
    {
      id: "strings",
      name: "Strings",
      description: "Sequence of characters with specialized operations",
      icon: "📝",
      route: null, // No separate page, covered here
      complexity: { access: "O(1)", search: "O(n)", concat: "O(n)", substring: "O(n)" },
      features: ["Character Arrays", "Immutable Strings", "String Operations", "Encoding"]
    },
    {
      id: "pointers",
      name: "Pointers & References",
      description: "Memory addresses and indirect data access mechanisms",
      icon: "🎯",
      route: null, // No separate page, covered here
      complexity: { dereference: "O(1)", allocation: "O(1)" },
      features: ["Memory Addresses", "Dynamic Allocation", "Reference Types", "Null Safety"]
    }
  ];

  // Variable Types Content
  const variableTypes = [
    {
      category: "Primitive Types",
      types: [
        { name: "int", size: "4 bytes", range: "-2,147,483,648 to 2,147,483,647", use: "Integers" },
        { name: "float", size: "4 bytes", range: "±3.4×10³⁸ (6-7 decimal digits)", use: "Single precision floating point" },
        { name: "double", size: "8 bytes", range: "±1.7×10³⁰⁸ (15 decimal digits)", use: "Double precision floating point" },
        { name: "char", size: "1 byte", range: "-128 to 127 or 0-255", use: "Single characters" },
        { name: "bool", size: "1 byte", range: "true/false", use: "Boolean values" }
      ]
    },
    {
      category: "Derived Types",
      types: [
        { name: "arrays", size: "Varies", range: "N/A", use: "Fixed-size sequences" },
        { name: "pointers", size: "Platform dependent", range: "Memory addresses", use: "Indirect access" },
        { name: "references", size: "Same as referenced", range: "N/A", use: "Aliases to variables" },
        { name: "strings", size: "Varies", range: "N/A", use: "Character sequences" }
      ]
    }
  ];

  // String Operations
  const stringOperations = [
    {
      name: "String Creation & Assignment",
      code: `// C++ string operations
#include <string>
#include <iostream>

int main() {
    // Different ways to create strings
    std::string s1 = "Hello";           // C-style string
    std::string s2("World");            // Constructor
    std::string s3 = s1;                // Copy constructor
    std::string s4(5, 'A');             // Fill constructor: "AAAAA"

    // Assignment
    s1 = "Hi";                          // Direct assignment
    s2.assign("Hello World");           // Using assign()
    s3.assign(s1, 0, 2);                // Assign substring: "Hi"

    std::cout << s1 << " " << s2 << " " << s3 << std::endl;
    return 0;
}`,
      explanation: "Strings can be created and assigned in multiple ways with different constructors."
    },
    {
      name: "String Access & Modification",
      code: `// String access and modification
std::string str = "Hello World";

// Access characters (O(1))
char first = str[0];        // 'H'
char last = str.back();     // 'd'
char at_pos = str.at(6);    // 'W'

// Modify characters (O(1))
str[0] = 'h';               // "hello World"
str.at(6) = 'w';            // "hello world"

// Append operations (O(n))
str += "!!!";               // "hello world!!!"
str.append(" How are you?"); // "hello world!!! How are you?"

// Insert (O(n))
str.insert(5, " beautiful"); // "hello beautiful world!!! How are you?"

// Erase (O(n))
str.erase(5, 11);           // "hello world!!! How are you?"

std::cout << str << std::endl;`,
      explanation: "Strings support random access, modification, and various manipulation operations."
    },
    {
      name: "String Searching & Comparison",
      code: `// String searching and comparison
std::string text = "Hello World, welcome to C++ programming!";
std::string pattern = "World";

// Find operations (O(n))
size_t pos = text.find(pattern);           // 6
size_t last_pos = text.rfind("o");         // Last 'o' position
size_t not_found = text.find("xyz");       // std::string::npos

// Substring operations (O(n))
std::string sub1 = text.substr(6, 5);      // "World"
std::string sub2 = text.substr(13);        // "welcome to C++ programming!"

// Comparison operations (O(n))
std::string s1 = "apple";
std::string s2 = "Apple";
std::string s3 = "apple";

int cmp1 = s1.compare(s2);    // > 0 (case sensitive)
int cmp2 = s1.compare(s3);    // 0 (equal)
bool equal = (s1 == s3);      // true

// Case insensitive comparison
bool case_insensitive_equal = std::equal(s1.begin(), s1.end(), s2.begin(),
    [](char a, char b) { return std::tolower(a) == std::tolower(b); });`,
      explanation: "Strings provide powerful searching, comparison, and substring operations."
    }
  ];

  // Pointer Concepts
  const pointerConcepts = [
    {
      name: "Pointer Declaration & Initialization",
      code: `// Pointer declaration and initialization
int x = 42;        // Regular variable
int* ptr;          // Pointer declaration (uninitialized)
int* ptr2 = &x;    // Pointer initialized with address of x
int* ptr3 = nullptr; // Null pointer

// Pointer to pointer
int** ptr_ptr = &ptr2;

// Array name as pointer
int arr[5] = {1, 2, 3, 4, 5};
int* arr_ptr = arr;  // Points to first element

std::cout << "x = " << x << std::endl;
std::cout << "*ptr2 = " << *ptr2 << std::endl;  // 42
std::cout << "arr[0] = " << arr[0] << std::endl;
std::cout << "*arr_ptr = " << *arr_ptr << std::endl;  // 1`,
      explanation: "Pointers store memory addresses and provide indirect access to data."
    },
    {
      name: "Dynamic Memory Allocation",
      code: `// Dynamic memory allocation with pointers
#include <iostream>
#include <memory>  // For smart pointers

// Raw pointers (manual memory management)
int* raw_ptr = new int(42);
int* array_ptr = new int[10];  // Dynamic array

// Don't forget to delete!
delete raw_ptr;
delete[] array_ptr;

// Smart pointers (automatic memory management)
std::unique_ptr<int> unique_ptr = std::make_unique<int>(42);
std::shared_ptr<int> shared_ptr = std::make_shared<int>(42);

// Dynamic arrays with smart pointers
auto unique_array = std::make_unique<int[]>(10);
auto shared_array = std::make_shared<int[]>(10);

// Reference counting
std::shared_ptr<int> ptr1 = std::make_shared<int>(100);
std::shared_ptr<int> ptr2 = ptr1;  // Reference count = 2
ptr1.reset();  // Reference count = 1
ptr2.reset();  // Reference count = 0, memory freed

std::cout << "Smart pointers handle memory automatically!" << std::endl;`,
      explanation: "Pointers enable dynamic memory allocation and management."
    },
    {
      name: "Pointer Arithmetic & Arrays",
      code: `// Pointer arithmetic
int arr[] = {10, 20, 30, 40, 50};
int* ptr = arr;  // Points to arr[0]

std::cout << "Pointer arithmetic:" << std::endl;
std::cout << "*ptr = " << *ptr << std::endl;           // 10
std::cout << "*(ptr + 1) = " << *(ptr + 1) << std::endl; // 20
std::cout << "ptr[2] = " << ptr[2] << std::endl;         // 30

// Incrementing pointers
ptr++;  // Now points to arr[1]
std::cout << "*ptr = " << *ptr << std::endl;  // 20

ptr += 2;  // Now points to arr[3]
std::cout << "*ptr = " << *ptr << std::endl;  // 40

// Pointer difference
int* ptr1 = &arr[0];
int* ptr2 = &arr[3];
ptrdiff_t diff = ptr2 - ptr1;  // 3
std::cout << "Difference: " << diff << std::endl;

// Bounds checking (important!)
if (ptr < arr + 5) {
    std::cout << "Pointer is within bounds" << std::endl;
}`,
      explanation: "Pointers support arithmetic operations, especially useful with arrays."
    },
    {
      name: "References vs Pointers",
      code: `// References vs Pointers comparison
int x = 42;

// Reference (alias to variable)
int& ref = x;      // Must be initialized
ref = 100;         // Modifies x
std::cout << "x = " << x << ", ref = " << ref << std::endl; // Both 100

// Pointer
int* ptr = &x;     // Can be null/uninitialized
*ptr = 200;        // Modifies x through pointer
std::cout << "x = " << x << ", *ptr = " << *ptr << std::endl; // Both 200

// Key differences:
// 1. References cannot be null
// 2. References must be initialized
// 3. References cannot be reassigned
// 4. Pointer arithmetic not allowed on references

// Function parameters
void modifyByReference(int& param) { param = 300; }
void modifyByPointer(int* param) { if (param) *param = 400; }

modifyByReference(x);  // x becomes 300
modifyByPointer(&x);   // x becomes 400

std::cout << "Final x = " << x << std::endl;`,
      explanation: "References provide safer, more convenient indirect access compared to pointers."
    }
  ];

  // Memory Management
  const memoryManagement = [
    {
      name: "Stack vs Heap Memory",
      code: `// Stack vs Heap memory allocation
#include <iostream>

class Example {
public:
    int value;
    Example(int v) : value(v) {
        std::cout << "Constructor called: " << value << std::endl;
    }
    ~Example() {
        std::cout << "Destructor called: " << value << std::endl;
    }
};

void demonstrateMemory() {
    // Stack allocation (automatic)
    std::cout << "=== Stack Allocation ===" << std::endl;
    {
        int stack_var = 42;              // Stack variable
        Example stack_obj(1);            // Stack object
        int arr[5] = {1, 2, 3, 4, 5};  // Stack array

        // All automatically cleaned up when scope ends
    }
    std::cout << "Stack variables cleaned up" << std::endl;

    // Heap allocation (manual)
    std::cout << "=== Heap Allocation ===" << std::endl;
    {
        int* heap_var = new int(42);           // Heap variable
        Example* heap_obj = new Example(2);    // Heap object
        int* heap_arr = new int[5];            // Heap array

        // Manual cleanup required
        delete heap_var;
        delete heap_obj;
        delete[] heap_arr;
    }
    std::cout << "Heap variables cleaned up" << std::endl;
}`,
      explanation: "Understanding stack vs heap memory and their lifetimes."
    },
    {
      name: "Memory Leaks & RAII",
      code: `// Memory leaks and RAII (Resource Acquisition Is Initialization)
#include <memory>
#include <vector>

class ResourceManager {
private:
    int* data;
public:
    ResourceManager(int size) {
        data = new int[size];
        std::cout << "Resource allocated" << std::endl;
    }

    ~ResourceManager() {
        delete[] data;
        std::cout << "Resource freed" << std::endl;
    }

    // Prevent copying (would cause double deletion)
    ResourceManager(const ResourceManager&) = delete;
    ResourceManager& operator=(const ResourceManager&) = delete;
};

// RAII principle: Resource management tied to object lifetime
void demonstrateRAII() {
    std::cout << "=== RAII Principle ===" << std::endl;
    {
        ResourceManager rm(10);  // Resource allocated
        // Use resource...
        // Resource automatically freed when rm goes out of scope
    }
    std::cout << "ResourceManager destroyed" << std::endl;

    // Smart pointers provide RAII for dynamic memory
    std::cout << "=== Smart Pointers ===" << std::endl;
    {
        auto unique = std::make_unique<int>(42);      // RAII
        auto shared = std::make_shared<int>(100);     // RAII
        auto weak = std::weak_ptr<int>(shared);       // RAII

        // Memory automatically managed
    }
    std::cout << "Smart pointers cleaned up" << std::endl;
}`,
      explanation: "RAII ensures resources are properly managed and prevents memory leaks."
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
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Basic Data Structures
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Foundational concepts that form the building blocks for complex data structures and algorithms.
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
              onClick={() => setActiveSection("variables")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "variables"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Variables & Memory
            </button>
            <button
              onClick={() => setActiveSection("strings")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "strings"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Strings
            </button>
            <button
              onClick={() => setActiveSection("pointers")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "pointers"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Pointers & Memory
            </button>
            <button
              onClick={() => setActiveSection("structures")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "structures"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Structures
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">What are Basic Data Structures?</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-4">Core Concepts</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Basic data structures are the fundamental building blocks of programming.
                    They represent the simplest ways to organize and store data in memory,
                    forming the foundation for more complex data structures and algorithms.
                  </p>

                  <h3 className="text-2xl font-semibold text-green-400 mb-4">Why They're Important</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">🏗️</span>
                      <span><strong>Foundation:</strong> Basis for all complex structures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">⚡</span>
                      <span><strong>Efficiency:</strong> Understanding memory and access patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">🔧</span>
                      <span><strong>Control:</strong> Direct memory management and optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">🎯</span>
                      <span><strong>Problem Solving:</strong> Essential for algorithm implementation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-green-400 mb-4">Components Covered</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Variables & Memory</h4>
                      <p className="text-gray-300">Data types, memory allocation, scope, and lifetime</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Arrays</h4>
                      <p className="text-gray-300">Contiguous memory, random access, fixed-size sequences</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Strings</h4>
                      <p className="text-gray-300">Character sequences, operations, and manipulations</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Pointers & References</h4>
                      <p className="text-gray-300">Memory addresses, indirect access, dynamic allocation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-green-400 mb-3">Memory Understanding</h4>
                  <p className="text-gray-300">Stack vs heap, allocation strategies</p>
                  <p className="text-sm text-gray-400 mt-2">Essential for performance</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Data Organization</h4>
                  <p className="text-gray-300">How data is stored and accessed</p>
                  <p className="text-sm text-gray-400 mt-2">Foundation of algorithms</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Type Systems</h4>
                  <p className="text-gray-300">Primitive and derived types</p>
                  <p className="text-sm text-gray-400 mt-2">Type safety and conversion</p>
                </div>
              </div>
            </div>
          )}

          {/* Variables & Memory Section */}
          {activeSection === "variables" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Variables & Memory Management</h2>

              <div className="grid grid-cols-1 gap-8">
                {variableTypes.map((category, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-green-400 mb-6">{category.category}</h3>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="pb-4 text-gray-200 text-lg font-bold">Type</th>
                              <th className="pb-4 text-gray-200 text-lg font-bold">Size</th>
                              <th className="pb-4 text-gray-200 text-lg font-bold">Range</th>
                              <th className="pb-4 text-gray-200 text-lg font-bold">Use Case</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.types.map((type, typeIdx) => (
                              <tr key={typeIdx} className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                                <td className="py-4 text-cyan-400 font-medium group-hover:text-cyan-300 transition-all duration-300">
                                  {type.name}
                                </td>
                                <td className="py-4 text-green-400 font-medium group-hover:text-green-300 transition-all duration-300">
                                  {type.size}
                                </td>
                                <td className="py-4 text-yellow-400 font-medium group-hover:text-yellow-300 transition-all duration-300 text-sm">
                                  {type.range}
                                </td>
                                <td className="py-4 text-gray-300 group-hover:text-gray-200 transition-all duration-300">
                                  {type.use}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Memory Concepts */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
                  <h3 className="text-2xl font-bold text-green-400 mb-6">Memory Concepts</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-cyan-400 mb-4">Stack Memory</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Automatic allocation/deallocation</li>
                        <li>• Fast access</li>
                        <li>• Limited size</li>
                        <li>• Local variables, function calls</li>
                        <li>• LIFO (Last In, First Out)</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-cyan-400 mb-4">Heap Memory</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Manual allocation/deallocation</li>
                        <li>• Larger size available</li>
                        <li>• Slower access</li>
                        <li>• Dynamic memory</li>
                        <li>• Requires careful management</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-700/50 p-6 rounded-xl">
                    <h4 className="text-xl font-semibold text-cyan-400 mb-4">Scope & Lifetime</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-lg mb-2">Local</div>
                        <div className="text-gray-300 text-sm">Function/block scope</div>
                        <div className="text-gray-400 text-xs">Stack memory</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold text-lg mb-2">Global</div>
                        <div className="text-gray-300 text-sm">Program lifetime</div>
                        <div className="text-gray-400 text-xs">Static memory</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold text-lg mb-2">Dynamic</div>
                        <div className="text-gray-300 text-sm">Manual control</div>
                        <div className="text-gray-400 text-xs">Heap memory</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strings Section */}
          {activeSection === "strings" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">String Operations & Concepts</h2>

              <div className="grid grid-cols-1 gap-8">
                {stringOperations.map((operation, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{operation.name}</h3>
                      <p className="text-gray-300 mb-6">{operation.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{operation.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* String Encoding */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">String Encoding & Representation</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-cyan-400 mb-4">ASCII (7-bit)</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• 128 characters (0-127)</li>
                        <li>• Basic Latin alphabet</li>
                        <li>• Control characters</li>
                        <li>• Limited international support</li>
                        <li>• 1 byte per character</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/50 p-6 rounded-xl">
                      <h4 className="text-xl font-semibold text-cyan-400 mb-4">Unicode (UTF-8/16/32)</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Millions of characters</li>
                        <li>• Worldwide language support</li>
                        <li>• Variable encoding size</li>
                        <li>• Backward compatible with ASCII</li>
                        <li>• UTF-8: 1-4 bytes per character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pointers Section */}
          {activeSection === "pointers" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Pointers, References & Memory Management</h2>

              <div className="grid grid-cols-1 gap-8">
                {pointerConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{concept.name}</h3>
                      <p className="text-gray-300 mb-6">{concept.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{concept.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Memory Management */}
                {memoryManagement.map((topic, idx) => (
                  <div
                    key={`memory-${idx}`}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{topic.name}</h3>
                      <p className="text-gray-300 mb-6">{topic.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{topic.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structures Section */}
          {activeSection === "structures" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Basic Data Structures Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {basicStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{structure.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{structure.name}</h3>
                          <p className="text-gray-300 text-sm">{structure.description}</p>
                        </div>
                      </div>

                      {/* Complexity Table */}
                      {structure.complexity && (
                        <div className="bg-gray-700/50 p-4 rounded-xl mb-6">
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Complexity</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(structure.complexity).map(([op, comp]) => (
                              <div key={op} className="flex justify-between items-center">
                                <span className="text-gray-300 capitalize">{op}:</span>
                                {renderComplexityBadge(comp)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {structure.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-lg">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {structure.route ? (
                        <button
                          onClick={() => navigate(structure.route)}
                          className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-bold text-white hover:from-green-500 hover:to-emerald-400 transition-all duration-500 transform hover:scale-105 hover:shadow-xl"
                        >
                          Learn {structure.name}
                        </button>
                      ) : (
                        <div className="w-full py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl font-bold text-white text-center">
                          Content Available Above
                        </div>
                      )}
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
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Reverse String</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Palindrome Check</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>String to Integer (atoi)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Valid Anagram</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>First Unique Character</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Longest Substring Without Repeating</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>String Compression</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Group Anagrams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Valid Parentheses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Implement strStr()</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Minimum Window Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Longest Palindromic Substring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Regular Expression Matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Word Break II</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Edit Distance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Memory Management</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Stack vs Heap memory</li>
                    <li>• Memory leaks prevention</li>
                    <li>• Smart pointers usage</li>
                    <li>• RAII principle</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">String Operations</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• String immutability concepts</li>
                    <li>• String concatenation efficiency</li>
                    <li>• Character encoding differences</li>
                    <li>• String searching algorithms</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Pointers & References</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Pointer arithmetic</li>
                    <li>• Memory addresses vs values</li>
                    <li>• Null pointer safety</li>
                    <li>• Reference vs pointer trade-offs</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Data Types & Sizes</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Type conversion rules</li>
                    <li>• Overflow handling</li>
                    <li>• Platform-dependent sizes</li>
                    <li>• Type safety importance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Concepts Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Basic Concepts Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Data Types</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Primitive types:</span>
                    <span className="text-cyan-400 font-mono">int, float, char, bool</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Derived types:</span>
                    <span className="text-cyan-400 font-mono">arrays, pointers, references</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">User-defined:</span>
                    <span className="text-cyan-400 font-mono">classes, structs, enums</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Type modifiers:</span>
                    <span className="text-cyan-400 font-mono">signed, unsigned, const</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Memory Management</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Stack Memory:</div>
                    <div className="text-gray-400">Automatic, fast, limited, LIFO</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Heap Memory:</div>
                    <div className="text-gray-400">Manual, slow, large, flexible</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">RAII Principle:</div>
                    <div className="text-gray-400">Resource management tied to lifetime</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Smart Pointers:</div>
                    <div className="text-gray-400">Automatic memory management</div>
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

export default Basic;

