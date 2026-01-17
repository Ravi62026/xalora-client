/**
 * Responsive Design Utility Classes and Helpers
 * Centralized responsive design patterns for consistent mobile-first design
 */

// Common responsive container classes
export const containers = {
    // Full-width container with responsive padding
    page: "w-full min-h-screen px-4 sm:px-6 lg:px-8",

    // Centered container with max-width
    centered: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

    // Narrow centered container (for forms, articles)
    narrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",

    // Extra narrow (for login/signup forms)
    extraNarrow: "max-w-md mx-auto px-4 sm:px-6",

    // Section padding
    section: "py-12 sm:py-16 md:py-20 lg:py-24",
};

// Responsive grid layouts
export const grids = {
    // 1 column mobile, 2 tablet, 3 desktop
    cols123: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8",

    // 1 column mobile, 2 tablet, 4 desktop
    cols124: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8",

    // 1 column mobile, 3 desktop
    cols13: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8",

    // 2 columns always (responsive gap)
    cols2: "grid grid-cols-2 gap-3 sm:gap-4 md:gap-6",

    // Auto-fit responsive grid
    autoFit: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",

    // Sidebar layout (mobile stack, desktop sidebar)
    sidebar: "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",
    sidebarMain: "lg:col-span-8",
    sidebarAside: "lg:col-span-4",
};

// Responsive flex layouts
export const flex = {
    // Stack on mobile, row on desktop
    stackToRow: "flex flex-col md:flex-row gap-4 sm:gap-6",

    // Stack on mobile, row on tablet
    stackToRowEarly: "flex flex-col sm:flex-row gap-4 sm:gap-6",

    // Responsive centered flex
    center: "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6",

    // Responsive space-between
    between: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6",

    // Responsive wrap
    wrap: "flex flex-wrap gap-3 sm:gap-4 md:gap-6",
};

// Responsive text sizes
export const text = {
    // Hero headings
    hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold",

    // Page headings
    h1: "text-3xl sm:text-4xl md:text-5xl font-bold",
    h2: "text-2xl sm:text-3xl md:text-4xl font-bold",
    h3: "text-xl sm:text-2xl md:text-3xl font-semibold",
    h4: "text-lg sm:text-xl md:text-2xl font-semibold",

    // Body text
    body: "text-sm sm:text-base",
    bodyLarge: "text-base sm:text-lg md:text-xl",

    // Small text
    small: "text-xs sm:text-sm",
};

// Responsive spacing
export const spacing = {
    // Padding
    p: {
        sm: "p-3 sm:p-4",
        md: "p-4 sm:p-6 md:p-8",
        lg: "p-6 sm:p-8 md:p-10 lg:p-12",
        xl: "p-8 sm:p-12 md:p-16 lg:p-20",
    },

    // Margin
    m: {
        sm: "m-3 sm:m-4",
        md: "m-4 sm:m-6 md:m-8",
        lg: "m-6 sm:m-8 md:m-10 lg:m-12",
    },

    // Gap
    gap: {
        sm: "gap-2 sm:gap-3",
        md: "gap-3 sm:gap-4 md:gap-6",
        lg: "gap-4 sm:gap-6 md:gap-8 lg:gap-10",
    },
};

// Responsive buttons
export const buttons = {
    // Primary button
    primary: "px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105",

    // Secondary button
    secondary: "px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300",

    // Icon button (touch-friendly)
    icon: "p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300",

    // Full width on mobile
    fullMobile: "w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-lg",
};

// Responsive cards
export const cards = {
    // Standard card
    standard: "bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300",

    // Compact card
    compact: "bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300",

    // Feature card
    feature: "bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300",
};

// Responsive forms
export const forms = {
    // Input field
    input: "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border focus:ring-2 transition-all duration-200",

    // Textarea
    textarea: "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border focus:ring-2 transition-all duration-200 min-h-[100px] sm:min-h-[120px]",

    // Label
    label: "block text-sm sm:text-base font-medium mb-2",

    // Form group
    group: "space-y-2 sm:space-y-3",
};

// Responsive modals
export const modals = {
    // Modal overlay
    overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",

    // Modal container
    container: "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8",

    // Modal header
    header: "flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b",

    // Modal title
    title: "text-xl sm:text-2xl md:text-3xl font-bold",
};

// Responsive tables
export const tables = {
    // Table container (horizontal scroll on mobile)
    container: "w-full overflow-x-auto -mx-4 sm:mx-0",

    // Table
    table: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",

    // Table header
    th: "px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider",

    // Table cell
    td: "px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-sm sm:text-base whitespace-nowrap",
};

// Responsive navigation
export const nav = {
    // Desktop nav (hidden on mobile)
    desktop: "hidden md:flex items-center space-x-2 lg:space-x-4",

    // Mobile nav (hidden on desktop)
    mobile: "md:hidden",

    // Nav link
    link: "px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-all duration-300",
};

// Responsive images
export const images = {
    // Avatar sizes
    avatar: {
        sm: "w-8 h-8 sm:w-10 sm:h-10 rounded-full",
        md: "w-10 h-10 sm:w-12 sm:h-12 rounded-full",
        lg: "w-12 h-12 sm:w-16 sm:h-16 rounded-full",
        xl: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full",
    },

    // Icon sizes
    icon: {
        sm: "w-4 h-4 sm:w-5 sm:h-5",
        md: "w-5 h-5 sm:w-6 sm:h-6",
        lg: "w-6 h-6 sm:w-8 sm:h-8",
        xl: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
    },
};

// Utility functions
export const utils = {
    // Combine classes
    cn: (...classes) => classes.filter(Boolean).join(' '),

    // Check if mobile
    isMobile: () => window.innerWidth < 768,

    // Check if tablet
    isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,

    // Check if desktop
    isDesktop: () => window.innerWidth >= 1024,
};

// Breakpoint values (for JS usage)
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export default {
    containers,
    grids,
    flex,
    text,
    spacing,
    buttons,
    cards,
    forms,
    modals,
    tables,
    nav,
    images,
    utils,
    breakpoints,
};
