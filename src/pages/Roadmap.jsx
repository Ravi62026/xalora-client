import React, { useState, useEffect, useRef } from "react";
import { Layout } from "../components";

// Custom CSS for enhanced animations
const customStyles = `
  @keyframes flowAnimation {
    0% { transform: translateY(0) scale(1); opacity: 0.7; }
    50% { transform: translateY(-10px) scale(1.05); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 0.7; }
  }
  
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 5px rgba(56, 189, 248, 0.5); }
    50% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.9); }
    100% { box-shadow: 0 0 5px rgba(56, 189, 248, 0.5); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes flowMove {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes waveFlow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes nodePulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
  }
  
  @keyframes connectionFlow {
    0% { stroke-dashoffset: 20; }
    100% { stroke-dashoffset: 0; }
  }
  
  .flow-node {
    animation: flowAnimation 3s infinite ease-in-out;
  }
  
  .pulse-glow {
    animation: pulseGlow 2s infinite ease-in-out;
  }
  
  .fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  .animate-flow {
    animation: flowMove 2s linear infinite;
  }
  
  .wave-flow {
    animation: waveFlow 3s linear infinite;
  }
  
  .node-pulse {
    animation: nodePulse 2s infinite ease-in-out;
  }
  
  .connection-flow {
    animation: connectionFlow 3s infinite linear;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .flow-connector {
    stroke-dasharray: 10;
    animation: connectionFlow 2s infinite linear;
  }
`;

