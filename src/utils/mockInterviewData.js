// Mock Interview Data for Testing

export const mockQuestions = {
  formal_qa: [
    {
      id: 1,
      question: "Tell me about yourself and your professional background.",
      round: "Formal Q&A",
      number: 1,
      total: 20,
      audioUrl: null
    },
    {
      id: 2,
      question: "What attracted you to this position and our company?",
      round: "Formal Q&A",
      number: 2,
      total: 20,
      audioUrl: null
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      round: "Formal Q&A",
      number: 3,
      total: 20,
      audioUrl: null
    },
    {
      id: 4,
      question: "How do you handle working in a team environment?",
      round: "Formal Q&A",
      number: 4,
      total: 20,
      audioUrl: null
    },
    {
      id: 5,
      question: "What are your strengths and weaknesses?",
      round: "Formal Q&A",
      number: 5,
      total: 20,
      audioUrl: null
    }
  ],
  technical: [
    {
      id: 1,
      question: "Can you explain the difference between REST and GraphQL APIs? When would you choose one over the other?",
      round: "Technical",
      number: 1,
      total: 50,
      audioUrl: null
    },
    {
      id: 2,
      question: "What is the difference between SQL and NoSQL databases? Give examples of when to use each.",
      round: "Technical",
      number: 2,
      total: 50,
      audioUrl: null
    },
    {
      id: 3,
      question: "Explain microservices architecture and its advantages over monolithic architecture.",
      round: "Technical",
      number: 3,
      total: 50,
      audioUrl: null
    },
    {
      id: 4,
      question: "What is Docker and how does containerization help in deployment?",
      round: "Technical",
      number: 4,
      total: 50,
      audioUrl: null
    },
    {
      id: 5,
      question: "Describe the CI/CD pipeline and its importance in modern development.",
      round: "Technical",
      number: 5,
      total: 50,
      audioUrl: null
    }
  ],
  behavioral: [
    {
      id: 1,
      question: "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
      round: "Behavioral",
      number: 1,
      total: 20,
      audioUrl: null
    },
    {
      id: 2,
      question: "Describe a situation where you had to meet a tight deadline. How did you manage it?",
      round: "Behavioral",
      number: 2,
      total: 20,
      audioUrl: null
    },
    {
      id: 3,
      question: "Give an example of when you had to learn something new quickly.",
      round: "Behavioral",
      number: 3,
      total: 20,
      audioUrl: null
    },
    {
      id: 4,
      question: "Tell me about a time you failed and what you learned from it.",
      round: "Behavioral",
      number: 4,
      total: 20,
      audioUrl: null
    },
    {
      id: 5,
      question: "Describe a situation where you took initiative and led a project.",
      round: "Behavioral",
      number: 5,
      total: 20,
      audioUrl: null
    }
  ],
  system_design: [
    {
      id: 1,
      question: "Design a URL shortening service like bit.ly. What are the key components?",
      round: "System Design",
      number: 1,
      total: 20,
      audioUrl: null
    },
    {
      id: 2,
      question: "How would you design a real-time chat application?",
      round: "System Design",
      number: 2,
      total: 20,
      audioUrl: null
    },
    {
      id: 3,
      question: "Design a distributed cache system. What challenges would you face?",
      round: "System Design",
      number: 3,
      total: 20,
      audioUrl: null
    },
    {
      id: 4,
      question: "How would you design a video streaming platform like YouTube?",
      round: "System Design",
      number: 4,
      total: 20,
      audioUrl: null
    },
    {
      id: 5,
      question: "Design a rate limiting system for an API.",
      round: "System Design",
      number: 5,
      total: 20,
      audioUrl: null
    }
  ]
};

