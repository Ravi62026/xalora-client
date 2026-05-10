const shuffleArray = (items = []) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const APTITUDE_TRACKS = [
  {
    id: "quant",
    label: "Quant",
    title: "Quantitative Aptitude",
    description:
      "Fast arithmetic, business math, and number sense under a timer.",
    durationMinutes: 15,
    questionCount: 5,
    accent: "emerald",
    summary: "Percentages, ratios, time-work, probability, and data reasoning.",
    topics: [
      "Percentages",
      "Ratio & Proportion",
      "Profit & Loss",
      "Time & Work",
      "Probability",
      "Averages",
    ],
    rules: [
      "Speed-first section with no calculator dependency.",
      "Good for campus aptitude rounds and screening tests.",
    ],
  },
  {
    id: "reasoning",
    label: "Reasoning",
    title: "Logical Reasoning",
    description:
      "Pattern spotting, relationship mapping, and puzzle solving.",
    durationMinutes: 15,
    questionCount: 5,
    accent: "cyan",
    summary: "Coding-decoding, direction, series, blood relation, and puzzles.",
    topics: [
      "Coding-Decoding",
      "Direction Sense",
      "Number Series",
      "Blood Relations",
      "Syllogism",
      "Seating Arrangement",
    ],
    rules: [
      "Track patterns before touching options.",
      "Great for accuracy-focused aptitude screening.",
    ],
  },
  {
    id: "verbal",
    label: "Verbal",
    title: "Verbal Ability",
    description:
      "Grammar, comprehension, vocabulary, and sentence precision.",
    durationMinutes: 10,
    questionCount: 5,
    accent: "amber",
    summary: "Sentence correction, cloze test, synonyms, and reading logic.",
    topics: [
      "Grammar",
      "Sentence Correction",
      "Cloze Test",
      "Synonyms & Antonyms",
      "Reading Comprehension",
      "Para Jumbles",
    ],
    rules: [
      "Read the full line before choosing an answer.",
      "Best for communication-heavy hiring rounds.",
    ],
  },
  {
    id: "mixed",
    label: "All",
    title: "Mixed Aptitude",
    description:
      "A balanced screening mix across Quant, Reasoning, and Verbal.",
    durationMinutes: 30,
    questionCount: 9,
    accent: "blue",
    summary: "A realistic full aptitude test with every major topic bucket.",
    topics: [
      "Quant",
      "Reasoning",
      "Verbal",
      "Mixed Screening",
    ],
    rules: [
      "Best for full mock screening and final hiring prep.",
      "Questions are shuffled across sections for realism.",
    ],
  },
];

const QUANT_QUESTIONS = [
  {
    id: "quant-1",
    section: "Quant",
    topic: "Percentages",
    prompt:
      "A shirt marked 20% above cost price is sold at a 10% discount on the marked price. What is the profit percentage?",
    options: ["6%", "8%", "10%", "12%"],
    answerIndex: 1,
    explanation:
      "Marked price becomes 120. After 10% discount, selling price is 108. Profit = 8%.",
  },
  {
    id: "quant-2",
    section: "Quant",
    topic: "Time & Work",
    prompt:
      "A can finish a job in 12 days and B can finish the same job in 18 days. Working together, how long will they take?",
    options: ["6 days", "7.2 days", "8 days", "9 days"],
    answerIndex: 1,
    explanation:
      "Combined work rate is 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days.",
  },
  {
    id: "quant-3",
    section: "Quant",
    topic: "Ratio",
    prompt:
      "The ratio of boys to girls in a class is 3:4. If there are 70 students, how many girls are there?",
    options: ["28", "36", "40", "42"],
    answerIndex: 2,
    explanation:
      "Total parts = 7. Each part = 10. Girls = 4 parts = 40.",
  },
  {
    id: "quant-4",
    section: "Quant",
    topic: "Simple Interest",
    prompt:
      "What is the simple interest on Rs. 1500 at 8% per annum for 3 years?",
    options: ["240", "300", "360", "420"],
    answerIndex: 2,
    explanation:
      "SI = (1500 x 8 x 3) / 100 = 360.",
  },
  {
    id: "quant-5",
    section: "Quant",
    topic: "Probability",
    prompt:
      "A fair die is rolled once. What is the probability of getting a prime number?",
    options: ["1/2", "1/3", "2/3", "5/6"],
    answerIndex: 0,
    explanation: "Prime faces are 2, 3, and 5. That is 3 out of 6 outcomes.",
  },
];

const REASONING_QUESTIONS = [
  {
    id: "reasoning-1",
    section: "Reasoning",
    topic: "Coding-Decoding",
    prompt:
      "If CAT is written as DBU using a simple +1 shift, how will DOG be written?",
    options: ["EPH", "EOG", "CNG", "EPI"],
    answerIndex: 0,
    explanation: "Each letter is shifted one step forward in the alphabet.",
  },
  {
    id: "reasoning-2",
    section: "Reasoning",
    topic: "Number Series",
    prompt: "Find the next number: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "34"],
    answerIndex: 1,
    explanation:
      "The pattern adds 4, 6, 8, then 10. So the next number is 30.",
  },
  {
    id: "reasoning-3",
    section: "Reasoning",
    topic: "Direction Sense",
    prompt:
      "A person walks 5 km north, then 3 km east, then 2 km south. How far and in which direction is the person from the start?",
    options: ["3 km north-east", "4 km north-east", "5 km south-east", "6 km east"],
    answerIndex: 1,
    explanation:
      "Net movement is 3 km north and 3 km east, so the person is 4.24 km north-east.",
  },
  {
    id: "reasoning-4",
    section: "Reasoning",
    topic: "Blood Relation",
    prompt:
      "Pointing to a woman, Rahul says, 'She is the daughter of my grandfather's only son.' How is the woman related to Rahul?",
    options: ["Sister", "Mother", "Cousin", "Aunt"],
    answerIndex: 0,
    explanation:
      "Grandfather's only son is Rahul's father. The father's daughter is Rahul's sister.",
  },
  {
    id: "reasoning-5",
    section: "Reasoning",
    topic: "Syllogism",
    prompt:
      "Statements: All pens are books. Some books are papers. Conclusion: Some pens are papers.",
    options: ["Definitely true", "Definitely false", "Cannot be concluded", "Both true and false"],
    answerIndex: 2,
    explanation:
      "The statements do not guarantee any overlap between pens and papers.",
  },
];

const VERBAL_QUESTIONS = [
  {
    id: "verbal-1",
    section: "Verbal",
    topic: "Vocabulary",
    prompt: "Choose the synonym of 'abundant'.",
    options: ["Scarce", "Plentiful", "Hidden", "Brief"],
    answerIndex: 1,
    explanation: "'Plentiful' is the closest synonym of abundant.",
  },
  {
    id: "verbal-2",
    section: "Verbal",
    topic: "Grammar",
    prompt: "Choose the correct sentence.",
    options: [
      "Each of the players were ready.",
      "Each of the players was ready.",
      "Each of the players are ready.",
      "Each player were ready.",
    ],
    answerIndex: 1,
    explanation:
      "'Each' is singular, so the verb should be 'was'.",
  },
  {
    id: "verbal-3",
    section: "Verbal",
    topic: "Cloze Test",
    prompt: "He is committed ___ excellence in every project he handles.",
    options: ["for", "to", "with", "at"],
    answerIndex: 1,
    explanation: "The correct collocation is 'committed to'.",
  },
  {
    id: "verbal-4",
    section: "Verbal",
    topic: "Sentence Correction",
    prompt: "Choose the grammatically correct version.",
    options: [
      "She don't like long meetings.",
      "She doesn't likes long meetings.",
      "She doesn't like long meetings.",
      "She not like long meetings.",
    ],
    answerIndex: 2,
    explanation:
      "The correct form is 'doesn't like' after the singular subject 'she'.",
  },
  {
    id: "verbal-5",
    section: "Verbal",
    topic: "Reading Logic",
    prompt:
      "Which option best fits a formal business email tone?",
    options: ["Hey, send it fast", "Please review the attached file at your convenience", "Need this now", "Fix it soon"],
    answerIndex: 1,
    explanation:
      "Formal communication uses polite, complete, and neutral phrasing.",
  },
];

export const APTITUDE_QUESTION_BANK = {
  quant: QUANT_QUESTIONS,
  reasoning: REASONING_QUESTIONS,
  verbal: VERBAL_QUESTIONS,
};

export const getAptitudeTrack = (trackId = "mixed") =>
  APTITUDE_TRACKS.find((track) => track.id === trackId) || APTITUDE_TRACKS[3];

export const buildAptitudeQuestions = (trackId = "mixed") => {
  if (trackId === "mixed") {
    const mixedQuestions = [
      ...QUANT_QUESTIONS.slice(0, 3),
      ...REASONING_QUESTIONS.slice(0, 3),
      ...VERBAL_QUESTIONS.slice(0, 3),
    ].map((question) => ({
      ...question,
    }));

    return shuffleArray(mixedQuestions);
  }

  return [...(APTITUDE_QUESTION_BANK[trackId] || [])];
};

export const buildAptitudeSession = (trackId = "mixed") => {
  const track = getAptitudeTrack(trackId);
  const questions = buildAptitudeQuestions(trackId);

  return {
    track,
    questions,
    timeLimitSeconds: track.durationMinutes * 60,
  };
};
