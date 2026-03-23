import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, Briefcase, Building, FileText, Loader2, AlertCircle, Sparkles, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { Layout } from '../../components';
import interviewService from '../../services/interviewService';
import { useSelector } from 'react-redux';

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

Role Summary:
Build scalable, performant, and user-centric web interfaces for production-grade applications. Responsible for translating product requirements and designs into high-quality frontend systems.

Core Responsibilities:
- Develop reusable UI components using React/Vue/Angular
- Implement responsive and accessible interfaces (WCAG standards)
- Optimize rendering performance, bundle size, and load time
- Integrate frontend with backend APIs and handle async data flows
- Collaborate closely with designers and backend engineers
- Debug cross-browser and device-specific issues

Required Skills:
- Strong JavaScript/TypeScript fundamentals
- Experience with component-driven architecture
- State management (Redux, Zustand, Context)
- CSS architecture, responsiveness, and theming
- Understanding of browser internals and performance profiling

Evaluation Signals:
- Explains UI trade-offs clearly
- Can debug real-world UI issues
- Thinks beyond visuals (performance, accessibility)`,

  backend: `Role: Backend Developer

Role Summary:
Design and maintain scalable, secure backend systems that power real-world applications. Own APIs, databases, and system reliability.

Core Responsibilities:
- Design REST/GraphQL APIs with clear contracts
- Implement authentication, authorization, and role-based access
- Design database schemas and optimize queries
- Handle concurrency, async processing, and background jobs
- Ensure system reliability with logging and monitoring
- Integrate third-party services and cloud infrastructure

Required Skills:
- Strong backend language proficiency (Node.js / Python / Java / Go)
- API design principles
- SQL & NoSQL databases
- Security fundamentals (JWT, OAuth, hashing)
- Basic system design and scalability concepts

Evaluation Signals:
- Can justify architectural decisions
- Demonstrates ownership of production systems
- Thinks about failure cases and edge conditions`,

  fullstack: `Role: Full Stack Developer

Role Summary:
Own end-to-end product development from UI to database. Expected to work across layers and deliver complete features independently.

Core Responsibilities:
- Build frontend interfaces and backend APIs
- Design and consume RESTful services
- Manage databases and application state
- Handle deployments and environment configs
- Ensure performance, security, and scalability
- Debug issues across the entire stack

Required Skills:
- Frontend + backend proficiency
- API integration and state handling
- Database design and query optimization
- Basic DevOps and cloud familiarity
- Strong debugging and problem-solving skills

Evaluation Signals:
- Comfort switching between layers
- Understands cross-stack trade-offs
- Shows real ownership of features`,

  devops: `Role: DevOps Engineer

Role Summary:
Ensure reliable, scalable, and secure deployment of applications. Own infrastructure automation, monitoring, and system uptime.

Core Responsibilities:
- Build and maintain CI/CD pipelines
- Automate infrastructure using IaC
- Manage containerized workloads
- Monitor system health and performance
- Handle incident response and recovery
- Enforce security best practices

Required Skills:
- Docker & Kubernetes
- Cloud platforms (AWS/GCP/Azure)
- Terraform or similar IaC tools
- Monitoring tools (Prometheus, Grafana)
- Linux and networking fundamentals

Evaluation Signals:
- Automation-first mindset
- Incident handling experience
- Cost and security awareness`,

  data_scientist: `Role: Data Scientist

Role Summary:
Use data to drive insights, predictions, and business decisions. Bridge the gap between raw data and actionable intelligence.

Core Responsibilities:
- Clean, preprocess, and analyze datasets
- Perform exploratory data analysis
- Build statistical and ML models
- Evaluate model performance
- Communicate insights to stakeholders
- Collaborate with engineering teams

Required Skills:
- Python, SQL
- Statistics and probability
- ML fundamentals
- Data visualization
- Problem framing skills

Evaluation Signals:
- Explains reasoning behind models
- Thinks in terms of business impact
- Understands data limitations`,

  ml_engineer: `Role: Machine Learning Engineer

Role Summary:
Build and deploy production-ready ML systems that scale. Focus on reliability, performance, and real-world impact of models.

