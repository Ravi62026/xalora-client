export const SEO_CONFIG = {
  // ─── Basic Site Information ────────────────────────────────────────────────
  site: {
    name: 'Xalora',
    tagline: 'AI-Powered Mock Interview Platform',
    url: 'https://xalora.one',
    description: 'Practice AI-powered mock interviews for FAANG, startups & product companies. Get instant feedback, improve coding skills, and land your dream job.',
    keywords: [
      'Xalora',
      'xalora',
      'xalora.one',
      'AI mock interview',
      'coding interview practice',
      'FAANG preparation',
      'technical interview questions',
      'system design interview',
      'DSA practice online',
      'AI interview platform',
      'mock interview free India',
      'product company interview',
      'software engineer interview prep',
      'leetcode alternative India',
      'AI interview platform India',
      'mock interview app'
    ].join(', '),
    author: 'Xalora Team',
    robots: 'index, follow',
    language: 'en_US',
    themeColor: '#3B82F6'
  },

  // ─── Social Media Handles ──────────────────────────────────────────────────
  social: {
    twitter: '@xalora_ai',
    linkedin: 'company/xalora',
    github: 'xalora',
    youtube: '@xalora-ai',
    instagram: 'xalora.ai'
  },

  // ─── Contact Information ───────────────────────────────────────────────────
  contact: {
    email: 'support@xalora.one',
    supportEmail: 'support@xalora.one',
    businessEmail: 'business@xalora.one'
  },

  // ─── Page-Specific Meta Tags ───────────────────────────────────────────────
  pages: {
    home: {
      title: 'Xalora - AI Mock Interview Platform | Practice & Get Hired',
      description: 'Master your technical interviews with AI-powered mock interviews. Practice DSA, system design, behavioral questions. Used by 10,000+ students. Start free today!',
      keywords: 'Xalora, xalora.one, AI mock interview, coding interview, FAANG preparation, technical interview, DSA practice, system design, behavioral interview, mock interview platform India',
      canonical: '/',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'WebSite',
        name: 'Xalora',
        url: 'https://xalora.one',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://xalora.one/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    },

    aiInterview: {
      title: 'AI Mock Interview - Practice Technical Interviews | Xalora',
      description: 'Experience realistic AI-powered mock interviews for software engineering roles. 7 rounds including coding, system design, behavioral. Get instant feedback & detailed reports.',
      keywords: 'AI mock interview, technical interview simulator, coding interview AI, system design interview practice, behavioral interview AI',
      canonical: '/ai-interview',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Xalora AI Interview',
        applicationCategory: 'Education',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '2500',
          bestRating: '5',
          worstRating: '1'
        }
      }
    },

    codingProblems: {
      title: 'DSA Coding Problems - Practice for Interviews | Xalora',
      description: 'Solve 500+ DSA problems curated from FAANG interviews. Easy to Hard difficulty. Detailed explanations, test cases, and AI code review.',
      keywords: 'DSA problems, coding questions, leetcode alternatives, FAANG coding questions, data structures problems, algorithms practice',
      canonical: '/coding-problems',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'LearningResource',
        name: 'Xalora DSA Problems',
        educationalLevel: 'Intermediate to Advanced',
        teaches: ['Data Structures', 'Algorithms', 'Problem Solving']
      }
    },

    quizzes: {
      title: 'Tech Quizzes - Test Your Knowledge | Xalora',
      description: 'Take timed quizzes on DSA, System Design, OOPs, DBMS, Computer Networks. Earn JBP coins. Get certificates. Track your progress.',
      keywords: 'tech quizzes, CS quizzes, DSA quiz, system design quiz, computer science MCQ, technical quiz with certificate',
      canonical: '/quizzes',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'Quiz',
        name: 'Xalora Tech Quizzes',
        educationalLevel: 'All Levels'
      }
    },

    internships: {
      title: 'Virtual Internships - Real Projects | Xalora',
      description: 'Work on real-world projects with mentor guidance. Get internship certificates. Build portfolio. Improve your chances of getting hired.',
      keywords: 'virtual internships, online internships, tech internships, programming internships, internship with certificate, remote internships',
      canonical: '/internships',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'EducationalOccupationalProgram',
        name: 'Xalora Virtual Internships',
        provides: 'Internship Certificate'
      }
    },

    pricing: {
      title: 'Pricing Plans - Free & Premium | Xalora',
      description: 'Start free with Spark plan. Upgrade to Pulse, Nexus, or Infinity for unlimited AI interviews, advanced features. Student discounts available.',
      keywords: 'Xalora pricing, AI interview cost, mock interview free, premium features, student discount',
      canonical: '/pricing',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'Product',
        name: 'Xalora Premium',
        offers: [
          {
            '@type': 'Offer',
            name: 'Spark (Free)',
            price: '0',
            priceCurrency: 'INR'
          },
          {
            '@type': 'Offer',
            name: 'Pulse',
            price: '499',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          },
          {
            '@type': 'Offer',
            name: 'Nexus',
            price: '999',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          },
          {
            '@type': 'Offer',
            name: 'Infinity',
            price: '1999',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          }
        ]
      }
    },

    about: {
      title: 'About Xalora - Mission & Story',
      description: 'Xalora is on a mission to democratize interview preparation. Founded by IITians, we help students crack their dream jobs with AI-powered practice.',
      keywords: 'about Xalora, Xalora story, who made Xalora, Xalora founders, AI interview platform India',
      canonical: '/about',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'Organization',
        name: 'Xalora',
        url: 'https://xalora.one',
        logo: 'https://xalora.one/logo.png',
        description: 'AI-powered mock interview platform for technical job preparation',
        founder: {
          '@type': 'Person',
          name: 'Xalora Team'
        },
        foundingDate: '2025',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN'
        }
      }
    },

    contact: {
      title: 'Contact Us - Get in Touch | Xalora',
      description: 'Have questions? Reach out to our support team. We\'re here to help you succeed in your interview journey.',
      keywords: 'contact Xalora, Xalora support, help desk, customer support',
      canonical: '/contact',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'ContactPage',
        name: 'Contact Xalora',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@xalora.one'
        }
      }
    },

    blog: {
      title: 'Blog - Interview Tips, Career Advice | Xalora',
      description: 'Read expert articles on cracking FAANG interviews, resume tips, salary negotiation, career growth. Learn from success stories.',
      keywords: 'interview tips, career advice, FAANG guide, resume tips, salary negotiation, tech career',
      canonical: '/blog',
      ogImage: '/logo_xalora.png',
      schema: {
        '@type': 'Blog',
        name: 'Xalora Blog',
        description: 'Interview tips and career advice for software engineers'
      }
    },

    // ─── Algorithm Pages ──────────────────────────────────────────────────────
    algorithms: {
      title: 'Algorithms - Learn & Practice All Algorithm Types | Xalora',
      description: 'Master algorithms for coding interviews. Learn sorting, searching, dynamic programming, graph, tree, greedy, backtracking & more with practice problems.',
      keywords: 'Xalora, algorithms, DSA algorithms, sorting algorithms, searching algorithms, dynamic programming, graph algorithms, coding interview algorithms',
      canonical: '/algorithms',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Xalora Algorithms', educationalLevel: 'Beginner to Advanced', teaches: ['Algorithms', 'Problem Solving'] }
    },
    algorithmsSearching: {
      title: 'Searching Algorithms - Binary Search, Linear Search & More | Xalora',
      description: 'Learn searching algorithms like Binary Search, Linear Search, Interpolation Search. Understand time complexity and solve practice problems.',
      keywords: 'searching algorithms, binary search, linear search, interpolation search, search algorithms DSA',
      canonical: '/algorithms/searching',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Searching Algorithms', teaches: ['Binary Search', 'Linear Search'] }
    },
    algorithmsSorting: {
      title: 'Sorting Algorithms - QuickSort, MergeSort, HeapSort & More | Xalora',
      description: 'Master sorting algorithms: QuickSort, MergeSort, HeapSort, BubbleSort, InsertionSort. Compare time complexities and practice problems.',
      keywords: 'sorting algorithms, quicksort, mergesort, heapsort, bubble sort, insertion sort, sorting DSA',
      canonical: '/algorithms/sorting',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Sorting Algorithms', teaches: ['QuickSort', 'MergeSort', 'HeapSort'] }
    },
    algorithmsFundamentals: {
      title: 'Algorithm Fundamentals - Time & Space Complexity | Xalora',
      description: 'Learn algorithm fundamentals: Big O notation, time complexity, space complexity, recursion basics. Essential for coding interviews.',
      keywords: 'algorithm fundamentals, Big O notation, time complexity, space complexity, recursion, algorithm basics',
      canonical: '/algorithms/fundamentals',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Algorithm Fundamentals', teaches: ['Big O Notation', 'Complexity Analysis'] }
    },
    algorithmsDp: {
      title: 'Dynamic Programming - DP Problems & Patterns | Xalora',
      description: 'Master Dynamic Programming for FAANG interviews. Learn memoization, tabulation, common DP patterns like knapsack, LCS, LIS with practice problems.',
      keywords: 'dynamic programming, DP problems, memoization, tabulation, knapsack problem, LCS, LIS, FAANG DP questions',
      canonical: '/algorithms/dynamic-programming',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Dynamic Programming', teaches: ['Memoization', 'Tabulation', 'DP Patterns'] }
    },
    algorithmsGreedy: {
      title: 'Greedy Algorithms - Activity Selection, Huffman & More | Xalora',
      description: 'Learn greedy algorithms: Activity Selection, Huffman Coding, Fractional Knapsack, Job Scheduling. Practice greedy approach problems.',
      keywords: 'greedy algorithms, activity selection, huffman coding, fractional knapsack, greedy approach DSA',
      canonical: '/algorithms/greedy',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Greedy Algorithms', teaches: ['Greedy Approach', 'Optimization'] }
    },
    algorithmsGraph: {
      title: 'Graph Algorithms - BFS, DFS, Dijkstra, MST | Xalora',
      description: 'Master graph algorithms: BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim, Topological Sort. Essential for FAANG coding interviews.',
      keywords: 'graph algorithms, BFS, DFS, Dijkstra algorithm, shortest path, MST, topological sort, graph DSA',
      canonical: '/algorithms/graph',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Graph Algorithms', teaches: ['BFS', 'DFS', 'Shortest Path'] }
    },
    algorithmsTree: {
      title: 'Tree Algorithms - BST, AVL, Traversals & More | Xalora',
      description: 'Learn tree algorithms: Binary Search Tree, AVL Tree, tree traversals (inorder, preorder, postorder), segment tree, trie. Practice tree problems.',
      keywords: 'tree algorithms, BST, AVL tree, tree traversal, inorder, preorder, postorder, segment tree, trie',
      canonical: '/algorithms/tree',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Tree Algorithms', teaches: ['BST', 'Tree Traversals'] }
    },
    algorithmsString: {
      title: 'String Algorithms - KMP, Rabin-Karp, Pattern Matching | Xalora',
      description: 'Master string algorithms: KMP, Rabin-Karp, Z-algorithm, suffix arrays. Solve string manipulation and pattern matching problems.',
      keywords: 'string algorithms, KMP algorithm, Rabin-Karp, pattern matching, string manipulation, Z-algorithm',
      canonical: '/algorithms/string',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'String Algorithms', teaches: ['Pattern Matching', 'String Processing'] }
    },
    algorithmsBacktracking: {
      title: 'Backtracking Algorithms - N-Queens, Sudoku Solver | Xalora',
      description: 'Learn backtracking: N-Queens, Sudoku Solver, Permutations, Combinations, Subset Sum. Master recursive backtracking patterns.',
      keywords: 'backtracking algorithms, N-Queens, sudoku solver, permutations, combinations, subset sum, recursive backtracking',
      canonical: '/algorithms/backtracking',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Backtracking Algorithms', teaches: ['Backtracking', 'Constraint Satisfaction'] }
    },
    algorithmsMath: {
      title: 'Mathematical Algorithms - GCD, Sieve, Modular Arithmetic | Xalora',
      description: 'Learn mathematical algorithms: GCD, Sieve of Eratosthenes, modular arithmetic, prime numbers, number theory for competitive programming.',
      keywords: 'mathematical algorithms, GCD, sieve of eratosthenes, modular arithmetic, prime numbers, number theory',
      canonical: '/algorithms/mathematical',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Mathematical Algorithms', teaches: ['Number Theory', 'Modular Arithmetic'] }
    },
    algorithmsGeometric: {
      title: 'Geometric Algorithms - Convex Hull, Line Intersection | Xalora',
      description: 'Learn computational geometry: Convex Hull, Line Intersection, closest pair of points. Practice geometric algorithm problems.',
      keywords: 'geometric algorithms, convex hull, line intersection, computational geometry, closest pair of points',
      canonical: '/algorithms/geometric',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Geometric Algorithms', teaches: ['Computational Geometry'] }
    },
    algorithmsRandomized: {
      title: 'Randomized Algorithms - Monte Carlo, Las Vegas | Xalora',
      description: 'Learn randomized algorithms: Monte Carlo, Las Vegas algorithms, randomized quicksort, skip lists. Understand probabilistic analysis.',
      keywords: 'randomized algorithms, Monte Carlo, Las Vegas algorithm, probabilistic algorithms, randomized quicksort',
      canonical: '/algorithms/randomized',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Randomized Algorithms', teaches: ['Probabilistic Analysis'] }
    },

    // ─── Data Structure Pages ─────────────────────────────────────────────────
    dataStructures: {
      title: 'Data Structures - Learn All DS Types for Interviews | Xalora',
      description: 'Master data structures for coding interviews. Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hash Tables & more with practice problems.',
      keywords: 'Xalora, data structures, DSA, arrays, linked lists, stacks, queues, hash tables, trees, graphs, coding interview DS',
      canonical: '/data-structures',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Xalora Data Structures', educationalLevel: 'Beginner to Advanced', teaches: ['Data Structures'] }
    },
    dsBasic: {
      title: 'Basic Data Structures - Arrays, Strings, Records | Xalora',
      description: 'Learn basic data structures: arrays, strings, records, and primitive types. Foundation for all DSA learning.',
      keywords: 'basic data structures, arrays, strings, primitive data types, DSA basics',
      canonical: '/data-structures/basic',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Basic Data Structures', teaches: ['Arrays', 'Strings'] }
    },
    dsLinear: {
      title: 'Linear Data Structures - Linked Lists, Stacks, Queues | Xalora',
      description: 'Learn linear data structures: Linked Lists, Stacks, Queues, Deques. Understand operations, implementations and interview questions.',
      keywords: 'linear data structures, linked list, stack, queue, deque, linear DS',
      canonical: '/data-structures/linear',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Linear Data Structures', teaches: ['Linked Lists', 'Stacks', 'Queues'] }
    },
    dsArrays: {
      title: 'Arrays - Operations, Problems & Interview Questions | Xalora',
      description: 'Master arrays: operations, two-pointer technique, sliding window, kadane algorithm. Solve top array interview questions from FAANG.',
      keywords: 'arrays, array problems, two pointer, sliding window, kadane algorithm, array interview questions',
      canonical: '/data-structures/arrays',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Arrays', teaches: ['Array Operations', 'Two Pointer Technique'] }
    },
    dsLinkedLists: {
      title: 'Linked Lists - Singly, Doubly, Circular | Xalora',
      description: 'Learn linked lists: singly, doubly, circular linked lists. Master operations like reversal, cycle detection, merge sorted lists.',
      keywords: 'linked list, singly linked list, doubly linked list, circular linked list, linked list problems',
      canonical: '/data-structures/linked-lists',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Linked Lists', teaches: ['Singly Linked List', 'Doubly Linked List'] }
    },
    dsStacks: {
      title: 'Stacks - LIFO, Implementation & Problems | Xalora',
      description: 'Learn stacks: LIFO principle, array & linked list implementation, expression evaluation, balanced parentheses. Practice stack problems.',
      keywords: 'stack data structure, LIFO, stack implementation, expression evaluation, balanced parentheses, stack problems',
      canonical: '/data-structures/stacks',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Stacks', teaches: ['Stack Operations', 'LIFO'] }
    },
    dsQueues: {
      title: 'Queues - FIFO, Priority Queue, Deque | Xalora',
      description: 'Learn queues: FIFO principle, circular queue, priority queue, deque. Understand BFS, task scheduling and queue interview questions.',
      keywords: 'queue data structure, FIFO, priority queue, deque, circular queue, BFS, queue problems',
      canonical: '/data-structures/queues',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Queues', teaches: ['Queue Operations', 'Priority Queue'] }
    },
    dsHashBased: {
      title: 'Hash-Based Data Structures - Hash Tables, Maps, Sets | Xalora',
      description: 'Learn hash-based data structures: Hash Tables, Hash Maps, Hash Sets, Bloom Filters, Consistent Hashing. Master hashing techniques.',
      keywords: 'hash table, hash map, hash set, bloom filter, consistent hashing, hashing, hash function',
      canonical: '/data-structures/hash-based',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Hash-Based Data Structures', teaches: ['Hashing', 'Hash Tables'] }
    },
    dsHashTables: {
      title: 'Hash Tables - Implementation, Collision Handling | Xalora',
      description: 'Learn hash tables: hash functions, collision resolution (chaining, open addressing), load factor. Essential for coding interviews.',
      keywords: 'hash table, hash function, collision resolution, chaining, open addressing, hash table implementation',
      canonical: '/data-structures/hash-based/hash-tables',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Hash Tables', teaches: ['Hash Functions', 'Collision Resolution'] }
    },
    dsHashMaps: {
      title: 'Hash Maps - Key-Value Pairs & Implementation | Xalora',
      description: 'Learn hash maps: key-value storage, operations, Java HashMap, Python dict. Solve hash map interview problems.',
      keywords: 'hash map, key value pair, hashmap implementation, dictionary, hash map problems',
      canonical: '/data-structures/hash-based/hash-maps',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Hash Maps', teaches: ['Key-Value Storage'] }
    },
    dsHashSets: {
      title: 'Hash Sets - Unique Elements & Set Operations | Xalora',
      description: 'Learn hash sets: unique element storage, set operations (union, intersection, difference). Practice hash set problems.',
      keywords: 'hash set, set operations, unique elements, union, intersection, difference, hash set problems',
      canonical: '/data-structures/hash-based/hash-sets',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Hash Sets', teaches: ['Set Operations'] }
    },
    dsBloomFilters: {
      title: 'Bloom Filters - Probabilistic Data Structure | Xalora',
      description: 'Learn Bloom Filters: probabilistic membership testing, false positives, applications in caching, spam filtering, databases.',
      keywords: 'bloom filter, probabilistic data structure, membership testing, false positive, bloom filter applications',
      canonical: '/data-structures/hash-based/bloom-filters',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Bloom Filters', teaches: ['Probabilistic Data Structures'] }
    },
    dsConsistentHashing: {
      title: 'Consistent Hashing - Distributed Systems | Xalora',
      description: 'Learn consistent hashing for distributed systems: virtual nodes, ring-based hashing, load balancing. Key system design concept.',
      keywords: 'consistent hashing, distributed systems, virtual nodes, ring hashing, load balancing, system design',
      canonical: '/data-structures/hash-based/consistent-hashing',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Consistent Hashing', teaches: ['Distributed Hashing'] }
    },
    dsPerfectHashing: {
      title: 'Perfect Hashing - Zero Collision Hashing | Xalora',
      description: 'Learn perfect hashing: minimal perfect hash functions, FKS scheme, zero collision guarantee. Advanced hashing technique.',
      keywords: 'perfect hashing, minimal perfect hash, FKS scheme, zero collision, perfect hash function',
      canonical: '/data-structures/hash-based/perfect-hashing',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Perfect Hashing', teaches: ['Perfect Hash Functions'] }
    },
    dsCuckooHashing: {
      title: 'Cuckoo Hashing - O(1) Worst-Case Lookup | Xalora',
      description: 'Learn cuckoo hashing: O(1) worst-case lookup, two hash functions, displacement strategy. Advanced hash table implementation.',
      keywords: 'cuckoo hashing, O(1) lookup, two hash functions, displacement, cuckoo hash table',
      canonical: '/data-structures/hash-based/cuckoo-hashing',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Cuckoo Hashing', teaches: ['Advanced Hashing'] }
    },

    // ─── Other Public Pages ───────────────────────────────────────────────────
    systemDesign: {
      title: 'System Design - Learn System Design for Interviews | Xalora',
      description: 'Master system design interviews. Learn scalability, load balancing, caching, database design, microservices. Practice real-world system design questions.',
      keywords: 'system design, system design interview, scalability, load balancing, caching, microservices, database design, FAANG system design',
      canonical: '/system-design',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'System Design', educationalLevel: 'Advanced', teaches: ['System Design', 'Scalability'] }
    },
    interviewPrep: {
      title: 'Interview Preparation Guide - Complete Roadmap | Xalora',
      description: 'Complete interview preparation guide for software engineers. DSA roadmap, system design, behavioral questions, resume tips. Crack FAANG interviews.',
      keywords: 'interview preparation, interview guide, DSA roadmap, FAANG prep, coding interview guide, software engineer interview',
      canonical: '/interview-prep',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'LearningResource', name: 'Interview Prep Guide', teaches: ['Interview Preparation'] }
    },
    careers: {
      title: 'Careers at Xalora - Join Our Team',
      description: 'Join Xalora and help democratize interview preparation. We are hiring engineers, designers, and content creators. Remote-first culture.',
      keywords: 'Xalora careers, Xalora jobs, work at Xalora, tech jobs, remote jobs India, startup careers',
      canonical: '/careers',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'JobPosting', hiringOrganization: { '@type': 'Organization', name: 'Xalora' } }
    },
    helpCenter: {
      title: 'Help Center - FAQs & Support | Xalora',
      description: 'Get help with Xalora. FAQs, account setup, billing, technical issues. Our support team is here to help you succeed.',
      keywords: 'Xalora help, Xalora FAQ, Xalora support, account help, billing help, technical support',
      canonical: '/help-center',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'FAQPage', name: 'Xalora Help Center' }
    },
    community: {
      title: 'Community - Connect with Fellow Learners | Xalora',
      description: 'Join the Xalora community. Connect with fellow coders, share tips, discuss problems, participate in coding challenges. Learn together.',
      keywords: 'Xalora community, coding community, DSA discussion, coding challenges, peer learning, tech community India',
      canonical: '/community',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Xalora Community' }
    },
    status: {
      title: 'System Status - Uptime & Incidents | Xalora',
      description: 'Check Xalora platform status. View uptime, ongoing incidents, maintenance schedules. All systems operational.',
      keywords: 'Xalora status, system status, uptime, platform status, service health',
      canonical: '/status',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Xalora System Status' }
    },
    roadmap: {
      title: 'Product Roadmap - Upcoming Features | Xalora',
      description: 'See what is coming next on Xalora. Upcoming features, improvements, and community-requested enhancements. Vote on features you want.',
      keywords: 'Xalora roadmap, upcoming features, product roadmap, feature requests, Xalora updates',
      canonical: '/roadmap',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Xalora Product Roadmap' }
    },
    jobGenie: {
      title: 'Job Genie - AI Job Matching & Career Assistant | Xalora',
      description: 'Find your dream job with AI-powered Job Genie. Get personalized job recommendations, resume tips, and interview preparation guidance.',
      keywords: 'job genie, AI job matching, job recommendations, career assistant, job search, AI career guidance',
      canonical: '/job-genie',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'SoftwareApplication', name: 'Xalora Job Genie', applicationCategory: 'Career' }
    },

    // ─── Legal Pages ──────────────────────────────────────────────────────────
    privacy: {
      title: 'Privacy Policy | Xalora',
      description: 'Xalora Privacy Policy. Learn how we collect, use, and protect your personal data. GDPR compliant. Your privacy matters to us.',
      keywords: 'Xalora privacy policy, data protection, GDPR, personal data, privacy',
      canonical: '/privacy',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Privacy Policy' }
    },
    terms: {
      title: 'Terms of Service | Xalora',
      description: 'Xalora Terms of Service. Read our terms and conditions for using the platform. Fair usage, refund policy, and user responsibilities.',
      keywords: 'Xalora terms of service, terms and conditions, user agreement, TOS',
      canonical: '/terms',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Terms of Service' }
    },
    cookies: {
      title: 'Cookie Policy | Xalora',
      description: 'Xalora Cookie Policy. Understand how we use cookies to improve your experience. Manage your cookie preferences.',
      keywords: 'Xalora cookie policy, cookies, tracking, cookie preferences',
      canonical: '/cookies',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Cookie Policy' }
    },
    acceptableUse: {
      title: 'Acceptable Use Policy | Xalora',
      description: 'Xalora Acceptable Use Policy. Guidelines for responsible use of our platform. Prohibited activities and enforcement.',
      keywords: 'Xalora acceptable use policy, usage guidelines, prohibited activities',
      canonical: '/acceptable-use',
      ogImage: '/logo_xalora.png',
      schema: { '@type': 'WebPage', name: 'Acceptable Use Policy' }
    }
  },

  // ─── Structured Data Templates ─────────────────────────────────────────────
  structuredData: {
    // Organization Schema
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Xalora',
      url: 'https://xalora.one',
      logo: 'https://xalora.one/logo.png',
      sameAs: [
        'https://twitter.com/xalora_ai',
        'https://linkedin.com/company/xalora',
        'https://github.com/xalora',
        'https://youtube.com/@xalora-ai',
        'https://instagram.com/xalora.ai'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@xalora.one',
        availableLanguage: 'English'
      }
    },

    // Software Application Schema
    software: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Xalora',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2500',
        bestRating: '5',
        worstRating: '1'
      },
      featureList: [
        'AI-powered mock interviews',
        '7 interview rounds',
        'Instant feedback',
        'Detailed performance reports',
        'DSA problem bank',
        'Tech quizzes',
        'Virtual internships'
      ]
    },

    // FAQ Schema (for FAQ page)
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Xalora free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Xalora offers a free Spark plan with 3 AI interviews per month, 10 daily AI requests, and access to basic features. Premium plans start at ₹499/month.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does the AI interview work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our AI analyzes your resume and generates personalized questions across 7 rounds: Formal Q&A, Coding, Technical, Behavioral, System Design, Resume Deep Dive, and JD-based questions. You get instant feedback and a comprehensive report.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is the AI interview similar to real company interviews?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely! Our AI is trained on thousands of real interview experiences from FAANG and top product companies. The questions, difficulty, and evaluation mimic actual interview processes.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use Xalora for college placements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We offer special college plans with bulk seats, analytics dashboard, and custom interview rounds. Contact business@xalora.one for college partnerships.'
          }
        }
      ]
    },

    // Breadcrumb Schema
    breadcrumb: (items) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }),

    // Article Schema (for blog posts)
    article: (article) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: article.author || 'Xalora Team',
        url: 'https://xalora.one/team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Xalora',
        logo: {
          '@type': 'ImageObject',
          url: 'https://xalora.one/logo.png'
        }
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt
    })
  },

  // ─── Open Graph Image Generator Helper ─────────────────────────────────────
  getOgImageUrl: () => {
    return 'https://xalora.one/logo_xalora.png';
  },

  // ─── Twitter Card Types ────────────────────────────────────────────────────
  twitterCard: {
    home: 'summary_large_image',
    'ai-interview': 'summary_large_image',
    'coding-problems': 'summary',
    quizzes: 'summary',
    internships: 'summary_large_image',
    pricing: 'summary',
    about: 'summary',
    contact: 'summary',
    blog: 'summary_large_image',
    algorithms: 'summary',
    dataStructures: 'summary',
    systemDesign: 'summary_large_image',
    interviewPrep: 'summary_large_image',
    careers: 'summary',
    helpCenter: 'summary',
    community: 'summary_large_image',
    jobGenie: 'summary_large_image'
  }
};

