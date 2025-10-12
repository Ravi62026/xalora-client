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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
              Subscription Debug
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Debugging tools for subscription and payment integration
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">User Information</h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400">User ID</p>
                  <p className="text-white font-mono text-sm">{user._id}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400">Name</p>
                  <p className="text-white">{user.name}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-400">Role</p>
                  <p className="text-white">{user.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No user information available</p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Debug Actions</h2>
              <button
                onClick={loadDebugInfo}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh Debug Info"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={testGetKey}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Test Get Razorpay Key
              </button>
              <button
                onClick={testCreateOrder}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Test Create Order (Free)
              </button>
            </div>
          </div>

          {Object.keys(debugInfo).length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Debug Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Current Subscription</h3>
                  <pre className="bg-gray-900/50 rounded-xl p-4 text-gray-300 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.currentSubscription, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Plan Features</h3>
                  <pre className="bg-gray-900/50 rounded-xl p-4 text-gray-300 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.planFeatures, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Feature Access</h3>
                  <pre className="bg-gray-900/50 rounded-xl p-4 text-gray-300 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.featureAccess, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Subscription Status</h3>
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <p className="text-white mb-2">Active: <span className="font-mono">{String(debugInfo.isActive)}</span></p>
                    <p className="text-white">Plan Name: <span className="font-mono">{debugInfo.planName}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">AI Usage</h3>
                  <pre className="bg-gray-900/50 rounded-xl p-4 text-gray-300 text-sm overflow-x-auto">
                    {JSON.stringify(debugInfo.aiUsage, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">Payment History</h3>
                  <pre className="bg-gray-900/50 rounded-xl p-4 text-gray-300 text-sm overflow-x-auto">
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