import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  Login,
  Signup,
  Profile,
  Dashboard,
  CreateProblem,
  EditProblem,
  Problems,
  MyProblems,
  AdminUsers,
  Problem,
  Quiz,
  TakeQuiz,
  ResumeAI,
  Pricing,
  Algorithms,
  DataStructures,
  SystemDesign,
  InterviewPrep,
  About,
  Careers,
  Blog,
  HelpCenter,
  Contact,
  Community,
  Status,
  Roadmap,
  QuizAnalytics,
  QuizReport,
  Internships,
  InternshipDetail,
  EnrolledInternships,
  SubmitProject,
  SubscriptionDebug,
  PaymentHistory,
  Searching,
  Sorting,
  Fundamentals,
  DynamicProgramming,
  GreedyAlgorithms,
  GraphAlgorithms,
  TreeAlgorithms,
  StringAlgorithms,
  BacktrackingAlgorithms,
  MathematicalAlgorithms,
  GeometricAlgorithms,
  Arrays,
  LinkedLists,
  Stacks,
  Queues,
  Linear,
  Basic,
  RandomizedAlgorithms,
  HashBased,
  HashTables,
  HashMaps,
  HashSets,
  BloomFilters,
  ConsistentHashing,
  PerfectHashing,
  CuckooHashing
} from "./pages";
import DebugUserInfo from "./components/DebugUserInfo";
import { initializeAuth } from "./store/slices/userSlice";

// Component to show page-specific loading messages
const LoadingMessage = () => {
  const location = useLocation();

  const getPageLoadingMessage = () => {
    if (location.pathname.startsWith("/internships")) {
      return "Loading Internships...";
    } else if (location.pathname.startsWith("/problems")) {
      return "Loading Problems...";
    } else if (location.pathname.startsWith("/quiz")) {
      return "Loading Quiz...";
    } else if (location.pathname.startsWith("/profile")) {
      return "Loading Profile...";
    } else if (location.pathname.startsWith("/status")) {
      return "Loading System Status...";
    } else if (location.pathname.startsWith("/roadmap")) {
      return "Loading Learning Roadmap...";
    } else {
      return "Loading Xalora...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full animate-ping opacity-20 border-4 border-blue-500"></div>
        </div>
        <p className="mt-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {getPageLoadingMessage()}
        </p>
        <p className="mt-2 text-gray-400 animate-pulse">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isInitializing, user } = useSelector((state) => state.user);
  
  // Use a ref to track if we've already initialized
  const hasInitialized = React.useRef(false);

  useEffect(() => {
    // Initialize auth on app load only once
    if (!hasInitialized.current) {
      console.log("🔄 APP: Initializing authentication for the first time");
      dispatch(initializeAuth());
      hasInitialized.current = true;
    }
    
    // Periodic auth check every 30 seconds
    // const authCheckInterval = setInterval(() => {
    //   // Only check auth if we're not already initializing
    //   if (!isInitializing) {
    //     console.log("🕒 APP: Periodic auth check");
    //     dispatch(initializeAuth());
    //   }
    // }, 30000); // Check every 30 seconds
    
    // // Clean up interval
    // return () => {
    //   clearInterval(authCheckInterval);
    // };
  }, [dispatch, isInitializing]);

  // Show loading screen while checking authentication
  if (isInitializing && !user) {
    return <LoadingMessage />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/create-problem" element={<CreateProblem />} />
        <Route path="/edit-problem/:id" element={<EditProblem />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/my-problems" element={<MyProblems />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/problems/:id" element={<Problem />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/quiz/analytics" element={<QuizAnalytics />} />
        <Route path="/quiz-history" element={<QuizAnalytics />} />
        <Route path="/quiz/report/:submissionId" element={<QuizReport />} />
        <Route path="/quiz-report/:submissionId" element={<QuizReport />} />
        <Route path="/resume-ai" element={<ResumeAI />} />
        <Route path="/resume-ai/:sessionId" element={<ResumeAI />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/enrolled" element={<EnrolledInternships />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route
          path="/internships/submit/:enrollmentId"
          element={<SubmitProject />}
        />

        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/algorithms/searching" element={<Searching />} />
        <Route path="/algorithms/sorting" element={<Sorting />} />
        <Route path="/algorithms/fundamentals" element={<Fundamentals />} />
        <Route path="/algorithms/dynamic-programming" element={<DynamicProgramming />} />
        <Route path="/algorithms/greedy" element={<GreedyAlgorithms />} />
        <Route path="/algorithms/graph" element={<GraphAlgorithms />} />
        <Route path="/algorithms/tree" element={<TreeAlgorithms />} />
        <Route path="/algorithms/string" element={<StringAlgorithms />} />
        <Route path="/algorithms/backtracking" element={<BacktrackingAlgorithms />} />
        <Route path="/algorithms/mathematical" element={<MathematicalAlgorithms />} />
        <Route path="/algorithms/geometric" element={<GeometricAlgorithms />} />
        <Route path="/algorithms/randomized" element={<RandomizedAlgorithms />} />
        <Route path="/data-structures" element={<DataStructures />} />
        <Route path="/data-structures/basic" element={<Basic />} />
        <Route path="/data-structures/linear" element={<Linear />} />
        <Route path="/data-structures/arrays" element={<Arrays />} />
        <Route path="/data-structures/linked-lists" element={<LinkedLists />} />
        <Route path="/data-structures/stacks" element={<Stacks />} />
        <Route path="/data-structures/queues" element={<Queues />} />
        <Route path="/data-structures/hash-based" element={<HashBased />} />
        <Route path="/data-structures/hash-based/hash-tables" element={<HashTables />} />
        <Route path="/data-structures/hash-based/hash-maps" element={<HashMaps />} />
        <Route path="/data-structures/hash-based/hash-sets" element={<HashSets />} />
        <Route path="/data-structures/hash-based/bloom-filters" element={<BloomFilters />} />
        <Route path="/data-structures/hash-based/consistent-hashing" element={<ConsistentHashing />} />
        <Route path="/data-structures/hash-based/perfect-hashing" element={<PerfectHashing />} />
        <Route path="/data-structures/hash-based/cuckoo-hashing" element={<CuckooHashing />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community />} />
        <Route path="/status" element={<Status />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscription-debug" element={<SubscriptionDebug />} />
      </Routes>
      {/* Debug component - remove in production */}
      {/* <DebugUserInfo /> */}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
};

export default App;