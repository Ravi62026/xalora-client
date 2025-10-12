// Utility functions for debugging cookies
export const debugCookies = () => {
    // console.log('🍪 COOKIE-DEBUG: Document cookies:', document.cookie);
    
    // Try to get cookies using different methods
    const cookies = {};
    if (document.cookie) {
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
        });
    }
    
    console.log('🍪 COOKIE-DEBUG: Parsed cookies:', cookies);
    return cookies;
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export default {
    debugCookies,
    getCookie
};