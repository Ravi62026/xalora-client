import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import AcademicStructureBuilder from "../../components/Organization/AcademicStructureBuilder";

const STEPS = [
  { id: 1, label: "Organization Info" },
  { id: 2, label: "Academic Structure" },
  { id: 3, label: "Review" },
];

const ORG_TYPES = [
  { value: "college", label: "College / University", icon: "Academic" },
  { value: "company", label: "Company / Startup", icon: "Hiring" },
];

const inputClass =
  "w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500";
const labelClass = "mb-2 block text-sm font-medium text-white/90";

const createAcademicDegreeType = () => ({
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `degree-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: "",
  programs: [],
});

const getDefaultAcademicStructure = () => [createAcademicDegreeType()];

export default function OrganizationSetup() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { user } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
  const [academicStructure, setAcademicStructure] = useState(
    getDefaultAcademicStructure()
  );

  const normalizedAcademicStructure = useMemo(
    () =>
      academicStructure
        .map((degreeType) => ({
          label: degreeType.label.trim(),
          programs: degreeType.programs
            .map((program) => program.trim())
            .filter(Boolean),
        }))
        .filter((degreeType) => degreeType.label && degreeType.programs.length > 0),
    [academicStructure]
  );

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

  const getOrgDashboardRoute = () => {
    if (!user?.organization?.orgId) return "/dashboard";
    if (user?.organization?.role === "super_admin") return "/org/dashboard";
    if (user?.userType === "org_team") return "/org/teamdashboard";
    return user?.organization?.degreeTypeValue || user?.organization?.programValue
      ? "/org/student/dashboard"
      : "/dashboard";
  };

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return "Organization name is required";
    if (!form.type) return "Select an organization type";
    if (!form.email.trim()) return "Organization email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid organization email";
    return null;
  };

  const validateStep2 = () => {
    if (form.type !== "college") return null;
    if (normalizedAcademicStructure.length === 0) {
      return "Add at least one degree type with at least one program";
    }
    return null;
  };

  const goNext = () => {
    const stepError = step === 1 ? validateStep1() : validateStep2();
    if (stepError) {
      setError(stepError);
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, STEPS.length));
  };

  const handleSubmit = async () => {
    const step1Error = validateStep1();
    const step2Error = validateStep2();
    if (step1Error || step2Error) {
      setError(step1Error || step2Error);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await organizationService.createWithToken(token, {
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
        academicStructure:
          form.type === "college"
            ? { degreeTypes: normalizedAcademicStructure }
            : undefined,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login?org=created"), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-gray-300">Validating setup link...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tokenValid || error === "Invalid setup token" || error.includes("expired")) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
              <X className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-xl font-semibold text-white">Invalid Setup Link</h1>
            <p className="mt-2 text-sm text-gray-400">
              {error || "This setup link is invalid or has expired."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Go to Signup
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.organization?.orgId) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h1 className="text-xl font-semibold text-white">Already in an Organization</h1>
            <p className="mt-2 text-sm text-gray-400">
              Each account can belong to only one organization at a time.
            </p>
            <button
              type="button"
              onClick={() => navigate(getOrgDashboardRoute())}
              className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-xl font-semibold text-white">Organization Created!</h1>
            <p className="mt-2 text-sm text-gray-400">
              <strong className="text-white">{form.name}</strong> has been set up successfully. You will be redirected to login shortly.
            </p>
            <p className="mt-4 text-xs text-gray-500">Redirecting to login...</p>
            <Loader2 className="mx-auto mt-3 h-5 w-5 animate-spin text-emerald-400" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <Building2 className="h-4 w-4" />
            Organization Setup
          </div>
          <h1 className="text-3xl font-bold text-white">Set Up Your Organization</h1>
          <p className="mt-2 text-sm text-gray-400">
            Create the organization, define the academic structure for colleges, then import students from the admin dashboard.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          {STEPS.map((currentStep, index) => (
            <div key={currentStep.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  step >= currentStep.id
                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                    : "border-gray-700 bg-gray-900 text-gray-500"
                }`}
              >
                {step > currentStep.id ? <Check className="h-3.5 w-3.5" /> : currentStep.id}
                <span className="hidden sm:inline">{currentStep.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px w-8 ${
                    step > currentStep.id ? "bg-emerald-500/30" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Organization Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. KIIT or Acme Corp"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Organization Type</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ORG_TYPES.map((typeOption) => (
                    <button
                      key={typeOption.value}
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          type: typeOption.value,
                        }))
                      }
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        form.type === typeOption.value
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <p className="text-sm font-semibold">{typeOption.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{typeOption.icon} flow</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    <Mail className="mr-1 inline h-4 w-4" />
                    Official Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@organization.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Globe className="mr-1 inline h-4 w-4" />
                    Website
                  </label>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://organization.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    <Phone className="mr-1 inline h-4 w-4" />
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short summary"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {["city", "state", "country"].map((fieldName) => (
                  <div key={fieldName}>
                    <label className={labelClass}>
                      <MapPin className="mr-1 inline h-4 w-4" />
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </label>
                    <input
                      name={fieldName}
                      value={form[fieldName]}
                      onChange={handleChange}
                      placeholder={fieldName}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {form.type === "college" ? (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Academic Structure</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Add each degree type and the programs available under it. This becomes the source of truth for student imports and ranking filters.
                    </p>
                  </div>
                  <AcademicStructureBuilder
                    value={academicStructure}
                    onChange={setAcademicStructure}
                  />
                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-5 text-sm text-gray-300">
                  Company organizations do not need an academic structure during setup.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-5">
                <h2 className="text-lg font-semibold text-white">Review</h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Name", form.name || "—"],
                    ["Type", form.type || "—"],
                    ["Email", form.email || "—"],
                    ["Website", form.website || "—"],
                    ["Phone", form.phone || "—"],
                    [
                      "Location",
                      [form.city, form.state, form.country].filter(Boolean).join(", ") || "—",
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
                      <dd className="mt-1 text-sm text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {form.type === "college" && (
                <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-5">
                  <h3 className="text-lg font-semibold text-white">Academic Structure</h3>
                  <div className="mt-4 space-y-3">
                    {normalizedAcademicStructure.map((degreeType) => (
                      <div
                        key={degreeType.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="font-medium text-white">{degreeType.label}</p>
                        <p className="mt-2 text-sm text-gray-400">
                          {degreeType.programs.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Organization
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
