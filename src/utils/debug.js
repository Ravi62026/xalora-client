// Debug utility to easily enable/disable console logging
// Set this to true to enable all commented console statements
export const DEBUG_MODE = false;

// Helper function to conditionally log
export const debugLog = (message, ...args) => {
  if (DEBUG_MODE) {
    console.log(message, ...args);
  }
};

export const debugError = (message, ...args) => {
  if (DEBUG_MODE) {
    console.error(message, ...args);
  }
};

export const debugWarn = (message, ...args) => {
  if (DEBUG_MODE) {
    console.warn(message, ...args);
  }
};
