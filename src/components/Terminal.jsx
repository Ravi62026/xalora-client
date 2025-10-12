import React, { useState, useEffect, useRef } from 'react';

const Terminal = ({ isVisible, onClose, executionResult, executing }) => {
    const [terminalHistory, setTerminalHistory] = useState([]);
    const terminalRef = useRef(null);

    useEffect(() => {
        if (executionResult) {
            const timestamp = new Date().toLocaleTimeString();
            const newEntry = {
                id: Date.now(),
                timestamp,
                type: executionResult.success ? 'success' : 'error',
                command: 'Code Execution',
                result: executionResult
            };
            
            setTerminalHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }
    }, [executionResult]);

    useEffect(() => {
        if (executing) {
            const timestamp = new Date().toLocaleTimeString();
            const executingEntry = {
                id: Date.now(),
                timestamp,
                type: 'executing',
                command: 'Code Execution',
                result: { message: 'Executing code...' }
            };
            
            setTerminalHistory(prev => [executingEntry, ...prev.slice(0, 9)]);
        }
    }, [executing]);

    const clearTerminal = () => {
        setTerminalHistory([]);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-green-400 rounded-lg w-4/5 h-4/5 flex flex-col">
                {/* Terminal Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="ml-4 text-sm font-mono">HireVeu Terminal</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={clearTerminal}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                        >
                            Clear
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Terminal Content */}
                <div 
                    ref={terminalRef}
                    className="flex-1 p-4 overflow-y-auto font-mono text-sm"
                >
                    {terminalHistory.length === 0 ? (
                        <div className="text-gray-500">
                            <p>HireVeu Code Execution Terminal</p>
                            <p>Run your code to see output here...</p>
                        </div>
                    ) : (
                        terminalHistory.map((entry) => (
                            <div key={entry.id} className="mb-4 border-b border-gray-800 pb-2">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-blue-400">[{entry.timestamp}]</span>
                                    <span className="text-yellow-400">$</span>
                                    <span className="text-white">{entry.command}</span>
                                    {entry.type === 'executing' && (
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    )}
                                </div>
                                
                                {entry.type === 'success' && (
                                    <div className="ml-4">
                                        <div className="text-green-400 mb-1">✓ Execution completed successfully</div>
                                        {entry.result.output && (
                                            <div>
                                                <div className="text-blue-300">Output:</div>
                                                <pre className="text-white bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">
                                                    {entry.result.output}
                                                </pre>
                                            </div>
                                        )}
                                        {entry.result.verdict && (
                                            <div className="mt-2">
                                                <span className="text-blue-300">Verdict: </span>
                                                <span className={entry.result.verdict === 'Accepted' ? 'text-green-400' : 'text-yellow-400'}>
                                                    {entry.result.verdict}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {entry.type === 'error' && (
                                    <div className="ml-4">
                                        <div className="text-red-400 mb-1">✗ Execution failed</div>
                                        {entry.result.error && (
                                            <div>
                                                <div className="text-red-300">Error:</div>
                                                <pre className="text-red-200 bg-red-900 bg-opacity-30 p-2 rounded mt-1 whitespace-pre-wrap">
                                                    {entry.result.error}
                                                </pre>
                                            </div>
                                        )}
                                        {entry.result.message && (
                                            <div className="text-red-300 mt-1">{entry.result.message}</div>
                                        )}
                                    </div>
                                )}
                                
                                {entry.type === 'executing' && (
                                    <div className="ml-4 text-yellow-400">
                                        {entry.result.message}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Terminal Input (for future enhancement) */}
                <div className="border-t border-gray-700 p-3">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <span>$</span>
                        <span>Terminal ready for code execution...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminal;