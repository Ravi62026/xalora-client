import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import subscriptionService from "../services/subscriptionService";

const Pricing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({});
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [activeTab, setActiveTab] = useState("individual");
  // Removed billingCycle - only monthly billing now (recurring subscriptions)

  const planValues = {
    spark: 0,
    pulse: 1,
    nexus: 2,
    infinity: 3,
  };

  const individualPlans = [
    {
      id: "spark",
      name: "Xalora Spark",
      tagline: "Where your journey begins.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: "forever",
      bestFor: "Freshers & first-year students",
      description: "Perfect start for absolute beginners",
      features: [
        "Complete DSA Learning Modules",
        "500+ Coding Problems",
        "Topic-wise Quizzes (Basic)",
        "Resume Builder (Basic Templates)",
        "Community Forum Access",
        "Basic AI Assistance (10 requests/day)",
        "3 File Uploads per Day",
        "Basic Certificates",
      ],
      limitations: [
        "No Internship Access",
        "No AI Interview",
        "No Resume AI Review",
        "Limited Quiz PDF Downloads",
      ],
      popular: false,
      buttonText: "Get Started",
      icon: "spark",
      color: "gray",
    },
    {
      id: "pulse",
      name: "Xalora Pulse",
      tagline: "Get in the flow — code, learn, evolve.",
      monthlyPrice: 499,
      yearlyPrice: 0, // Not used anymore
      originalMonthlyPrice: 0, // No discount for now
      originalYearlyPrice: 0, // Not used
      period: "per month",
      bestFor: "Intermediate users (1st–2nd year students serious about CS)",
      description: "For consistent learners who want AI-backed coding support",
      features: [
        "Everything in Spark",
        "Complete DSA with Advanced Problems",
        "Advanced Quizzes with Analytics",
        "Resume AI - 5 Reviews per Month",
        "1 AI Mock Interview per Month",
        "Internship Portal Access",
        "50 AI Requests per Day",
        "10 File Uploads per Day",
        "GPT + Gemini AI Access",
        "AI Code Review & Gap Analysis",
        "Resume Tracker",
        "Early Access to Hackathons",
        "Quiz PDF Downloads",
      ],
      limitations: [
        "Limited to 1 Mock Interview/month",
        "Limited Resume AI Reviews",
      ],
      popular: false,
      buttonText: "Start Learning",
      icon: "pulse",
      color: "blue",
    },
    {
      id: "nexus",
      name: "Xalora Nexus",
      tagline: "Connect with the future of AI learning.",
      monthlyPrice: 999,
      yearlyPrice: 0, // Not used anymore
      originalMonthlyPrice: 0, // No discount for now
      originalYearlyPrice: 0, // Not used
      period: "per month",
      bestFor: "2nd–3rd year students & project builders",
      description: "AI-powered skill acceleration + project-based growth",
      features: [
        "Everything in Pulse",
        "Premium DSA with Company-wise Problems",
        "Advanced Quiz Analytics & Reports",
        "Resume AI - Unlimited Reviews",
        "3 AI Mock Interviews per Month",
        "Priority Internship Access",
        "100 AI Requests per Day",
        "20 File Uploads per Day",
        "20+ AI Models (GPT, Claude, Gemini, Mistral)",
        "Project Workspace with Versioning",
        "Real-time AI Code Mentor",
        "Project Certificate with Skill Mapping",
        "Internship Readiness Challenges",
        "LinkedIn Profile Optimizer",
      ],
      limitations: [
        "Limited to 3 Mock Interviews/month",
      ],
      popular: true,
      buttonText: "Go Nexus",
      icon: "nexus",
      color: "purple",
    },
    {
      id: "infinity",
      name: "Xalora Infinity",
      tagline: "The complete intelligence suite — built for achievers.",
      monthlyPrice: 1999,
      yearlyPrice: 0, // Not used anymore
      originalMonthlyPrice: 0, // No discount for now
      originalYearlyPrice: 0, // Not used
      period: "per month",
      bestFor: "3rd–4th year students, job seekers, professionals",
      description: "Ultimate all-access plan — from learning to hiring",
      comingSoon: false,
      features: [
        "Everything in Nexus",
        "Expert DSA with Interview Patterns",
        "Unlimited Quizzes & Custom Tests",
        "Resume AI - Unlimited + ATS Check",
        "5 AI Mock Interviews with Detailed Reports",
        "Guaranteed Internship Referrals",
        "250 AI Requests per Day",
        "Unlimited File Uploads",
        "50+ LLMs (GPT, Claude, Gemini, Mistral, Command-R)",
        "AI Interview Engine (All 5 Rounds)",
        "Technical + HR + Behavioral + Coding + System Design",
        "Detailed Performance Reports",
        "Personalized Career Analytics",
        "1-on-1 Mentorship Sessions",
        "Priority Support 24/7",
        "Early Access to New Features",
      ],
      limitations: [],
      popular: false,
      buttonText: "Go Infinity",
      icon: "infinity",
      color: "amber",
    },
  ];

  const organizationPlans = [
    {
      id: "org-free",
      name: "Starter",
      tagline: "Perfect for small teams getting started.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: "forever",
      bestFor: "Small groups & pilot programs",
      description: "Get your team started with essential features",
      seats: 10,
      features: [
        "Up to 10 team members",
        "Basic learning modules access",
        "Community support",
        "Basic analytics dashboard",
        "Email invites",
        "Department & batch management",
      ],
      limitations: [
        "Limited to 10 members",
        "Basic AI features only",
        "No priority support",
        "No custom branding",
      ],
      popular: false,
      buttonText: "Get Started",
      icon: "starter",
      color: "gray",
    },
    {
      id: "org-basic",
      name: "Basic",
      tagline: "Scale your team's learning journey.",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      originalMonthlyPrice: 1999,
      originalYearlyPrice: 19999,
      period: "per month",
      bestFor: "Growing colleges & training institutes",
      description: "Enhanced features for growing organizations",
      seats: 100,
      features: [
        "Up to 100 team members",
        "All individual Pulse features",
        "Advanced analytics & reporting",
        "Custom organization code",
        "Priority email support",
        "Quiz & assignment creation",
        "Progress tracking",
      ],
      limitations: [
        "Limited to 100 members",
        "No custom branding",
        "No API access",
      ],
      popular: false,
      buttonText: "Choose Basic",
      icon: "basic",
      color: "cyan",
    },
    {
      id: "org-pro",
      name: "Professional",
      tagline: "Advanced tools for serious organizations.",
      monthlyPrice: 2499,
      yearlyPrice: 24999,
      originalMonthlyPrice: 4999,
      originalYearlyPrice: 49999,
      period: "per month",
      bestFor: "Colleges & companies with 100-500 users",
      description: "Full-featured platform for professional training",
      seats: 500,
      features: [
        "Up to 500 team members",
        "All individual Nexus features",
        "Custom branding & logo",
        "Dedicated account manager",
        "API access",
        "SSO integration",
        "Advanced role management",
        "Interview scheduling",
        "Custom certificates",
      ],
      limitations: [
        "Limited to 500 members",
      ],
      popular: true,
      buttonText: "Go Pro",
      icon: "pro",
      color: "indigo",
    },
    {
      id: "org-enterprise",
      name: "Enterprise",
      tagline: "Unlimited potential for large institutions.",
      monthlyPrice: null,
      yearlyPrice: null,
      period: "custom",
      bestFor: "Large universities & enterprises (500+ users)",
      description: "Tailored solutions for large-scale deployments",
      seats: 10000,
      features: [
        "Up to 10,000 team members",
        "Everything in Professional",
        "Custom AI model training",
        "White-label solution",
        "On-premise deployment option",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantee",
        "Dedicated success team",
      ],
      limitations: [],
      popular: false,
      buttonText: "Contact Sales",
      icon: "enterprise",
      color: "emerald",
      customPricing: true,
    },
  ];

  useEffect(() => {
    setPlans(activeTab === "individual" ? individualPlans : organizationPlans);
    fetchCurrentSubscription();
  }, [isAuthenticated, user, activeTab]);

  const fetchCurrentSubscription = async () => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      setCurrentSubscription(subscription?.data || null);
    } catch (error) {
      setCurrentSubscription(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPlans(tab === "individual" ? individualPlans : organizationPlans);
  };

  const getPrice = (plan) => {
    // Always return monthly price (recurring subscriptions)
    return plan.monthlyPrice;
  };

  const getOriginalPrice = (plan) => {
    // Return original price only if there's a discount
    return plan.originalMonthlyPrice || 0;
  };

  const handlePlanSelect = async (planId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsLoading((prev) => ({ ...prev, [planId]: true }));

    const selectedPlan = plans.find((plan) => plan.id === planId);
    if (!selectedPlan) {
      alert("Plan not found");
      setIsLoading((prev) => ({ ...prev, [planId]: false }));
      return;
    }

    // Free plan (Spark) - activate directly
    if (planId === "spark" || selectedPlan.monthlyPrice === 0) {
      try {
        await subscriptionService.createSubscription("spark");
        alert("Xalora Spark plan activated! You now have access to basic features.");
        window.location.reload();
      } catch (err) {
        console.error("Error activating free plan:", err);
        alert(err.response?.data?.message || "Failed to activate free plan. Please try again.");
      } finally {
        setIsLoading((prev) => ({ ...prev, [planId]: false }));
      }
      return;
    }

    // Paid plans - create recurring subscription and open Razorpay checkout
    try {
      console.log("Creating recurring subscription for plan:", planId);

      // Get Razorpay key and create subscription in parallel
      const [razorpayKey, subscriptionData] = await Promise.all([
        subscriptionService.getRazorpayKey(),
        subscriptionService.createSubscription(planId)
      ]);

      console.log("Subscription created:", {
        subscriptionId: subscriptionData.subscriptionId,
        status: subscriptionData.status
      });

      if (!subscriptionData.subscriptionId) {
        throw new Error("Subscription ID not received from server");
      }

      // Open Razorpay Checkout modal for subscription payment
      const options = {
        key: razorpayKey,
        subscription_id: subscriptionData.subscriptionId,
        name: "Xalora",
        description: `${selectedPlan.name} - Monthly Subscription`,
        handler: async function (response) {
          console.log("Payment successful:", response);
          try {
            // Verify payment and update database immediately
            await subscriptionService.verifySubscriptionPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });
            alert(`Payment successful! ${selectedPlan.name} subscription activated. Your account will be auto-charged monthly.`);
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment received! Your subscription will be activated shortly.");
          }
          // Refresh to show updated plan
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        prefill: {
          email: user?.email || "",
          name: user?.fullName || user?.name || ""
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed by user");
            setIsLoading((prev) => ({ ...prev, [planId]: false }));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsLoading((prev) => ({ ...prev, [planId]: false }));
      });
      rzp.open();

    } catch (err) {
      console.error("Error creating subscription:", err);
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          "Failed to create subscription. Please try again.";
      alert(errorMessage);
      setIsLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  // Handle any leftover redirect params (edge case)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('razorpay_subscription_id') || urlParams.has('payment')) {
      // Clean up URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchCurrentSubscription();
    }
  }, []);

  const getPlanIcon = (planId, color = "gray") => {
    const iconClass = `w-12 h-12`;
    const colorClasses = {
      gray: "text-gray-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
      amber: "text-amber-400",
      cyan: "text-cyan-400",
      indigo: "text-indigo-400",
      emerald: "text-emerald-400",
    };

    const icons = {
      spark: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      pulse: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14v4.5a1.5 1.5 0 01-1.5 1.5H14M7 14v4.5a1.5 1.5 0 001.5 1.5H10" />
        </svg>
      ),
      nexus: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      infinity: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
        </svg>
      ),
      starter: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      basic: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      pro: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      enterprise: (
        <svg className={`${iconClass} ${colorClasses[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M9 10a2 2 0 012-2h2a2 2 0 012 2M7 21h10M9 7h.01M15 7h.01M12 3v4" />
        </svg>
      ),
    };

    return icons[planId] || icons.spark;
  };

  const getColorClasses = (color, isPopular) => {
    const colors = {
      gray: {
        bg: "from-gray-800/40 to-gray-900/40",
        border: isPopular ? "border-gray-500 ring-2 ring-gray-500/30" : "border-gray-700 hover:border-gray-600",
        icon: "text-gray-400",
        button: "from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600",
        badge: "bg-gray-600",
      },
      blue: {
        bg: "from-blue-900/30 to-cyan-900/30",
        border: isPopular ? "border-blue-500 ring-2 ring-blue-500/30" : "border-blue-700/50 hover:border-blue-600",
        icon: "text-blue-400",
        button: "from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400",
        badge: "bg-blue-600",
      },
      purple: {
        bg: "from-purple-900/30 to-indigo-900/30",
        border: isPopular ? "border-purple-500 ring-2 ring-purple-500/30" : "border-purple-700/50 hover:border-purple-600",
        icon: "text-purple-400",
        button: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500",
        badge: "bg-purple-600",
      },
      amber: {
        bg: "from-amber-900/30 to-orange-900/30",
        border: isPopular ? "border-amber-500 ring-2 ring-amber-500/30" : "border-amber-700/50 hover:border-amber-600",
        icon: "text-amber-400",
        button: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
        badge: "bg-amber-600",
      },
      cyan: {
        bg: "from-cyan-900/30 to-teal-900/30",
        border: isPopular ? "border-cyan-500 ring-2 ring-cyan-500/30" : "border-cyan-700/50 hover:border-cyan-600",
        icon: "text-cyan-400",
        button: "from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400",
        badge: "bg-cyan-600",
      },
      indigo: {
        bg: "from-indigo-900/30 to-violet-900/30",
        border: isPopular ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-indigo-700/50 hover:border-indigo-600",
        icon: "text-indigo-400",
        button: "from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
        badge: "bg-indigo-600",
      },
      emerald: {
        bg: "from-emerald-900/30 to-teal-900/30",
        border: isPopular ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-emerald-700/50 hover:border-emerald-600",
        icon: "text-emerald-400",
        button: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
        badge: "bg-emerald-600",
      },
    };
    return colors[color] || colors.gray;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm mb-4 animate-pulse shadow-lg shadow-red-500/25">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              LIMITED TIME: 51% OFF ALL PAID PLANS!
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 sm:mb-6">
              Choose Your Plan
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-2 mb-8">
              Unlock your coding potential with our flexible subscription plans.
              Start for free and upgrade as you grow.
            </p>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-700">
                <button
                  onClick={() => handleTabChange("individual")}
                  className={`px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "individual"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Individual
                </button>
                <button
                  onClick={() => handleTabChange("organization")}
                  className={`px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "organization"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Organization
                </button>
              </div>
            </div>

            {/* Billing Cycle Toggle - Only for Individual */}
            {/* Billing cycle toggle removed - only monthly recurring subscriptions now */}
            {activeTab === "individual" && (
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-white font-medium">Monthly Recurring Billing</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">Auto-renew</span>
                </div>
              </div>
            )}
          </div>

          {/* Tab Content Description */}
          <div className="text-center mb-8">
            {activeTab === "individual" ? (
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Perfect for students, job seekers, and individual learners. Choose a plan that fits your learning journey.
              </p>
            ) : (
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                Designed for colleges, training institutes, and companies. Manage your entire team with powerful admin tools.
              </p>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {plans.map((plan) => {
              const colors = getColorClasses(plan.color, plan.popular);
              const price = getPrice(plan);
              const originalPrice = getOriginalPrice(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl shadow-2xl overflow-hidden border transition-all duration-500 hover:scale-[1.02] transform-gpu bg-gradient-to-br ${colors.bg} ${colors.border}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className={`absolute top-0 right-0 bg-gradient-to-r ${colors.button} text-white text-xs font-bold px-5 py-2 rounded-bl-xl z-10`}>
                      MOST POPULAR
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {currentSubscription && currentSubscription.planId === plan.id && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-br-xl z-10">
                      YOUR PLAN
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    {/* Plan Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50`}>
                        {getPlanIcon(plan.icon, plan.color)}
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-1">
                      {plan.name}
                    </h2>

                    {/* Tagline */}
                    <p className="text-center text-sm text-gray-400 mb-4">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="text-center mb-4">
                      {price === 0 || price === null ? (
                        <div>
                          {plan.customPricing ? (
                            <span className="text-3xl sm:text-4xl font-extrabold text-white">
                              Custom
                            </span>
                          ) : plan.comingSoon ? (
                            <span className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                              Coming Soon
                            </span>
                          ) : (
                            <span className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                              Free
                            </span>
                          )}
                          <span className="block text-gray-400 text-sm mt-1">
                            {plan.customPricing ? "Contact us for pricing" : plan.comingSoon ? "Stay tuned!" : "Forever free"}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              51% OFF
                            </span>
                          </div>
                          <span className="text-4xl sm:text-5xl font-extrabold text-white">
                            ₹{price}
                          </span>
                          <span className="block text-gray-400 text-sm mt-1">
                            /{plan.period === "forever" ? "forever" : "month"}
                            {plan.monthlyPrice > 0 && (
                              <span className="block text-xs text-emerald-400 mt-0.5">Auto-renews monthly</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Seat Info for Organization */}
                    {activeTab === "organization" && plan.seats && (
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-sm">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Up to <strong className="text-white ml-1">{plan.seats}</strong> members
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-400 text-center mb-5 text-sm">
                      {plan.description}
                    </p>

                    {/* Best For */}
                    <div className="rounded-lg p-3 mb-5 bg-gray-800/50 border border-gray-700/50">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">Best for:</span> {plan.bestFor}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-5">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Included Features
                      </h3>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className={`h-4 w-4 ${colors.icon} mr-2 mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300 text-xs">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-gray-500 text-xs italic pl-6">+ {plan.features.length - 5} more features</li>
                        )}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {plan.limitations && plan.limitations.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Limitations
                        </h3>
                        <ul className="space-y-1.5">
                          {plan.limitations.slice(0, 3).map((limitation, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-gray-400 text-xs">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (plan.comingSoon) {
                          alert("Coming soon! Stay tuned for updates.");
                          return;
                        }
                        if (plan.customPricing) {
                          window.location.href = "/contact";
                          return;
                        }
                        handlePlanSelect(plan.id);
                      }}
                      disabled={isLoading[plan.id] || (currentSubscription && currentSubscription.planId === plan.id) || plan.comingSoon}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-white text-sm transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gradient-to-r ${colors.button} shadow-lg hover:shadow-xl ${
                        currentSubscription && currentSubscription.planId === plan.id
                          ? "bg-gray-600 cursor-not-allowed opacity-50"
                          : ""
                      } ${isLoading[plan.id] ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {isLoading[plan.id] ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </div>
                      ) : currentSubscription && currentSubscription.planId === plan.id ? (
                        "Current Plan"
                      ) : plan.customPricing ? (
                        "Contact Sales"
                      ) : (
                        plan.buttonText
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: "cyan",
                  question: "Can I upgrade or downgrade my plan anytime?",
                  answer: "Yes, you can change your subscription plan at any time. When upgrading, you'll get immediate access to premium features. When downgrading, changes will take effect at the end of your current billing cycle."
                },
                {
                  icon: "blue",
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support UPI payments for Indian users. All payments are processed securely through Razorpay."
                },
                {
                  icon: "purple",
                  question: "Is there a free trial for paid plans?",
                  answer: "While we don't offer a traditional free trial, our free plans give you access to basic features. You can upgrade to any paid plan at any time to unlock premium features."
                },
                {
                  icon: "amber",
                  question: "What happens if I cancel my subscription?",
                  answer: "You can cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period. We don't offer refunds for partial months."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all duration-300">
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center">
                    <svg className={`w-5 h-5 mr-2 text-${faq.icon}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-green-300 font-bold text-sm">
                7-day money-back guarantee on all paid plans
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