/**
 * Generate complete meta tags for a page
 * @param {string} pageKey - Key from SEO_CONFIG.pages
 * @param {Object} custom - Override default values
 * @returns {Object} Complete meta tags object
 */
export const generateMetaTags = (pageKey, custom = {}) => {
  const page = SEO_CONFIG.pages[pageKey] || SEO_CONFIG.pages.home;
  const { site, social } = SEO_CONFIG;
  const canonicalPath = custom.canonical || page.canonical;
  const canonicalUrl = canonicalPath?.startsWith("http")
    ? canonicalPath
    : `${site.url}${canonicalPath}`;
  const ogImage = custom.ogImage || page.ogImage || SEO_CONFIG.getOgImageUrl(pageKey);

  return {
    // Basic Meta Tags
    title: custom.title || page.title,
    description: custom.description || page.description,
    keywords: custom.keywords || page.keywords,
    author: site.author,
    robots: custom.robots || page.robots || site.robots,

    // Canonical URL
    canonical: canonicalUrl,

    // Open Graph / Facebook
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogTitle: custom.ogTitle || page.title,
    ogDescription: custom.ogDescription || page.description,
    ogImage,
    ogSiteName: site.name,
    ogLocale: site.language,

    // Twitter Card
    twitterCard: SEO_CONFIG.twitterCard[pageKey] || 'summary',
    twitterSite: social.twitter,
    twitterCreator: social.twitter,
    twitterTitle: custom.twitterTitle || page.title,
    twitterDescription: custom.twitterDescription || page.description,
    twitterImage: custom.twitterImage || ogImage,

    // Theme
    themeColor: site.themeColor,

    // Structured Data
    structuredData: page.schema || null
  };
};

export default SEO_CONFIG;
