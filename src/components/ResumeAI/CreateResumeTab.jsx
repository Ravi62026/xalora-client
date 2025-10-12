import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../utils/axios";
import ApiRoutes from "../../routes/routes";

const CreateResumeTab = ({ onResumeCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("RenderCVEngineeringResumes");
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [activeFormat, setActiveFormat] = useState("markdown");
  const [createdResumes, setCreatedResumes] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    targetRole: {
      method: "role", // "role", "custom_jd", "jd_file"
      roleName: "",
      customJD: "",
      jdFile: null
    },
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const steps = [
    { title: "Template", icon: "🎨" },
    { title: "Target Role", icon: "🎯" },
    { title: "Personal Info", icon: "👤" },
    { title: "Experience", icon: "💼" },
    { title: "Education", icon: "🎓" },
    { title: "Skills", icon: "⚡" },
    { title: "Projects", icon: "🚀" },
    { title: "Certifications", icon: "🏆" },
    { title: "Review", icon: "✅" }
  ];

  useEffect(() => {
    loadTemplates();
    loadRoles();
    loadCreatedResumes();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await axiosInstance.get(ApiRoutes.resumeAI.getTemplates);
      setTemplates(res.data.data.templates || {});
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await axiosInstance.get(ApiRoutes.resumeAI.getRoles);
      setRoles(res.data.data.roles || []);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const loadCreatedResumes = async () => {
    try {
      const res = await axiosInstance.get(ApiRoutes.resumeAI.getCreatedResumes);
      setCreatedResumes(res.data.data.resumes || []);
    } catch (error) {
      console.error("Error loading created resumes:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Template selection
        return selectedTemplate;
      case 1: // Target role
        const targetRole = formData.targetRole;
        if (targetRole.method === "role") return targetRole.roleName;
        if (targetRole.method === "custom_jd") return targetRole.customJD.trim();
        if (targetRole.method === "jd_file") return targetRole.jdFile;
        return false;
      case 2: // Personal info
        return formData.personalInfo.fullName && formData.personalInfo.email && formData.personalInfo.phone;
      case 3: // Experience
        return formData.experience.length > 0;
      case 4: // Education
        return formData.education.length > 0;
      case 5: // Skills
        return formData.skills.length > 0;
      default:
        return true;
    }
  };

  const isFormValid = () => {
    const targetRoleValid = 
      (formData.targetRole.method === "role" && formData.targetRole.roleName) ||
      (formData.targetRole.method === "custom_jd" && formData.targetRole.customJD.trim()) ||
      (formData.targetRole.method === "jd_file" && formData.targetRole.jdFile);
    
    return (
      targetRoleValid &&
      formData.personalInfo.fullName &&
      formData.personalInfo.email &&
      formData.personalInfo.phone &&
      formData.experience.length > 0 &&
      formData.education.length > 0 &&
      formData.skills.length > 0
    );
  };

  const handleCreateResume = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields before creating the resume.");
      return;
    }

    console.log("🚀 Starting resume creation...");
    console.log("📋 Form data:", formData);
    console.log("🎨 Template:", selectedTemplate);
    
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        ApiRoutes.resumeAI.create, 
        {
          resumeData: formData,
          templateName: selectedTemplate,
          targetRole: formData.targetRole
        },
        {
          timeout: 180000, // 3 minute timeout for resume creation
        }
      );

      console.log("✅ Resume creation response:", res.data);
      
      // Handle different response structures
      const responseData = res.data.data || res.data;
      
      if (!responseData.resumeLatex || !responseData.resumeMarkdown) {
        console.error("❌ Invalid response structure:", responseData);
        throw new Error("Invalid response from server - missing resume data");
      }

      setGeneratedResume({
        latex: responseData.resumeLatex,
        markdown: responseData.resumeMarkdown,
        templateName: responseData.templateName,
        sessionId: responseData.sessionId
      });

      // Refresh created resumes list
      loadCreatedResumes();

      console.log("✅ Resume created successfully, showing results");
      setCurrentStep(steps.length); // Move to results view
      
      // Notify parent component if callback provided
      if (onResumeCreated) {
        onResumeCreated({
          sessionId: responseData.sessionId,
          analysisId: responseData.analysisId,
          templateName: responseData.templateName
        });
      }
    } catch (error) {
      console.error("❌ Error creating resume:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to create resume. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TemplateStep 
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />;
      case 1:
        return <TargetRoleStep 
          data={formData.targetRole}
          updateData={(data) => updateFormData('targetRole', data)}
          roles={roles}
        />;
      case 2:
        return <PersonalInfoStep 
          data={formData.personalInfo}
          updateData={(data) => updateFormData('personalInfo', data)}
        />;
      case 3:
        return <ExperienceStep 
          data={formData.experience}
          updateData={(data) => updateFormData('experience', data)}
        />;
      case 4:
        return <EducationStep 
          data={formData.education}
          updateData={(data) => updateFormData('education', data)}
        />;
      case 5:
        return <SkillsStep 
          data={formData.skills}
          updateData={(data) => updateFormData('skills', data)}
        />;
      case 6:
        return <ProjectsStep 
          data={formData.projects}
          updateData={(data) => updateFormData('projects', data)}
        />;
      case 7:
        return <CertificationsStep 
          data={formData.certifications}
          updateData={(data) => updateFormData('certifications', data)}
        />;
      case 8:
        return <ReviewStep 
          formData={formData}
          selectedTemplate={selectedTemplate}
          templates={templates}
          isFormValid={isFormValid}
        />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎨 Create Resume</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {showHistory ? "Hide" : "Show"} Created Resumes ({createdResumes.length})
        </button>
      </div>

      {/* Created Resumes History */}
      {showHistory && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">📄 Your Created Resumes</h3>
          {createdResumes.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {createdResumes.slice(0, 10).map((resume) => (
                <div
                  key={resume._id}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => {
                    // You can add functionality to view/edit the created resume
                    console.log("View created resume:", resume);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {resume.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(resume.createdAt).toLocaleDateString()} • {resume.templateName}
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium ml-2">
                      {resume.analysisResult?.overallScore || 95}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              No resumes created yet. Create your first professional resume below! 🚀
            </p>
          )}
        </div>
      )}    
  {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[500px]">
        {generatedResume ? (
          <ResumeResults 
            resume={generatedResume}
            activeFormat={activeFormat}
            setActiveFormat={setActiveFormat}
            onViewInAnalysis={onResumeCreated ? (sessionId) => {
              // This would trigger navigation to analysis view
              console.log("📊 Viewing resume in analysis mode:", sessionId);
              // You can add navigation logic here
            } : null}
          />
        ) : (
          renderStepContent()
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0 || generatedResume}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        {generatedResume ? (
          <button
            onClick={() => {
              setGeneratedResume(null);
              setCurrentStep(0);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            🔄 Create Another Resume
          </button>
        ) : currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!canProceedToNextStep()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleCreateResume}
            disabled={loading || !isFormValid()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Resume 🚀"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateResumeTab;

// Template Selection Step
const TemplateStep = ({ templates, selectedTemplate, setSelectedTemplate }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Choose a Resume Template</h3>
    <p className="text-gray-600 mb-6">Select a professional template that matches your style and industry.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(templates).map(([key, template]) => (
        <div
          key={key}
          onClick={() => setSelectedTemplate(key)}
          className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
            selectedTemplate === key
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <div className="flex flex-wrap gap-1">
            {template.features?.map((feature, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Personal Information Step
const PersonalInfoStep = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      <p className="text-gray-600 mb-6">Enter your contact details and professional summary.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="New York, NY"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
          <input
            type="url"
            value={data.github}
            onChange={(e) => handleChange('github', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Brief professional summary highlighting your key strengths and career objectives..."
        />
      </div>
    </div>
  );
};
// Experience Step
const ExperienceStep = ({ data, updateData }) => {
  const addExperience = () => {
    updateData([...data, {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    updateData(updated);
  };

  const removeExperience = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Work Experience</h3>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Experience
        </button>
      </div>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Job Title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  />
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Currently working here</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// Education Step
const EducationStep = ({ data, updateData }) => {
  const addEducation = () => {
    updateData([...data, {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: ""
    }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    updateData(updated);
  };

  const removeEducation = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Education</h3>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Education
        </button>
      </div>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="University Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Bachelor's, Master's, PhD, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="3.8/4.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Relevant coursework, honors, activities..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// Skills Step
const SkillsStep = ({ data, updateData }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      updateData([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Skills</h3>
      <p className="text-gray-600 mb-6">Add your technical and professional skills.</p>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter a skill (e.g., JavaScript, Project Management)"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet.</p>
          <p className="text-sm">Start typing to add your skills.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Include both technical skills (programming languages, tools) 
          and soft skills (leadership, communication) relevant to your target role.
        </p>
      </div>
    </div>
  );
};

// Projects Step
const ProjectsStep = ({ data, updateData }) => {
  const addProject = () => {
    updateData([...data, {
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: ""
    }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    updateData(updated);
  };

  const removeProject = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Projects</h3>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Project
        </button>
      </div>
      <p className="text-gray-600 mb-6">Showcase your personal or professional projects.</p>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to showcase your work.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the project, your role, and key achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// Certifications Step
const CertificationsStep = ({ data, updateData }) => {
  const addCertification = () => {
    updateData([...data, {
      name: "",
      issuer: "",
      date: "",
      link: "",
      description: ""
    }]);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    updateData(updated);
  };

  const removeCertification = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Certifications</h3>
        <button
          onClick={addCertification}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add Certification
        </button>
      </div>
      <p className="text-gray-600 mb-6">Add your professional certifications and licenses.</p>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to showcase your credentials.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((cert, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Certification #{index + 1}</h4>
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Amazon Web Services"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Link</label>
                  <input
                    type="url"
                    value={cert.link}
                    onChange={(e) => updateCertification(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://credly.com/badges/..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Step
const ReviewStep = ({ formData, selectedTemplate, templates, isFormValid }) => {
  const isComplete = (section, requiredFields) => {
    if (Array.isArray(formData[section])) {
      return formData[section].length > 0;
    }
    return requiredFields.every(field => formData[section][field]?.trim());
  };

  const targetRoleComplete = 
    (formData.targetRole.method === "role" && formData.targetRole.roleName) ||
    (formData.targetRole.method === "custom_jd" && formData.targetRole.customJD.trim()) ||
    (formData.targetRole.method === "jd_file" && formData.targetRole.jdFile);

  const sections = [
    { name: 'Target Role', key: 'targetRole', required: [], complete: targetRoleComplete },
    { name: 'Personal Info', key: 'personalInfo', required: ['fullName', 'email', 'phone'], complete: isComplete('personalInfo', ['fullName', 'email', 'phone']) },
    { name: 'Experience', key: 'experience', required: [], complete: isComplete('experience', []) },
    { name: 'Education', key: 'education', required: [], complete: isComplete('education', []) },
    { name: 'Skills', key: 'skills', required: [], complete: isComplete('skills', []) },
    { name: 'Projects', key: 'projects', required: [], complete: formData.projects.length > 0 },
    { name: 'Certifications', key: 'certifications', required: [], complete: formData.certifications.length > 0 }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Review Your Resume</h3>
      <p className="text-gray-600 mb-6">Review all sections before generating your resume.</p>
      
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900">Selected Template</h4>
          <p className="text-indigo-700">{templates[selectedTemplate]?.name}</p>
        </div>
        
        {sections.map((section) => (
          <div key={section.key} className={`border rounded-lg p-4 ${section.complete ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{section.name}</h4>
              <span className={`text-sm ${section.complete ? 'text-green-600' : 'text-yellow-600'}`}>
                {section.complete ? '✅ Complete' : '⚠️ Incomplete'}
              </span>
            </div>
            {section.key === 'targetRole' && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.targetRole.method === 'role' && formData.targetRole.roleName}
                {formData.targetRole.method === 'custom_jd' && 'Custom job description provided'}
                {formData.targetRole.method === 'jd_file' && formData.targetRole.jdFile?.name}
              </p>
            )}
            {section.key === 'personalInfo' && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.personalInfo.fullName} • {formData.personalInfo.email}
              </p>
            )}
            {Array.isArray(formData[section.key]) && (
              <p className="text-sm text-gray-600 mt-1">
                {formData[section.key].length} item(s) added
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Ready to generate?</strong> Your resume will be created in both LaTeX and Markdown formats. 
          The LaTeX version is perfect for PDF generation, while Markdown is great for online applications.
        </p>
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-800">
          <strong>🎯 1-Page Guarantee:</strong> Both formats are automatically optimized to fit within 1 page while maintaining professional impact and readability.
        </div>
        {!isFormValid() && (
          <div className="mt-2 text-sm text-red-600">
            <strong>Missing required sections:</strong>
            <ul className="list-disc list-inside mt-1">
              {!(formData.targetRole.method === "role" && formData.targetRole.roleName) && 
               !(formData.targetRole.method === "custom_jd" && formData.targetRole.customJD.trim()) && 
               !(formData.targetRole.method === "jd_file" && formData.targetRole.jdFile) && 
               <li>Target role specification</li>}
              {!formData.personalInfo.fullName && <li>Full name in Personal Info</li>}
              {!formData.personalInfo.email && <li>Email in Personal Info</li>}
              {!formData.personalInfo.phone && <li>Phone in Personal Info</li>}
              {formData.experience.length === 0 && <li>At least one work experience</li>}
              {formData.education.length === 0 && <li>At least one education entry</li>}
              {formData.skills.length === 0 && <li>At least one skill</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Resume Results Component
const ResumeResults = ({ resume, activeFormat, setActiveFormat, onViewInAnalysis }) => {
  const downloadResume = (format) => {
    const content = format === 'latex' ? resume.latex : resume.markdown;
    const extension = format === 'latex' ? 'tex' : 'md';
    const mimeType = format === 'latex' ? 'text/x-tex' : 'text/markdown';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${resume.templateName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Resume Created Successfully!</h3>
        <p className="text-green-700">Your professional resume has been generated using the {resume.templateName} template.</p>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveFormat('markdown')}
            className={`px-4 py-2 text-sm font-medium ${
              activeFormat === 'markdown' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 Markdown
          </button>
          <button
            onClick={() => setActiveFormat('latex')}
            className={`px-4 py-2 text-sm font-medium ${
              activeFormat === 'latex' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📐 LaTeX
          </button>
        </div>
        
        <button
          onClick={() => downloadResume(activeFormat)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          💾 Download {activeFormat.toUpperCase()}
        </button>
        
        <button
          onClick={() => downloadResume(activeFormat === 'latex' ? 'markdown' : 'latex')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          💾 Download {activeFormat === 'latex' ? 'Markdown' : 'LaTeX'}
        </button>
        
        {onViewInAnalysis && (
          <button
            onClick={() => onViewInAnalysis(resume.sessionId)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            📊 View Analysis
          </button>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-[600px] overflow-y-auto">
        <div className="mb-3 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
          {activeFormat === 'latex' ? 'LaTeX Code' : 'Markdown Preview'}
        </div>
        
        {activeFormat === 'latex' ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed bg-gray-50 p-4 rounded border">
            {resume.latex}
          </pre>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{resume.markdown}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
// Target Role Step
const TargetRoleStep = ({ data, updateData, roles }) => {
  const handleMethodChange = (method) => {
    updateData({ ...data, method, roleName: "", customJD: "", jdFile: null });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateData({ ...data, jdFile: file });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Target Role & Job Description</h3>
      <p className="text-gray-600 mb-6">Specify the role you're targeting to create an optimized resume.</p>
      
      {/* Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you like to specify the target role?
        </label>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="targetMethod"
              value="role"
              checked={data.method === "role"}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="mr-3 text-indigo-600"
            />
            <div>
              <span className="font-medium">Predefined Role</span>
              <p className="text-xs text-gray-500">Choose from common job roles</p>
            </div>
          </label>
          
          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="targetMethod"
              value="custom_jd"
              checked={data.method === "custom_jd"}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="mr-3 text-indigo-600"
            />
            <div>
              <span className="font-medium">Custom Job Description</span>
              <p className="text-xs text-gray-500">Paste a specific job description</p>
            </div>
          </label>
          
          <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="targetMethod"
              value="jd_file"
              checked={data.method === "jd_file"}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="mr-3 text-indigo-600"
            />
            <div>
              <span className="font-medium">Upload Job Description</span>
              <p className="text-xs text-gray-500">Upload a JD file (PDF, DOC, TXT)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Role Selection */}
      {data.method === "role" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Role:
          </label>
          <select
            value={data.roleName}
            onChange={(e) => updateData({ ...data, roleName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose a role...</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom JD Text */}
      {data.method === "custom_jd" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description Text:
          </label>
          <textarea
            value={data.customJD}
            onChange={(e) => updateData({ ...data, customJD: e.target.value })}
            rows={8}
            placeholder="Paste the job description here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      {/* JD File Upload */}
      {data.method === "jd_file" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Job Description File:
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {data.jdFile && (
            <p className="mt-2 text-sm text-green-600">
              ✅ {data.jdFile.name} selected
            </p>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Providing a target role helps the AI create a more focused, 
          ATS-optimized resume with relevant keywords and skills highlighted for that specific position.
        </p>
      </div>
    </div>
  );
};