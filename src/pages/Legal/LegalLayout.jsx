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
    <div className="min-h-screen xalora-grid-bg">
      {/* Header - Matches platform theme */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white py-16 px-4 border-b border-indigo-500/20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">{title}</h1>
          <p className="text-lg text-indigo-100 mb-4">{description}</p>
          <p className="text-sm text-indigo-200/80 font-medium">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          {headings.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-6">
                <button
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                  className="w-full flex items-center justify-between text-lg font-bold text-slate-900 mb-4 lg:hidden hover:text-indigo-600 transition-colors"
                >
                  Table of Contents
                  <ChevronUp
                    size={20}
                    className={`transform transition-transform text-indigo-600`}
                    style={{ transform: showTableOfContents ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  />
                </button>

                <nav className={`${showTableOfContents ? 'block' : 'hidden'} lg:block space-y-1`}>
                  <h3 className="font-bold text-slate-900 mb-4 hidden lg:block text-sm uppercase tracking-wider">Contents</h3>
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToSection(heading.id)}
                      className={`block w-full text-left text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all ${
                        heading.level === 3 ? 'ml-4' : ''
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Quick Contact */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm">Questions?</h4>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    Contact our legal team
                  </p>
                  <a
                    href="mailto:legal@xalora.com"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                  >
                    legal@xalora.com →
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12 text-slate-700 space-y-8">
              {children}
            </article>

            {/* Footer CTA - Matches platform theme */}
            <div className="mt-8 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Need More Information?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Have questions about our policies? Our legal team is here to help.
              </p>
              <a
                href="mailto:legal@xalora.com"
                className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all text-sm font-bold shadow-md shadow-indigo-100"
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center"
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
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
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
    <div id={id} className="space-y-3 pl-4 border-l-4 border-indigo-600/30">
      <h3 className="text-xl font-bold text-indigo-600">
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
  <li className="text-slate-600 flex items-start gap-3">
    <span className="text-indigo-600 font-bold mt-0.5">•</span>
    <span>{children}</span>
  </li>
);

/**
 * Table - Styled table component - Light theme
 */
export const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto my-6 rounded-xl border border-slate-200">
    <table className="w-full border-collapse">
      <thead className="bg-slate-50">
        <tr>
          {headers.map((header, idx) => (
            <th
              key={idx}
              className="border border-slate-200 px-6 py-3 text-left font-semibold text-slate-800"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                className="border border-slate-200 px-6 py-4 text-slate-600"
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