export const mockAnswers = {
  excellent: [
    "REST is a traditional API architecture where you have fixed endpoints for each resource. GraphQL allows clients to request exactly what they need, reducing over-fetching and under-fetching. I would choose REST for simple, well-defined APIs with stable schemas, and GraphQL for complex applications with diverse client needs and frequent schema changes.",
    "SQL databases are relational and work well for structured data with ACID compliance. NoSQL databases are better for unstructured data and horizontal scaling. I'd use SQL for financial systems and NoSQL for real-time analytics or content management.",
    "Microservices break down applications into small, independent services. This allows teams to work independently, scale services individually, and deploy faster. However, it adds complexity in communication and data consistency."
  ],
  good: [
    "REST uses HTTP methods and endpoints. GraphQL uses a single endpoint with queries. REST is simpler but GraphQL is more flexible.",
    "SQL is for structured data, NoSQL for unstructured. SQL has ACID, NoSQL is more scalable.",
    "Microservices are small services that work together. They're better than monoliths for scaling."
  ],
  fair: [
    "REST and GraphQL are both APIs. GraphQL is newer. I think GraphQL is better.",
    "SQL and NoSQL are different databases. SQL is older.",
    "Microservices are services that are small."
  ],
  poor: [
    "I'm not sure about the difference.",
    "They're both databases I think.",
    "I don't know much about this."
  ]
};

export const mockFeedback = {
  excellent: {
    type: 'excellent',
    message: '✨ Excellent explanation! Great technical depth and real-world examples.',
    score: 90
  },
  good: {
    type: 'good',
    message: '👍 Good answer! You covered the main points well.',
    score: 75
  },
  fair: {
    type: 'fair',
    message: '🤔 Fair answer. Can you elaborate more on the technical details?',
    score: 60
  },
  poor: {
    type: 'poor',
    message: '❌ Let me ask a follow-up question to clarify your understanding.',
    score: 40
  }
};

export const mockInterruptions = [
  {
    type: 'time_running_out',
    message: '⏰ We\'re running short on time. Please wrap up your answer.'
  },
  {
    type: 'off_track',
    message: '📍 That\'s interesting, but let me refocus on the main question.'
  },
  {
    type: 'clarification',
    message: '🤔 I didn\'t quite understand. Can you clarify that point?'
  },
  {
    type: 'follow_up',
    message: '💡 Let me ask a follow-up question based on your answer.'
  }
];

export const mockReportData = {
  candidateName: "John Doe",
  position: "Senior Backend Engineer",
  date: new Date().toLocaleDateString(),
  overallScore: 85,
  rounds: [
    { name: 'Resume Analysis', score: 90, status: 'excellent' },
    { name: 'Formal Q&A', score: 85, status: 'good' },
    { name: 'Technical', score: 82, status: 'good' },
    { name: 'Behavioral', score: 88, status: 'excellent' },
    { name: 'System Design', score: 80, status: 'good' }
  ],
  strengths: [
    'Excellent communication skills',
    'Strong understanding of system design',
    'Good problem-solving approach',
    'Clear and structured answers'
  ],
  weaknesses: [
    'Could improve on dynamic programming concepts',
    'Need more practice with time complexity analysis',
    'Some answers were too brief'
  ],
  recommendations: [
    'Review LeetCode medium-hard problems',
    'Practice explaining code while writing',
    'Work on providing more detailed examples'
  ]
};

export const mockCandidateInfo = {
  name: "John Doe",
  age: 28,
  gender: "male",
  experience: "5 years",
  position: "Senior Backend Engineer",
  companyType: "product_based",
  interviewMode: "full"
};

// Function to get random question from a round
export const getRandomQuestion = (round) => {
  const questions = mockQuestions[round] || [];
  return questions[Math.floor(Math.random() * questions.length)];
};

// Function to get random answer
export const getRandomAnswer = (quality) => {
  const answers = mockAnswers[quality] || mockAnswers.fair;
  return answers[Math.floor(Math.random() * answers.length)];
};

// Function to get feedback based on answer quality
export const getFeedbackForQuality = (quality) => {
  return mockFeedback[quality] || mockFeedback.fair;
};

// Function to get random interruption
export const getRandomInterruption = () => {
  return mockInterruptions[Math.floor(Math.random() * mockInterruptions.length)];
};

// Function to simulate AI thinking time
export const getThinkingTime = () => {
  return 2000 + Math.random() * 1000; // 2-3 seconds
};

// Function to simulate answer evaluation
export const evaluateAnswer = (answer) => {
  const length = answer.split(' ').length;
  
  if (length > 100) {
    return 'excellent';
  } else if (length > 50) {
    return 'good';
  } else if (length > 20) {
    return 'fair';
  } else {
    return 'poor';
  }
};
