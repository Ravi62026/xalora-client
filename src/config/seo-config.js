export const SEO_CONFIG = {
  // ─── Basic Site Information ────────────────────────────────────────────────
  site: {
    name: 'Xalora',
    tagline: 'AI-Powered Mock Interview Platform',
    url: 'https://xalora.one',
    description: 'Practice AI-powered mock interviews for FAANG, startups & product companies. Get instant feedback, improve coding skills, and land your dream job.',
    keywords: [
      'AI mock interview',
      'coding interview practice',
      'FAANG preparation',
      'technical interview questions',
      'system design interview',
      'DSA practice online',
      'AI interview platform',
      'mock interview free India',
      'product company interview',
      'software engineer interview prep'
    ].join(', '),
    author: 'Xalora Team',
    robots: 'index, follow',
    language: 'en_US',
    themeColor: '#3B82F6'
  },

  // ─── Social Media Handles ──────────────────────────────────────────────────
  social: {
    twitter: '@xalora_ai',
    linkedin: 'company/xalora',
    github: 'xalora',
    youtube: '@xalora-ai',
    instagram: 'xalora.ai'
  },

  // ─── Contact Information ───────────────────────────────────────────────────
  contact: {
    email: 'support@xalora.one',
    supportEmail: 'support@xalora.one',
    businessEmail: 'business@xalora.one'
  },

  // ─── Page-Specific Meta Tags ───────────────────────────────────────────────
  pages: {
    home: {
      title: 'Xalora - AI Mock Interview Platform | Practice & Get Hired',
      description: 'Master your technical interviews with AI-powered mock interviews. Practice DSA, system design, behavioral questions. Used by 10,000+ students. Start free today!',
      keywords: 'AI mock interview, coding interview, FAANG preparation, technical interview, DSA practice, system design, behavioral interview',
      canonical: '/',
      ogImage: '/og-images/home.jpg',
      schema: {
        '@type': 'WebSite',
        name: 'Xalora',
        url: 'https://xalora.one',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://xalora.one/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    },

    aiInterview: {
      title: 'AI Mock Interview - Practice Technical Interviews | Xalora',
      description: 'Experience realistic AI-powered mock interviews for software engineering roles. 7 rounds including coding, system design, behavioral. Get instant feedback & detailed reports.',
      keywords: 'AI mock interview, technical interview simulator, coding interview AI, system design interview practice, behavioral interview AI',
      canonical: '/ai-interview',
      ogImage: '/og-images/ai-interview.jpg',
      schema: {
        '@type': 'SoftwareApplication',
        name: 'Xalora AI Interview',
        applicationCategory: 'Education',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '2500',
          bestRating: '5',
          worstRating: '1'
        }
      }
    },

    codingProblems: {
      title: 'DSA Coding Problems - Practice for Interviews | Xalora',
      description: 'Solve 500+ DSA problems curated from FAANG interviews. Easy to Hard difficulty. Detailed explanations, test cases, and AI code review.',
      keywords: 'DSA problems, coding questions, leetcode alternatives, FAANG coding questions, data structures problems, algorithms practice',
      canonical: '/coding-problems',
      ogImage: '/og-images/coding-problems.jpg',
      schema: {
        '@type': 'LearningResource',
        name: 'Xalora DSA Problems',
        educationalLevel: 'Intermediate to Advanced',
        teaches: ['Data Structures', 'Algorithms', 'Problem Solving']
      }
    },

    quizzes: {
      title: 'Tech Quizzes - Test Your Knowledge | Xalora',
      description: 'Take timed quizzes on DSA, System Design, OOPs, DBMS, Computer Networks. Earn JBP coins. Get certificates. Track your progress.',
      keywords: 'tech quizzes, CS quizzes, DSA quiz, system design quiz, computer science MCQ, technical quiz with certificate',
      canonical: '/quizzes',
      ogImage: '/og-images/quizzes.jpg',
      schema: {
        '@type': 'Quiz',
        name: 'Xalora Tech Quizzes',
        educationalLevel: 'All Levels'
      }
    },

    internships: {
      title: 'Virtual Internships - Real Projects | Xalora',
      description: 'Work on real-world projects with mentor guidance. Get internship certificates. Build portfolio. Improve your chances of getting hired.',
      keywords: 'virtual internships, online internships, tech internships, programming internships, internship with certificate, remote internships',
      canonical: '/internships',
      ogImage: '/og-images/internships.jpg',
      schema: {
        '@type': 'EducationalOccupationalProgram',
        name: 'Xalora Virtual Internships',
        provides: 'Internship Certificate'
      }
    },

    pricing: {
      title: 'Pricing Plans - Free & Premium | Xalora',
      description: 'Start free with Spark plan. Upgrade to Pulse, Nexus, or Infinity for unlimited AI interviews, advanced features. Student discounts available.',
      keywords: 'Xalora pricing, AI interview cost, mock interview free, premium features, student discount',
      canonical: '/pricing',
      ogImage: '/og-images/pricing.jpg',
      schema: {
        '@type': 'Product',
        name: 'Xalora Premium',
        offers: [
          {
            '@type': 'Offer',
            name: 'Spark (Free)',
            price: '0',
            priceCurrency: 'INR'
          },
          {
            '@type': 'Offer',
            name: 'Pulse',
            price: '499',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          },
          {
            '@type': 'Offer',
            name: 'Nexus',
            price: '999',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          },
          {
            '@type': 'Offer',
            name: 'Infinity',
            price: '1999',
            priceCurrency: 'INR',
            priceValidUntil: '2027-12-31'
          }
        ]
      }
    },

    about: {
      title: 'About Xalora - Mission & Story',
      description: 'Xalora is on a mission to democratize interview preparation. Founded by IITians, we help students crack their dream jobs with AI-powered practice.',
      keywords: 'about Xalora, Xalora story, who made Xalora, Xalora founders, AI interview platform India',
      canonical: '/about',
      ogImage: '/og-images/about.jpg',
      schema: {
        '@type': 'Organization',
        name: 'Xalora',
        url: 'https://xalora.one',
        logo: 'https://xalora.one/logo.png',
        description: 'AI-powered mock interview platform for technical job preparation',
        founder: {
          '@type': 'Person',
          name: 'Xalora Team'
        },
        foundingDate: '2025',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN'
        }
      }
    },

    contact: {
      title: 'Contact Us - Get in Touch | Xalora',
      description: 'Have questions? Reach out to our support team. We\'re here to help you succeed in your interview journey.',
      keywords: 'contact Xalora, Xalora support, help desk, customer support',
      canonical: '/contact',
      ogImage: '/og-images/contact.jpg',
      schema: {
        '@type': 'ContactPage',
        name: 'Contact Xalora',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@xalora.one'
        }
      }
    },

    blog: {
      title: 'Blog - Interview Tips, Career Advice | Xalora',
      description: 'Read expert articles on cracking FAANG interviews, resume tips, salary negotiation, career growth. Learn from success stories.',
      keywords: 'interview tips, career advice, FAANG guide, resume tips, salary negotiation, tech career',
      canonical: '/blog',
      ogImage: '/og-images/blog.jpg',
      schema: {
        '@type': 'Blog',
        name: 'Xalora Blog',
        description: 'Interview tips and career advice for software engineers'
      }
    }
  },

  // ─── Structured Data Templates ─────────────────────────────────────────────
  structuredData: {
    // Organization Schema
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Xalora',
      url: 'https://xalora.one',
      logo: 'https://xalora.one/logo.png',
      sameAs: [
        'https://twitter.com/xalora_ai',
        'https://linkedin.com/company/xalora',
        'https://github.com/xalora',
        'https://youtube.com/@xalora-ai',
        'https://instagram.com/xalora.ai'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@xalora.one',
        availableLanguage: 'English'
      }
    },

    // Software Application Schema
    software: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Xalora',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2500',
        bestRating: '5',
        worstRating: '1'
      },
      featureList: [
        'AI-powered mock interviews',
        '7 interview rounds',
        'Instant feedback',
        'Detailed performance reports',
        'DSA problem bank',
        'Tech quizzes',
        'Virtual internships'
      ]
    },

    // FAQ Schema (for FAQ page)
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Xalora free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Xalora offers a free Spark plan with 3 AI interviews per month, 10 daily AI requests, and access to basic features. Premium plans start at ₹499/month.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does the AI interview work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our AI analyzes your resume and generates personalized questions across 7 rounds: Formal Q&A, Coding, Technical, Behavioral, System Design, Resume Deep Dive, and JD-based questions. You get instant feedback and a comprehensive report.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is the AI interview similar to real company interviews?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely! Our AI is trained on thousands of real interview experiences from FAANG and top product companies. The questions, difficulty, and evaluation mimic actual interview processes.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use Xalora for college placements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We offer special college plans with bulk seats, analytics dashboard, and custom interview rounds. Contact business@xalora.one for college partnerships.'
          }
        }
      ]
    },

    // Breadcrumb Schema
    breadcrumb: (items) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }),

    // Article Schema (for blog posts)
    article: (article) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: article.author || 'Xalora Team',
        url: 'https://xalora.one/team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Xalora',
        logo: {
          '@type': 'ImageObject',
          url: 'https://xalora.one/logo.png'
        }
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt
    })
  },

  // ─── Open Graph Image Generator Helper ─────────────────────────────────────
  getOgImageUrl: (page = 'home') => {
    const baseUrl = 'https://xalora.one/og-images';
    const imageMap = {
      home: 'home.jpg',
      'ai-interview': 'ai-interview.jpg',
      'coding-problems': 'coding-problems.jpg',
      quizzes: 'quizzes.jpg',
      internships: 'internships.jpg',
      pricing: 'pricing.jpg',
      about: 'about.jpg',
      contact: 'contact.jpg',
      blog: 'blog.jpg'
    };
    return `${baseUrl}/${imageMap[page] || 'home.jpg'}`;
  },

  // ─── Twitter Card Types ────────────────────────────────────────────────────
  twitterCard: {
    home: 'summary_large_image',
    'ai-interview': 'summary_large_image',
    'coding-problems': 'summary',
    quizzes: 'summary',
    internships: 'summary_large_image',
    pricing: 'summary',
    about: 'summary',
    contact: 'summary',
    blog: 'summary_large_image'
  }
};

/**
 * Generate complete meta tags for a page
 * @param {string} pageKey - Key from SEO_CONFIG.pages
 * @param {Object} custom - Override default values
 * @returns {Object} Complete meta tags object
 */
export const generateMetaTags = (pageKey, custom = {}) => {
  const page = SEO_CONFIG.pages[pageKey] || SEO_CONFIG.pages.home;
  const { site, social } = SEO_CONFIG;
  const canonicalPath = custom.canonical || page.canonical;
  const canonicalUrl = canonicalPath?.startsWith("http")
    ? canonicalPath
    : `${site.url}${canonicalPath}`;
  const ogImage = custom.ogImage || page.ogImage || SEO_CONFIG.getOgImageUrl(pageKey);

  return {
    // Basic Meta Tags
    title: custom.title || page.title,
    description: custom.description || page.description,
    keywords: custom.keywords || page.keywords,
    author: site.author,
    robots: custom.robots || page.robots || site.robots,

    // Canonical URL
    canonical: canonicalUrl,

    // Open Graph / Facebook
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogTitle: custom.ogTitle || page.title,
    ogDescription: custom.ogDescription || page.description,
    ogImage,
    ogSiteName: site.name,
    ogLocale: site.language,

    // Twitter Card
    twitterCard: SEO_CONFIG.twitterCard[pageKey] || 'summary',
    twitterSite: social.twitter,
    twitterCreator: social.twitter,
    twitterTitle: custom.twitterTitle || page.title,
    twitterDescription: custom.twitterDescription || page.description,
    twitterImage: custom.twitterImage || ogImage,

    // Theme
    themeColor: site.themeColor,

    // Structured Data
    structuredData: page.schema || null
  };
};

export default SEO_CONFIG;
