#!/usr/bin/env node

/**
 * RESPONSIVE DESIGN - BATCH PROCESSOR
 * This script contains all the responsive patterns to apply to remaining pages
 */

// Common responsive class replacements
const responsivePatterns = {
    // Container padding
    containers: {
        'py-12': 'py-8 sm:py-12',
        'py-16': 'py-12 sm:py-16',
        'py-20': 'py-16 sm:py-20',
        'px-6': 'px-4 sm:px-6',
        'px-8': 'px-6 sm:px-8',
        'p-6': 'p-4 sm:p-6',
        'p-8': 'p-6 sm:p-8',
        'mb-8': 'mb-6 sm:mb-8',
        'mb-12': 'mb-8 sm:mb-12',
        'gap-6': 'gap-4 sm:gap-6',
        'gap-8': 'gap-6 sm:gap-8',
        'space-y-6': 'space-y-4 sm:space-y-6',
        'space-y-8': 'space-y-6 sm:space-y-8',
    },

    // Text sizes
    text: {
        'text-4xl': 'text-2xl sm:text-3xl md:text-4xl',
        'text-3xl': 'text-2xl sm:text-3xl',
        'text-2xl': 'text-xl sm:text-2xl',
        'text-xl': 'text-lg sm:text-xl',
        'text-lg': 'text-base sm:text-lg',
    },

    // Grids
    grids: {
        'grid-cols-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        'grid-cols-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        'grid-cols-2': 'grid-cols-1 sm:grid-cols-2',
    },

    // Form inputs
    inputs: {
        'px-4 py-3': 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base',
        'px-4 py-2': 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base',
    },

    // Buttons
    buttons: {
        'px-6 py-3': 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base',
        'px-4 py-2': 'px-3 sm:px-4 py-2 text-sm sm:text-base',
    },

    // Rounded corners
    rounded: {
        'rounded-2xl': 'rounded-xl sm:rounded-2xl',
        'rounded-3xl': 'rounded-2xl sm:rounded-3xl',
    },
};

// Pages categorized by type
const pageCategories = {
    quiz: [
        'Quiz.jsx',
        'TakeQuiz.jsx',
        'QuizReport.jsx',
        'QuizAnalytics.jsx',
        'QuizResults.jsx',
    ],

    aiInterview: [
        'AIInterview/InterviewSetup.jsx',
        'AIInterview/InterviewSession.jsx',
        'AIInterview/InterviewRound.jsx',
        'AIInterview/InterviewReport.jsx',
        'AIInterview/WaitingRoom.jsx',
        'AIInterview/MyInterviews.jsx',
    ],

    learning: [
        'Algorithms.jsx',
        'DataStructures.jsx',
        'Arrays.jsx',
        'LinkedLists.jsx',
        'Stacks.jsx',
        'Queues.jsx',
        'Trees.jsx',
        'Graphs.jsx',
        'Sorting.jsx',
        'Searching.jsx',
        'DynamicProgramming.jsx',
        'GraphAlgorithms.jsx',
        'TreeAlgorithms.jsx',
        'HashMaps.jsx',
        'HashSets.jsx',
        'HashTables.jsx',
        'HashBased.jsx',
        'BloomFilters.jsx',
        'ConsistentHashing.jsx',
        'CuckooHashing.jsx',
        'PerfectHashing.jsx',
        'BacktrackingAlgorithms.jsx',
        'GeometricAlgorithms.jsx',
        'GreedyAlgorithms.jsx',
        'MathematicalAlgorithms.jsx',
        'StringAlgorithms.jsx',
        'Basic.jsx',
        'Fundamentals.jsx',
        'Linear.jsx',
        'SystemDesign.jsx',
        'Roadmap.jsx',
    ],

    career: [
        'Internships.jsx',
        'InternshipDetail.jsx',
        'EnrolledInternships.jsx',
        'ResumeAI.jsx',
        'InterviewPrep.jsx',
    ],

    admin: [
        'AdminUsers.jsx',
        'CreateProblem.jsx',
        'EditProblem.jsx',
        'MyProblems.jsx',
        'Status.jsx',
        'PaymentHistory.jsx',
        'Problem.jsx',
    ],

    info: [
        'About.jsx',
        'Careers.jsx',
        'Blog.jsx',
        'Community.jsx',
        'Contact.jsx',
        'HelpCenter.jsx',
        'Pricing.jsx',
        'EmailVerification.jsx',
    ],
};

// Standard responsive template for content pages
const contentPageTemplate = `
// Apply these patterns to content pages:

1. Main container:
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

2. Page header:
   <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">

3. Section headers:
   <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">

4. Content grids:
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

5. Cards:
   <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">

6. Buttons:
   <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">

7. Form inputs:
   <input className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base">

8. Spacing:
   - mb-6 sm:mb-8
   - gap-4 sm:gap-6
   - space-y-4 sm:space-y-6
`;

console.log('📱 RESPONSIVE DESIGN BATCH PROCESSOR');
console.log('=====================================\n');
console.log('Total pages to process:',
    Object.values(pageCategories).flat().length);
console.log('\nCategories:');
Object.entries(pageCategories).forEach(([cat, pages]) => {
    console.log(`  ${cat}: ${pages.length} pages`);
});
console.log('\n✅ Patterns ready to apply!');
console.log('\nUse RESPONSIVE_QUICK_REFERENCE.md for manual updates');

module.exports = {
    responsivePatterns,
    pageCategories,
    contentPageTemplate,
};