Core Responsibilities:
- Build ML pipelines end-to-end
- Deploy models into production
- Optimize inference latency and throughput
- Manage data versioning and experiments
- Monitor model performance and drift
- Collaborate with product and backend teams

Required Skills:
- Strong ML fundamentals
- PyTorch / TensorFlow
- Model deployment strategies
- Data pipelines
- System design basics for ML systems

Evaluation Signals:
- Production mindset (not notebook-only)
- Can discuss trade-offs in model design
- Understands ML system failures`,

  gen_ai_engineer: `Role: Gen AI Engineer

Role Summary:
Build and deploy generative AI applications using LLMs, RAG, and prompt engineering. Focus on creating intelligent, context-aware AI systems that solve real-world problems.

Core Responsibilities:
- Design and implement LLM-powered applications
- Build RAG (Retrieval-Augmented Generation) systems
- Optimize prompts and fine-tune models
- Integrate AI APIs (OpenAI, Anthropic, DeepSeek, etc.)
- Implement vector databases and semantic search
- Handle AI safety, hallucination mitigation, and evaluation

Required Skills:
- Strong understanding of LLMs and transformers
- Prompt engineering and chain-of-thought reasoning
- Vector databases (Pinecone, Weaviate, ChromaDB)
- LangChain, LlamaIndex, or similar frameworks
- API integration and backend development
- Understanding of embeddings and semantic search

Evaluation Signals:
- Can design effective prompts and AI workflows
- Understands LLM limitations and failure modes
- Thinks about AI safety and responsible AI
- Production-ready AI system design`,

  product_manager: `Role: Product Manager

Role Summary:
Own product vision and execution. Translate user needs into clear requirements and guide teams to deliver value.

Core Responsibilities:
- Define product roadmap and priorities
- Conduct user research and problem discovery
- Write clear product requirements
- Coordinate with engineering and design
- Track metrics and product outcomes
- Drive iteration and continuous improvement

Required Skills:
- Strong communication
- Analytical thinking
- Stakeholder management
- User-centric mindset
- Basic technical understanding

Evaluation Signals:
- Clear decision-making examples
- Ability to balance trade-offs
- Strong ownership mindset`,

  ui_ux: `Role: UI/UX Designer

Role Summary:
Design intuitive and delightful user experiences that solve real problems while aligning with business goals.

Core Responsibilities:
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Maintain design systems
- Collaborate with developers
- Iterate designs based on feedback
- Ensure accessibility and consistency

Required Skills:
- Design tools (Figma, Sketch)
- UX research methods
- Interaction design principles
- Design systems
- Accessibility fundamentals

Evaluation Signals:
- Explains design rationale clearly
- Iterative and user-focused thinking
- Understands technical constraints`,

  qa_engineer: `Role: QA Engineer

Role Summary:
Ensure product quality through structured testing and proactive defect prevention.

Core Responsibilities:
- Create and execute test plans
- Perform manual and automated testing
- Identify, document, and track defects
- Collaborate with developers
- Maintain regression suites
- Improve testing processes

Required Skills:
- Test design techniques
- Automation basics
- CI/CD testing integration
- Bug tracking tools
- Attention to detail

Evaluation Signals:
- Thinks like a user and engineer
- Preventive quality mindset
- Strong analytical thinking`,

  cybersecurity: `Role: Cybersecurity Analyst

Role Summary:
Protect systems, networks, and data from security threats. Identify vulnerabilities and respond to incidents.

Core Responsibilities:
- Monitor systems for threats
- Conduct vulnerability assessments
- Perform penetration testing
- Investigate security incidents
- Implement security controls
- Ensure compliance and risk mitigation

Required Skills:
- Network and application security
- Threat modeling
- Penetration testing tools
- Cryptography basics
- Security standards and compliance

Evaluation Signals:
- Attacker + defender mindset
- Practical security reasoning
- Awareness of real-world breaches`
};


const InterviewSetup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Company candidate detection
  const isCompanyCandidate = user?.userType === "org_member" && user?.organization?.interviewRounds?.length > 0;
  const assignedRounds = user?.organization?.interviewRounds || [];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    experience: '',
    position: isCompanyCandidate ? (user?.organization?.position || '') : '',
    selectedRole: '', // Dropdown value
    customPosition: '', // Manual input if 'other'
    companyType: isCompanyCandidate ? 'product_based' : 'startup',
    interviewMode: isCompanyCandidate ? 'specific' : 'full',
    specificRound: isCompanyCandidate && assignedRounds.length === 1 ? assignedRounds[0] : '',
    jobDescription: '',
    codingDifficulty: isCompanyCandidate ? 'medium' : 'auto'
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showPreviewJD, setShowPreviewJD] = useState(false);

  // Progress tracking
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
  // Simplified form: show only what's needed for these rounds
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simplified form validation
    if (isResumeDeepDive) {
      if (!formData.name || !resumeFile) {
        setError('Please enter your name and upload your resume');
        return;
      }
    } else if (isJDBased) {
      if (!formData.name || !formData.jobDescription.trim()) {
        setError('Please enter your name and paste the job description');
        return;
      }
    } else if (!formData.name || !formData.age || !formData.position || !resumeFile) {
      setError('Please fill all required fields and upload your resume');
      return;
    }

    // Validate specific round selection
    if (formData.interviewMode === 'specific' && !formData.specificRound) {
      setError('Please select a specific round to practice');
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
      // Logic to merge JDs
      let finalJD = '';
      if (formData.selectedRole && formData.selectedRole !== 'other') {
        const predefinedJD = PREDEFINED_JDS[formData.selectedRole] || '';
        if (formData.jobDescription.trim()) {
          finalJD = `${predefinedJD}\n\n--- ADDITIONAL CANDIDATE REQUIREMENTS ---\n${formData.jobDescription}`;
        } else {
          finalJD = predefinedJD;
        }
      } else {
        // If 'other' or no role selected (manual fallback), use user JD only
        finalJD = formData.jobDescription;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('candidateName', formData.name);
      submitData.append('interviewMode', formData.interviewMode);
      submitData.append('codingDifficulty', formData.codingDifficulty);
      if (formData.specificRound) submitData.append('specificRound', formData.specificRound);

      // Simplified mode: only pass what's needed
      if (isResumeDeepDive) {
        submitData.append('resumeFile', resumeFile);
        // Provide minimal defaults so backend doesn't error
        submitData.append('candidateAge', '25');
        submitData.append('position', 'Not specified');
        submitData.append('companyType', 'startup');
      } else if (isJDBased) {
        // JD-based needs JD + a dummy resume (backend requires a file)
        const dummyBlob = new Blob(['Resume not provided for JD-based round'], { type: 'application/pdf' });
        submitData.append('resumeFile', dummyBlob, 'placeholder.pdf');
        submitData.append('jobDescription', formData.jobDescription);
        submitData.append('candidateAge', '25');
        submitData.append('position', 'Not specified');
        submitData.append('companyType', 'startup');
      } else {
        // Full form — all fields
        if (resumeFile) submitData.append('resumeFile', resumeFile);
        submitData.append('candidateAge', formData.age);
        submitData.append('candidateGender', formData.gender);
        submitData.append('candidateExperience', formData.experience);
        submitData.append('position', formData.position);
        submitData.append('companyType', formData.companyType);
        if (finalJD) submitData.append('jobDescription', finalJD);
      }

      // Mark step 1 as done, start step 2
      setProgressSteps(prev =>
        prev.map((step, idx) => {
          if (idx === 0) return { ...step, status: 'done' };
          if (idx === 1) return { ...step, status: 'active' };
          return step;
        })
      );

      // Simulate parsing delay (usually happens server-side, but this gives feedback)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mark step 2 as done, start step 3
      setProgressSteps(prev =>
        prev.map((step, idx) => {
          if (idx === 1) return { ...step, status: 'done' };
          if (idx === 2) return { ...step, status: 'active' };
          return step;
        })
      );
      setLoadingMessage('Analyzing your resume with AI...');

      // Mark step 3 as active (API call happening)
      const response = await interviewService.startInterview(submitData);

      if (response.success) {
        // Mark step 4 as active
        setProgressSteps(prev =>
          prev.map((step, idx) => {
            if (idx === 2) return { ...step, status: 'done' };
            if (idx === 3) return { ...step, status: 'active' };
            return step;
          })
        );
        setLoadingMessage('Generating personalized questions...');

        // Simulate question generation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mark step 4 as done, step 5 as active
        setProgressSteps(prev =>
          prev.map((step, idx) => {
            if (idx === 3) return { ...step, status: 'done' };
            if (idx === 4) return { ...step, status: 'active' };
            return step;
          })
        );
        setLoadingMessage('Finalizing your interview setup...');

        // Store session ID in localStorage
        localStorage.setItem('interviewSessionId', response.data.sessionId);
        localStorage.setItem('interviewSessionData', JSON.stringify({
          sessionId: response.data.sessionId,
          candidateInfo: response.data.candidateInfo,
          resumeAnalysis: response.data.resumeAnalysis,
          position: formData.position,
          companyType: formData.companyType,
          interviewMode: formData.interviewMode,
          specificRound: formData.specificRound,
          codingDifficulty: formData.codingDifficulty
        }));

        // Mark all done
        setProgressSteps(prev =>
          prev.map(step => ({ ...step, status: 'done' }))
        );
        setLoadingMessage('Success! Redirecting to waiting room...');

        // Navigate to waiting room
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* Compact Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Interview Setup</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">AI-Powered</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">Configure your interview session below</p>
          </div>

          {/* Loading Progress Tracker */}
          {isLoading && (
            <div className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                Setting Up Your Interview
              </h3>
              <div className="space-y-3">
                {progressSteps.map((step, idx) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        step.status === 'done'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : step.status === 'active'
                            ? 'bg-purple-500/20 text-purple-400 animate-pulse'
                            : 'bg-slate-700/50 text-slate-500'
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
                            ? 'bg-emerald-500/40'
                            : step.status === 'active'
                              ? 'bg-purple-500/40'
                              : 'bg-slate-700/30'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-medium transition-colors ${
                        step.status === 'done'
                          ? 'text-emerald-300'
                          : step.status === 'active'
                            ? 'text-purple-300'
                            : 'text-slate-500'
                      }`}>
                        {step.label}
                      </p>
                      {step.status === 'active' && (
                        <p className="text-xs text-slate-400 mt-1 animate-pulse">In progress...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 text-center">
                  ⏱️ This usually takes 1-2 minutes. Grab some coffee! ☕
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Main Form Card */}
          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-6 sm:space-y-8">

            {/* Company Candidate Banner */}
            {isCompanyCandidate && (
              <section className="space-y-4">
                <div className="p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amber-300">Company Screening Interview</h3>
                      <p className="text-xs text-amber-200/70 mt-1">
                        You have <span className="font-bold text-white">3 interview attempts</span> for your assigned round{assignedRounds.length > 1 ? 's' : ''}.
                        {user?.organization?.deadlineDays && (
                          <> Complete within <span className="font-bold text-white">{user.organization.deadlineDays} days</span> of accepting your invite.</>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {assignedRounds.map(round => (
                          <span key={round} className="text-[11px] uppercase font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
                            {round.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Round selection for company candidates */}
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Select Your Interview Round</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedRounds.map(round => (
                    <label key={round} className="relative group cursor-pointer">
                      <input
                        type="radio"
                        name="specificRound"
                        value={round}
                        checked={formData.specificRound === round}
                        onChange={(e) => setFormData({ ...formData, specificRound: e.target.value, interviewMode: 'specific' })}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <div className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center ${formData.specificRound === round
                        ? 'bg-emerald-600/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}>
                        <p className={`text-sm font-bold capitalize ${formData.specificRound === round ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {round.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* 1. Interview Mode — Choose First (hidden for company candidates) */}
            {!isCompanyCandidate && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Choose Interview Mode</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Full Interview Card */}
                <label className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="interviewMode"
                    value="full"
                    checked={formData.interviewMode === 'full'}
                    onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value, specificRound: '' })}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className={`h-full p-6 rounded-2xl border-2 transition-all duration-300 ${formData.interviewMode === 'full'
                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20 translate-y-[-4px]'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${formData.interviewMode === 'full' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-white transition-colors'}`}>
                        <Briefcase className="w-6 h-6" />
                      </div>
                      {formData.interviewMode === 'full' && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />}
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${formData.interviewMode === 'full' ? 'text-white' : 'text-slate-300'}`}>Full Interview</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">Complete simulation with all 7 rounds — including Resume Deep Dive and JD-based rounds.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Formal', 'DSA', 'Sys Design', 'HR', 'Resume', 'JD'].map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                </label>

                {/* Practice Mode Card */}
                <label className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="interviewMode"
                    value="practice"
                    checked={formData.interviewMode === 'practice'}
                    onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value, specificRound: '' })}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className={`h-full p-6 rounded-2xl border-2 transition-all duration-300 ${formData.interviewMode === 'practice'
                    ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-500/20 translate-y-[-4px]'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${formData.interviewMode === 'practice' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-white transition-colors'}`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      {formData.interviewMode === 'practice' && <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />}
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${formData.interviewMode === 'practice' ? 'text-white' : 'text-slate-300'}`}>Practice Mode</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">Quick warm-up session focusing on verbal technical questions (No coding).</p>
                    <div className="flex flex-wrap gap-2">
                      {['Theory', 'Concepts', 'Behavioral'].map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                </label>

                {/* Specific Round Card */}
                <label className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="interviewMode"
                    value="specific"
                    checked={formData.interviewMode === 'specific'}
                    onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value })}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className={`h-full p-6 rounded-2xl border-2 transition-all duration-300 ${formData.interviewMode === 'specific'
                    ? 'bg-emerald-600/10 border-emerald-500 shadow-lg shadow-emerald-500/20 translate-y-[-4px]'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${formData.interviewMode === 'specific' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-white transition-colors'}`}>
                        <User className="w-6 h-6" />
                      </div>
                      {formData.interviewMode === 'specific' && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />}
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${formData.interviewMode === 'specific' ? 'text-white' : 'text-slate-300'}`}>Specific Round</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">Deep dive into a single topic. Perfect for targeted preparation.</p>
                  </div>
                </label>
              </div>

              {formData.interviewMode === 'specific' && (
                <div className="mt-8 p-6 bg-emerald-900/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in-95 duration-300">
                  <label className="block text-sm font-medium text-emerald-400 mb-3">
                    Select Target Round
                  </label>
                  <div className="relative">
                    <select
                      value={formData.specificRound}
                      onChange={(e) => setFormData({ ...formData, specificRound: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-white appearance-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="" className="bg-slate-900">Choose a round...</option>
                      <option value="formal_qa" className="bg-slate-900">🎯 Formal Q&A - Intro &amp; Basics</option>
                      <option value="technical" className="bg-slate-900">💻 Technical - Deep Dive</option>
                      <option value="coding" className="bg-slate-900">⚡ Coding - Algorithms &amp; DSA</option>
                      <option value="system_design" className="bg-slate-900">🏗️ System Design - Architecture</option>
                      <option value="behavioral" className="bg-slate-900">🤝 HR - Culture &amp; Fit</option>
                      <option value="resume_deep_dive" className="bg-slate-900">📄 Resume Deep Dive - Your Experience</option>
                      <option value="jd_based" className="bg-slate-900">📋 JD Based - Role Requirements</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              )}
            </section>
            )}

            {/* Divider */}
            <div className="border-t border-slate-700/50" />

            {/* ── SIMPLIFIED FORM for resume_deep_dive & jd_based ── */}
            {isSimplifiedForm && (
              <section className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                {/* Round badge */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isResumeDeepDive
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                  <div className={`text-2xl`}>{isResumeDeepDive ? '📄' : '📋'}</div>
                  <div>
                    <p className={`text-sm font-bold ${isResumeDeepDive ? 'text-cyan-300' : 'text-amber-300'}`}>
                      {isResumeDeepDive ? 'Resume Deep Dive Mode' : 'JD Based Mode'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isResumeDeepDive
                        ? 'AI will ask targeted questions based on your actual resume content — projects, skills, and experience.'
                        : 'AI will ask questions based on the job description — verifying if you meet the requirements.'}
                    </p>
                  </div>
                </div>

                {/* Name field — always needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>

                {/* Resume Upload — only for resume_deep_dive */}
                {isResumeDeepDive && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Resume (PDF) <span className="text-red-400">*</span>
                    </label>
                    <div className="group relative">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 ${resumeFile ? 'opacity-50' : ''}`} />
                      <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer bg-slate-900/80 backdrop-blur-sm ${resumeFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 group-hover:border-cyan-500/50'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="file" accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden" id="resume-upload-simplified"
                          disabled={isLoading}
                        />
                        <label htmlFor="resume-upload-simplified" className={`cursor-pointer w-full h-full block ${isLoading ? 'cursor-not-allowed' : ''}`}>
                          <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${resumeFile ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500 group-hover:scale-110 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                            }`}>
                            <Upload className="w-7 h-7" />
                          </div>
                          {resumeFile ? (
                            <>
                              <p className="text-emerald-400 font-semibold text-sm">{resumeFile.name}</p>
                              <p className="text-slate-500 text-xs mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                            </>
                          ) : (
                            <>
                              <p className="text-slate-300 font-semibold text-sm mb-1">Click to upload your resume</p>
                              <p className="text-slate-500 text-xs">PDF only · Max 10MB</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-cyan-400/70 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      AI will analyze your resume and ask 6 deep questions about your actual projects & experience.
                    </p>
                  </div>
                )}

                {/* JD Textarea — only for jd_based */}
                {isJDBased && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Job Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-900/50 border border-amber-500/30 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-slate-900 transition-all outline-none min-h-[200px] resize-y"
                      placeholder="Paste the job description here...&#10;&#10;e.g. Role: Backend Engineer&#10;Requirements: 3+ years Node.js, AWS, REST APIs..."
                      disabled={isLoading}
                    />
                    <p className="text-xs text-amber-400/70 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      AI will ask 6 targeted questions verifying you meet the JD requirements.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* ── FULL FORM ── (hidden when simplified mode is active) */}

            {/* 1. Personal Information */}
            {!isSimplifiedForm && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <h2 className="text-base sm:text-lg font-semibold text-white">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="25"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                      disabled={isLoading}
                    >
                      <option value="" className="bg-gray-800">Select (Optional)</option>
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="other" className="bg-gray-800">Other</option>
                      <option value="prefer_not_to_say" className="bg-gray-800">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Years of Experience <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="3 years"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </section>
            )}
            {/* 2. Job Details */}
            {!isSimplifiedForm && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Job Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isCompanyCandidate ? (
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.position}
                      className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white opacity-80 cursor-not-allowed outline-none"
                    />
                  </div>
                  ) : (
                  <>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-purple-400 transition-colors">
                      Position <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.selectedRole}
                        onChange={(e) => setFormData({ ...formData, selectedRole: e.target.value, customPosition: '' })}
                        className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white appearance-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-slate-900 transition-all outline-none cursor-pointer"
                        disabled={isLoading}
                      >
                        <option value="" className="bg-slate-900">Select Role...</option>
                        {PREDEFINED_ROLES.map(role => (
                          <option key={role.value} value={role.value} className="bg-slate-900">{role.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>

                  {formData.selectedRole === 'other' && (
                    <div className="md:col-span-2 animate-fade-in-up">
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Specify Position <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customPosition}
                        onChange={(e) => setFormData({ ...formData, customPosition: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                        placeholder="e.g. Cloud Solutions Architect"
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  </>
                  )}

                  {!isCompanyCandidate && (
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-purple-400 transition-colors">
                      Target Company Type <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.companyType}
                        onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white appearance-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-slate-900 transition-all outline-none cursor-pointer"
                        disabled={isLoading}
                      >
                        <option value="startup" className="bg-slate-900">🚀 Startup (Speed & Innovation)</option>
                        <option value="service_based" className="bg-slate-900">🏢 Service Based (Practical & Core)</option>
                        <option value="product_based" className="bg-slate-900">💎 Product Based (Deep Tech & DSA)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                  )}
                  {!isCompanyCandidate && (
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-purple-400 transition-colors">
                      Coding Difficulty
                    </label>
                    <div className="relative">
                      <select
                        value={formData.codingDifficulty}
                        onChange={(e) => setFormData({ ...formData, codingDifficulty: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white appearance-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-slate-900 transition-all outline-none cursor-pointer"
                        disabled={isLoading}
                      >
                        <option value="auto" className="bg-slate-900">Auto (Company Type)</option>
                        <option value="easy" className="bg-slate-900">Easy</option>
                        <option value="medium" className="bg-slate-900">Medium</option>
                        <option value="hard" className="bg-slate-900">Hard</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm font-medium text-slate-400">
                      Job Description {formData.selectedRole && formData.selectedRole !== 'other' ? '(Predefined active)' : '(Optional)'}
                    </label>
                    {formData.selectedRole && formData.selectedRole !== 'other' && (
                      <button
                        type="button"
                        onClick={() => setShowPreviewJD(!showPreviewJD)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center gap-2"
                      >
                        {showPreviewJD ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPreviewJD ? 'Hide Standard JD' : 'View Standard JD'}
                      </button>
                    )}
                  </div>

                  {showPreviewJD && formData.selectedRole && formData.selectedRole !== 'other' && (
                    <div className="mb-4 p-5 bg-slate-900/80 rounded-xl border border-slate-700 text-sm animate-in fade-in zoom-in-95 duration-200 shadow-inner">
                      <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <FileText className="w-4 h-4" />
                        Standard JD for {PREDEFINED_ROLES.find(r => r.value === formData.selectedRole)?.label}
                      </h4>
                      <div className="whitespace-pre-wrap font-mono text-xs text-slate-300 opacity-90 leading-relaxed pl-2 border-l-2 border-slate-700">
                        {PREDEFINED_JDS[formData.selectedRole]}
                      </div>
                    </div>
                  )}

                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-slate-900 transition-all outline-none min-h-[120px] resize-y"
                    placeholder={formData.selectedRole && formData.selectedRole !== 'other'
                      ? "Add any specific requirements on top of standard JD (optional)..."
                      : "Paste the job description here..."}
                    disabled={isLoading}
                  />
                  {formData.selectedRole && formData.selectedRole !== 'other' && (
                    <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1.5 px-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Standard JD is active. Text above will be appended.
                    </p>
                  )}
                </div>
              </section>

            )} {/* end !isSimplifiedForm job section */}

            {/* 3. Resume Upload */}
            {!isSimplifiedForm && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Resume Upload</h2>
                </div>

                <div className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 ${resumeFile ? 'opacity-50' : ''}`} />
                  <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer bg-slate-900/80 backdrop-blur-sm ${resumeFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 group-hover:border-cyan-500/50'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="resume-upload" className={`cursor-pointer w-full h-full block ${isLoading ? 'cursor-not-allowed' : ''}`}>
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${resumeFile ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500 group-hover:scale-110 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'}`}>
                        <Upload className="w-10 h-10" />
                      </div>
                      {resumeFile ? (
                        <div>
                          <p className="text-emerald-400 font-bold text-lg mb-1">
                            {resumeFile.name}
                          </p>
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                            ✓ Ready for Analysis
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-slate-200 font-semibold text-lg">
                            Upload your Resume
                          </p>
                          <p className="text-slate-500 text-sm">
                            Drag & drop or click to browse (PDF only, Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </section>
            )} {/* end !isSimplifiedForm resume section */}

            {/* Submit Action */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !resumeFile}
                className="group relative w-full py-5 text-lg font-bold text-white rounded-2xl overflow-hidden shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 w-[200%] animate-gradient-x" />
                <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>{loadingMessage}</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Personalized Interview</span>
                      <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </div>
              </button>
              <p className="text-center text-slate-500 text-sm mt-4">
                Powered by Advanced AI • Custom tailored to your profile
              </p>
            </div>

          </form>
        </div>
      </div>
    </Layout >
  );
};

export default InterviewSetup;
