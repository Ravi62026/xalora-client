import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, Briefcase, Building, FileText, Loader2, AlertCircle, Sparkles, Eye, EyeOff, CheckCircle2, Circle, Mic, MessageSquare, Lock, Zap, ArrowLeft, ArrowRight, Check, Ticket, Tag } from 'lucide-react';
import { Layout } from '../../components';
import interviewService from '../../services/interviewService';
import { useSelector } from 'react-redux';
import {
  getActiveWorkspace,
  isCompanyCandidateWorkspace,
} from "../../utils/workspace";

// Predefined Roles & JDs
const PREDEFINED_ROLES = [
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'ml_engineer', label: 'Machine Learning Engineer' },
  { value: 'gen_ai_engineer', label: 'Gen AI Engineer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'ui_ux', label: 'UI/UX Designer' },
  { value: 'qa_engineer', label: 'QA Engineer' },
  { value: 'cybersecurity', label: 'Cybersecurity Analyst' },
  { value: 'other', label: 'Other (Specify Manual)' }
];

const PREDEFINED_JDS = {
  frontend: `Role: Frontend Developer
Role Summary: Build scalable, performant, and user-centric web interfaces for production-grade applications. Responsible for translating product requirements and designs into high-quality frontend systems.
Required Skills: Strong JavaScript/TypeScript fundamentals, React/Vue/Angular, Zustand/Redux, CSS architecture.`,
  backend: `Role: Backend Developer
Role Summary: Design and maintain scalable, secure backend systems that power real-world applications. Own APIs, databases, and system reliability.
Required Skills: Node.js/Python/Java/Go, REST/GraphQL API design, SQL/NoSQL databases, security fundamentals.`,
  fullstack: `Role: Full Stack Developer
Role Summary: Own end-to-end product development from UI to database. Expected to work across layers and deliver complete features independently.
Required Skills: Frontend + Backend proficiency, API integration, databases, DevOps and cloud basics.`,
  devops: `Role: DevOps Engineer
Role Summary: Ensure reliable, scalable, and secure deployment of applications. Own infrastructure automation, monitoring, and system uptime.
Required Skills: Docker & Kubernetes, AWS/GCP, Terraform, CI/CD, Prometheus & Grafana.`,
  data_scientist: `Role: Data Scientist
Role Summary: Use data to drive insights, predictions, and business decisions. Bridge the gap between raw data and actionable intelligence.
Required Skills: Python, SQL, Statistics and probability, ML models, Data visualization.`,
  ml_engineer: `Role: Machine Learning Engineer
Role Summary: Build and deploy production-ready ML systems that scale. Focus on reliability, performance, and real-world impact of models.
Required Skills: PyTorch/TensorFlow, Model deployment, Data pipelines, System design basics.`,
  gen_ai_engineer: `Role: Gen AI Engineer
Role Summary: Build and deploy generative AI applications using LLMs, RAG, and prompt engineering. Focus on creating intelligent, context-aware AI systems.
Required Skills: LLMs, Prompt engineering, Vector databases (Pinecone, Chroma), LangChain/LlamaIndex.`,
  product_manager: `Role: Product Manager
Role Summary: Own product vision and execution. Translate user needs into clear requirements and guide teams to deliver value.
Required Skills: Communication, Analytical thinking, Stakeholder management, User-centric mindset.`,
  ui_ux: `Role: UI/UX Designer
Role Summary: Design intuitive and delightful user experiences that solve real problems while aligning with business goals.
Required Skills: Figma/Sketch, UX research, Design systems, Accessibility fundamentals.`,
  qa_engineer: `Role: QA Engineer
Role Summary: Ensure product quality through structured testing and proactive defect prevention.
Required Skills: Test design, Automation, CI/CD integration, Bug tracking, Detail focus.`,
  cybersecurity: `Role: Cybersecurity Analyst
Role Summary: Protect systems, networks, and data from security threats. Identify vulnerabilities and respond to incidents.
Required Skills: Application security, Threat modeling, Penetration testing, Cryptography basics.`
};

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const activeWorkspace = getActiveWorkspace(user);

  // Company candidate detection
  const isCompanyCandidate = isCompanyCandidateWorkspace(activeWorkspace);
  const assignedRounds = activeWorkspace?.interviewRounds || [];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    experience: '',
    position: isCompanyCandidate ? (activeWorkspace?.position || '') : '',
    selectedRole: '', // Dropdown value
    customPosition: '', // Manual input if 'other'
    companyType: isCompanyCandidate ? 'product_based' : 'startup',
    interviewMode: isCompanyCandidate ? 'specific' : 'full',
    specificRound: isCompanyCandidate && assignedRounds.length === 1 ? assignedRounds[0] : '',
    jobDescription: '',
    codingDifficulty: isCompanyCandidate ? 'medium' : 'auto',
    interviewStyle: 'manual', // 'manual' | 'conversational'
    personality: 'professional', // 'professional' | 'mentoring' | 'challenging'
    interviewTopic: '',
    customTopic: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [userPlan, setUserPlan] = useState(null); // fetched from /api/subscription/current

  // Wizard Navigation States
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('forward'); // 'forward' | 'backward'

  // Allowed plans for conversational mode (mirrors server CONVERSATIONAL_MODE_PLANS)
  const CONVERSATIONAL_ALLOWED = ['nexus', 'infinity', 'org'];
  const canUseConversational = !userPlan || CONVERSATIONAL_ALLOWED.includes(userPlan?.toLowerCase());
  const [showPreviewJD, setShowPreviewJD] = useState(false);

  // Progress tracking (final loader steps)
  const [progressSteps, setProgressSteps] = useState([
    { id: 1, label: 'Uploading Resume', status: 'pending' },
    { id: 2, label: 'Parsing PDF Content', status: 'pending' },
    { id: 3, label: 'Analyzing with AI', status: 'pending' },
    { id: 4, label: 'Generating Questions', status: 'pending' },
    { id: 5, label: 'Finalizing Setup', status: 'pending' },
  ]);

  // Derived helpers — which specific round is selected
  const isResumeDeepDive = formData.interviewMode === 'specific' && formData.specificRound === 'resume_deep_dive';
  const isJDBased = formData.interviewMode === 'specific' && formData.specificRound === 'jd_based';
  const isSimplifiedForm = isResumeDeepDive || isJDBased;

  // Update position when role selection changes
  useEffect(() => {
    if (formData.selectedRole && formData.selectedRole !== 'other') {
      const roleLabel = PREDEFINED_ROLES.find(r => r.value === formData.selectedRole)?.label || '';
      setFormData(prev => ({ ...prev, position: roleLabel }));
    } else if (formData.selectedRole === 'other') {
      setFormData(prev => ({ ...prev, position: prev.customPosition }));
    }
  }, [formData.selectedRole, formData.customPosition]);

  // Fetch plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/subscription/current', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data?.subscription?.planId || 'spark');
        }
      } catch { /* silently fail */ }
    };
    fetchPlan();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  // Step Validation & Navigation
  const scrollToFormTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (formData.interviewMode === 'specific' && !formData.specificRound) {
        setError('Please select a specific round to practice');
        return;
      }
      if (formData.interviewMode === 'topic') {
        const resolvedTopic = formData.interviewTopic === 'other' ? formData.customTopic : formData.interviewTopic;
        if (!resolvedTopic || !resolvedTopic.trim()) {
          setError('Please select or specify a topic');
          return;
        }
      }
    } else if (currentStep === 2) {
      if (!formData.name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!isSimplifiedForm) {
        if (!formData.age) {
          setError('Please enter your age');
          return;
        }
        if (!formData.experience.trim()) {
          setError('Please enter your experience');
          return;
        }
      }
    } else if (currentStep === 3) {
      if (isJDBased) {
        if (!formData.jobDescription.trim()) {
          setError('Please provide a Job Description');
          return;
        }
      } else if (!isSimplifiedForm) {
        if (!formData.position.trim()) {
          setError('Please select a target position');
          return;
        }
      }
    }

    setError(null);
    setSlideDirection('forward');
    const targetStep = (currentStep === 2 && isResumeDeepDive) ? 4 : currentStep + 1;
    setCurrentStep(targetStep);
    scrollToFormTop();
  };

  const handlePrevStep = () => {
    setError(null);
    setSlideDirection('backward');
    const targetStep = (currentStep === 4 && isResumeDeepDive) ? 2 : currentStep - 1;
    setCurrentStep(targetStep);
    scrollToFormTop();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Verify fields
    if (isResumeDeepDive) {
      if (!formData.name || !resumeFile) {
        setError('Please complete the steps and upload your resume');
        return;
      }
    } else if (isJDBased) {
      if (!formData.name || !formData.jobDescription.trim()) {
        setError('Please complete the steps and paste the job description');
        return;
      }
    } else if (!formData.name || !formData.age || !formData.position || !resumeFile) {
      setError('Please complete all steps and upload your resume');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingMessage('Uploading your resume...');
    setProgressSteps(prev =>
      prev.map((step, idx) =>
        idx === 0 ? { ...step, status: 'active' } : step
      )
    );

    try {
      let finalJD = '';
      if (formData.selectedRole && formData.selectedRole !== 'other') {
        const predefinedJD = PREDEFINED_JDS[formData.selectedRole] || '';
        if (formData.jobDescription.trim()) {
          finalJD = `${predefinedJD}\n\n--- ADDITIONAL CANDIDATE REQUIREMENTS ---\n${formData.jobDescription}`;
        } else {
          finalJD = predefinedJD;
        }
      } else {
        finalJD = formData.jobDescription;
      }

      const submitData = new FormData();
      submitData.append('candidateName', formData.name);
      
      const actualInterviewMode = formData.interviewMode === 'topic' ? 'specific' : formData.interviewMode;
      const actualSpecificRound = formData.interviewMode === 'topic' ? 'technical' : formData.specificRound;
      
      submitData.append('interviewMode', actualInterviewMode);
      submitData.append('codingDifficulty', formData.codingDifficulty);
      submitData.append('interviewStyle', formData.interviewStyle || 'manual');
      submitData.append('personality', formData.personality || 'professional');
      if (actualSpecificRound) submitData.append('specificRound', actualSpecificRound);

      if (formData.interviewMode === 'topic') {
        const resolvedTopic = formData.interviewTopic === 'other' ? formData.customTopic : formData.interviewTopic;
        submitData.append('interviewTopic', resolvedTopic || 'General Technology');
      }

      if (isResumeDeepDive) {
        submitData.append('resumeFile', resumeFile);
        submitData.append('candidateAge', '25');
        submitData.append('position', 'Not specified');
        submitData.append('companyType', 'startup');
      } else if (isJDBased) {
        const dummyBlob = new Blob(['Resume not provided for JD-based round'], { type: 'application/pdf' });
        submitData.append('resumeFile', dummyBlob, 'placeholder.pdf');
        submitData.append('jobDescription', formData.jobDescription);
        submitData.append('candidateAge', '25');
        submitData.append('position', 'Not specified');
        submitData.append('companyType', 'startup');
      } else {
        if (resumeFile) submitData.append('resumeFile', resumeFile);
        submitData.append('candidateAge', formData.age);
        submitData.append('candidateGender', formData.gender);
        submitData.append('candidateExperience', formData.experience);
        submitData.append('position', formData.position);
        submitData.append('companyType', formData.companyType);
        if (finalJD) submitData.append('jobDescription', finalJD);
      }

      setProgressSteps(prev =>
        prev.map((step, idx) => {
          if (idx === 0) return { ...step, status: 'done' };
          if (idx === 1) return { ...step, status: 'active' };
          return step;
        })
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      setProgressSteps(prev =>
        prev.map((step, idx) => {
          if (idx === 1) return { ...step, status: 'done' };
          if (idx === 2) return { ...step, status: 'active' };
          return step;
        })
      );
      setLoadingMessage('Analyzing your resume with AI...');

      const response = await interviewService.startInterview(submitData);

      if (response.success) {
        setProgressSteps(prev =>
          prev.map((step, idx) => {
            if (idx === 2) return { ...step, status: 'done' };
            if (idx === 3) return { ...step, status: 'active' };
            return step;
          })
        );
        setLoadingMessage('Generating personalized questions...');

        await new Promise(resolve => setTimeout(resolve, 800));

        setProgressSteps(prev =>
          prev.map((step, idx) => {
            if (idx === 3) return { ...step, status: 'done' };
            if (idx === 4) return { ...step, status: 'active' };
            return step;
          })
        );
        setLoadingMessage('Finalizing your interview setup...');

        localStorage.setItem('interviewSessionId', response.data.sessionId);
        
        const finalTopic = formData.interviewMode === 'topic'
          ? (formData.interviewTopic === 'other' ? formData.customTopic : formData.interviewTopic)
          : null;

        localStorage.setItem('interviewSessionData', JSON.stringify({
          sessionId: response.data.sessionId,
          userId: response.data.userId,
          candidateInfo: response.data.candidateInfo,
          resumeAnalysis: response.data.resumeAnalysis,
          position: formData.position,
          companyType: formData.companyType,
          interviewMode: formData.interviewMode === 'topic' ? 'specific' : formData.interviewMode,
          specificRound: formData.interviewMode === 'topic' ? 'technical' : formData.specificRound,
          codingDifficulty: formData.codingDifficulty,
          interviewStyle: formData.interviewStyle,
          personality: formData.personality,
          interviewTopic: finalTopic,
          interviewDuration: formData.interviewStyle === 'conversational'
            ? (formData.interviewMode === 'full' ? 1800 : 900)
            : null
        }));

        setProgressSteps(prev =>
          prev.map(step => ({ ...step, status: 'done' }))
        );
        setLoadingMessage('Success! Redirecting to waiting room...');

        setTimeout(() => {
          navigate(`/ai-interview/${response.data.sessionId}/waiting-room`);
        }, 1000);
      } else {
        throw new Error(response.message || 'Failed to start interview');
      }
    } catch (err) {
      console.error('Interview start error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to start interview. Please try again.');
      setIsLoading(false);
    }
  };

  // Live Summary Label Helpers
  const selectedRoundLabel = useMemo(() => {
    if (formData.interviewMode === 'full') return 'Full Loop Interview';
    if (formData.interviewMode === 'topic') {
      const topic = formData.interviewTopic === 'other' ? formData.customTopic : formData.interviewTopic;
      return `Topic: ${topic || 'Technology'}`;
    }
    if (formData.interviewMode === 'specific') {
      if (formData.specificRound === 'resume_deep_dive') return 'Resume Deep Dive';
      if (formData.specificRound === 'jd_based') return 'Job Description Based';
      return `Specific Round: ${formData.specificRound?.replace(/_/g, ' ')}`;
    }
    return 'Select Focus...';
  }, [formData.interviewMode, formData.specificRound, formData.interviewTopic, formData.customTopic]);

  const progressPercent = (currentStep / 4) * 100;

  return (
    <Layout>
      <style>{`
        @keyframes slideInForward {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInBackward {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .step-transition-forward {
          animation: slideInForward 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .step-transition-backward {
          animation: slideInBackward 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="min-h-screen xalora-grid-bg text-slate-800 relative py-8 overflow-hidden">
        
        {/* Floating background decorative blobs */}
        <div className="absolute top-1/4 left-5 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none animate-blob" />
        <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none animate-blob" style={{ animationDelay: '3s' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Compact Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Interview Setup</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 rounded-full border border-purple-200 animate-pulse shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs text-purple-700 font-bold">Smart Generator</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm">Create a personalized, real-time interview matching your stack and background.</p>
            </div>
            {isCompanyCandidate && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2 max-w-xs">
                <Building className="w-4 h-4 text-amber-700" />
                <span className="text-xs text-amber-800 font-bold">Assigned Workspace Active</span>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in-20 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Main Grid Wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Wizard Form (col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Form Loading Progress Tracker */}
              {isLoading ? (
                <div className="bg-white border border-slate-200/80 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.04)] rounded-3xl p-6 sm:p-8">
                  <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    Setting Up Your Interview
                  </h3>
                  <div className="space-y-3">
                    {progressSteps.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center pt-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            step.status === 'done'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : step.status === 'active'
                                ? 'bg-purple-50 text-purple-600 border border-purple-300 animate-pulse'
                                : 'bg-slate-50 text-slate-400 border border-slate-200'
                          }`}>
                            {step.status === 'done' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : step.status === 'active' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </div>
                          {idx < progressSteps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${
                              step.status === 'done'
                                ? 'bg-emerald-200'
                                : step.status === 'active'
                                  ? 'bg-purple-200'
                                  : 'bg-slate-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`text-sm font-semibold transition-colors ${
                            step.status === 'done'
                              ? 'text-emerald-700'
                              : step.status === 'active'
                                ? 'text-purple-700'
                                : 'text-slate-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
                  
                  {/* Wizard Header Progress Bar */}
                  <div className="border-b border-slate-100 p-6 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {currentStep} of 4</span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                        {currentStep === 1 && 'Style & Round Focus'}
                        {currentStep === 2 && 'Personal Info'}
                        {currentStep === 3 && 'Job Specifications'}
                        {currentStep === 4 && 'Resume & Finish'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Form Step Body Wrapper */}
                  <div className="p-6 sm:p-8">
                    
                    {/* Animated Step Section Container */}
                    <div className={slideDirection === 'forward' ? 'step-transition-forward' : 'step-transition-backward'}>
                      
                      {/* ── STEP 1: Focus & Style ── */}
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          {/* style selection */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Mic className="w-5 h-5 text-purple-600" />
                              <h2 className="text-lg font-bold text-slate-800">Choose Interview Style</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <label className="relative cursor-pointer active:scale-98 transition-all">
                                <input type="radio" name="interviewStyle" value="manual"
                                  checked={formData.interviewStyle === 'manual'}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    interviewStyle: e.target.value,
                                    interviewMode: formData.interviewMode === 'topic' ? 'full' : formData.interviewMode
                                  })}
                                  className="hidden" />
                                <div className={`h-full p-5 rounded-2xl border-2 transition-all ${formData.interviewStyle === 'manual' ? 'bg-indigo-50/40 border-indigo-600 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}>
                                  <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2.5 rounded-xl ${formData.interviewStyle === 'manual' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><MessageSquare className="w-5 h-5" /></div>
                                    {formData.interviewStyle === 'manual' && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />}
                                  </div>
                                  <h3 className={`text-sm font-bold mb-1 ${formData.interviewStyle === 'manual' ? 'text-indigo-950' : 'text-slate-700'}`}>📝 Manual Mode</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">Submit answers via microphone or keyboard, then review evaluation manually before moving on.</p>
                                </div>
                              </label>

                              <label className={`relative ${canUseConversational ? 'cursor-pointer active:scale-98' : 'cursor-not-allowed'} transition-all`}>
                                <input type="radio" name="interviewStyle" value="conversational"
                                  checked={formData.interviewStyle === 'conversational'}
                                  onChange={(e) => canUseConversational && setFormData({ ...formData, interviewStyle: e.target.value })}
                                  className="hidden" disabled={!canUseConversational} />
                                <div className={`relative h-full p-5 rounded-2xl border-2 transition-all ${!canUseConversational ? 'bg-slate-50 border-slate-200 opacity-60' : formData.interviewStyle === 'conversational' ? 'bg-purple-50/40 border-purple-600 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}>
                                  {!canUseConversational && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-200 rounded-full">
                                      <Lock className="w-2.5 h-2.5 text-amber-700" />
                                      <span className="text-[9px] text-amber-800 font-bold">Upgrade</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2.5 rounded-xl ${!canUseConversational ? 'bg-slate-100 text-slate-300' : formData.interviewStyle === 'conversational' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Mic className="w-5 h-5" /></div>
                                    {formData.interviewStyle === 'conversational' && canUseConversational && <div className="w-2 h-2 bg-purple-700 rounded-full animate-pulse" />}
                                  </div>
                                  <h3 className={`text-sm font-bold mb-1 ${!canUseConversational ? 'text-slate-400' : formData.interviewStyle === 'conversational' ? 'text-purple-950' : 'text-slate-700'}`}>🎙️ Conversational Mode</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">Speak naturally. Advanced AI will listen, analyze voice, and engage in real-time dialog.</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Personality Selection (Conversational only) */}
                          {formData.interviewStyle === 'conversational' && canUseConversational && (
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl animate-in zoom-in-95 duration-200">
                              <label className="block text-xs font-bold text-purple-800 mb-2.5 uppercase tracking-wide">Interviewer Personality</label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: 'professional', emoji: '🎯', label: 'Professional', desc: 'Structured' },
                                  { value: 'mentoring', emoji: '🤝', label: 'Mentoring', desc: 'Supportive' },
                                  { value: 'challenging', emoji: '⚡', label: 'Challenging', desc: 'Hard questions' },
                                ].map(p => (
                                  <label key={p.value} className="cursor-pointer active:scale-95 transition-all">
                                    <input type="radio" name="personality" value={p.value}
                                      checked={formData.personality === p.value}
                                      onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                                      className="hidden" />
                                    <div className={`p-2.5 rounded-xl border text-center transition-all ${formData.personality === p.value ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                      <div className="text-lg">{p.emoji}</div>
                                      <p className="text-xs font-bold">{p.label}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mode/Round choice */}
                          {!isCompanyCandidate && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-lg font-bold text-slate-800">Select Practice Focus</h2>
                              </div>
                              <div className={`grid grid-cols-1 ${formData.interviewStyle === 'conversational' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                                <label className="cursor-pointer active:scale-98 transition-all">
                                  <input type="radio" name="interviewMode" value="full"
                                    checked={formData.interviewMode === 'full'}
                                    onChange={() => setFormData({ ...formData, interviewMode: 'full', specificRound: '' })}
                                    className="hidden" />
                                  <div className={`h-full p-4 rounded-xl border-2 transition-all ${formData.interviewMode === 'full' ? 'bg-indigo-50/40 border-indigo-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span>🎯</span>
                                      <span className="text-xs font-bold text-slate-800">Full Loop</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-normal pl-6">Comprehensive session covering multiple coding & verbal rounds.</p>
                                  </div>
                                </label>

                                <label className="cursor-pointer active:scale-98 transition-all">
                                  <input type="radio" name="interviewMode" value="specific"
                                    checked={formData.interviewMode === 'specific'}
                                    onChange={() => setFormData({ ...formData, interviewMode: 'specific', specificRound: formData.specificRound || 'formal_qa' })}
                                    className="hidden" />
                                  <div className={`h-full p-4 rounded-xl border-2 transition-all ${formData.interviewMode === 'specific' ? 'bg-purple-50 border-purple-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span>⚡</span>
                                      <span className="text-xs font-bold text-slate-800">Single Round</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-normal pl-6">Target a specific interview style (Coding, System Design, behavioral, etc.)</p>
                                  </div>
                                </label>

                                {formData.interviewStyle === 'conversational' && (
                                  <label className="cursor-pointer active:scale-98 transition-all">
                                    <input type="radio" name="interviewMode" value="topic"
                                      checked={formData.interviewMode === 'topic'}
                                      onChange={() => setFormData({ ...formData, interviewMode: 'topic', specificRound: 'technical', interviewTopic: 'javascript' })}
                                      className="hidden" />
                                    <div className={`h-full p-4 rounded-xl border-2 transition-all ${formData.interviewMode === 'topic' ? 'bg-purple-50 border-purple-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span>🛠️</span>
                                        <span className="text-xs font-bold text-slate-800">Topic-wise</span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-normal pl-6">Focus on individual tech languages (JS, Java, React, SQL, etc.)</p>
                                    </div>
                                  </label>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Technology Topic selector */}
                          {formData.interviewMode === 'topic' && (
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl animate-in fade-in duration-200">
                              <label className="block text-xs font-bold text-purple-800 mb-2 uppercase">Choose Topic Language</label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {[
                                  { value: 'javascript', label: 'JavaScript' },
                                  { value: 'typescript', label: 'TypeScript' },
                                  { value: 'cpp',        label: 'C++' },
                                  { value: 'java',       label: 'Java' },
                                  { value: 'python',     label: 'Python' },
                                  { value: 'react',      label: 'React' },
                                  { value: 'nodejs',     label: 'Node.js' },
                                  { value: 'sql',        label: 'SQL' },
                                  { value: 'other',      label: 'Custom...' }
                                ].map(topic => (
                                  <label key={topic.value} className="cursor-pointer active:scale-95 transition-all">
                                    <input type="radio" name="interviewTopic" value={topic.value}
                                      checked={formData.interviewTopic === topic.value}
                                      onChange={(e) => setFormData({ ...formData, interviewTopic: e.target.value })}
                                      className="hidden" />
                                    <div className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all border ${formData.interviewTopic === topic.value ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                                      {topic.label}
                                    </div>
                                  </label>
                                ))}
                              </div>
                              {formData.interviewTopic === 'other' && (
                                <div className="mt-3">
                                  <input
                                    type="text"
                                    value={formData.customTopic}
                                    onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
                                    placeholder="Enter custom tech, e.g. AWS, Kubernetes, Django"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 outline-none focus:border-purple-600 transition-colors"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Specific Round selector */}
                          {formData.interviewMode === 'specific' && (
                            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-200">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Round Focus</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                  { value: 'formal_qa',        emoji: '🤝', label: 'Formal Q&A',       desc: 'HR & Comm' },
                                  { value: 'technical',         emoji: '💻', label: 'Technical',         desc: 'Concepts' },
                                  { value: 'coding',            emoji: '🧩', label: 'Coding',            desc: 'DSA algorithms' },
                                  { value: 'system_design',     emoji: '🏗️', label: 'System Design',    desc: 'Architecture' },
                                  { value: 'behavioral',        emoji: '🌟', label: 'Behavioral',        desc: 'STAR Method' },
                                  { value: 'resume_deep_dive',  emoji: '📄', label: 'Resume Deep Dive', desc: 'Personal projects' },
                                  { value: 'jd_based',          emoji: '📋', label: 'JD Based',          desc: 'Job details' }
                                ].map(r => (
                                  <label key={r.value} className="cursor-pointer active:scale-95 transition-all">
                                    <input type="radio" name="specificRound" value={r.value}
                                      checked={formData.specificRound === r.value}
                                      onChange={() => setFormData({ ...formData, specificRound: r.value })}
                                      className="hidden" />
                                    <div className={`p-2 rounded-xl border text-center transition-all ${formData.specificRound === r.value ? 'bg-purple-600 border-purple-600 text-white shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                      <div className="text-base">{r.emoji}</div>
                                      <p className="text-[11px] font-bold leading-tight">{r.label}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── STEP 2: Candidate Info ── */}
                      {currentStep === 2 && (
                        <div className="space-y-5">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold text-slate-800">Candidate Information</h2>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                placeholder="John Doe"
                              />
                            </div>

                            {/* Show age, gender, experience only if NOT simplified mode */}
                            {!isSimplifiedForm ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Age</label>
                                  <input
                                    type="number"
                                    min="18"
                                    max="100"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                    placeholder="25"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender</label>
                                  <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none cursor-pointer"
                                  >
                                    <option value="">Select (Optional)</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Years of Experience</label>
                                  <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                    placeholder="e.g. 3 years, 6 months"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-800 leading-relaxed font-semibold">
                                💡 Standard profile details (Age, Gender, Exp) are automatically bypassed for this simplified deep practice round. We will analyze your inputs on the next screen.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 3: Job Specifications & JD ── */}
                      {currentStep === 3 && (
                        <div className="space-y-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold text-slate-800">Job Profile & Requirements</h2>
                          </div>

                          <div className="space-y-4">
                            {/* If JD Based mode, we only need the JD textbox */}
                            {isJDBased ? (
                              <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paste Job Description</label>
                                <textarea
                                  value={formData.jobDescription}
                                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none min-h-[160px] resize-y"
                                  placeholder="Paste the target Job Description (JD) here..."
                                />
                                <p className="text-[10px] text-slate-400">AI will generate 6 questions custom-tailored to verify you meet the JD requirements.</p>
                              </div>
                            ) : (
                              <>
                                {/* Target Position dropdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Position</label>
                                    <select
                                      value={formData.selectedRole}
                                      onChange={(e) => setFormData({ ...formData, selectedRole: e.target.value, customPosition: '' })}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none cursor-pointer"
                                    >
                                      <option value="">Select Target Role...</option>
                                      {PREDEFINED_ROLES.map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Style</label>
                                    <select
                                      value={formData.companyType}
                                      onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none cursor-pointer"
                                    >
                                      <option value="startup">🚀 Startup (Speed & Generalist)</option>
                                      <option value="service_based">🏢 Service Based (Core & Delivery)</option>
                                      <option value="product_based">💎 Product Based (Systems & DSA)</option>
                                    </select>
                                  </div>

                                  {formData.selectedRole === 'other' && (
                                    <div className="sm:col-span-2">
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Specify Position</label>
                                      <input
                                        type="text"
                                        value={formData.customPosition}
                                        onChange={(e) => setFormData({ ...formData, customPosition: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                        placeholder="e.g. Lead Engineer, iOS Developer"
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Coding Difficulty</label>
                                    <select
                                      value={formData.codingDifficulty}
                                      onChange={(e) => setFormData({ ...formData, codingDifficulty: e.target.value })}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none cursor-pointer"
                                    >
                                      <option value="auto">Auto (Match Company Type)</option>
                                      <option value="easy">Easy</option>
                                      <option value="medium">Medium</option>
                                      <option value="hard">Hard</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Target Job Description (Optional)</label>
                                    {formData.selectedRole && formData.selectedRole !== 'other' && (
                                      <button
                                        type="button"
                                        onClick={() => setShowPreviewJD(!showPreviewJD)}
                                        className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-1 cursor-pointer font-bold"
                                      >
                                        {showPreviewJD ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        {showPreviewJD ? 'Hide standard JD template' : 'View standard JD template'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  {showPreviewJD && formData.selectedRole && formData.selectedRole !== 'other' && (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed max-h-48 overflow-y-auto mb-3 shadow-inner">
                                      <p className="font-bold text-indigo-800 mb-1">Standard template active for {formData.position}:</p>
                                      <p className="text-slate-600 whitespace-pre-wrap font-mono">{PREDEFINED_JDS[formData.selectedRole]}</p>
                                    </div>
                                  )}

                                  <textarea
                                    value={formData.jobDescription}
                                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-indigo-700 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none min-h-[100px] resize-y"
                                    placeholder="Append custom company job specs, Stack requirements, etc."
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── STEP 4: Resume PDF & Finish ── */}
                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold text-slate-800">Resume Upload & Verification</h2>
                          </div>

                          {isJDBased ? (
                            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner">
                              <Sparkles className="w-12 h-12 text-amber-500 mb-3 animate-pulse" />
                              <h3 className="text-sm font-bold text-amber-900 mb-1">No Resume Required!</h3>
                              <p className="text-xs text-amber-800 max-w-sm leading-relaxed">
                                Under JD Based mode, AI will formulate questions solely based on your target job description requirements.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="group relative">
                                <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer bg-slate-50/30 ${resumeFile ? 'border-emerald-500 bg-emerald-50/15' : 'border-slate-300 hover:border-cyan-500/50 hover:bg-slate-50'}`}>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="resume-upload-wizard"
                                  />
                                  <label htmlFor="resume-upload-wizard" className="cursor-pointer w-full h-full block">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${resumeFile ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 group-hover:scale-105 group-hover:bg-cyan-50'}`}>
                                      <Upload className="w-8 h-8" />
                                    </div>
                                    {resumeFile ? (
                                      <div>
                                        <p className="text-emerald-900 font-bold text-sm mb-1">{resumeFile.name}</p>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                          ✓ Ready for Generation
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <p className="text-slate-800 font-bold text-sm">Upload your Resume (PDF)</p>
                                        <p className="text-slate-500 text-xs">Drag & drop or click to browse (Max 10MB)</p>
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                            <p className="text-xs text-purple-900 leading-relaxed font-semibold">
                              All configurations are complete. Our AI engine will now analyze your ticket blueprint and assemble the waiting room.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Wizard Control Buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/5 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isLoading || (!resumeFile && !isJDBased)}
                          className="flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
                        >
                          Generate Interview
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </button>
                      )}
                    </div>

                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: Live Summary Ticket (col-span-4) */}
            <div className="lg:col-span-4">
              <div className="relative group">
                {/* Decorative glowing card border */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-35 transition duration-500 blur" />
                
                {/* Boarding ticket body */}
                <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl overflow-hidden">
                  
                  {/* Decorative Ticket Punch Holes (Visual detail) */}
                  <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#f5f7fa] border-r border-slate-200 rounded-full z-20" style={{ transform: 'translateY(-50%)' }} />
                  <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#f5f7fa] border-l border-slate-200 rounded-full z-20" style={{ transform: 'translateY(-50%)' }} />

                  {/* Header stamp */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Ticket className="w-4 h-4 text-purple-600 rotate-12" />
                      <span className="text-xs font-black tracking-widest uppercase">BOARDING PASS</span>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">AI-PRAC-2026</span>
                  </div>

                  {/* Blueprint details */}
                  <div className="space-y-4 text-xs">
                    
                    {/* Style Ticket Row */}
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Interview Style</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {formData.interviewStyle === 'conversational' ? '🎙️' : '📝'}
                        </span>
                        <span className="font-extrabold text-slate-800 transition-all">
                          {formData.interviewStyle === 'conversational' ? 'Conversational Mode' : 'Manual Mode'}
                        </span>
                        {formData.interviewStyle === 'conversational' && (
                          <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded capitalize animate-pulse">
                            {formData.personality}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Round Ticket Row */}
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Selected Focus</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🎯</span>
                        <span className="font-bold text-slate-800 truncate" title={selectedRoundLabel}>
                          {selectedRoundLabel}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Details Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Candidate</span>
                        <p className="font-extrabold text-slate-800 truncate transition-all">
                          {formData.name.trim() ? formData.name : 'Pending...'}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Experience</span>
                        <p className="font-extrabold text-slate-800 truncate transition-all">
                          {isSimplifiedForm ? 'Bypassed' : (formData.experience.trim() ? formData.experience : 'Pending...')}
                        </p>
                      </div>
                    </div>

                    {/* Role Details Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target Role</span>
                        <p className="font-extrabold text-slate-800 truncate transition-all">
                          {isSimplifiedForm ? (isResumeDeepDive ? 'Resume Defined' : 'JD Defined') : (formData.position ? formData.position : 'Pending...')}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Difficulty</span>
                        <p className="font-extrabold text-slate-800 capitalize">
                          {isSimplifiedForm ? 'Auto' : formData.codingDifficulty}
                        </p>
                      </div>
                    </div>

                    {/* Resume Upload Status Row */}
                    <div className="pt-3 border-t border-dashed border-slate-200">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Resume Attachment</span>
                      {isJDBased ? (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-[11px] font-bold text-amber-700">JD Source Active</span>
                        </div>
                      ) : resumeFile ? (
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-extrabold truncate max-w-[180px]">{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping" />
                          <span>Waiting for file...</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Decorative Ticket Barcode */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center justify-center">
                    <div className="w-full h-8 opacity-45 flex items-center justify-center gap-[2px] bg-slate-50 rounded py-1 px-3">
                      {[1,3,2,1,4,2,3,1,2,4,1,2,3,1,4,2,1,3,2,1,4,2,3,1].map((w, idx) => (
                        <div key={idx} className="h-full bg-slate-800" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                    <span className="text-[8px] text-slate-400 font-mono tracking-widest mt-1.5">ALORA-ENGINE-PASS-VERIFY-OK</span>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default InterviewSetup;
