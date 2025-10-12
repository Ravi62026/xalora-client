# 🔧 Quiz Analytics Troubleshooting Guide

## 🚨 **Current Issues:**

### **Issue 1: Analytics showing "No Quiz Data"**
- **Symptom:** Analytics page shows empty state despite quiz submissions in database
- **Possible Causes:**
  - API endpoint not responding correctly
  - Authentication issues
  - Database query problems
  - Frontend API call issues

### **Issue 2: JBP Coins not showing in navbar**
- **Symptom:** User profile shows 0 JBP coins even after passing quizzes
- **Possible Causes:**
  - User data not refreshed after quiz completion
  - JBP coins not saved to database
  - Frontend not displaying updated user data

## 🔍 **Debugging Steps:**

### **Step 1: Check Database**
```bash
# Connect to MongoDB and check:
# 1. User has jbpCoins field
db.users.findOne({email: "user@example.com"})

# 2. Quiz submissions exist
db.quizsubmissions.find({userId: ObjectId("...")})

# 3. Check if JBP coins were awarded
db.users.find({jbpCoins: {$gt: 0}})
```

### **Step 2: Check Backend API**
```bash
# Test analytics endpoint directly
curl -X GET http://localhost:8000/api/v1/quizzes/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test user endpoint
curl -X GET http://localhost:8000/api/v1/users/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Step 3: Check Frontend Console**
1. Open browser dev tools
2. Go to `/quiz/analytics`
3. Check console for:
   - API call logs
   - Error messages
   - Response data

### **Step 4: Use Debug Component**
- Debug component added to bottom-right of screen
- Shows current user data including JBP coins
- Click "Log to Console" to see full user object

## 🛠️ **Quick Fixes:**

### **Fix 1: Refresh User Data After Quiz**
```javascript
// In TakeQuiz.jsx - already implemented
if (response.data.jbpCoinsEarned > 0) {
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}
```

### **Fix 2: Force Analytics Data Refresh**
```javascript
// Add to QuizAnalytics.jsx
useEffect(() => {
  // Force refresh on component mount
  fetchAnalytics();
}, []);
```

### **Fix 3: Check API Routes**
```javascript
// Verify routes in routes.js
quizzes: {
  analytics: "/api/v1/quizzes/analytics",
  getReport: (submissionId) => `/api/v1/quizzes/report/${submissionId}`,
}
```

## 🧪 **Testing Checklist:**

### **Backend Tests:**
- [ ] Server running on correct port (8000)
- [ ] Quiz routes registered properly
- [ ] Analytics endpoint returns data
- [ ] JBP coins saved to user model
- [ ] Authentication middleware working

### **Frontend Tests:**
- [ ] Analytics page loads without errors
- [ ] API calls have correct headers
- [ ] User data includes jbpCoins field
- [ ] Navbar displays JBP coins
- [ ] Debug component shows user info

### **Integration Tests:**
- [ ] Take a quiz and pass (60%+)
- [ ] Check if JBP coins awarded
- [ ] Verify analytics updates
- [ ] Test report generation
- [ ] Check PDF download

## 🔧 **Common Solutions:**

### **Solution 1: Restart Services**
```bash
# Restart backend
cd server && npm start

# Restart frontend  
cd client && npm start
```

### **Solution 2: Clear Browser Cache**
```bash
# Clear localStorage
localStorage.clear()

# Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### **Solution 3: Check Environment Variables**
```bash
# Verify .env files exist and have correct values
client/.env
server/.env
```

### **Solution 4: Database Migration**
```javascript
// If JBP coins field missing, add it:
db.users.updateMany(
  {jbpCoins: {$exists: false}}, 
  {$set: {jbpCoins: 0}}
)
```

## 📊 **Expected Behavior:**

### **After Taking Quiz:**
1. **Score ≥60%:** User earns 10 JBP coins
2. **Score <60%:** No coins earned
3. **Navbar:** Shows updated coin count
4. **Analytics:** Reflects new quiz attempt
5. **Database:** User document updated with coins

### **Analytics Page Should Show:**
- Total quizzes attempted
- Pass rate percentage  
- Average score
- JBP coins balance
- Topic-wise performance
- Recent quiz history
- Detailed quiz list with actions

### **Report Page Should Show:**
- Question-wise analysis
- Correct/incorrect answers
- Explanations
- Performance summary
- PDF download option

## 🚀 **Next Steps:**

1. **Check Debug Component:** Look at bottom-right corner for user info
2. **Test API Endpoints:** Use browser network tab or Postman
3. **Verify Database:** Check if data is being saved correctly
4. **Check Console Logs:** Look for error messages or API responses
5. **Test Complete Flow:** Take quiz → Check analytics → View report

## 📞 **If Still Not Working:**

1. **Check Server Logs:** Look for error messages in backend console
2. **Verify Routes:** Ensure all quiz routes are properly registered
3. **Test Authentication:** Make sure user is properly logged in
4. **Database Connection:** Verify MongoDB connection is working
5. **API Responses:** Check if endpoints return expected data structure

The debug component and console logs should help identify where the issue is occurring! 🔍