const Roadmap = () => {
  const [activeTrack, setActiveTrack] = useState("dsa");
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [expandedResources, setExpandedResources] = useState({});
  const flowRef = useRef(null);

  // Roadmap data for different technology tracks
  const roadmapTracks = {
    dsa: {
      name: "Data Structures & Algorithms",
      description: "Master fundamental computer science concepts and problem-solving techniques",
      color: "from-emerald-500 to-cyan-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "Programming Fundamentals",
            description: "Master the basics of programming with any language (Python/Java/C++/JavaScript)",
            duration: "2-3 weeks",
            topics: ["Variables & Data Types", "Control Structures", "Functions & Methods", "Input/Output", "Error Handling"],
            status: "completed",
            resources: {
              books: ["Python Crash Course", "Java: A Beginner's Guide", "Eloquent JavaScript"],
              courses: ["CS50: Intro to Computer Science", "Python for Everybody", "JavaScript Basics"],
              platforms: ["freeCodeCamp", "Codecademy", "Coursera"]
            }
          },
          {
            id: 2,
            title: "Basic Data Structures",
            description: "Learn fundamental data structures that form the building blocks",
            duration: "2-3 weeks",
            topics: ["Arrays", "Strings", "Pointers", "References", "Basic Memory Management"],
            status: "completed",
            resources: {
              books: ["Data Structures and Algorithms in Python", "Think Data Structures"],
              courses: ["Basic Data Structures - Coursera", "Intro to Data Structures"],
              platforms: ["GeeksforGeeks", "LeetCode", "HackerRank"]
            }
          },
          {
            id: 3,
            title: "Linear Data Structures",
            description: "Master sequential data structures for organizing data",
            duration: "3-4 weeks",
            topics: ["Linked Lists", "Stacks", "Queues", "Deques", "Vectors"],
            status: "in-progress",
            resources: {
              books: ["Algorithms Unlocked", "Data Structures Made Easy"],
              courses: ["Linear Data Structures - Udemy", "Stacks and Queues"],
              platforms: ["LeetCode", "InterviewBit", "CodeSignal"]
            }
          },
          {
            id: 4,
            title: "Algorithm Fundamentals",
            description: "Understand algorithmic thinking and complexity analysis",
            duration: "2-3 weeks",
            topics: ["Time/Space Complexity", "Asymptotic Notation", "Recursion", "Brute Force"],
            status: "pending",
            resources: {
              books: ["Grokking Algorithms", "Algorithm Design Manual"],
              courses: ["Algorithmic Thinking - edX", "Complexity Analysis"],
              platforms: ["Brilliant.org", "Khan Academy", "Visualgo"]
            }
          },
          {
            id: 5,
            title: "Basic Sorting & Searching",
            description: "Learn essential sorting and searching techniques",
            duration: "2-3 weeks",
            topics: ["Bubble/Selection/Insertion Sort", "Linear Search", "Binary Search", "Two Pointers"],
            status: "pending",
            resources: {
              books: ["Introduction to Algorithms", "Algorithms in a Nutshell"],
              courses: ["Sorting Algorithms - Coursera", "Searching Techniques"],
              platforms: ["LeetCode", "HackerEarth", "GeeksforGeeks"]
            }
          }
        ],
        intermediate: [
          {
            id: 6,
            title: "Advanced Sorting Algorithms",
            description: "Master efficient sorting techniques for large datasets",
            duration: "2-3 weeks",
            topics: ["Merge Sort", "Quick Sort", "Heap Sort", "Counting/Radix Sort"],
            status: "pending",
            resources: {
              books: ["Introduction to Algorithms", "Algorithms Unlocked"],
              courses: ["Advanced Sorting - Udemy", "Divide and Conquer"],
              platforms: ["LeetCode", "Codeforces", "HackerRank"]
            }
          },
          {
            id: 7,
            title: "Hash-Based Structures",
            description: "Learn hash functions and efficient data retrieval structures",
            duration: "2-3 weeks",
            topics: ["Hash Tables", "Hash Maps", "Hash Sets", "Collision Resolution", "Bloom Filters"],
            status: "pending",
            resources: {
              books: ["Data Structures and Algorithms in Java", "Hashing Techniques"],
              courses: ["Hash Tables - Coursera", "Hashing Fundamentals"],
              platforms: ["GeeksforGeeks", "InterviewBit", "LeetCode"]
            }
          },
          {
            id: 8,
            title: "Tree Data Structures",
            description: "Understand hierarchical data organization",
            duration: "3-4 weeks",
            topics: ["Binary Trees", "Binary Search Trees", "AVL Trees", "Heaps", "Tries"],
            status: "pending",
            resources: {
              books: ["Tree Data Structures", "Algorithms + Data Structures"],
              courses: ["Tree Algorithms - edX", "Binary Trees Mastery"],
              platforms: ["LeetCode", "CodeChef", "HackerEarth"]
            }
          },
          {
            id: 9,
            title: "Graph Data Structures",
            description: "Model relationships and networks with graphs",
            duration: "3-4 weeks",
            topics: ["Adjacency Matrix/List", "Directed/Undirected Graphs", "Weighted Graphs", "Special Graphs"],
            status: "pending",
            resources: {
              books: ["Graph Theory", "Networks and Graphs"],
              courses: ["Graph Theory - Coursera", "Graph Algorithms"],
              platforms: ["GeeksforGeeks", "LeetCode", "VisuAlgo"]
            }
          },
          {
            id: 10,
            title: "Dynamic Programming",
            description: "Solve complex problems with optimization techniques",
            duration: "4-5 weeks",
            topics: ["Memoization", "Tabulation", "Classic Problems", "State Space Reduction"],
            status: "pending",
            resources: {
              books: ["Dynamic Programming for Coding Interviews", "Competitive Programming"],
              courses: ["Dynamic Programming - Udemy", "DP Masterclass"],
              platforms: ["LeetCode", "Codeforces", "AtCoder"]
            }
          },
          {
            id: 11,
            title: "Greedy Algorithms",
            description: "Learn greedy techniques for optimization problems",
            duration: "2-3 weeks",
            topics: ["Activity Selection", "Fractional Knapsack", "Huffman Coding", "Spanning Trees"],
            status: "pending",
            resources: {
              books: ["Greedy Algorithms", "Algorithm Design"],
              courses: ["Greedy Techniques - Coursera", "Optimization Algorithms"],
              platforms: ["LeetCode", "HackerEarth", "GeeksforGeeks"]
            }
          }
        ],
        advanced: [
          {
            id: 12,
            title: "Advanced Graph Algorithms",
            description: "Master complex graph traversal and optimization algorithms",
            duration: "3-4 weeks",
            topics: ["Shortest Path (Dijkstra/Bellman-Ford)", "MST (Kruskal/Prim)", "Topological Sort", "SCC"],
            status: "pending",
            resources: {
              books: ["Graph Algorithms", "Network Flows"],
              courses: ["Advanced Graphs - edX", "Network Optimization"],
              platforms: ["Codeforces", "LeetCode", "HackerRank"]
            }
          },
          {
            id: 13,
            title: "Advanced Data Structures",
            description: "Specialized structures for complex problem solving",
            duration: "4-5 weeks",
            topics: ["Segment Trees", "Fenwick Trees", "Disjoint Set Union", "B-Trees", "Suffix Arrays"],
            status: "pending",
            resources: {
              books: ["Advanced Data Structures", "Handbook of Data Structures"],
              courses: ["Advanced DS - Coursera", "Specialized Structures"],
              platforms: ["Codeforces", "AtCoder", "TopCoder"]
            }
          },
          {
            id: 14,
            title: "String Algorithms",
            description: "Pattern matching and text processing techniques",
            duration: "2-3 weeks",
            topics: ["KMP Algorithm", "Rabin-Karp", "Z Algorithm", "Manacher's Algorithm", "Aho-Corasick"],
            status: "pending",
            resources: {
              books: ["String Algorithms", "Text Processing"],
              courses: ["String Matching - edX", "Pattern Recognition"],
              platforms: ["LeetCode", "Codeforces", "HackerEarth"]
            }
          },
          {
            id: 15,
            title: "Backtracking & Math Algorithms",
            description: "Constraint satisfaction and mathematical problem solving",
            duration: "3-4 weeks",
            topics: ["N-Queens", "Sudoku Solver", "Number Theory", "Combinatorics", "Geometric Algorithms"],
            status: "pending",
            resources: {
              books: ["Mathematical Algorithms", "Combinatorial Algorithms"],
              courses: ["Math for CS - MIT", "Number Theory"],
              platforms: ["Project Euler", "Codeforces", "LeetCode"]
            }
          },
          {
            id: 16,
            title: "System Design",
            description: "Design scalable and distributed systems",
            duration: "6-8 weeks",
            topics: ["Load Balancing", "Caching", "Databases", "API Design", "Microservices", "Distributed Systems"],
            status: "pending",
            resources: {
              books: ["Designing Data-Intensive Applications", "System Design Primer"],
              courses: ["System Design - Udemy", "Scalability Fundamentals"],
              platforms: ["Grokking System Design", "High Scalability", "System Design Interview"]
            }
          },
          {
            id: 17,
            title: "Interview Preparation",
            description: "Comprehensive preparation for technical interviews",
            duration: "4-6 weeks",
            topics: ["Coding Interviews", "System Design Interviews", "Behavioral Questions", "Mock Interviews"],
            status: "pending",
            resources: {
              books: ["Cracking the Coding Interview", "Elements of Programming Interviews"],
              courses: ["Interview Prep - Udemy", "Behavioral Interview"],
              platforms: ["Pramp", "InterviewBit", "Gainlo"]
            }
          }
        ]
      }
    },
    dataScience: {
      name: "Data Science",
      description: "Learn data analysis, machine learning, and AI techniques",
      color: "from-purple-500 to-indigo-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "Mathematics Foundation",
            description: "Essential math for data science and machine learning",
            duration: "4-6 weeks",
            topics: ["Linear Algebra", "Calculus", "Statistics", "Probability", "Descriptive Statistics"],
            status: "pending",
            resources: {
              books: ["Mathematics for Machine Learning", "Think Stats", "Think Bayes"],
              courses: ["Linear Algebra - Khan Academy", "Statistics - Coursera", "Probability - edX"],
              platforms: ["Khan Academy", "Brilliant.org", "3Blue1Brown"]
            }
          },
          {
            id: 2,
            title: "Programming for Data Science",
            description: "Learn Python/R for data manipulation and analysis",
            duration: "3-4 weeks",
            topics: ["Python Basics", "NumPy", "Pandas", "Data Cleaning", "File I/O"],
            status: "pending",
            resources: {
              books: ["Python for Data Analysis", "Automate the Boring Stuff"],
              courses: ["Python for Data Science - Coursera", "Data Analysis with Python"],
              platforms: ["DataCamp", "Kaggle Learn", "freeCodeCamp"]
            }
          },
          {
            id: 3,
            title: "Data Visualization",
            description: "Create insightful visualizations to understand data",
            duration: "2-3 weeks",
            topics: ["Matplotlib", "Seaborn", "Plotly", "ggplot2", "Dashboard Creation"],
            status: "pending",
            resources: {
              books: ["Storytelling with Data", "Python Data Science Handbook"],
              courses: ["Data Visualization - Udemy", "ggplot2 - Coursera"],
              platforms: ["Tableau Public", "Plotly", "Observable"]
            }
          },
          {
            id: 4,
            title: "SQL for Data Analysis",
            description: "Query and manipulate data in relational databases",
            duration: "2-3 weeks",
            topics: ["SELECT Statements", "Joins", "Aggregations", "Subqueries", "Window Functions"],
            status: "pending",
            resources: {
              books: ["Learning SQL", "SQL Cookbook"],
              courses: ["SQL for Data Science - Coursera", "Advanced SQL"],
              platforms: ["Mode Analytics", "SQLZoo", "HackerRank SQL"]
            }
          }
        ],
        intermediate: [
          {
            id: 5,
            title: "Statistical Analysis",
            description: "Apply statistical methods to analyze data",
            duration: "3-4 weeks",
            topics: ["Hypothesis Testing", "Regression Analysis", "ANOVA", "Bayesian Statistics", "Experimental Design"],
            status: "pending",
            resources: {
              books: ["Practical Statistics for Data Scientists", "Think Stats"],
              courses: ["Statistics - Udacity", "Inferential Statistics"],
              platforms: ["Stat Trek", "RStudio", "JASP"]
            }
          },
          {
            id: 6,
            title: "Machine Learning Fundamentals",
            description: "Learn core ML algorithms and techniques",
            duration: "4-5 weeks",
            topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Cross-Validation", "Feature Engineering"],
            status: "pending",
            resources: {
              books: ["Hands-On Machine Learning", "Introduction to Statistical Learning"],
              courses: ["ML - Andrew Ng (Coursera)", "Applied Data Science"],
              platforms: ["Scikit-learn", "Kaggle", "Fast.ai"]
            }
          },
          {
            id: 7,
            title: "Data Wrangling",
            description: "Clean, transform, and prepare data for analysis",
            duration: "2-3 weeks",
            topics: ["Data Cleaning", "Missing Data Handling", "Outlier Detection", "Data Transformation", "ETL Processes"],
            status: "pending",
            resources: {
              books: ["Data Wrangling with Python", "Bad Data Handbook"],
              courses: ["Data Cleaning - Udemy", "Data Preprocessing"],
              platforms: ["Trifacta", "OpenRefine", "Talend"]
            }
          },
          {
            id: 8,
            title: "Exploratory Data Analysis",
            description: "Discover patterns and insights in data",
            duration: "2-3 weeks",
            topics: ["Data Profiling", "Correlation Analysis", "Anomaly Detection", "Dimensionality Reduction", "Data Storytelling"],
            status: "pending",
            resources: {
              books: ["Exploratory Data Analysis", "R for Data Science"],
              courses: ["EDA - Coursera", "Data Exploration"],
              platforms: ["Jupyter Notebooks", "KNIME", "RStudio"]
            }
          }
        ],
        advanced: [
          {
            id: 9,
            title: "Deep Learning",
            description: "Build neural networks for complex pattern recognition",
            duration: "6-8 weeks",
            topics: ["Neural Networks", "CNNs", "RNNs", "Transformers", "TensorFlow/PyTorch"],
            status: "pending",
            resources: {
              books: ["Deep Learning", "Hands-On Deep Learning"],
              courses: ["Deep Learning Specialization - Coursera", "Practical DL"],
              platforms: ["TensorFlow", "PyTorch", "Keras"]
            }
          },
          {
            id: 10,
            title: "Advanced Machine Learning",
            description: "Master sophisticated ML techniques and algorithms",
            duration: "5-6 weeks",
            topics: ["Ensemble Methods", "Gradient Boosting", "SVM", "Clustering", "Reinforcement Learning"],
            status: "pending",
            resources: {
              books: ["The Elements of Statistical Learning", "ML: A Probabilistic Perspective"],
              courses: ["Advanced ML - edX", "Reinforcement Learning"],
              platforms: ["XGBoost", "LightGBM", "Scikit-learn"]
            }
          },
          {
            id: 11,
            title: "Big Data Technologies",
            description: "Work with large-scale data processing frameworks",
            duration: "4-5 weeks",
            topics: ["Hadoop", "Spark", "MapReduce", "NoSQL Databases", "Stream Processing"],
            status: "pending",
            resources: {
              books: ["Hadoop: The Definitive Guide", "Learning Spark"],
              courses: ["Big Data - Coursera", "Apache Spark"],
              platforms: ["Databricks", "Cloudera", "Hortonworks"]
            }
          },
          {
            id: 12,
            title: "Natural Language Processing",
            description: "Process and analyze human language data",
            duration: "4-5 weeks",
            topics: ["Text Preprocessing", "Sentiment Analysis", "Topic Modeling", "Named Entity Recognition", "Language Models"],
            status: "pending",
            resources: {
              books: ["Speech and Language Processing", "NLTK with Python"],
              courses: ["NLP - Coursera", "Natural Language Understanding"],
              platforms: ["NLTK", "spaCy", "Hugging Face"]
            }
          },
          {
            id: 13,
            title: "Computer Vision",
            description: "Analyze and interpret visual information",
            duration: "4-5 weeks",
            topics: ["Image Processing", "Object Detection", "Image Classification", "OpenCV", "YOLO"],
            status: "pending",
            resources: {
              books: ["Computer Vision", "Programming Computer Vision with Python"],
              courses: ["Computer Vision - Udacity", "Deep Learning for CV"],
              platforms: ["OpenCV", "TensorFlow", "PyTorch"]
            }
          },
          {
            id: 14,
            title: "MLOps & Deployment",
            description: "Deploy and maintain machine learning models in production",
            duration: "3-4 weeks",
            topics: ["Model Deployment", "CI/CD for ML", "Monitoring", "A/B Testing", "Model Versioning"],
            status: "pending",
            resources: {
              books: ["ML Ops", "Building ML Pipelines"],
              courses: ["MLOps - Coursera", "ML Engineering"],
              platforms: ["MLflow", "Kubeflow", "Seldon"]
            }
          }
        ]
      }
    },
    fullStack: {
      name: "Full Stack Development",
      description: "Become proficient in both frontend and backend web development",
      color: "from-blue-500 to-teal-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "HTML & CSS Fundamentals",
            description: "Build the structure and styling of web pages",
            duration: "2-3 weeks",
            topics: ["HTML Tags", "CSS Selectors", "Flexbox", "Grid", "Responsive Design"],
            status: "pending",
            resources: {
              books: ["HTML and CSS", "CSS Secrets"],
              courses: ["HTML/CSS - freeCodeCamp", "Responsive Web Design"],
              platforms: ["MDN Web Docs", "W3Schools", "Codecademy"]
            }
          },
          {
            id: 2,
            title: "JavaScript Basics",
            description: "Learn the fundamentals of client-side programming",
            duration: "3-4 weeks",
            topics: ["Variables & Data Types", "Functions", "DOM Manipulation", "Events", "ES6 Features"],
            status: "pending",
            resources: {
              books: ["Eloquent JavaScript", "You Don't Know JS"],
              courses: ["JavaScript - freeCodeCamp", "Modern JS"],
              platforms: ["JavaScript.info", "Codecademy", "JSFiddle"]
            }
          },
          {
            id: 3,
            title: "Frontend Frameworks",
            description: "Build dynamic user interfaces with modern frameworks",
            duration: "4-5 weeks",
            topics: ["React/Vue/Angular", "Component Architecture", "State Management", "Routing", "Forms"],
            status: "pending",
            resources: {
              books: ["React Up and Running", "Vue.js in Action"],
              courses: ["React - freeCodeCamp", "Vue Mastery"],
              platforms: ["React Docs", "Vue.js Guide", "Angular.io"]
            }
          },
          {
            id: 4,
            title: "Version Control",
            description: "Manage code changes with Git and GitHub",
            duration: "1-2 weeks",
            topics: ["Git Basics", "Branching", "Merging", "Pull Requests", "GitHub Workflow"],
            status: "pending",
            resources: {
              books: ["Pro Git", "Git for Teams"],
              courses: ["Git - Udemy", "Version Control"],
              platforms: ["GitHub", "GitLab", "Bitbucket"]
            }
          }
        ],
        intermediate: [
          {
            id: 5,
            title: "Backend Development",
            description: "Create server-side applications and APIs",
            duration: "5-6 weeks",
            topics: ["Node.js/Python/Java", "RESTful APIs", "Authentication", "Middleware", "Error Handling"],
            status: "pending",
            resources: {
              books: ["Node.js Design Patterns", "RESTful Web APIs"],
              courses: ["Backend Development - Udemy", "API Design"],
              platforms: ["Express.js", "Django", "Spring Boot"]
            }
          },
          {
            id: 6,
            title: "Database Management",
            description: "Design and work with databases",
            duration: "3-4 weeks",
            topics: ["SQL Basics", "Database Design", "ORM", "Transactions", "NoSQL Databases"],
            status: "pending",
            resources: {
              books: ["Database Design for Mere Mortals", "SQL Antipatterns"],
              courses: ["Databases - Coursera", "MongoDB University"],
              platforms: ["PostgreSQL", "MySQL", "MongoDB"]
            }
          },
          {
            id: 7,
            title: "Web Security",
            description: "Protect applications from common vulnerabilities",
            duration: "2-3 weeks",
            topics: ["Authentication", "Authorization", "OWASP Top 10", "CORS", "CSRF Protection"],
            status: "pending",
            resources: {
              books: ["Web Security for Developers", "The Web Application Hacker's Handbook"],
              courses: ["Web Security - Coursera", "Ethical Hacking"],
              platforms: ["OWASP", "Snyk", "Burp Suite"]
            }
          },
          {
            id: 8,
            title: "Testing",
            description: "Ensure code quality with automated testing",
            duration: "2-3 weeks",
            topics: ["Unit Testing", "Integration Testing", "End-to-End Testing", "Test Frameworks", "CI/CD"],
            status: "pending",
            resources: {
              books: ["Test-Driven Development", "Working Effectively with Legacy Code"],
              courses: ["Testing - Udemy", "Quality Assurance"],
              platforms: ["Jest", "Cypress", "Selenium"]
            }
          }
        ],
        advanced: [
          {
            id: 9,
            title: "Cloud Deployment",
            description: "Deploy applications to cloud platforms",
            duration: "3-4 weeks",
            topics: ["Docker", "Kubernetes", "AWS/Azure/GCP", "Serverless", "Load Balancing"],
            status: "pending",
            resources: {
              books: ["Docker in Action", "Kubernetes Up and Running"],
              courses: ["Cloud Computing - Coursera", "AWS Solutions Architect"],
              platforms: ["AWS", "Google Cloud", "Microsoft Azure"]
            }
          },
          {
            id: 10,
            title: "Performance Optimization",
            description: "Optimize applications for speed and efficiency",
            duration: "2-3 weeks",
            topics: ["Caching", "Database Optimization", "CDN", "Lazy Loading", "Code Splitting"],
            status: "pending",
            resources: {
              books: ["High Performance Browser Networking", "Web Performance in Action"],
              courses: ["Web Performance - Udemy", "Optimization Techniques"],
              platforms: ["Webpack", "Lighthouse", "New Relic"]
            }
          },
          {
            id: 11,
            title: "Microservices Architecture",
            description: "Design and implement distributed systems",
            duration: "4-5 weeks",
            topics: ["Service Design", "API Gateways", "Message Queues", "Event-Driven Architecture", "Service Mesh"],
            status: "pending",
            resources: {
              books: ["Building Microservices", "Microservices Patterns"],
              courses: ["Microservices - edX", "Distributed Systems"],
              platforms: ["Kubernetes", "Istio", "RabbitMQ"]
            }
          },
          {
            id: 12,
            title: "DevOps Practices",
            description: "Implement modern development and operations practices",
            duration: "3-4 weeks",
            topics: ["CI/CD Pipelines", "Infrastructure as Code", "Monitoring", "Logging", "Container Orchestration"],
            status: "pending",
            resources: {
              books: ["The DevOps Handbook", "Continuous Delivery"],
              courses: ["DevOps - Coursera", "Site Reliability Engineering"],
              platforms: ["Jenkins", "Ansible", "Terraform"]
            }
          },
          {
            id: 13,
            title: "Real-time Applications",
            description: "Build applications with real-time capabilities",
            duration: "2-3 weeks",
            topics: ["WebSockets", "Server-Sent Events", "Push Notifications", "Real-time Databases", "Streaming"],
            status: "pending",
            resources: {
              books: ["Real-Time Web Application Development", "WebSocket Essentials"],
              courses: ["Real-time Apps - Udemy", "Streaming Data"],
              platforms: ["Socket.IO", "Firebase", "Pusher"]
            }
          },
          {
            id: 14,
            title: "Mobile Development",
            description: "Extend skills to mobile application development",
            duration: "4-5 weeks",
            topics: ["React Native", "Flutter", "Progressive Web Apps", "Mobile UI/UX", "App Store Deployment"],
            status: "pending",
            resources: {
              books: ["React Native in Action", "Flutter in Action"],
              courses: ["Mobile Development - Coursera", "iOS/Android Development"],
              platforms: ["React Native", "Flutter", "Xamarin"]
            }
          }
        ]
      }
    },
    blockchain: {
      name: "Blockchain Development",
      description: "Master decentralized technologies and smart contract development",
      color: "from-yellow-500 to-orange-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "Blockchain Fundamentals",
            description: "Understand the core concepts of blockchain technology",
            duration: "2-3 weeks",
            topics: ["Decentralization", "Cryptography", "Consensus Mechanisms", "Digital Signatures", "Hash Functions"],
            status: "pending",
            resources: {
              books: ["Mastering Bitcoin", "Blockchain Basics"],
              courses: ["Blockchain - Coursera", "Bitcoin and Cryptocurrency"],
              platforms: ["Bitcoin.org", "Ethereum.org", "Blockchain.com"]
            }
          },
          {
            id: 2,
            title: "Cryptocurrency Basics",
            description: "Learn about digital currencies and their underlying technology",
            duration: "2-3 weeks",
            topics: ["Bitcoin", "Ethereum", "Wallets", "Transactions", "Mining"],
            status: "pending",
            resources: {
              books: ["Digital Gold", "The Internet of Money"],
              courses: ["Cryptocurrency - Udemy", "Crypto Fundamentals"],
              platforms: ["Coinbase", "Binance Academy", "Crypto.com"]
            }
          },
          {
            id: 3,
            title: "Smart Contract Development",
            description: "Write self-executing contracts on blockchain platforms",
            duration: "3-4 weeks",
            topics: ["Solidity", "Remix IDE", "Contract Deployment", "Gas Optimization", "Security Best Practices"],
            status: "pending",
            resources: {
              books: ["Mastering Ethereum", "Solidity Programming Essentials"],
              courses: ["Smart Contracts - Udemy", "Solidity Mastery"],
              platforms: ["Remix IDE", "Truffle Suite", "Hardhat"]
            }
          },
          {
            id: 4,
            title: "Web3 Development",
            description: "Build decentralized applications (dApps)",
            duration: "3-4 weeks",
            topics: ["Ethereum", "Web3.js", "Metamask", "IPFS", "Truffle Suite"],
            status: "pending",
            resources: {
              books: ["Building Ethereum DApps", "Web3.js Guide"],
              courses: ["Web3 Development - Coursera", "dApp Development"],
              platforms: ["Alchemy", "Infura", "Moralis"]
            }
          }
        ],
        intermediate: [
          {
            id: 5,
            title: "Advanced Smart Contracts",
            description: "Develop complex smart contracts with advanced patterns",
            duration: "4-5 weeks",
            topics: ["Design Patterns", "Upgradeable Contracts", "Oracles", "Token Standards", "Security Audits"],
            status: "pending",
            resources: {
              books: ["Solidity Design Patterns", "Smart Contract Security"],
              courses: ["Advanced Solidity - Udemy", "Security Best Practices"],
              platforms: ["OpenZeppelin", "Chainlink", "Tenderly"]
            }
          },
          {
            id: 6,
            title: "DeFi Development",
            description: "Build decentralized finance applications",
            duration: "4-5 weeks",
            topics: ["Lending Protocols", "DEXs", "Staking", "Yield Farming", "AMMs"],
            status: "pending",
            resources: {
              books: ["DeFi and the Future of Finance", "Decentralized Finance"],
              courses: ["DeFi Development - Coursera", "Yield Farming"],
              platforms: ["Uniswap", "Compound", "Aave"]
            }
          },
          {
            id: 7,
            title: "NFT Development",
            description: "Create and deploy non-fungible tokens",
            duration: "2-3 weeks",
            topics: ["ERC-721", "ERC-1155", "Metadata Standards", "Marketplaces", "Royalties"],
            status: "pending",
            resources: {
              books: ["NFT Art and Collectibles", "Non-Fungible Tokens"],
              courses: ["NFT Development - Udemy", "Digital Art"],
              platforms: ["OpenSea", "Rarible", "SuperRare"]
            }
          },
          {
            id: 8,
            title: "Layer 2 Solutions",
            description: "Learn scaling solutions for blockchain networks",
            duration: "3-4 weeks",
            topics: ["Rollups", "Sidechains", "State Channels", "Plasma", "Optimistic vs ZK Rollups"],
            status: "pending",
            resources: {
              books: ["Ethereum Layer 2 Scaling", "Rollup Technology"],
              courses: ["Layer 2 Scaling - Coursera", "Ethereum Scaling"],
              platforms: ["Polygon", "Arbitrum", "Optimism"]
            }
          }
        ],
        advanced: [
          {
            id: 9,
            title: "Cross-Chain Development",
            description: "Build applications that work across multiple blockchains",
            duration: "4-5 weeks",
            topics: ["Cross-Chain Bridges", "Interoperability Protocols", "Polkadot", "Cosmos", "Chainlink"],
            status: "pending",
            resources: {
              books: ["Cross-Chain Interoperability", "Blockchain Interoperability"],
              courses: ["Cross-Chain Dev - Udemy", "Interoperability"],
              platforms: ["Polkadot", "Cosmos", "Chainlink"]
            }
          },
          {
            id: 10,
            title: "Blockchain Security",
            description: "Secure blockchain applications and smart contracts",
            duration: "3-4 weeks",
            topics: ["Common Vulnerabilities", "Formal Verification", "Penetration Testing", "Bug Bounties", "Security Tools"],
            status: "pending",
            resources: {
              books: ["Blockchain Security", "Smart Contract Hacking"],
              courses: ["Blockchain Security - Coursera", "Ethical Hacking"],
              platforms: ["MythX", "Slither", "Oyente"]
            }
          },
          {
            id: 11,
            title: "Blockchain Architecture",
            description: "Design and implement custom blockchain solutions",
            duration: "5-6 weeks",
            topics: ["Consensus Algorithms", "Network Protocols", "Storage Solutions", "Governance", "Custom Blockchains"],
            status: "pending",
            resources: {
              books: ["Blockchain Architecture", "Designing Blockchain Systems"],
              courses: ["Blockchain Architecture - edX", "Custom Chains"],
              platforms: ["Substrate", "Tendermint", "Hyperledger"]
            }
          },
          {
            id: 12,
            title: "DAO Development",
            description: "Build decentralized autonomous organizations",
            duration: "3-4 weeks",
            topics: ["Governance Tokens", "Voting Mechanisms", "Treasury Management", "Proposal Systems", "DAO Frameworks"],
            status: "pending",
            resources: {
              books: ["The Dao of DAOs", "Decentralized Governance"],
              courses: ["DAO Development - Udemy", "Governance"],
              platforms: ["Aragon", "DAOstack", "Colony"]
            }
          },
          {
            id: 13,
            title: "Blockchain Analytics",
            description: "Analyze blockchain data for insights and monitoring",
            duration: "2-3 weeks",
            topics: ["On-Chain Analysis", "Transaction Graphs", "Behavioral Analytics", "Risk Assessment", "Compliance"],
            status: "pending",
            resources: {
              books: ["Blockchain Analytics", "Crypto Crime"],
              courses: ["Blockchain Analytics - Coursera", "Forensics"],
              platforms: ["Chainalysis", "Elliptic", "Glassnode"]
            }
          },
          {
            id: 14,
            title: "Enterprise Blockchain",
            description: "Implement blockchain solutions for businesses",
            duration: "4-5 weeks",
            topics: ["Permissioned Chains", "Consortium Networks", "Identity Management", "Supply Chain", "Regulatory Compliance"],
            status: "pending",
            resources: {
              books: ["Enterprise Blockchain", "Blockchain for Business"],
              courses: ["Enterprise Blockchain - edX", "Business Applications"],
              platforms: ["Hyperledger", "R3 Corda", "Quorum"]
            }
          }
        ]
      }
    },
    aiMl: {
      name: "AI/ML Engineering",
      description: "Master artificial intelligence and machine learning technologies",
      color: "from-pink-500 to-rose-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "Mathematics for ML",
            description: "Essential mathematical foundations for machine learning",
            duration: "4-6 weeks",
            topics: ["Linear Algebra", "Calculus", "Probability", "Statistics", "Optimization"],
            status: "pending",
            resources: {
              books: ["Mathematics for Machine Learning", "Think Stats", "Pattern Recognition and Machine Learning"],
              courses: ["Mathematics for ML - Coursera", "Linear Algebra - Khan Academy", "Statistics 101"],
              platforms: ["Khan Academy", "3Blue1Brown", "Brilliant.org"]
            }
          },
          {
            id: 2,
            title: "Python for ML",
            description: "Learn Python programming for machine learning applications",
            duration: "3-4 weeks",
            topics: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "Jupyter Notebooks"],
            status: "pending",
            resources: {
              books: ["Python for Data Analysis", "Hands-On Machine Learning"],
              courses: ["Python for ML - Udemy", "Data Analysis with Python"],
              platforms: ["Kaggle Learn", "DataCamp", "Google Colab"]
            }
          },
          {
            id: 3,
            title: "ML Fundamentals",
            description: "Core concepts of machine learning algorithms",
            duration: "4-5 weeks",
            topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Overfitting/Underfitting"],
            status: "pending",
            resources: {
              books: ["Hands-On Machine Learning", "Introduction to Statistical Learning"],
              courses: ["ML Course - Andrew Ng", "Applied Data Science"],
              platforms: ["Scikit-learn", "Kaggle", "Fast.ai"]
            }
          }
        ],
        intermediate: [
          {
            id: 4,
            title: "Deep Learning Basics",
            description: "Introduction to neural networks and deep learning",
            duration: "5-6 weeks",
            topics: ["Neural Networks", "Backpropagation", "Activation Functions", "Loss Functions"],
            status: "pending",
            resources: {
              books: ["Deep Learning", "Neural Networks and Deep Learning"],
              courses: ["Deep Learning Specialization", "Practical Deep Learning"],
              platforms: ["TensorFlow", "PyTorch", "Keras"]
            }
          },
          {
            id: 5,
            title: "Computer Vision",
            description: "Image processing and computer vision techniques",
            duration: "4-5 weeks",
            topics: ["Image Processing", "CNNs", "Object Detection", "Image Classification"],
            status: "pending",
            resources: {
              books: ["Computer Vision", "Programming Computer Vision with Python"],
              courses: ["Computer Vision - Udacity", "Deep Learning for CV"],
              platforms: ["OpenCV", "TensorFlow", "PyTorch"]
            }
          },
          {
            id: 6,
            title: "Natural Language Processing",
            description: "Text processing and natural language understanding",
            duration: "4-5 weeks",
            topics: ["Text Preprocessing", "Word Embeddings", "Sentiment Analysis", "Language Models"],
            status: "pending",
            resources: {
              books: ["Speech and Language Processing", "Natural Language Processing with Python"],
              courses: ["NLP - Coursera", "Natural Language Understanding"],
              platforms: ["NLTK", "spaCy", "Hugging Face"]
            }
          }
        ],
        advanced: [
          {
            id: 7,
            title: "Advanced Deep Learning",
            description: "Advanced neural network architectures and techniques",
            duration: "6-8 weeks",
            topics: ["RNNs", "Transformers", "GANs", "Reinforcement Learning"],
            status: "pending",
            resources: {
              books: ["Deep Learning", "Reinforcement Learning"],
              courses: ["Advanced Deep Learning", "Reinforcement Learning Specialization"],
              platforms: ["TensorFlow", "PyTorch", "Stable-Baselines3"]
            }
          },
          {
            id: 8,
            title: "MLOps & Deployment",
            description: "Deploy and maintain machine learning models in production",
            duration: "4-5 weeks",
            topics: ["Model Deployment", "CI/CD for ML", "Monitoring", "A/B Testing"],
            status: "pending",
            resources: {
              books: ["ML Ops", "Building ML Pipelines"],
              courses: ["MLOps - Coursera", "ML Engineering"],
              platforms: ["MLflow", "Kubeflow", "Seldon"]
            }
          },
          {
            id: 9,
            title: "AI Research & Innovation",
            description: "Cutting-edge AI research and innovation techniques",
            duration: "8-10 weeks",
            topics: ["Research Papers", "Experimentation", "Novel Architectures", "AI Ethics"],
            status: "pending",
            resources: {
              books: ["AI Research Papers", "The Master Algorithm"],
              courses: ["AI Research - edX", "Deep Learning Research"],
              platforms: ["Papers With Code", "ArXiv", "Google AI"]
            }
          }
        ]
      }
    },
    cybersecurity: {
      name: "Cybersecurity",
      description: "Protect systems and networks from digital attacks",
      color: "from-red-500 to-orange-500",
      levels: {
        beginner: [
          {
            id: 1,
            title: "Security Fundamentals",
            description: "Core concepts of cybersecurity and threat landscape",
            duration: "3-4 weeks",
            topics: ["Threats and Vulnerabilities", "Security Principles", "Risk Management", "Compliance"],
            status: "pending",
            resources: {
              books: ["Cybersecurity Basics", "The Basics of Cybersecurity"],
              courses: ["Cybersecurity Fundamentals", "Introduction to Cybersecurity"],
              platforms: ["Cybrary", "TryHackMe", "Hack The Box"]
            }
          },
          {
            id: 2,
            title: "Network Security",
            description: "Protect network infrastructure and communications",
            duration: "4-5 weeks",
            topics: ["Firewalls", "IDS/IPS", "VPN", "Network Protocols", "Packet Analysis"],
            status: "pending",
            resources: {
              books: ["Network Security", "Practical Packet Analysis"],
              courses: ["Network Security - Coursera", "Wireshark Fundamentals"],
              platforms: ["Wireshark", "Nmap", "Nessus"]
            }
          },
          {
            id: 3,
            title: "System Security",
            description: "Secure operating systems and computing environments",
            duration: "4-5 weeks",
            topics: ["Linux Security", "Windows Security", "Access Controls", "Hardening"],
            status: "pending",
            resources: {
              books: ["Linux Security", "Windows Security"],
              courses: ["System Security - Udemy", "Operating System Security"],
              platforms: ["Kali Linux", "Security+", "OSSEC"]
            }
          }
        ],
        intermediate: [
          {
            id: 4,
            title: "Ethical Hacking",
            description: "Learn penetration testing and vulnerability assessment",
            duration: "6-8 weeks",
            topics: ["Reconnaissance", "Scanning", "Exploitation", "Post-Exploitation"],
            status: "pending",
            resources: {
              books: ["Ethical Hacking", "The Hacker Playbook"],
              courses: ["Ethical Hacking - Udemy", "Penetration Testing"],
              platforms: ["Kali Linux", "Metasploit", "Burp Suite"]
            }
          },
          {
            id: 5,
            title: "Web Application Security",
            description: "Secure web applications from common vulnerabilities",
            duration: "5-6 weeks",
            topics: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "Authentication"],
            status: "pending",
            resources: {
              books: ["Web Security", "The Web Application Hacker's Handbook"],
              courses: ["Web Security - Coursera", "Secure Coding"],
              platforms: ["OWASP", "Burp Suite", "ZAP"]
            }
          },
          {
            id: 6,
            title: "Cryptography",
            description: "Implement cryptographic techniques for data protection",
            duration: "4-5 weeks",
            topics: ["Encryption Algorithms", "Digital Signatures", "PKI", "Hash Functions"],
            status: "pending",
            resources: {
              books: ["Cryptography Engineering", "Applied Cryptography"],
              courses: ["Cryptography - Coursera", "Crypto 101"],
              platforms: ["OpenSSL", "GPG", "Hashcat"]
            }
          }
        ],
        advanced: [
          {
            id: 7,
            title: "Incident Response",
            description: "Respond to and manage security incidents effectively",
            duration: "5-6 weeks",
            topics: ["Forensics", "Malware Analysis", "Threat Hunting", "IR Procedures"],
            status: "pending",
            resources: {
              books: ["Incident Response", "Digital Forensics"],
              courses: ["Incident Response - edX", "Digital Forensics"],
              platforms: ["Splunk", "Volatility", "SIFT"]
            }
          },
          {
            id: 8,
            title: "Security Architecture",
            description: "Design and implement secure system architectures",
            duration: "6-8 weeks",
            topics: ["Zero Trust", "Cloud Security", "Network Design", "Security Controls"],
            status: "pending",
            resources: {
              books: ["Security Architecture", "Enterprise Security"],
              courses: ["Security Architecture - Coursera", "Cloud Security"],
              platforms: ["AWS Security", "Azure Security", "GCP Security"]
            }
          },
          {
            id: 9,
            title: "Advanced Threat Detection",
            description: "Detect and analyze advanced persistent threats",
            duration: "8-10 weeks",
            topics: ["APT Analysis", "Behavioral Analytics", "Threat Intelligence", "SIEM"],
            status: "pending",
            resources: {
              books: ["Threat Detection", "Advanced Persistent Threats"],
              courses: ["Threat Detection - Udemy", "SIEM Management"],
              platforms: ["Splunk", "ELK Stack", "QRadar"]
            }
          }
        ]
      }
    }
  };

  // Animate nodes sequentially when track or level changes
  useEffect(() => {
    const currentLevelModules = roadmapTracks[activeTrack].levels[activeLevel];
    setAnimatedNodes([]);
    
    const timer = setTimeout(() => {
      currentLevelModules.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedNodes(prev => [...prev, index]);
        }, index * 300);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTrack, activeLevel]);

  // Enhanced animation for flow visualization
  useEffect(() => {
    if (flowRef.current) {
      const connectors = flowRef.current.querySelectorAll('.flow-connector');
      connectors.forEach((connector, index) => {
        setTimeout(() => {
          connector.style.animation = 'connectionFlow 2s infinite linear';
        }, index * 500);
      });
    }
  }, [activeTrack, activeLevel]);

  const toggleResourceExpansion = (moduleId, resourceType) => {
    setExpandedResources(prev => ({
      ...prev,
      [`${moduleId}-${resourceType}`]: !prev[`${moduleId}-${resourceType}`]
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'pending': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  // Get the current track data
  const currentTrack = roadmapTracks[activeTrack];
  const currentLevelModules = currentTrack.levels[activeLevel];

  // Inject custom styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Learning Roadmaps
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive learning paths for different technology domains
            </p>
          </div>

          {/* Technology Track Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {Object.entries(roadmapTracks).map(([key, track]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTrack(key);
                  setActiveLevel("beginner");
                }}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTrack === key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>

          {/* Track Description */}
          <div className="text-center mb-12">
            <p className="text-base text-gray-600 max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              {currentTrack.description}
            </p>
          </div>

          {/* Level Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeLevel === level
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)} Path
              </button>
            ))}
          </div>

          {/* Flow-based Roadmap Visualization with Animation */}
          <div className="relative mb-20" ref={flowRef}>
            {/* Animated flow line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-indigo-500 to-purple-400 transform -translate-x-1/2 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-flow"></div>
            </div>
            
            {/* Modules in flow format with animation */}
            <div className="space-y-8">
              {currentLevelModules.map((module, index) => (
                <div 
                  key={module.id} 
                  className={`relative flex items-center transition-all duration-700 ${
                    animatedNodes.includes(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  } ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Flow node */}
                  <div className={`absolute left-1/2 w-7 h-7 rounded-full bg-indigo-600 border-4 border-white z-10 transform -translate-x-1/2 transition-all duration-500 shadow-md flow-node ${
                    animatedNodes.includes(index) ? 'animate-bounce' : ''
                  }`}>
                    {animatedNodes.includes(index) && (
                      <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-50 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Connection lines between nodes */}
                  {index < currentLevelModules.length - 1 && (
                    <svg className="absolute left-1/2 top-12 w-1 h-12 transform -translate-x-1/2" style={{ zIndex: 5 }}>
                      <line 
                        x1="0.5" 
                        y1="0" 
                        x2="0.5" 
                        y2="48" 
                        stroke="url(#gradient)" 
                        strokeWidth="1.5"
                        className="flow-connector"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="50%" stopColor="#06B6D4" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                  
                  {/* Module card */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                    <div
                      className="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg cursor-pointer fade-in-up"
                      onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    >
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusClass(module.status)}`}>
                          {getStatusText(module.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">{module.description}</p>
                      <div className="flex flex-wrap justify-between items-center mb-3">
                        <span className="text-indigo-600 font-semibold text-sm">{module.duration}</span>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-gray-700 font-semibold mb-2 text-sm">Key Topics:</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg border border-indigo-100"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Expandable Resources Section */}
                      {selectedModule === module.id && (
                        <div className="border-t border-gray-200 pt-4 mt-4 animate-fadeIn">
                          <h4 className="text-gray-700 font-semibold mb-3 text-sm">Learning Resources:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 transition-all duration-300 hover:border-emerald-400">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-emerald-700 font-semibold text-sm flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                  </svg>
                                  Books
                                </h5>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'books');
                                  }}
                                  className="text-emerald-600 hover:text-emerald-800"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 transform transition-transform ${expandedResources[`${module.id}-books`] ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              <ul className={`text-gray-600 text-xs space-y-1 ${expandedResources[`${module.id}-books`] ? '' : 'max-h-20 overflow-hidden'}`}>
                                {module.resources.books.map((book, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-emerald-600 mr-2 mt-1">•</span>
                                    <span>{book}</span>
                                  </li>
                                ))}
                              </ul>
                              {module.resources.books.length > 3 && !expandedResources[`${module.id}-books`] && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'books');
                                  }}
                                  className="text-emerald-600 text-xs mt-1 hover:text-emerald-800"
                                >
                                  Show more...
                                </button>
                              )}
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 transition-all duration-300 hover:border-blue-400">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-blue-700 font-semibold text-sm flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                  Courses
                                </h5>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'courses');
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 transform transition-transform ${expandedResources[`${module.id}-courses`] ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              <ul className={`text-gray-600 text-xs space-y-1 ${expandedResources[`${module.id}-courses`] ? '' : 'max-h-20 overflow-hidden'}`}>
                                {module.resources.courses.map((course, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-600 mr-2 mt-1">•</span>
                                    <span>{course}</span>
                                  </li>
                                ))}
                              </ul>
                              {module.resources.courses.length > 3 && !expandedResources[`${module.id}-courses`] && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'courses');
                                  }}
                                  className="text-blue-600 text-xs mt-1 hover:text-blue-800"
                                >
                                  Show more...
                                </button>
                              )}
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 transition-all duration-300 hover:border-purple-400">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-purple-700 font-semibold text-sm flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  Platforms
                                </h5>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'platforms');
                                  }}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 transform transition-transform ${expandedResources[`${module.id}-platforms`] ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              <ul className={`text-gray-600 text-xs space-y-1 ${expandedResources[`${module.id}-platforms`] ? '' : 'max-h-20 overflow-hidden'}`}>
                                {module.resources.platforms.map((platform, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-purple-600 mr-2 mt-1">•</span>
                                    <span>{platform}</span>
                                  </li>
                                ))}
                              </ul>
                              {module.resources.platforms.length > 3 && !expandedResources[`${module.id}-platforms`] && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleResourceExpansion(module.id, 'platforms');
                                  }}
                                  className="text-purple-600 text-xs mt-1 hover:text-purple-800"
                                >
                                  Show more...
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Module Progress */}
                          <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <h5 className="text-gray-700 font-semibold mb-2 text-sm">Module Progress Tracker</h5>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-600 text-xs">Completion Status</span>
                              <span className="text-indigo-600 text-xs font-bold">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: '45%' }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-3">
                              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition-colors border border-gray-300">
                                Mark as Completed
                              </button>
                              <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition-colors">
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Toggle Button */}
                      <div className="flex justify-center mt-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModule(selectedModule === module.id ? null : module.id);
                          }}
                        >
                          {selectedModule === module.id ? 'Show Less' : 'Show Resources'}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 transition-transform duration-300 ${selectedModule === module.id ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="mt-16 bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Recommended Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 transition-all duration-300 hover:border-emerald-400 hover:shadow-md">
                <div className="text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Books</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-3 mt-1">•</span>
                    <span>Introduction to Algorithms by Cormen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-3 mt-1">•</span>
                    <span>Clean Code by Robert Martin</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-3 mt-1">•</span>
                    <span>Designing Data-Intensive Applications</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 transition-all duration-300 hover:border-blue-400 hover:shadow-md">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Online Platforms</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span>LeetCode</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span>HackerRank</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span>GeeksforGeeks</span>
                  </li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 transition-all duration-300 hover:border-purple-400 hover:shadow-md">
                <div className="text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Courses</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>MIT 6.006 Introduction to Algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Stanford Algorithms Specialization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Xalora Masterclass</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Community Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Community & Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Discussion Forums</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Join our community to discuss concepts, ask questions, and share knowledge with fellow learners.</p>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm transition-colors">
                    Join Community
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Mentorship Program</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Get personalized guidance from industry experts to accelerate your learning journey.</p>
                  <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center text-sm transition-colors">
                    Find a Mentor
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;