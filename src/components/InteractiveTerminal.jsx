import React, { useState, useEffect, useRef } from 'react';

const InteractiveTerminal = ({ 
    history, 
    onInputSubmit, 
    waitingForInput, 
    executing,
    onClear 
}) => {
    const [input, setInput] = useState("");
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        if (waitingForInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [waitingForInput]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && onInputSubmit) {
            onInputSubmit(input);
            setInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 text-green-400 font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-sm text-gray-300">HireVeu Terminal</span>
                </div>
                <button
                    onClick={onClear}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
                >
                    Clear
                </button>
            </div>

            {/* Terminal Content */}
            <div 
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto"
            >
                {history.length === 0 ? (
                    <div className="text-gray-500">
                        <p>HireVeu Interactive Terminal</p>
                        <p>Run your code to see output here...</p>
                        <p className="mt-2 text-xs">Tips:</p>
                        <p className="text-xs">• Ctrl+Enter to run code</p>
                        <p className="text-xs">• Enter input when prompted</p>
                    </div>
                ) : (
                    history.map((entry, index) => (
                        <div key={index} className="mb-2">
                            {entry.type === 'command' && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-400">[{entry.timestamp}]</span>
                                    <span className="text-yellow-400">$</span>
                                    <span className="text-white">{entry.content}</span>
                                </div>
                            )}
                            
                            {entry.type === 'output' && (
                                <div className="text-green-400 whitespace-pre-wrap ml-4">
                                    {entry.content}
                                </div>
                            )}
                            
                            {entry.type === 'error' && (
                                <div className="text-red-400 whitespace-pre-wrap ml-4">
                                    {entry.content}
                                </div>
                            )}
                            
                            {entry.type === 'input' && (
                                <div className="flex items-center space-x-2 ml-4">
                                    <span className="text-cyan-400">Input:</span>
                                    <span className="text-white">{entry.content}</span>
                                </div>
                            )}
                            
                            {entry.type === 'system' && (
                                <div className="text-yellow-400 ml-4 italic">
                                    {entry.content}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Current execution status */}
                {executing && (
                    <div className="flex items-center space-x-2 text-yellow-400">
                        <span>Executing</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Terminal Input */}
            <div className="border-t border-gray-700 p-3 bg-gray-800">
                {waitingForInput ? (
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <span className="text-cyan-400">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 bg-gray-700 text-white px-2 py-1 rounded border-none outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter input and press Enter..."
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                        >
                            Send
                        </button>
                    </form>
                ) : executing ? (
                    <div className="flex items-center space-x-2 text-yellow-400">
                        <span>$</span>
                        <span>Executing code...</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <span>$</span>
                        <span>Ready for code execution... (Use Run button in editor or Ctrl+Enter)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveTerminal;