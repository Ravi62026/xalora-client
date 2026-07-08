import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import subscriptionService from "../services/subscriptionService";

const SubscriptionDebug = () => {
  const { user } = useSelector((state) => state.user);
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("=== SUBSCRIPTION DEBUG PAGE LOADED ===");
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    console.log("=== LOADING DEBUG INFO ===");
    setLoading(true);
    
    try {
      // Test all subscription service methods
      const results = {};
      
      console.log("1. Testing getCurrentSubscription...");
      results.currentSubscription = await subscriptionService.getCurrentSubscription();
      
      console.log("2. Testing getPlanFeatures for all plans...");
      results.planFeatures = {
        spark: subscriptionService.getPlanFeatures("spark"),
        pulse: subscriptionService.getPlanFeatures("pulse"),
        nexus: subscriptionService.getPlanFeatures("nexus"),
        infinity: subscriptionService.getPlanFeatures("infinity")
      };
      
      console.log("3. Testing hasFeatureAccess...");
      results.featureAccess = {
        aiAccess: subscriptionService.hasFeatureAccess(results.currentSubscription?.data, "openAIModelsAccess"),
        internshipAccess: subscriptionService.hasFeatureAccess(results.currentSubscription?.data, "internshipAccess"),
        pdfDownload: subscriptionService.hasFeatureAccess(results.currentSubscription?.data, "quizPDFDownload")
      };
      
      console.log("4. Testing isSubscriptionActive...");
      results.isActive = subscriptionService.isSubscriptionActive(results.currentSubscription?.data);
      
      console.log("5. Testing getPlanName...");
      results.planName = subscriptionService.getPlanName(results.currentSubscription?.data?.planId);
      
      console.log("6. Testing getAIUsageInfo...");
      results.aiUsage = await subscriptionService.getAIUsageInfo();
      
      console.log("7. Testing getPaymentHistory...");
      try {
        results.paymentHistory = await subscriptionService.getPaymentHistory();
      } catch (error) {
        results.paymentHistory = "Not available or error occurred";
        console.log("Payment history not available:", error.message);
      }
      
      setDebugInfo(results);
      console.log("=== DEBUG INFO LOADED ===", results);
    } catch (error) {
      console.error("=== DEBUG INFO ERROR ===");
      console.error("Error loading debug info:", error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateOrder = async () => {
    console.log("=== TESTING CREATE ORDER ===");
    try {
      const result = await subscriptionService.createOrder(0, "spark");
      console.log("Create order result:", result);
      alert("Order created successfully! Check console for details.");
    } catch (error) {
      console.error("Create order error:", error);
      alert("Error creating order. Check console for details.");
    }
  };

  const testGetKey = async () => {
    console.log("=== TESTING GET KEY ===");
    try {
      const key = await subscriptionService.getRazorpayKey();
      console.log("Razorpay key:", key ? "RECEIVED" : "NOT RECEIVED");
      alert("Razorpay key test completed! Check console for details.");
    } catch (error) {
      console.error("Get key error:", error);
      alert("Error getting Razorpay key. Check console for details.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mb-6">
              Subscription Debug
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Debugging tools for subscription and payment integration
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl shadow-sm p-8 mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">User Information</h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <p className="text-slate-500 font-semibold text-sm">User ID</p>
                  <p className="text-slate-800 font-mono text-sm">{user._id}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <p className="text-slate-500 font-semibold text-sm">Name</p>
                  <p className="text-slate-800 font-bold">{user.name}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <p className="text-slate-500 font-semibold text-sm">Email</p>
                  <p className="text-slate-800 font-bold">{user.email}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <p className="text-slate-500 font-semibold text-sm">Role</p>
                  <p className="text-slate-800 font-bold">{user.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">No user information available</p>
            )}
          </div>

          <div className="bg-white/80 rounded-2xl shadow-sm p-8 mb-8 border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Debug Actions</h2>
              <button
                onClick={loadDebugInfo}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh Debug Info"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={testGetKey}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-purple-100"
              >
                Test Get Razorpay Key
              </button>
              <button
                onClick={testCreateOrder}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-amber-100"
              >
                Test Create Order (Free)
              </button>
            </div>
          </div>

          {Object.keys(debugInfo).length > 0 && (
            <div className="bg-white/80 rounded-2xl shadow-sm p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Debug Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Current Subscription</h3>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-100 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.currentSubscription, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Plan Features</h3>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-100 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.planFeatures, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Feature Access</h3>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-100 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.featureAccess, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Subscription Status</h3>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                    <p className="text-slate-700 font-semibold mb-2">Active: <span className="font-mono text-slate-900 font-bold">{String(debugInfo.isActive)}</span></p>
                    <p className="text-slate-700 font-semibold">Plan Name: <span className="font-mono text-slate-900 font-bold">{debugInfo.planName}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">AI Usage</h3>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-100 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.aiUsage, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">Payment History</h3>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-100 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.paymentHistory, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionDebug;