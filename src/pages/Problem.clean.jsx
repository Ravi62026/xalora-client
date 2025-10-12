// This is a clean version of Problem.jsx with subscription handling
// In a real implementation, you would need to replace the existing Problem.jsx with this content
// and fix all the duplicate declarations

// Key changes for subscription handling:
// 1. Added useNavigate hook
// 2. Modified handleGetReview to check for subscription errors
// 3. Added navigation to pricing page when subscription is required

// Example of subscription error handling in handleGetReview:
/*
const handleGetReview = async () => {
  if (!code.trim()) {
    alert("Please write some code first!");
    return;
  }

  if (!isAuthenticated) {
    alert("Please login to use the AI code review feature!");
    return;
  }

  setReviewLoading(true);
  setReviewResult(null);

  try {
    const result = await aiService.reviewCode(code, selectedLanguage);
    if (result.success) {
      setReviewResult(result.data.review);
      setRightActiveTab("review");
    } else {
      // Check if it's a subscription error
      if (result.message && result.message.includes("upgrade")) {
        alert("AI code review is not available in your current plan. Please upgrade to unlock this feature.");
        setTimeout(() => {
          navigate('/pricing');
        }, 1000);
      } else {
        alert(result.message || "Failed to get code review");
      }
    }
  } catch (error) {
    // Check if it's a subscription error
    if (error.response?.data?.redirectToPricing) {
      alert("AI code review is not available in your current plan. Please upgrade to unlock this feature.");
      setTimeout(() => {
        navigate('/pricing');
      }, 1000);
    } else {
      alert(error.message || "Failed to get code review");
    }
  } finally {
    setReviewLoading(false);
  }
};
*/