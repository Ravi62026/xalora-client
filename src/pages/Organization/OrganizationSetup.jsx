import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Mail,
  Globe,
  Phone,
  MapPin,
  Layers,
  Users,
  Plus,
  X,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import { initializeAuth } from "../../store/slices/userSlice";

const STEPS = [
  { id: 1, label: "Organization Info" },
  { id: 2, label: "Structure" },
  { id: 3, label: "Review & Create" },
];

const ORG_TYPES = [
  { value: "college", label: "College / University", icon: "🎓" },
  { value: "company", label: "Company / Startup", icon: "🏢" },
];

const inputClass =
  "w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300";
const labelClass = "block text-sm font-medium text-white/90 mb-2";

export default function OrganizationSetup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams(); // Get setup token from URL
  const { user } = useSelector((state) => state.user);
  const getOrgDashboardRoute = () => {
    if (!user?.organization?.orgId) return "/dashboard";
    if (user?.organization?.role === "super_admin") return "/org/dashboard";
    if (user?.userType === "org_team") return "/org/teamdashboard";
    return "/org/student/dashboard";
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenUser, setTokenUser] = useState(null);
  const [error, setError] = useState("");

  // Step 1 — Basic info
  const [form, setForm] = useState({
    name: "",
    type: "",
    email: "",
    website: "",
    phone: "",
    description: "",
    city: "",
    state: "",
    country: "",
  });

  // Step 2 — Structure
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [newBatch, setNewBatch] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const addDepartment = () => {
    const trimmed = newDept.trim();
    if (trimmed && !departments.includes(trimmed)) {
      setDepartments((prev) => [...prev, trimmed]);
      setNewDept("");
    }
  };

  const addBatch = () => {
    const trimmed = newBatch.trim();
    if (trimmed && !batches.includes(trimmed)) {
      setBatches((prev) => [...prev, trimmed]);
      setNewBatch("");
    }
  };

  // Validate setup token on mount
  useEffect(() => {
    if (!token) {
      setError("Setup token is missing. Please use the link from your signup email.");
      setValidatingToken(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await organizationService.validateSetupToken(token);
        if (response.success && response.data?.valid) {
          setTokenValid(true);
          setTokenUser(response.data.user);
        } else {
          setError("Invalid setup token");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Invalid or expired setup token");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const validateStep1 = () => {
    if (!form.name.trim()) return "Organization name is required";
    if (!form.type) return "Select an organization type";
    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
    return null;
  };

  const nextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    setError("");
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    const err = validateStep1();
    if (err) return setError(err);

    if (!token) {
      return setError("Setup token is missing");
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        email: form.email.trim(),
        website: form.website.trim() || undefined,
        phone: form.phone.trim() || undefined,
        description: form.description.trim() || undefined,
        address: {
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          country: form.country.trim() || undefined,
        },
        structure: {
          departments,
          batches,
        },
      };

      await organizationService.createWithToken(token, payload);

      // Organization created successfully - redirect to login
      navigate("/login?org=created");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  // Validating token
  if (validatingToken) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Validating Setup Token</h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Invalid token or error
  if (!tokenValid || error) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Invalid Setup Link</h2>
            <p className="text-gray-400 mb-6">{error || "This setup link is invalid or has expired."}</p>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-300"
            >
              Go to Signup
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Already in an org? ──
  if (user?.organization?.orgId) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <Building2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Already in an Organization</h2>
            <p className="text-gray-400 mb-6">
              You are already part of an organization. Each user can only belong to one organization.
            </p>
            <button
              onClick={() => navigate(getOrgDashboardRoute())}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-8 sm:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Create Organization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Set Up Your Organization
            </h1>
            <p className="text-gray-400 mt-2">
              Create your org, add departments, and start inviting your team.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    step >= s.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-gray-800 text-gray-500 border border-gray-700"
                  }`}
                >
                  {step > s.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{s.id}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-px mx-1 ${
                      step > s.id ? "bg-emerald-500/40" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form card */}
          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 shadow-2xl rounded-2xl border border-white/20">
            {/* ── Step 1: Org Info ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Organization Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. IIT Bombay, Acme Corp"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ORG_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, type: t.value }))
                        }
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                          form.type === t.value
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                            : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <Mail className="w-4 h-4 inline mr-1" /> Official Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@yourorg.com"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      <Globe className="w-4 h-4 inline mr-1" /> Website
                    </label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://yourorg.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Phone className="w-4 h-4 inline mr-1" /> Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly describe your organization..."
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["city", "state", "country"].map((f) => (
                    <div key={f}>
                      <label className={labelClass}>
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </label>
                      <input
                        name={f}
                        value={form[f]}
                        onChange={handleChange}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Structure ──────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>
                    <Layers className="w-4 h-4 inline mr-1" /> Departments / Branches
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Add departments, branches or teams (e.g. CSE, Mechanical, Engineering, HR).
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDepartment())}
                      placeholder="e.g. Computer Science"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addDepartment}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {d}
                        <button
                          onClick={() => setDepartments((prev) => prev.filter((x) => x !== d))}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {departments.length === 0 && (
                      <span className="text-xs text-gray-600">No departments added yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <Users className="w-4 h-4 inline mr-1" /> Batches / Cohorts
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Add batches, cohorts, or year groups (e.g. 2024, Batch A, Q1-2025).
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBatch())}
                      placeholder="e.g. 2025"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addBatch}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {batches.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {b}
                        <button
                          onClick={() => setBatches((prev) => prev.filter((x) => x !== b))}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {batches.length === 0 && (
                      <span className="text-xs text-gray-600">No batches added yet</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  You can always add or edit departments and batches later from the admin dashboard.
                </p>
              </div>
            )}

            {/* ── Step 3: Review ──────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Review Details</h3>

                <div className="space-y-3">
                  {[
                    ["Name", form.name],
                    ["Type", ORG_TYPES.find((t) => t.value === form.type)?.label],
                    ["Email", form.email],
                    ["Website", form.website || "—"],
                    ["Phone", form.phone || "—"],
                    ["Description", form.description || "—"],
                    [
                      "Location",
                      [form.city, form.state, form.country].filter(Boolean).join(", ") || "—",
                    ],
                    ["Departments", departments.length > 0 ? departments.join(", ") : "None"],
                    ["Batches", batches.length > 0 ? batches.join(", ") : "None"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-start py-2 border-b border-gray-800"
                    >
                      <span className="text-sm text-gray-400">{label}</span>
                      <span className="text-sm text-white text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-sm text-emerald-300">
                    <strong>Free plan:</strong> 10 seats, 30-day trial. You can invite members
                    after creation.
                  </p>
                </div>
              </div>
            )}

            {/* ── Navigation buttons ──────────────────────────── */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" /> Create Organization
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
