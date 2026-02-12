import React, { useState } from 'react';
import { ChevronUp, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const LegalPages = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Learn how Xalora collects, uses, and protects your personal data',
    lastUpdated: 'January 2025'
  },
  'terms-of-service': {
    title: 'Terms of Service',
    description: 'Our service terms and conditions for using Xalora',
    lastUpdated: 'January 2025'
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'How we use cookies and tracking technologies',
    lastUpdated: 'January 2025'
  },
  'acceptable-use': {
    title: 'Acceptable Use Policy',
    description: 'Guidelines for acceptable use of the Xalora platform',
    lastUpdated: 'January 2025'
  }
};

export const LegalPage = ({ pageType = 'privacy-policy', content }) => {
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const pageInfo = LegalPages[pageType] || LegalPages['privacy-policy'];

  // Extract headings for table of contents
  const extractHeadings = (markdown) => {
    const headings = [];
    const lines = markdown.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith('##') && !line.startsWith('###')) {
        const text = line.replace(/^##\s+/, '').trim();
        const id = text.toLowerCase().replace(/\s+/g, '-');
        headings.push({ id, text, level: 2 });
      }
    });
    return headings;
  };

  const headings = extractHeadings(content);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{pageInfo.title}</h1>
          <p className="text-lg text-indigo-100 mb-4">{pageInfo.description}</p>
          <p className="text-sm text-indigo-200">Last updated: {pageInfo.lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          {headings.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                  className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4 lg:hidden"
                >
                  Table of Contents
                  <ChevronUp
                    size={20}
                    className={`transform transition-transform ${showTableOfContents ? '' : 'rotate-180'}`}
                  />
                </button>

                <nav className={`${showTableOfContents ? 'block' : 'hidden'} lg:block space-y-2`}>
                  <h3 className="font-semibold text-gray-900 mb-4 hidden lg:block">Contents</h3>
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToSection(heading.id)}
                      className="block w-full text-left text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded transition-colors"
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Related Policies</h4>
                  <div className="space-y-2">
                    {Object.entries(LegalPages).map(([key, policy]) => (
                      <a
                        key={key}
                        href={`/legal/${key}`}
                        className={`block text-sm px-3 py-2 rounded transition-colors ${
                          key === pageType
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {policy.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-md p-8">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                <ReactMarkdown
                  remarkPlugins={[gfm]}
                  components={{
                    h2: ({ node, children }) => {
                      const id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]/g, '');
                      return (
                        <h2 id={id} className="mt-8 mb-4 text-2xl font-bold text-gray-900 pt-8 border-t-2 border-gray-200">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => (
                      <h3 className="mt-6 mb-3 text-xl font-bold text-gray-800">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="mt-4 mb-2 text-lg font-semibold text-gray-700">{children}</h4>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse border border-gray-300">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-100">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{children}</td>
                    ),
                    code: ({ inline, children }) => {
                      if (inline) {
                        return <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono text-sm">{children}</code>;
                      }
                      return (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4">
                          {children}
                        </code>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-indigo-600 pl-4 italic text-gray-600 my-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-indigo-600 hover:text-indigo-700 underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Last Updated Footer */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> {pageInfo.lastUpdated}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Effective Date:</strong> [LAUNCH_DATE]
                </p>
              </div>

              {/* Questions Section */}
              <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-6 w-6 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Questions about our policies?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      If you have questions about our privacy practices or terms, please don't hesitate to contact us.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <strong>Privacy & Legal:</strong>{' '}
                        <a href="mailto:legal@xalora.com" className="text-indigo-600 hover:underline">
                          legal@xalora.com
                        </a>
                      </p>
                      <p className="text-gray-700">
                        <strong>Support:</strong>{' '}
                        <a href="mailto:support@xalora.com" className="text-indigo-600 hover:underline">
                          support@xalora.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors hidden md:block"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default LegalPage;
