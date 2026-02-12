import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * LegalLayout - Reusable layout component for all legal pages
 * Matches Xalora's dark theme with blue/purple accents
 */
export const LegalLayout = ({ title, description, children }) => {
  const [showTableOfContents, setShowTableOfContents] = useState(true);

  // Extract h1, h2, h3 headings from children for table of contents
  const extractHeadings = (children) => {
    const headings = [];

    React.Children.forEach(children, (child) => {
      if (child?.props?.title) {
        const text = child.props.title;
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Determine level based on component type
        const level = child.type.displayName === 'Section' ? 2 : child.type.displayName === 'SubSection' ? 3 : 2;

        headings.push({ id, text, level });
      }
    });

    return headings;
  };

  const headings = extractHeadings(children);

  const scrollToSection = (id) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header - Matches platform theme */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-16 px-4 border-b border-purple-500/30">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-blue-100 mb-4">{description}</p>
          <p className="text-sm text-blue-200">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          {headings.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-slate-800/50 border border-purple-500/30 rounded-lg backdrop-blur-sm p-6">
                <button
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                  className="w-full flex items-center justify-between text-lg font-semibold text-white mb-4 lg:hidden hover:text-cyan-400 transition-colors"
                >
                  Table of Contents
                  <ChevronUp
                    size={20}
                    className={`transform transition-transform text-cyan-400`}
                    style={{ transform: showTableOfContents ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  />
                </button>

                <nav className={`${showTableOfContents ? 'block' : 'hidden'} lg:block space-y-2`}>
                  <h3 className="font-semibold text-white mb-4 hidden lg:block">Contents</h3>
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToSection(heading.id)}
                      className={`block w-full text-left text-sm text-gray-300 hover:text-cyan-400 hover:bg-purple-500/20 px-3 py-2 rounded transition-colors ${
                        heading.level === 3 ? 'ml-4' : ''
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Quick Contact */}
                <div className="mt-8 pt-8 border-t border-purple-500/30">
                  <h4 className="font-semibold text-white mb-3 text-sm">Questions?</h4>
                  <p className="text-xs text-gray-400 mb-3">
                    Contact our legal team
                  </p>
                  <a
                    href="mailto:legal@xalora.com"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    legal@xalora.com →
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-slate-800/30 border border-purple-500/30 backdrop-blur-sm rounded-lg p-8 md:p-12 text-gray-200 space-y-6">
              {children}
            </article>

            {/* Footer CTA - Matches platform theme */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-2">Need More Information?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Have questions about our policies? Our legal team is here to help.
              </p>
              <a
                href="mailto:legal@xalora.com"
                className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all text-sm font-medium"
              >
                Contact Legal Team
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-cyan-500/50 hidden md:flex items-center justify-center"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
};

/**
 * Section - Top-level section component
 */
export const Section = ({ title, children }) => {
  const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <section id={id} className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white border-b-2 border-cyan-500/50 pb-4">
        {title}
      </h2>
      {children}
    </section>
  );
};

Section.displayName = 'Section';

/**
 * SubSection - Second-level heading
 */
export const SubSection = ({ title, children }) => {
  const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <div id={id} className="space-y-3 pl-4 border-l-4 border-purple-500/50">
      <h3 className="text-xl font-semibold text-cyan-400">
        {title}
      </h3>
      {children}
    </div>
  );
};

SubSection.displayName = 'SubSection';

/**
 * ListItem - Styled list item
 */
export const ListItem = ({ children }) => (
  <li className="text-gray-300 flex items-start gap-3">
    <span className="text-cyan-400 font-bold mt-0.5">•</span>
    <span>{children}</span>
  </li>
);

/**
 * Table - Styled table component - Dark theme
 */
export const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto my-6 rounded-lg border border-purple-500/30">
    <table className="w-full border-collapse">
      <thead className="bg-slate-700/50">
        <tr>
          {headers.map((header, idx) => (
            <th
              key={idx}
              className="border border-purple-500/30 px-6 py-3 text-left font-semibold text-cyan-400"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} className="hover:bg-purple-500/20 transition-colors">
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                className="border border-purple-500/30 px-6 py-4 text-gray-300"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LegalLayout;
