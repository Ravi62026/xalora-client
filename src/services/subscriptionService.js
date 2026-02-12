import ApiRoutes from "../routes/routes";
import axios from "../utils/axios";

const subscriptionService = {
    // Get user's current subscription
    getCurrentSubscription: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: getCurrentSubscription ===");
            const response = await axios.get(ApiRoutes.subscription.current);
            console.log("Current subscription response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching subscription:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Check if user has access to a specific feature
    hasFeatureAccess: (subscription, feature) => {
        console.log("=== SUBSCRIPTION SERVICE: hasFeatureAccess ===");
        console.log("Checking feature access for:", feature);
        console.log("Subscription data:", subscription);

        if (!subscription || !subscription.features) {
            console.log("No subscription or features found, returning false");
            return false;
        }

        const hasAccess = subscription.features[feature] === true;
        console.log("Feature access result:", hasAccess);
        return hasAccess;
    },

    // Get user's plan name
    getPlanName: (planId) => {
        console.log("=== SUBSCRIPTION SERVICE: getPlanName ===");
        console.log("Getting plan name for ID:", planId);

        const plans = {
            "spark": "Xalora Spark",
            "pulse": "Xalora Pulse",
            "nexus": "Xalora Nexus",
            "infinity": "Xalora Infinity"
        };
        const planName = plans[planId] || "Unknown Plan";
        console.log("Plan name result:", planName);
        return planName;
    },

    // Check if subscription is active
    isSubscriptionActive: (subscription) => {
        console.log("=== SUBSCRIPTION SERVICE: isSubscriptionActive ===");
        console.log("Checking subscription active status:", subscription);

        if (!subscription) {
            console.log("No subscription found, returning false");
            return false;
        }

        const isActive = subscription.isActive && new Date(subscription.endDate) > new Date();
        console.log("Subscription active status:", isActive);
        return isActive;
    },

    // Get plan features for display
    getPlanFeatures: (planId) => {
        console.log("=== SUBSCRIPTION SERVICE: getPlanFeatures ===");
        console.log("Getting features for plan ID:", planId);

        const features = {
            "spark": {
                name: "Xalora Spark",
                description: "Free forever plan with basic features",
                color: "bg-gray-600",
                price: 0,
                features: [
                    "10 AI requests per day",
                    "3 file uploads per day",
                    "Basic coding playground",
                    "Community forum access"
                ],
                limitations: [
                    "No access to advanced AI models",
                    "No internship access",
                    "No quiz PDF downloads",
                    "No AI code review"
                ]
            },
            "pulse": {
                name: "Xalora Pulse",
                description: "Perfect for intermediate learners",
                color: "bg-blue-600",
                price: 499,
                features: [
                    "50 AI requests per day",
                    "10 file uploads per day",
                    "Access to GPT & Gemini models",
                    "AI-assisted code review",
                    "Quiz PDF downloads",
                    "Internship access"
                ],
                limitations: []
            },
            "nexus": {
                name: "Xalora Nexus",
                description: "For advanced learners and project builders",
                color: "bg-purple-600",
                price: 999,
                features: [
                    "100 AI requests per day",
                    "20 file uploads per day",
                    "Access to 20+ AI models",
                    "Real-time AI code mentor",
                    "Project workspace",
                    "Internship access"
                ],
                limitations: []
            },
            "infinity": {
                name: "Xalora Infinity",
                description: "Ultimate plan for professionals",
                color: "bg-amber-600",
                price: 1999,
                features: [
                    "Unlimited AI requests",
                    "Unlimited file uploads",
                    "Access to 50+ AI models",
                    "AI Interview Engine",
                    "Priority support",
                    "Internship access"
                ],
                limitations: []
            }
        };

        const planFeatures = features[planId] || features["spark"];
        console.log("Plan features result:", planFeatures);
        return planFeatures;
    },

    // Get AI usage information
    getAIUsageInfo: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: getAIUsageInfo ===");
            const response = await axios.get(ApiRoutes.subscription.aiUsage);
            console.log("AI usage info response:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching AI usage info:", error);
            // Return default values if there's an error
            const defaultUsage = { requestsUsed: 0, requestsLimit: 10, requestsRemaining: 10 };
            console.log("Returning default AI usage info:", defaultUsage);
            return defaultUsage;
        }
    },

    // ============ RECURRING SUBSCRIPTION METHODS ============

    // Get Razorpay key
    getRazorpayKey: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: getRazorpayKey ===");
            const response = await axios.get("/api/v1/payments/getkey");
            console.log("Razorpay key response:", response.data.data.key ? "KEY_PRESENT" : "KEY_MISSING");
            return response.data.data.key;
        } catch (error) {
            console.error("Error fetching Razorpay key:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Create recurring subscription (NEW)
    createSubscription: async (planId) => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: createSubscription (RECURRING) ===");
            console.log("Creating recurring subscription for planId:", planId);

            const response = await axios.post("/api/v1/payments/create-subscription", {
                planId
            });

            console.log("Subscription creation response:", {
                success: response.data.success,
                subscriptionId: response.data.data.subscriptionId,
                shortUrl: response.data.data.shortUrl,
                status: response.data.data.status
            });

            return response.data.data;
        } catch (error) {
            console.error("Error creating subscription:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Verify subscription payment after Razorpay checkout success
    verifySubscriptionPayment: async (paymentData) => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: verifySubscriptionPayment ===");
            console.log("Verifying payment:", paymentData);

            const response = await axios.post("/api/v1/payments/verify-subscription", paymentData);

            console.log("Verification response:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Error verifying subscription payment:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Cancel recurring subscription (NEW)
    cancelSubscription: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: cancelSubscription ===");

            const response = await axios.post("/api/v1/payments/cancel-subscription");

            console.log("Subscription cancellation response:", {
                success: response.data.success,
                message: response.data.message
            });

            return response.data.data;
        } catch (error) {
            console.error("Error cancelling subscription:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Get subscription status (NEW)
    getSubscriptionStatus: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: getSubscriptionStatus ===");

            const response = await axios.get("/api/v1/payments/subscription-status");

            console.log("Subscription status response:", response.data.data);

            return response.data.data;
        } catch (error) {
            console.error("Error fetching subscription status:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // Get payment history
    getPaymentHistory: async () => {
        try {
            console.log("=== SUBSCRIPTION SERVICE: getPaymentHistory ===");
            const response = await axios.get("/api/v1/payments/history");
            console.log("Payment history response:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching payment history:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // ============ DEPRECATED (ONE-TIME PAYMENT METHODS - KEPT FOR BACKWARD COMPATIBILITY) ============

    // @deprecated - Use createSubscription instead
    createOrder: async (amount, planId) => {
        console.warn("⚠️ createOrder is deprecated. Use createSubscription instead.");
        try {
            console.log("=== SUBSCRIPTION SERVICE: createOrder (DEPRECATED) ===");
            console.log("Creating order with amount:", amount, "planId:", planId);

            const response = await axios.post("/api/v1/payments/create-order", {
                amount,
                planId
            });

            console.log("Order creation response:", {
                success: response.data.success,
                hasOrder: !!response.data.data.order,
                hasSubscription: !!response.data.data.subscription
            });

            return response.data.data;
        } catch (error) {
            console.error("Error creating order:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // @deprecated - Not needed for recurring subscriptions
    verifyPayment: async (paymentData) => {
        console.warn("⚠️ verifyPayment is deprecated. Webhooks handle payment verification automatically.");
        try {
            console.log("=== SUBSCRIPTION SERVICE: verifyPayment (DEPRECATED) ===");
            console.log("Verifying payment with data:", {
                orderId: paymentData.razorpay_order_id,
                paymentId: paymentData.razorpay_payment_id,
                planId: paymentData.planId,
                amount: paymentData.amount
            });

            const response = await axios.post("/api/v1/payments/verify", paymentData);
            console.log("Payment verification response:", {
                success: response.data.success,
                hasSubscription: !!response.data.data.subscription
            });

            return response.data.data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // @deprecated - Prorated billing removed for recurring subscriptions
    calculateProratedAmount: async (currentPlanId, newPlanId) => {
        console.warn("⚠️ calculateProratedAmount is deprecated for recurring subscriptions.");
        try {
            console.log("=== SUBSCRIPTION SERVICE: calculateProratedAmount (DEPRECATED) ===");
            console.log("Calculating prorated amount for:", currentPlanId, "->", newPlanId);

            const response = await axios.post("/api/v1/payments/calculate-prorated", {
                currentPlanId,
                newPlanId
            });

            console.log("Prorated amount calculation response:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error calculating prorated amount:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    // @deprecated - Use getPaymentHistory instead
    generateReceipt: async (paymentId) => {
        console.warn("⚠️ generateReceipt is deprecated.");
        try {
            console.log("=== SUBSCRIPTION SERVICE: generateReceipt (DEPRECATED) ===");
            console.log("Generating receipt for payment ID:", paymentId);

            const response = await axios.get(`/api/v1/payments/generate-receipt/${paymentId}`);
            console.log("Receipt data response:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error generating receipt:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    }
};

export default subscriptionService;
