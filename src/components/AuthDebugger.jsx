import React, { useState } from 'react';
import authService from '../services/authService';

const AuthDebugger = () => {
    const [debugInfo, setDebugInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const result = await authService.checkAuth();
            setDebugInfo(result);
            console.log("🔍 AUTH-DEBUGGER: Auth check result:", result);
        } catch (error) {
            setDebugInfo({
                error: true,
                message: error.response?.data?.message || error.message,
                status: error.response?.status
            });
            console.log("❌ AUTH-DEBUGGER: Auth check failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const testCookie = async () => {
        try {
            console.log("🧪 COOKIE-TEST: Testing cookie functionality...");
            const response = await fetch('/api/v1/users/test-cookie', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            console.log("🧪 COOKIE-TEST: Response:", result);
            
            // Wait a moment then check cookies
            setTimeout(() => {
                checkCookies();
            }, 100);
        } catch (error) {
            console.log("❌ COOKIE-TEST: Failed:", error);
        }
    };

    const checkCookies = () => {
        const cookieString = document.cookie;
        console.log("🍪 RAW-COOKIES:", cookieString);
        
        let cookies = {};
        if (cookieString && cookieString.trim() !== '') {
            cookies = cookieString.split(';').reduce((acc, cookie) => {
                const trimmed = cookie.trim();
                if (trimmed) {
                    const [name, ...valueParts] = trimmed.split('=');
                    const value = valueParts.join('='); // Handle values with = in them
                    if (name && name.trim()) {
                        acc[name.trim()] = value || '';
                    }
                }
                return acc;
            }, {});
        }
        
        console.log("🍪 COOKIES-DEBUG: Parsed cookies:", cookies);
        console.log("🍪 COOKIES-COUNT:", Object.keys(cookies).length);
        
        setDebugInfo({
            cookies,
            cookieString,
            cookieCount: Object.keys(cookies).length,
            hasCookies: Object.keys(cookies).length > 0,
            timestamp: new Date().toISOString()
        });
    };

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
            <h3 className="text-sm font-bold mb-2">🔧 Auth Debugger</h3>
            <div className="space-y-2">
                <div>
                    <button
                        onClick={checkAuth}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs disabled:opacity-50"
                    >
                        {loading ? "Checking..." : "Check Auth"}
                    </button>
                    <button
                        onClick={checkCookies}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs ml-2"
                    >
                        Check Cookies
                    </button>
                </div>
                <div>
                    <button
                        onClick={testCookie}
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs"
                    >
                        Test Cookie
                    </button>
                    <button
                        onClick={() => setDebugInfo(null)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs ml-2"
                    >
                        Clear
                    </button>
                </div>
            </div>
            
            {debugInfo && (
                <div className="mt-3 p-2 bg-gray-700 rounded text-xs overflow-auto max-h-40">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AuthDebugger;