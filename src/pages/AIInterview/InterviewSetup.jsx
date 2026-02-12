import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, Briefcase, Building, FileText, Loader2, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    experience: '',
    position: '',
    selectedRole: '', // Dropdown value
    customPosition: '', // Manual input if 'other'
    companyType: 'startup',
    interviewMode: 'full',
    specificRound: '',
    jobDescription: '',
    codingDifficulty: 'auto'
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showPreviewJD, setShowPreviewJD] = useState(false);

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

    if (!formData.name || !formData.age || !formData.position || !resumeFile) {
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
      submitData.append('resumeFile', resumeFile);
      submitData.append('candidateName', formData.name);
      submitData.append('candidateAge', formData.age);
      submitData.append('candidateGender', formData.gender);
      submitData.append('candidateExperience', formData.experience);
      submitData.append('position', formData.position);
      submitData.append('companyType', formData.companyType);
      submitData.append('interviewMode', formData.interviewMode);
      submitData.append('codingDifficulty', formData.codingDifficulty);
      if (formData.specificRound) {
        submitData.append('specificRound', formData.specificRound);
      }
      if (finalJD) {
        submitData.append('jobDescription', finalJD);
      }

      setLoadingMessage('Analyzing your resume with AI...');

      const response = await interviewService.startInterview(submitData);

      if (response.success) {
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

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Main Form Card */}
          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-6 sm:space-y-8">

            {/* 1. Personal Information */}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
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

            {/* 2. Job Details */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Job Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* 3. Resume Upload */}
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

            {/* 4. Interview Mode */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Interview Mode</h2>
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
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">Complete simulation of a real interview process with all 5 rounds.</p>
                    <div className="flex flex-wrap gap-2">
                      {['Formal', 'DSA', 'Sys Design', 'HR'].map(tag => (
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
                      <option value="formal_qa" className="bg-slate-900">🎯 Formal Q&A - Intro & Basics</option>
                      <option value="technical" className="bg-slate-900">💻 Technical - Deep Dive</option>
                      <option value="coding" className="bg-slate-900">⚡ Coding - Algorithms & DSA</option>
                      <option value="system_design" className="bg-slate-900">🏗️ System Design - Architecture</option>
                      <option value="hr" className="bg-slate-900">🤝 HR - Culture & Fit</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 5. Submit Action */}
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
    </Layout>
  );
};

export default InterviewSetup;
