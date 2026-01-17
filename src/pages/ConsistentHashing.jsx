import React, { useState } from "react";
import { Layout } from "../components";

const ConsistentHashing = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Consistent Hashing Implementation
  const consistentHashingImplementation = {
    basic: `// Basic Consistent Hashing Implementation
#include <vector>
#include <unordered_map>
#include <string>
#include <functional>

class ConsistentHash {
private:
    std::vector<size_t> ring;                    // Sorted list of hash values
    std::unordered_map<size_t, std::string> nodeMap; // Hash -> Node mapping
    size_t virtualNodesPerNode;                 // Number of virtual nodes per physical node

    size_t hashFunction(const std::string& key) const {
        // Simple hash function (in practice, use better hash like MD5, SHA-1)
        size_t hash = 0;
        for (char c : key) {
            hash = hash * 31 + c;
        }
        return hash;
    }

    // Find the node responsible for a key
    size_t findNode(size_t keyHash) const {
        // Binary search to find the first node >= keyHash
        auto it = std::lower_bound(ring.begin(), ring.end(), keyHash);

        if (it == ring.end()) {
            // Wrap around to first node
            return ring[0];
        }

        return *it;
    }

public:
    ConsistentHash(size_t virtualNodes = 100) : virtualNodesPerNode(virtualNodes) {}

    // Add a physical node
    void addNode(const std::string& nodeId) {
        // Create virtual nodes for this physical node
        for (size_t i = 0; i < virtualNodesPerNode; ++i) {
            std::string virtualNodeId = nodeId + "#" + std::to_string(i);
            size_t hash = hashFunction(virtualNodeId);

            // Insert into sorted ring
            auto it = std::lower_bound(ring.begin(), ring.end(), hash);
            ring.insert(it, hash);

            // Map hash to physical node
            nodeMap[hash] = nodeId;
        }
    }

    // Remove a physical node
    void removeNode(const std::string& nodeId) {
        // Remove all virtual nodes for this physical node
        for (size_t i = 0; i < virtualNodesPerNode; ++i) {
            std::string virtualNodeId = nodeId + "#" + std::to_string(i);
            size_t hash = hashFunction(virtualNodeId);

            // Remove from ring
            auto it = std::find(ring.begin(), ring.end(), hash);
            if (it != ring.end()) {
                ring.erase(it);
                nodeMap.erase(hash);
            }
        }
    }

    // Get node responsible for a key
    std::string getNode(const std::string& key) {
        if (ring.empty()) {
            throw std::runtime_error("No nodes available");
        }

        size_t keyHash = hashFunction(key);
        size_t nodeHash = findNode(keyHash);

        return nodeMap[nodeHash];
    }

    // Get all nodes
    std::vector<std::string> getAllNodes() const {
        std::unordered_set<std::string> uniqueNodes;
        for (const auto& pair : nodeMap) {
            uniqueNodes.insert(pair.second);
        }
        return std::vector<std::string>(uniqueNodes.begin(), uniqueNodes.end());
    }

    size_t getRingSize() const { return ring.size(); }
    size_t getVirtualNodesPerNode() const { return virtualNodesPerNode; }
};

// Usage example
void demonstrateConsistentHashing() {
    ConsistentHash ch(3); // 3 virtual nodes per physical node

    // Add nodes
    ch.addNode("NodeA");
    ch.addNode("NodeB");
    ch.addNode("NodeC");

    std::cout << "Added 3 nodes, ring size: " << ch.getRingSize() << std::endl;

    // Test key assignments
    std::vector<std::string> keys = {"user123", "product456", "order789", "data999"};

    std::cout << "Key assignments:" << std::endl;
    for (const auto& key : keys) {
        std::string node = ch.getNode(key);
        std::cout << key << " -> " << node << std::endl;
    }

    // Add another node
    ch.addNode("NodeD");
    std::cout << "\\nAfter adding NodeD, ring size: " << ch.getRingSize() << std::endl;

    // Check key assignments again (only some should change)
    std::cout << "Key assignments after adding NodeD:" << std::endl;
    for (const auto& key : keys) {
        std::string node = ch.getNode(key);
        std::cout << key << " -> " << node << std::endl;
    }

    // Remove a node
    ch.removeNode("NodeB");
    std::cout << "\\nAfter removing NodeB, ring size: " << ch.getRingSize() << std::endl;
}`,
    withLoadBalancing: `// Consistent Hashing with Load Balancing
#include <vector>
#include <unordered_map>
#include <map>
#include <string>
#include <algorithm>

class LoadBalancedConsistentHash {
private:
    std::vector<size_t> ring;
    std::unordered_map<size_t, std::string> nodeMap;
    std::unordered_map<std::string, size_t> nodeLoad; // Track load per node
    size_t virtualNodesPerNode;
    size_t maxLoadFactor; // Maximum load factor before redistribution

    size_t hashFunction(const std::string& key) const {
        size_t hash = 0;
        for (char c : key) {
            hash = hash * 31 + c;
        }
        return hash;
    }

    size_t findNode(size_t keyHash) const {
        auto it = std::lower_bound(ring.begin(), ring.end(), keyHash);
        if (it == ring.end()) {
            return ring[0];
        }
        return *it;
    }

    // Redistribute load when a node becomes overloaded
    void redistributeLoad() {
        std::vector<std::string> nodes = getAllNodes();
        size_t totalKeys = 0;

        // Count total keys
        for (const auto& node : nodes) {
            totalKeys += nodeLoad[node];
        }

        size_t targetLoad = totalKeys / nodes.size();
        size_t maxAllowedLoad = targetLoad * maxLoadFactor;

        // Find overloaded nodes
        std::vector<std::string> overloadedNodes;
        for (const auto& node : nodes) {
            if (nodeLoad[node] > maxAllowedLoad) {
                overloadedNodes.push_back(node);
            }
        }

        // Note: In a real implementation, you would need to track which keys
        // belong to which nodes and migrate them. This is a simplified version.
        std::cout << "Load redistribution triggered for " << overloadedNodes.size() << " nodes" << std::endl;
    }

public:
    LoadBalancedConsistentHash(size_t virtualNodes = 100, size_t maxLoad = 2)
        : virtualNodesPerNode(virtualNodes), maxLoadFactor(maxLoad) {}

    void addNode(const std::string& nodeId) {
        nodeLoad[nodeId] = 0; // Initialize load

        for (size_t i = 0; i < virtualNodesPerNode; ++i) {
            std::string virtualNodeId = nodeId + "#" + std::to_string(i);
            size_t hash = hashFunction(virtualNodeId);

            auto it = std::lower_bound(ring.begin(), ring.end(), hash);
            ring.insert(it, hash);
            nodeMap[hash] = nodeId;
        }
    }

    void removeNode(const std::string& nodeId) {
        // Remove virtual nodes
        std::vector<size_t> hashesToRemove;
        for (const auto& pair : nodeMap) {
            if (pair.second == nodeId) {
                hashesToRemove.push_back(pair.first);
            }
        }

        for (size_t hash : hashesToRemove) {
            auto it = std::find(ring.begin(), ring.end(), hash);
            if (it != ring.end()) {
                ring.erase(it);
                nodeMap.erase(hash);
            }
        }

        nodeLoad.erase(nodeId);
    }

    std::string getNode(const std::string& key) {
        if (ring.empty()) {
            throw std::runtime_error("No nodes available");
        }

        size_t keyHash = hashFunction(key);
        size_t nodeHash = findNode(keyHash);
        std::string node = nodeMap[nodeHash];

        // Update load (in real implementation, this would be atomic)
        nodeLoad[node]++;

        // Check if redistribution is needed
        std::vector<std::string> nodes = getAllNodes();
        if (!nodes.empty()) {
            size_t totalKeys = 0;
            for (const auto& n : nodes) {
                totalKeys += nodeLoad[n];
            }
            size_t targetLoad = totalKeys / nodes.size();
            size_t maxAllowedLoad = targetLoad * maxLoadFactor;

            if (nodeLoad[node] > maxAllowedLoad) {
                redistributeLoad();
            }
        }

        return node;
    }

    std::vector<std::string> getAllNodes() const {
        std::unordered_set<std::string> uniqueNodes;
        for (const auto& pair : nodeMap) {
            uniqueNodes.insert(pair.second);
        }
        return std::vector<std::string>(uniqueNodes.begin(), uniqueNodes.end());
    }

    size_t getNodeLoad(const std::string& nodeId) const {
        auto it = nodeLoad.find(nodeId);
        return (it != nodeLoad.end()) ? it->second : 0;
    }

    // Get load distribution
    std::unordered_map<std::string, size_t> getLoadDistribution() const {
        return nodeLoad;
    }

    size_t getRingSize() const { return ring.size(); }
};

// Usage example
void demonstrateLoadBalancedHashing() {
    LoadBalancedConsistentHash ch(3, 2); // 3 virtual nodes, max load factor 2

    ch.addNode("Server1");
    ch.addNode("Server2");
    ch.addNode("Server3");

    // Simulate many requests
    for (int i = 0; i < 1000; ++i) {
        std::string key = "key" + std::to_string(i);
        ch.getNode(key);
    }

    // Check load distribution
    auto loadDist = ch.getLoadDistribution();
    std::cout << "Load distribution:" << std::endl;
    for (const auto& pair : loadDist) {
        std::cout << pair.first << ": " << pair.second << " keys" << std::endl;
    }
}`,
    distributed: `// Distributed Consistent Hashing with Replication
#include <vector>
#include <unordered_map>
#include <set>
#include <string>

class DistributedConsistentHash {
private:
    std::vector<size_t> ring;
    std::unordered_map<size_t, std::string> nodeMap;
    size_t virtualNodesPerNode;
    size_t replicationFactor; // Number of replicas per key

    size_t hashFunction(const std::string& key) const {
        size_t hash = 0;
        for (char c : key) {
            hash = hash * 31 + c;
        }
        return hash;
    }

    size_t findNode(size_t keyHash) const {
        auto it = std::lower_bound(ring.begin(), ring.end(), keyHash);
        if (it == ring.end()) {
            return ring[0];
        }
        return *it;
    }

    // Get next N nodes clockwise from a position
    std::vector<size_t> getNextNodes(size_t startHash, size_t count) const {
        std::vector<size_t> result;
        auto it = std::lower_bound(ring.begin(), ring.end(), startHash);

        for (size_t i = 0; i < count && i < ring.size(); ++i) {
            if (it == ring.end()) {
                it = ring.begin(); // Wrap around
            }
            result.push_back(*it);
            ++it;
        }

        return result;
    }

public:
    DistributedConsistentHash(size_t virtualNodes = 100, size_t replication = 3)
        : virtualNodesPerNode(virtualNodes), replicationFactor(replication) {}

    void addNode(const std::string& nodeId) {
        for (size_t i = 0; i < virtualNodesPerNode; ++i) {
            std::string virtualNodeId = nodeId + "#" + std::to_string(i);
            size_t hash = hashFunction(virtualNodeId);

            auto it = std::lower_bound(ring.begin(), ring.end(), hash);
            ring.insert(it, hash);
            nodeMap[hash] = nodeId;
        }
    }

    void removeNode(const std::string& nodeId) {
        std::vector<size_t> hashesToRemove;
        for (const auto& pair : nodeMap) {
            if (pair.second == nodeId) {
                hashesToRemove.push_back(pair.first);
            }
        }

        for (size_t hash : hashesToRemove) {
            auto it = std::find(ring.begin(), ring.end(), hash);
            if (it != ring.end()) {
                ring.erase(it);
                nodeMap.erase(hash);
            }
        }
    }

    // Get primary node for a key
    std::string getNode(const std::string& key) {
        if (ring.empty()) {
            throw std::runtime_error("No nodes available");
        }

        size_t keyHash = hashFunction(key);
        size_t nodeHash = findNode(keyHash);
        return nodeMap[nodeHash];
    }

    // Get all replica nodes for a key (for replication)
    std::vector<std::string> getReplicaNodes(const std::string& key) {
        if (ring.empty()) {
            return {};
        }

        size_t keyHash = hashFunction(key);
        auto nodeHashes = getNextNodes(keyHash, replicationFactor);

        std::vector<std::string> nodes;
        for (size_t hash : nodeHashes) {
            nodes.push_back(nodeMap[hash]);
        }

        return nodes;
    }

    // Check if a key should be stored on a particular node
    bool isKeyOnNode(const std::string& key, const std::string& nodeId) {
        auto replicas = getReplicaNodes(key);
        return std::find(replicas.begin(), replicas.end(), nodeId) != replicas.end();
    }

    std::vector<std::string> getAllNodes() const {
        std::set<std::string> uniqueNodes;
        for (const auto& pair : nodeMap) {
            uniqueNodes.insert(pair.second);
        }
        return std::vector<std::string>(uniqueNodes.begin(), uniqueNodes.end());
    }

    size_t getReplicationFactor() const { return replicationFactor; }
    size_t getRingSize() const { return ring.size(); }
};

// Usage example
void demonstrateDistributedHashing() {
    DistributedConsistentHash ch(3, 2); // 3 virtual nodes, 2 replicas

    ch.addNode("DataCenter1");
    ch.addNode("DataCenter2");
    ch.addNode("DataCenter3");

    std::string key = "user123";

    std::cout << "Primary node for " << key << ": " << ch.getNode(key) << std::endl;

    auto replicas = ch.getReplicaNodes(key);
    std::cout << "Replica nodes for " << key << ": ";
    for (size_t i = 0; i < replicas.size(); ++i) {
        if (i > 0) std::cout << ", ";
        std::cout << replicas[i];
    }
    std::cout << std::endl;

    // Check which nodes should store the key
    auto allNodes = ch.getAllNodes();
    std::cout << "Nodes that should store " << key << ": ";
    for (size_t i = 0; i < allNodes.size(); ++i) {
        if (ch.isKeyOnNode(key, allNodes[i])) {
            if (i > 0) std::cout << ", ";
            std::cout << allNodes[i];
        }
    }
    std::cout << std::endl;
}`
  };

  // Applications
  const applications = [
    {
      id: "distributed-caching",
      name: "Distributed Caching Systems",
      description: "Scale out cache storage across multiple servers",
      example: "Redis Cluster, Memcached with consistent hashing",
      code: `class DistributedCache {
private:
    ConsistentHash ring;
    std::unordered_map<std::string, std::unordered_map<std::string, std::string>> nodeCaches;

public:
    void addCacheNode(const std::string& nodeId) {
        ring.addNode(nodeId);
        nodeCaches[nodeId] = {}; // Initialize empty cache for node
    }

    void put(const std::string& key, const std::string& value) {
        std::string nodeId = ring.getNode(key);
        nodeCaches[nodeId][key] = value;
    }

    std::string get(const std::string& key) {
        std::string nodeId = ring.getNode(key);
        auto& nodeCache = nodeCaches[nodeId];

        auto it = nodeCache.find(key);
        return (it != nodeCache.end()) ? it->second : "";
    }

    void removeNode(const std::string& nodeId) {
        ring.removeNode(nodeId);
        nodeCaches.erase(nodeId);
        // In real implementation, you'd redistribute cached data
    }
};`
    },
    {
      id: "database-sharding",
      name: "Database Sharding",
      description: "Distribute database records across multiple shards",
      example: "MongoDB sharding, Cassandra partitioning",
      code: `class DatabaseShardManager {
private:
    ConsistentHash shardRing;
    std::unordered_map<std::string, std::string> shardConnections;

public:
    void addShard(const std::string& shardId, const std::string& connectionString) {
        shardRing.addNode(shardId);
        shardConnections[shardId] = connectionString;
    }

    std::string getShardForKey(const std::string& key) {
        return shardRing.getNode(key);
    }

    std::string getConnectionString(const std::string& shardId) {
        return shardConnections[shardId];
    }

    // Route database operation to correct shard
    void executeQuery(const std::string& key, const std::string& query) {
        std::string shardId = getShardForKey(key);
        std::string connection = getConnectionString(shardId);

        // Execute query on the appropriate shard
        std::cout << "Executing on shard " << shardId
                  << " with connection: " << connection << std::endl;
        // executeQueryOnShard(connection, query);
    }
};`
    },
    {
      id: "load-balancing",
      name: "Load Balancing",
      description: "Distribute requests evenly across servers",
      example: "Web server load balancing, microservice routing",
      code: `class LoadBalancer {
private:
    ConsistentHash serverRing;
    std::unordered_map<std::string, size_t> serverLoad;
    std::unordered_map<std::string, std::string> serverEndpoints;

public:
    void addServer(const std::string& serverId, const std::string& endpoint) {
        serverRing.addNode(serverId);
        serverLoad[serverId] = 0;
        serverEndpoints[serverId] = endpoint;
    }

    std::string routeRequest(const std::string& requestId) {
        std::string serverId = serverRing.getNode(requestId);
        serverLoad[serverId]++; // Track load

        return serverEndpoints[serverId];
    }

    void removeServer(const std::string& serverId) {
        serverRing.removeNode(serverId);
        serverLoad.erase(serverId);
        serverEndpoints.erase(serverId);
    }

    // Get load distribution for monitoring
    std::unordered_map<std::string, size_t> getLoadDistribution() {
        return serverLoad;
    }
};`
    }
  ];

  // Mathematical Analysis
  const mathematicalAnalysis = [
    {
      title: "Load Distribution Analysis",
      content: `// Mathematical analysis of load distribution in consistent hashing

// Expected number of keys per node:
// E[keys_per_node] = total_keys / num_nodes

// Variance in consistent hashing is much lower than traditional hashing
// Standard deviation ≈ √(num_virtual_nodes / num_physical_nodes)

// Key properties:
// 1. When a node is added/removed, only K/n keys need to be remapped
//    where K is total keys, n is number of nodes
//
// 2. Load distribution follows approximately uniform distribution
//
// 3. The variance decreases as number of virtual nodes increases

double calculateExpectedKeysPerNode(size_t totalKeys, size_t numNodes) {
    return static_cast<double>(totalKeys) / numNodes;
}

double calculateStandardDeviation(size_t virtualNodes, size_t physicalNodes) {
    // Approximation: σ ≈ √(V/P) where V = virtual nodes, P = physical nodes
    return std::sqrt(static_cast<double>(virtualNodes) / physicalNodes);
}

// Probability that a key maps to a particular node:
// P(key → node) = (number of virtual nodes of that node) / total virtual nodes

// When adding a new node:
// - Only keys between new node's position and next node need remapping
// - Fraction of keys to remap = 1/(n+1) where n is current nodes
// - This is much better than traditional hashing where all keys might need remapping

double calculateRemappingFraction(size_t currentNodes) {
    return 1.0 / (currentNodes + 1);
}`,
      explanation: "Mathematical analysis of load distribution and remapping costs"
    },
    {
      title: "Virtual Nodes Optimization",
      content: `// Optimal number of virtual nodes analysis

// Trade-offs:
// - More virtual nodes = better load distribution
// - More virtual nodes = higher memory usage
// - More virtual nodes = slower node addition/removal

// Optimal virtual nodes per physical node:
// V = 100-200 for most applications
// V = 1000+ for high-performance systems

// Memory overhead per virtual node:
// - Ring storage: O(V × P) where P = physical nodes
// - Node mapping: O(V × P) hash table entries

// Performance impact:
// - Node lookup: O(log V) due to binary search on ring
// - Node addition: O(V × log V) for inserting virtual nodes
// - Space complexity: O(V × P)

// Recommended values:
// - Small system (P ≤ 10): V = 100-200
// - Medium system (P ≤ 100): V = 200-500
// - Large system (P > 100): V = 500-1000

struct ConsistentHashingConfig {
    size_t virtualNodesPerNode;
    double expectedLoadVariance; // Lower is better
    size_t memoryOverhead;       // Bytes per virtual node

    static ConsistentHashingConfig smallSystem() {
        return {100, 0.1, 64};   // 100 virtual nodes, 64 bytes overhead
    }

    static ConsistentHashingConfig largeSystem() {
        return {500, 0.05, 64};  // 500 virtual nodes, lower variance
    }
};`,
      explanation: "Analysis of virtual nodes optimization and system sizing"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(1)") || complexity.includes("O(log")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(n)")) color = "bg-yellow-100 text-yellow-800";
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
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Consistent Hashing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scalable distributed systems algorithm for minimal key remapping during node changes.
              Master the foundation of modern distributed databases and caching systems.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "implementation"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Implementation
            </button>
            <button
              onClick={() => setActiveSection("mathematical")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "mathematical"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Mathematical Analysis
            </button>
            <button
              onClick={() => setActiveSection("applications")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "applications"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Applications
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Consistent Hashing Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-4">What is Consistent Hashing?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Consistent hashing is a distributed hashing scheme that operates independently of
                    the number of servers or objects in a distributed hash table. It provides a way to
                    distribute keys across a cluster of machines with minimal key remapping when nodes
                    are added or removed.
                  </p>

                  <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Key Characteristics</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">🔄</span>
                      <span><strong>Minimal Remapping:</strong> Only K/n keys need to be moved when adding/removing nodes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">🎯</span>
                      <span><strong>Load Balancing:</strong> Evenly distributes keys across available nodes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">🔧</span>
                      <span><strong>Scalability:</strong> Handles dynamic addition and removal of nodes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">🎭</span>
                      <span><strong>Virtual Nodes:</strong> Uses virtual nodes to improve load distribution</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-4">How It Works</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-blue-400 mb-2">1. Hash Ring Creation</h4>
                      <p className="text-gray-300 text-sm">Arrange nodes on a circular hash ring based on their hash values</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-blue-400 mb-2">2. Key Assignment</h4>
                      <p className="text-gray-300 text-sm">Map keys to the first node clockwise on the ring</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-blue-400 mb-2">3. Node Addition</h4>
                      <p className="text-gray-300 text-sm">Only keys between new node and next node are remapped</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-blue-400 mb-2">4. Virtual Nodes</h4>
                      <p className="text-gray-300 text-sm">Each physical node has multiple virtual nodes for better distribution</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Advantages</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Minimal key remapping</li>
                    <li>• Good load balancing</li>
                    <li>• Fault tolerance</li>
                    <li>• Scalable architecture</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-orange-400 mb-3">Challenges</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Hotspots possible</li>
                    <li>• Virtual node management</li>
                    <li>• Node failure handling</li>
                    <li>• Complex implementation</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Common Use Cases</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Distributed caching</li>
                    <li>• Database sharding</li>
                    <li>• Load balancing</li>
                    <li>• Distributed storage</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Section */}
          {activeSection === "implementation" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Consistent Hashing Implementations</h2>

              <div className="grid grid-cols-1 gap-8">
                {/* Basic Implementation */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Basic Consistent Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Fundamental implementation with hash ring and virtual nodes for even distribution.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Hash ring implementation</li>
                          <li>• Virtual node support</li>
                          <li>• Node addition/removal</li>
                          <li>• Key-to-node mapping</li>
                          <li>• Minimal remapping</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Complexity</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Key Lookup:</span>
                            {renderComplexityBadge("O(log V)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Node Addition:</span>
                            {renderComplexityBadge("O(V log V)")}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Space:</span>
                            {renderComplexityBadge("O(V × P)")}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{consistentHashingImplementation.basic}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Load Balanced Implementation */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Load Balanced Consistent Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Enhanced implementation with load monitoring and automatic redistribution.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Load factor monitoring</li>
                          <li>• Automatic redistribution</li>
                          <li>• Overload detection</li>
                          <li>• Load balancing metrics</li>
                          <li>• Performance optimization</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Benefits</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Prevents hotspots</li>
                          <li>• Maintains performance</li>
                          <li>• Automatic optimization</li>
                          <li>• Better resource utilization</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{consistentHashingImplementation.withLoadBalancing}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distributed Implementation */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">Distributed Consistent Hashing</h3>
                    <p className="text-gray-300 mb-6">
                      Advanced implementation with data replication and fault tolerance.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Features</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Data replication</li>
                          <li>• Fault tolerance</li>
                          <li>• Replica management</li>
                          <li>• Consistency guarantees</li>
                          <li>• High availability</li>
                        </ul>

                        <h4 className="text-lg font-semibold text-green-400 mt-4 mb-3">Advantages</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Data durability</li>
                          <li>• Fault tolerance</li>
                          <li>• High availability</li>
                          <li>• Read scalability</li>
                        </ul>
                      </div>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{consistentHashingImplementation.distributed}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Analysis Section */}
          {activeSection === "mathematical" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Mathematical Analysis</h2>

              <div className="grid grid-cols-1 gap-8">
                {mathematicalAnalysis.map((analysis, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-4">{analysis.title}</h3>
                      <p className="text-gray-300 mb-6">{analysis.explanation}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Mathematical Details</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{analysis.content}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Comparison with Traditional Hashing */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-6">Consistent vs Traditional Hashing</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-4 text-gray-200 text-lg font-bold">Aspect</th>
                            <th className="pb-4 text-cyan-400 text-lg font-bold">Consistent Hashing</th>
                            <th className="pb-4 text-red-400 text-lg font-bold">Traditional Hashing</th>
                            <th className="pb-4 text-yellow-400 text-lg font-bold">Improvement</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-cyan-400 transition-all duration-300">Node Addition Remapping</td>
                            <td className="py-4 text-green-400 font-medium">K/(n+1) keys</td>
                            <td className="py-4 text-red-400 font-medium">All keys</td>
                            <td className="py-4 text-yellow-400 font-medium">n/(n+1) reduction</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-cyan-400 transition-all duration-300">Load Distribution</td>
                            <td className="py-4 text-green-400 font-medium">Even with virtual nodes</td>
                            <td className="py-4 text-red-400 font-medium">Uneven clustering</td>
                            <td className="py-4 text-yellow-400 font-medium">σ ≈ √(V/P)</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-cyan-400 transition-all duration-300">Scalability</td>
                            <td className="py-4 text-green-400 font-medium">Excellent</td>
                            <td className="py-4 text-red-400 font-medium">Poor</td>
                            <td className="py-4 text-yellow-400 font-medium">Handles growth well</td>
                          </tr>
                          <tr className="border-b border-gray-700 group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-cyan-400 transition-all duration-300">Memory Overhead</td>
                            <td className="py-4 text-yellow-400 font-medium">O(V × P)</td>
                            <td className="py-4 text-green-400 font-medium">O(1)</td>
                            <td className="py-4 text-yellow-400 font-medium">V × P extra space</td>
                          </tr>
                          <tr className="group hover:bg-gray-700/30 transition-all duration-300">
                            <td className="py-4 text-white font-medium group-hover:text-cyan-400 transition-all duration-300">Implementation Complexity</td>
                            <td className="py-4 text-red-400 font-medium">High</td>
                            <td className="py-4 text-green-400 font-medium">Low</td>
                            <td className="py-4 text-yellow-400 font-medium">Worth the benefits</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 text-sm text-gray-400">
                      K = total keys, n = number of nodes, V = virtual nodes, P = physical nodes, σ = standard deviation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Consistent Hashing Applications</h2>

              <div className="grid grid-cols-1 gap-8">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-4">{app.name}</h3>
                      <p className="text-gray-300 mb-4">{app.description}</p>
                      <p className="text-blue-300 mb-6"><strong>Example:</strong> {app.example}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-blue-400 mb-3">Code Example</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{app.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement Basic Consistent Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Key Distribution Analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Virtual Node Management</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Load Balanced Consistent Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Distributed Data Replication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Node Failure Handling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Consistent Hashing with Bounded Loads</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Virtual Node Optimization</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Rendezvous Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Multi-Probe Consistent Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Consistent Hashing with Hierarchical Namespaces</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Dynamic Load Balancing in Consistent Hashing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Consistent Hashing for Content Delivery Networks</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Fundamental Concepts</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• How does consistent hashing work?</li>
                    <li>• What are virtual nodes and why are they needed?</li>
                    <li>• How does it minimize key remapping?</li>
                    <li>• What are the advantages over traditional hashing?</li>
                    <li>• How do you handle node failures?</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">System Design</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Design a distributed cache using consistent hashing</li>
                    <li>• How would you implement database sharding?</li>
                    <li>• Design a load balancer with consistent hashing</li>
                    <li>• Handle hotspots in consistent hashing</li>
                    <li>• Implement replication with consistent hashing</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Performance Analysis</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Analyze load distribution in consistent hashing</li>
                    <li>• Calculate expected remapping when adding nodes</li>
                    <li>• Optimize virtual nodes per physical node</li>
                    <li>• Compare with other distributed hashing schemes</li>
                    <li>• Handle the hash ring maintenance overhead</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-2">Advanced Topics</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Implement consistent hashing with bounded loads</li>
                    <li>• Handle network partitions in distributed systems</li>
                    <li>• Implement consistent hashing for microservices</li>
                    <li>• Design consistent hashing for IoT device management</li>
                    <li>• Consistent hashing in blockchain and distributed ledgers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Consistent Hashing Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Consistent Hashing Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Time Complexities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Key Lookup:</span>
                    <span className="text-blue-400 font-mono">O(log V)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Node Addition:</span>
                    <span className="text-yellow-400 font-mono">O(V log V)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Node Removal:</span>
                    <span className="text-yellow-400 font-mono">O(V log V)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Space Complexity:</span>
                    <span className="text-purple-400 font-mono">O(V × P)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Key Remapping (node change):</span>
                    <span className="text-green-400 font-mono">O(K/n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Key Concepts</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Hash Ring:</div>
                    <div className="text-gray-400">Circular arrangement of hash values representing nodes</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Virtual Nodes:</div>
                    <div className="text-gray-400">Multiple hash positions per physical node for better load distribution</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Clockwise Assignment:</div>
                    <div className="text-gray-400">Keys map to first node encountered moving clockwise on the ring</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Minimal Remapping:</div>
                    <div className="text-gray-400">Only K/n keys affected when adding/removing nodes (K=keys, n=nodes)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-blue-400 font-medium mb-1">Load Balancing:</div>
                    <div className="text-gray-400">Even distribution with low variance using virtual nodes</div>
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

export default ConsistentHashing;

