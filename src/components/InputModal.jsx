import React, { useState, useRef, useEffect } from 'react';

const InputModal = ({ isOpen, onClose, onSubmit, title = "Program Input Required" }) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input);
        setInput("");
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                
                <p className="text-sm text-gray-600 mb-4">
                    Your program requires input. Please enter the input data below:
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input Data
                        </label>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                            placeholder="Enter input data (e.g., '5 7' for two numbers)"
                            autoComplete="off"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Tip: For multiple inputs, separate with spaces or new lines
                        </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                        >
                            Run with Input
                        </button>
                    </div>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Examples:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Two numbers: <code className="bg-blue-100 px-1 rounded">5 7</code></li>
                        <li>• Multiple lines: <code className="bg-blue-100 px-1 rounded">5<br/>7</code></li>
                        <li>• String input: <code className="bg-blue-100 px-1 rounded">Hello World</code></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InputModal;