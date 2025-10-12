import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import subscriptionService from "../services/subscriptionService";

const Pricing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({}); // Changed to object for plan-specific loading
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Plan values for comparison (higher value = better plan)
  const planValues = {
    "spark": 0,
    "pulse": 1,
    "nexus": 2,
    "infinity": 3
  };

  // Updated data for subscription plans with better color schemes and icons
  const updatedPlans = [
    {
      id: "spark",
      name: "Xalora Spark",
      tagline: "Where your journey begins.",
      price: 0,
      period: "forever",
      bestFor: "Freshers & first-year students",
      description: "Perfect start for absolute beginners",
      features: [
        "Access to core learning modules (DSA, CS fundamentals)",
        "Limited AI usage (basic LLM responses only)",
        "Coding playground (single test input)",
        "Community forum access",
        "Basic certificates"
      ],
      limitations: [
        "10 AI requests per day",
        "3 file uploads per day",
        "No access to advanced AI models",
        "No internship access",
        "No quiz PDF downloads"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonStyle: "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900",
      iconColor: "text-gray-400",
      bgColor: "bg-gray-800/50",
      borderColor: "border-gray-700"
    },
    {
      id: "pulse",
      name: "Xalora Pulse",
      tagline: "Get in the flow — code, learn, evolve.",
      price: 245, // 51% discount from 499
      originalPrice: 499,
      period: "per month",
      bestFor: "Intermediate users (1st–2nd year students serious about CS)",
      description: "For consistent learners who want AI-backed coding support",
      features: [
        "All Spark features",
        "Unlimited coding playground (multi-testcases)",
        "AI-assisted learning (GPT + Gemini access) (50 req daily)",
        "Topic-wise quizzes & skill assessments (AI-assisted code review, gap analysis, code quality)",
        "Resume tracker",
        "Early access to hackathons"
      ],
      limitations: [
        "Limited to 50 AI requests per day",
        "Limited to 10 file uploads per day"
      ],
      popular: false,
      buttonText: "Start Learning",
      buttonStyle: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700"
    },
    {
      id: "nexus",
      name: "Xalora Nexus",
      tagline: "Connect with the future of AI learning.",
      price: 490, // 51% discount from 999
      originalPrice: 999,
      period: "per month",
      bestFor: "2nd–3rd year students & project builders",
      description: "AI-powered skill acceleration + project-based growth",
      features: [
        "All Pulse features",
        "Full access to 20+ AI models (GPT, Claude, Gemini, Mistral, etc.)",
        "Project workspace with versioning",
        "Real-time AI code mentor",
        "Project certificate with skill mapping",
        "Access to internship readiness challenges"
      ],
      limitations: [
        "Limited to 100 AI requests per day",
        "Limited to 20 file uploads per day"
      ],
      popular: true,
      buttonText: "Go Nexus",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-700"
    },
    {
      id: "infinity",
      name: "Xalora Infinity",
      tagline: "The complete intelligence suite — built for achievers.",
      price: null, // Coming Soon
      originalPrice: 1999,
      period: "per month",
      bestFor: "3rd–4th year students, job seekers, professionals",
      description: "Ultimate all-access plan — from learning to hiring",
      comingSoon: true,
      features: [
        "Everything in Nexus",
        "AI Interview Engine (5 full rounds: Technical, HR, Behavioral, Coding, System Design)",
        "Access to 50+ LLMs (GPT, Claude, Gemini, Mistral, Command-R, etc.)",
        "Personalized career analytics & AI-driven feedback",
        "Resume + LinkedIn Optimizer",
        "Certificate with AI credibility score",
        "Priority support & early access to new Xalora tools"
      ],
      limitations: [],
      popular: false,
      buttonText: "Coming Soon",
      buttonStyle: "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-75",
      iconColor: "text-amber-400",
      bgColor: "bg-amber-900/20",
      borderColor: "border-amber-700"
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setPlans(updatedPlans);
    
    // Log user subscription info for debugging
    console.log("=== PRICING PAGE LOADED ===");
    console.log("User authentication status:", isAuthenticated);
    if (user) {
      console.log("User info:", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      });
    }
    
    // Fetch current subscription
    fetchCurrentSubscription();
  }, [isAuthenticated, user]);

  // Fetch current subscription
  const fetchCurrentSubscription = async () => {
    try {
      console.log("Fetching current subscription...");
      const subscription = await subscriptionService.getCurrentSubscription();
      console.log("Current subscription fetched:", subscription);
      setCurrentSubscription(subscription?.data || null);
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      setCurrentSubscription(null);
    }
  };

  // Calculate prorated amount for plan upgrade
  const calculateProratedAmount = async (currentPlanId, newPlanId) => {
    try {
      console.log("=== PRICING: Calculating prorated amount ===");
      console.log("User is upgrading from", currentPlanId, "to", newPlanId);
      
      // Call backend API to calculate prorated amount
      const result = await subscriptionService.calculateProratedAmount(currentPlanId, newPlanId);
      console.log("Backend prorated calculation result:", result);
      
      if (result.isProrated) {
        console.log("=== PRORATED BILLING DETAILS ===");
        console.log("User is paying DIFFERENCE amount because they already have", currentPlanId);
        console.log("Original price: ₹", result.fullAmount);
        console.log("Prorated amount: ₹", result.amount.toFixed(2));
        console.log("Savings: ₹", result.savings.toFixed(2));
        console.log("User pays only the DIFFERENCE: ₹", result.amount.toFixed(2));
      } else {
        console.log("No prorated billing - full amount charged: ₹", result.amount);
      }
      
      return result;
    } catch (error) {
      console.error("Error calculating prorated amount:", error);
      // Fallback to full amount if API fails
      return { amount: null, isProrated: false };
    }
  };

  const handlePlanSelect = async (planId) => {
    console.log("=== PLAN SELECTION INITIATED ===");
    console.log("Selected plan ID:", planId);
    console.log("User authenticated:", isAuthenticated);
    
    // Check if it's the Infinity plan (Coming Soon)
    if (planId === "infinity") {
      alert("Xalora Infinity is coming soon! Stay tuned for the ultimate AI learning experience.");
      return;
    }
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    // Set loading state for this specific plan
    setIsLoading(prev => ({ ...prev, [planId]: true }));

    // Get the selected plan details
    const selectedPlan = plans.find(plan => plan.id === planId);
    console.log("Selected plan details:", selectedPlan);
    
    if (!selectedPlan) {
      console.error("Plan not found for ID:", planId);
      alert("Plan not found");
      setIsLoading(prev => ({ ...prev, [planId]: false }));
      return;
    }

    // Check if user already has this plan
    if (currentSubscription && currentSubscription.planId === planId) {
      console.log("User already has this plan:", planId);
      alert(`You already have the ${selectedPlan.name} plan. Please select a different plan to upgrade.`);
      setIsLoading(prev => ({ ...prev, [planId]: false }));
      return;
    }

    // Check if user is trying to downgrade (select a lower-value plan)
    if (currentSubscription && planValues[planId] < planValues[currentSubscription.planId]) {
      console.log("Downgrade attempt detected:", currentSubscription.planId, "->", planId);
      // Instead of showing alert, redirect to homepage for lower-tier plans
      console.log("Redirecting to homepage for lower-tier plan access");
      window.location.href = "/";
      return;
    }

    // For free plan, we can directly assign it
    if (planId === "spark" || selectedPlan.price === 0) {
      console.log("Processing free plan (Spark)");
      try {
        console.log("Calling subscriptionService.createOrder with amount: 0, planId:", planId);
        const result = await subscriptionService.createOrder(0, planId);
        console.log("Free plan activation result:", result);
        alert("Xalora Spark plan activated! You now have access to basic features.");
        // Refresh the page to update the subscription status
        window.location.reload();
      } catch (err) {
        console.error("=== FREE PLAN ACTIVATION ERROR ===");
        console.error("Error activating free plan:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("=== END ERROR ===");
        alert("Failed to activate free plan. Please try again.");
      } finally {
        setIsLoading(prev => ({ ...prev, [planId]: false }));
        console.log("=== FREE PLAN PROCESSING COMPLETE ===");
      }
      return;
    }

    // For paid plans, check if user has existing subscription for prorated billing
    console.log("Processing paid plan:", selectedPlan.name);
    
    try {
      let finalAmount = selectedPlan.price;
      let isProrated = false;
      let proratedInfo = null;
      
      // Calculate prorated amount if upgrading
      if (currentSubscription && currentSubscription.planId !== planId) {
        console.log("User is upgrading from", currentSubscription.planId, "to", planId);
        console.log("Calculating prorated amount for plan upgrade");
        const proratedResult = await calculateProratedAmount(
          currentSubscription.planId, 
          planId
        );
        
        if (proratedResult && proratedResult.isProrated && proratedResult.amount < selectedPlan.price && proratedResult.amount > 0) {
          finalAmount = proratedResult.amount;
          isProrated = true;
          proratedInfo = proratedResult;
          console.log("Using prorated amount:", finalAmount);
        } else {
          console.log("Using full amount:", selectedPlan.price);
        }
      } else {
        console.log("No existing subscription or same plan, using full amount:", selectedPlan.price);
        if (currentSubscription) {
          console.log("User already has the same plan:", currentSubscription.planId);
        } else {
          console.log("User has no existing subscription");
        }
      }

      // Get Razorpay key
      console.log("Fetching Razorpay key...");
      const key = await subscriptionService.getRazorpayKey();
      console.log("Razorpay key received:", key ? "KEY_PRESENT" : "KEY_MISSING");

      // Create order with calculated amount
      console.log("Creating order for amount:", finalAmount, "plan:", planId);
      let orderData;
      try {
        // Round the amount to 2 decimal places before sending to backend
        const roundedAmount = Math.round(finalAmount * 100) / 100;
        orderData = await subscriptionService.createOrder(roundedAmount, planId);
      } catch (orderError) {
        // Handle specific error cases from backend
        if (orderError.response?.data?.message) {
          console.error("Order creation failed:", orderError.response.data.message);
          // Show user-friendly messages for specific errors
          if (orderError.response.data.message.includes("already have this plan")) {
            alert(`You already have the ${selectedPlan.name} plan. No need to purchase it again.`);
          } else if (orderError.response.data.message.includes("Downgrade is not allowed")) {
            const currentPlanName = subscriptionService.getPlanName(currentSubscription.planId);
            alert(`Downgrade is not allowed. You currently have the ${currentPlanName} plan. You can only upgrade to a higher plan.`);
          } else {
            alert(orderError.response.data.message);
          }
        } else {
          console.error("Order creation failed:", orderError);
          alert("Failed to create order. Please try again.");
        }
        setIsLoading(prev => ({ ...prev, [planId]: false }));
        return;
      }
      
      console.log("Order creation result:", orderData);
      
      // If it's a free plan activation response
      if (orderData.order === null) {
        console.log("Free plan activation confirmed");
        alert("Plan activated successfully!");
        window.location.reload();
        return;
      }

      const order = orderData.order;
      console.log("Order details:", {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });

      // Show prorated information to user
      if (isProrated && proratedInfo) {
        console.log("=== DISPLAYING PRORATED BILLING TO USER ===");
        console.log("User is paying DIFFERENCE amount because they already have", proratedInfo.currentPlan);
        console.log("Original price: ₹", proratedInfo.fullAmount);
        console.log("Prorated amount: ₹", proratedInfo.amount.toFixed(2));
        console.log("Savings: ₹", proratedInfo.savings.toFixed(2));
        
        alert(`You're upgrading your plan!\n\n` +
              `You already have: ${proratedInfo.currentPlan}\n` +
              `Upgrading to: ${planId}\n\n` +
              `Original price: ₹${proratedInfo.fullAmount}\n` +
              `Prorated amount: ₹${proratedInfo.amount.toFixed(2)}\n` +
              `You save: ₹${proratedInfo.savings.toFixed(2)}\n\n` +
              `Click OK to proceed with payment.`);
      }

      // Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Xalora',
        description: `Xalora ${selectedPlan.name} Plan`,
        order_id: order.id,
        handler: async function (response) {
          console.log("=== PAYMENT SUCCESSFUL ===");
          console.log("Razorpay response:", response);
          
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId,
              amount: finalAmount
            };
            
            console.log("Verifying payment with backend...");
            console.log("Verification data:", {
              orderId: verificationData.razorpay_order_id,
              paymentId: verificationData.razorpay_payment_id,
              planId: verificationData.planId,
              amount: verificationData.amount
            });

            const verificationResult = await subscriptionService.verifyPayment(verificationData);
            console.log("Payment verification result:", verificationResult);
            
            // Show success message and refresh
            if (isProrated && proratedInfo) {
              console.log("=== PAYMENT SUCCESS WITH PRORATED BILLING ===");
              console.log("User paid DIFFERENCE amount: ₹", proratedInfo.amount.toFixed(2));
              console.log("They saved: ₹", proratedInfo.savings.toFixed(2));
              
              alert(`${selectedPlan.name} plan upgraded successfully!\n\n` +
                    `You've been charged ₹${proratedInfo.amount.toFixed(2)} (prorated amount).\n` +
                    `You saved ₹${proratedInfo.savings.toFixed(2)}!\n\n` +
                    `Your subscription has been updated.`);
            } else {
              alert(`${selectedPlan.name} plan activated successfully!`);
            }
            window.location.reload();
          } catch (err) {
            console.error("=== PAYMENT VERIFICATION ERROR ===");
            console.error("Payment verification failed:", err);
            console.error("Error message:", err.message);
            console.error("Error stack:", err.stack);
            console.error("=== END ERROR ===");
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsLoading(prev => ({ ...prev, [planId]: false }));
          }
        },
        prefill: {
          name: user?.name || 'Customer Name',
          email: user?.email || 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#017a8d',
        },
        modal: {
          ondismiss: function() {
            console.log("=== PAYMENT MODAL DISMISSED ===");
            setIsLoading(prev => ({ ...prev, [planId]: false }));
            console.log("Payment dialog closed by user");
          }
        }
      };

      console.log("Opening Razorpay checkout modal...");
      const rzp = new window.Razorpay(options);
      rzp.open();
      console.log("Razorpay modal opened");
    } catch (err) {
      console.error("=== PAYMENT PROCESSING ERROR ===");
      console.error('Payment error:', err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("=== END ERROR ===");
      alert('Payment failed. Please try again.');
      setIsLoading(prev => ({ ...prev, [planId]: false })); // Make sure to set loading to false on error
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case "spark":
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "pulse":
        return (
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14v4.5a1.5 1.5 0 01-1.5 1.5H14M7 14v4.5a1.5 1.5 0 001.5 1.5H10" />
          </svg>
        );
      case "nexus":
        return (
          <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case "infinity":
        return (
          <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12l8.25 8.25M20.25 12L12 20.25" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4 animate-pulse">
              🔥 LIMITED TIME: 51% OFF ALL PAID PLANS!
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock your coding potential with our flexible subscription plans. 
              Start for free and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl shadow-2xl overflow-hidden border transition-all duration-500 hover:scale-105 transform-gpu ${
                  currentSubscription && currentSubscription.planId === plan.id
                    ? "cursor-default bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500 ring-4 ring-green-500/20"
                    : "cursor-pointer bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-gray-600"
                } ${
                  plan.popular && !(currentSubscription && currentSubscription.planId === plan.id)
                    ? "ring-4 ring-purple-500/20 border-purple-500" 
                    : ""
                }`}
                onClick={() => {
                  // Check if it's Coming Soon
                  if (plan.comingSoon) {
                    alert("Xalora Infinity is coming soon! Stay tuned for the ultimate AI learning experience.");
                    return;
                  }
                  
                  // Only allow clicking if it's not the current plan
                  if (!(currentSubscription && currentSubscription.planId === plan.id)) {
                    console.log("Plan card clicked:", plan.id);
                    // Check if user is trying to downgrade
                    if (currentSubscription && planValues[plan.id] < planValues[currentSubscription.planId]) {
                      console.log("Downgrade attempt detected:", currentSubscription.planId, "->", plan.id);
                      // Instead of showing alert, redirect to homepage for lower-tier plans
                      console.log("Redirecting to homepage for lower-tier plan access");
                      window.location.href = "/";
                      return;
                    }
                    
                    handlePlanSelect(plan.id);
                  }
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}

                {/* Current Plan Badge */}
                {currentSubscription && currentSubscription.planId === plan.id && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-6 py-2 rounded-br-xl">
                    YOUR PLAN
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Icon */}
                  <div className={`flex justify-center mb-6 ${plan.bgColor} backdrop-blur-sm rounded-2xl p-4`}>
                    {getPlanIcon(plan.id)}
                  </div>

                  {/* Plan Name */}
                  <h2 className="text-2xl font-bold text-white text-center mb-2">
                    {plan.name}
                  </h2>

                  {/* Tagline */}
                  <p className="text-center italic mb-4">
                    <span className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${plan.iconColor} to-white`}>
                      {plan.tagline}
                    </span>
                  </p>

                  {/* Best For */}
                  <div className={`rounded-xl p-4 mb-6 ${plan.bgColor} backdrop-blur-sm border ${plan.borderColor}`}>
                    <p className="text-sm">
                      <span className="font-semibold text-white">Best for:</span> 
                      <span className="text-gray-300"> {plan.bestFor}</span>
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    {plan.price === 0 ? (
                      <div>
                        <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                          Free
                        </span>
                        <span className="block text-gray-400 mt-2">Forever</span>
                      </div>
                    ) : plan.comingSoon ? (
                      <div>
                        <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                          Coming Soon
                        </span>
                        <div className="mt-2">
                          <span className="text-2xl text-gray-500 line-through">₹{plan.originalPrice}</span>
                          <span className="block text-gray-400 text-sm mt-1">/{plan.period}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-2xl text-gray-500 line-through">₹{plan.originalPrice}</span>
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            51% OFF
                          </span>
                        </div>
                        <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                          ₹{plan.price}
                        </span>
                        <span className="block text-gray-400 mt-2">/{plan.period}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-center mb-8 italic">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Included Features
                    </h3>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className={`h-5 w-5 ${plan.iconColor} mr-3 mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations for non-free plans */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Limitations
                      </h3>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-gray-400 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Button clicked for plan:", plan.id);
                      
                      // Check if it's Coming Soon
                      if (plan.comingSoon) {
                        alert("Xalora Infinity is coming soon! Stay tuned for the ultimate AI learning experience.");
                        return;
                      }
                      
                      // Check if user is trying to downgrade
                      if (currentSubscription && planValues[plan.id] < planValues[currentSubscription.planId]) {
                        console.log("Downgrade attempt detected:", currentSubscription.planId, "->", plan.id);
                        // Instead of showing alert, redirect to homepage for lower-tier plans
                        console.log("Redirecting to homepage for lower-tier plan access");
                        window.location.href = "/";
                        return;
                      }
                      
                      handlePlanSelect(plan.id);
                    }}
                    disabled={isLoading[plan.id] || false || (currentSubscription && currentSubscription.planId === plan.id) || plan.comingSoon}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      currentSubscription && currentSubscription.planId === plan.id 
                        ? "bg-gray-600 cursor-not-allowed" 
                        : plan.buttonStyle
                    } ${(isLoading[plan.id] || false) ? "opacity-75 cursor-not-allowed" : ""} shadow-lg hover:shadow-xl`}
                  >
                    {(isLoading[plan.id] || false) ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      // Show different button text based on current subscription
                      currentSubscription && currentSubscription.planId === plan.id 
                        ? "Current Plan" 
                        : (currentSubscription && planValues[plan.id] < planValues[currentSubscription.planId])
                          ? (plan.id === "spark" ? "Get Started" : "Start Learning")
                          : (currentSubscription && plan.id !== "spark" && plan.id !== currentSubscription.planId) 
                            ? `Upgrade to ${plan.name.split(" ")[1]}` 
                            : plan.buttonText
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Can I upgrade or downgrade my plan anytime?
                </h3>
                <p className="text-gray-300">
                  Yes, you can change your subscription plan at any time. 
                  When upgrading, you'll get immediate access to premium features. 
                  When downgrading, changes will take effect at the end of your current billing cycle.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-300">
                  We accept all major credit cards including Visa, Mastercard, and American Express. 
                  We also support UPI payments for Indian users. All payments are processed securely through Razorpay.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Is there a free trial for paid plans?
                </h3>
                <p className="text-gray-300">
                  While we don't offer a traditional free trial, our Xalora Spark plan gives you access to basic features. 
                  You can upgrade to any paid plan at any time to unlock premium features.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-500/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  What happens if I cancel my subscription?
                </h3>
                <p className="text-gray-300">
                  You can cancel your subscription at any time. Your access to premium features will continue 
                  until the end of your current billing period. We don't offer refunds for partial months.
                </p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-8 py-4 backdrop-blur-sm">
              <svg className="w-8 h-8 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-green-300 font-bold text-lg">
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