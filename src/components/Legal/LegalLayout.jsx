import React, { useState } from 'react';
import { ChevronDown, Mail, MessageSquare } from 'lucide-react';

const LegalLayout = ({ title, description, children }) => {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-indigo-100">{description}</p>
          <p className="text-sm text-indigo-200 mt-4">Last Updated: January 2025 | Effective: [Launch Date]</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-gray-700 space-y-6">
          {children}
        </article>

        {/* Contact Section */}
        <div className="mt-12 bg-indigo-50 border-2 border-indigo-200 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <MessageSquare className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Questions or Concerns?</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} className="text-indigo-600" />
                  <span><strong>Privacy & Legal:</strong> <a href="mailto:legal@xalora.com" className="text-indigo-600 hover:underline">legal@xalora.com</a></span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} className="text-indigo-600" />
                  <span><strong>Support:</strong> <a href="mailto:support@xalora.com" className="text-indigo-600 hover:underline">support@xalora.com</a></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm border-t pt-8">
          <a href="/privacy" className="text-indigo-600 hover:underline font-medium">Privacy Policy</a>
          <a href="/terms" className="text-indigo-600 hover:underline font-medium">Terms of Service</a>
          <a href="/cookies" className="text-indigo-600 hover:underline font-medium">Cookie Policy</a>
          <a href="/acceptable-use" className="text-indigo-600 hover:underline font-medium">Acceptable Use</a>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg hidden md:flex items-center justify-center transition-colors"
      >
        <ChevronDown className="rotate-180" size={24} />
      </button>
    </div>
  );
};

export const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900 pt-8 border-t-2">{title}</h2>
    {children}
  </div>
);

export const SubSection = ({ title, children }) => (
  <div className="ml-4 space-y-3">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {children}
  </div>
);

export const ListItem = ({ children }) => (
  <li className="ml-6 list-disc text-gray-700">{children}</li>
);

export const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-300 px-4 py-2 text-gray-700">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export { LegalLayout };
