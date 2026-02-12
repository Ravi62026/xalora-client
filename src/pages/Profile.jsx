import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components";
import { useApiCall } from "../hooks";
import authService from "../services/authService";
import subscriptionService from "../services/subscriptionService";
import problemService from "../services/problemService";
import quizService from "../services/quizService";
import organizationService from "../services/organizationService";
import { setUser } from "../store/slices/userSlice";

const PLAN_META = {
  spark: {
    name: "Xalora Spark",
    tone: "from-slate-700 to-slate-800",
    accent: "text-slate-100",
    features: [
      "10 AI requests per day",
      "3 file uploads per day",
      "Community access",
    ],
  },
  pulse: {
    name: "Xalora Pulse",
    tone: "from-blue-600 to-cyan-600",
    accent: "text-blue-100",
    features: [
      "50 AI requests per day",
      "10 file uploads per day",
      "Internship access",
    ],
  },
  nexus: {
    name: "Xalora Nexus",
    tone: "from-indigo-600 to-fuchsia-600",
    accent: "text-indigo-100",
    features: [
      "100 AI requests per day",
      "20 file uploads per day",
      "Advanced model access",
    ],
  },
  infinity: {
    name: "Xalora Infinity",
    tone: "from-amber-500 to-orange-600",
    accent: "text-amber-100",
    features: [
      "Unlimited AI requests",
      "Unlimited file uploads",
      "Priority support",
    ],
  },
};

const getProblemsArray = (res) => {
  if (Array.isArray(res?.data?.data?.problems)) return res.data.data.problems;
  if (Array.isArray(res?.data?.problems)) return res.data.problems;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.problems)) return res.problems;
  return [];
};

const getQuizSubmissionsArray = (res) => {
  if (Array.isArray(res?.data?.submissions)) return res.data.submissions;
  if (Array.isArray(res?.submissions)) return res.submissions;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, execute } = useApiCall();
  const getOrgDashboardRoute = () => {
    if (!user?.organization?.orgId) return "/dashboard";
    if (user?.organization?.role === "super_admin") return "/org/dashboard";
    if (user?.userType === "org_team") return "/org/teamdashboard";
    return "/org/student/dashboard";
  };
  const orgDetails = user?.organization;
  const isOrgMember = Boolean(orgDetails?.orgId);
  const isSuperAdminOrg = orgDetails?.role === "super_admin";
  const upgradeDisabled = isOrgMember && !isSuperAdminOrg;

  const [subscription, setSubscription] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  const [orgProfile, setOrgProfile] = useState(null);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    quizzesTaken: 0,
    currentStreak: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check if user is organization member (only if they have actual orgId)
  const isOrgUser = !!user?.organization?.orgId;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      await execute(
        () => authService.getUser(),
        (response) => {
          if (!response?.success || !response?.data) return;
          dispatch(setUser(response.data));
          setFormData({
            name: response.data.name || "",
            username: response.data.username || "",
            email: response.data.email || "",
            avatar: response.data.avatar || "",
          });
        },
        (err) => {
          if (err?.response?.status === 401) navigate("/login");
        }
      );
    };

    fetchProfile();
  }, [dispatch, execute, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchSubscriptionAndUsage = async () => {
      if (!isAuthenticated || isOrgMember) return;

      try {
        const [subRes, usageRes] = await Promise.all([
          subscriptionService.getCurrentSubscription(),
          subscriptionService.getAIUsageInfo(),
        ]);

        setSubscription(subRes?.data || null);
        setAiUsage(usageRes || null);
      } catch (err) {
        if (err?.response?.status === 401) navigate("/login");
      }
    };

    fetchSubscriptionAndUsage();
  }, [isAuthenticated, isOrgMember, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user || isOrgMember) return;
      try {
        const [problemsRes, quizzesRes] = await Promise.all([
          problemService.getAllProblems({ limit: 1000 }),
          quizService.getUserSubmissions(),
        ]);

        const solvedFromStorage = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const problems = getProblemsArray(problemsRes);
        const quizzes = getQuizSubmissionsArray(quizzesRes);

        const problemsSolved = problems.filter(
          (p) => p?.userStatus === "Solved" || solvedFromStorage.includes(p?._id)
        ).length;

        setStats({
          problemsSolved,
          quizzesTaken: quizzes.length,
          currentStreak: user?.stats?.currentStreak || 0,
        });
      } catch (err) {
        if (err?.response?.status === 401) navigate("/login");
      }
    };

    fetchStats();
  }, [isAuthenticated, isOrgMember, navigate, user]);

  useEffect(() => {
    const fetchOrgProfile = async () => {
      if (!isOrgMember || !orgDetails?.orgId) {
        setOrgProfile(null);
        return;
      }

      try {
        const response = await organizationService.get(orgDetails.orgId);
        setOrgProfile(response?.data?.organization || response?.organization || null);
      } catch (err) {
        setOrgProfile(null);
      }
    };

    fetchOrgProfile();
  }, [isOrgMember, orgDetails?.orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setUpdateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setSuccessMessage("");
    setUpdateError("");

    try {
      const response = await authService.updateUser(
        formData.name,
        formData.username,
        formData.email,
        formData.avatar
      );

      if (!response?.success) {
        setUpdateError(response?.message || "Profile update failed");
      } else {
        dispatch(setUser(response.data));
        setSuccessMessage("Profile updated successfully.");
      }
    } catch (err) {
      setUpdateError(err?.response?.data?.message || "Profile update failed");
      if (err?.response?.status === 401) navigate("/login");
    } finally {
      setUpdateLoading(false);
    }
  };

  const roleLabel = useMemo(() => {
    if (user?.role === "setter") return "Problem Setter";
    return "User";
  }, [user]);

  const avatarInitial = useMemo(
    () => (formData.name || formData.username || "U").charAt(0).toUpperCase(),
    [formData.name, formData.username]
  );

  const currentPlan = useMemo(() => {
    const planId = subscription?.planId || "spark";
    return PLAN_META[planId] || PLAN_META.spark;
  }, [subscription]);

  const orgName = orgProfile?.name || orgDetails?.name || "Your Organization";
  const orgType = orgProfile?.type || orgDetails?.type || "N/A";
  const orgRole = (orgDetails?.role || "member").replace("_", " ");

  const usagePercent = useMemo(() => {
    if (!aiUsage?.requestsLimit) return 0;
    const raw = (aiUsage.requestsUsed / aiUsage.requestsLimit) * 100;
    return Math.max(0, Math.min(100, raw));
  }, [aiUsage]);

  const uploadPercent = useMemo(() => {
    if (!aiUsage?.fileUploadsLimit) return 0;
    const raw = (aiUsage.fileUploadsUsed / aiUsage.fileUploadsLimit) * 100;
    return Math.max(0, Math.min(100, raw));
  }, [aiUsage]);

  const statCards = useMemo(
    () => [
      {
        label: "Problems Solved",
        value: stats.problemsSolved,
        hint: "Coding progress",
      },
      {
        label: "Quizzes Taken",
        value: stats.quizzesTaken,
        hint: "Assessment activity",
      },
      {
        label: "Current Streak",
        value: stats.currentStreak,
        hint: "Consecutive days",
      },
    ],
    [stats]
  );

  if (loading && !user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(45,212,191,0.18),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.16),transparent_35%),linear-gradient(145deg,#020617,#0b1120,#030712)] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/15 via-transparent to-emerald-500/10 p-5 backdrop-blur sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Account Center</p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Profile and Settings</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                  {isOrgMember
                    ? "Manage your personal and organization-linked account details in one place."
                    : "Manage your personal details, review your plan, and track daily AI usage in one place."}
                </p>
                {isOrgMember && (
                  <p className="mt-1 text-xs text-emerald-200">
                    You belong to{" "}
                    <span className="font-semibold text-white">{orgName}</span> as{" "}
                    <span className="font-semibold text-white">{orgRole}</span>{" "}
                    so billing is handled by your organization’s super admin.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/pricing"
                  onClick={(event) => {
                    if (upgradeDisabled) {
                      event.preventDefault();
                    }
                  }}
                  className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    upgradeDisabled
                      ? "border-cyan-300/15 bg-white/5 text-slate-400 cursor-not-allowed"
                      : "border-cyan-300/35 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20"
                  }`}
                  aria-disabled={upgradeDisabled}
                  title={
                    upgradeDisabled
                      ? "Billing is managed at the organization level by the super admin."
                      : "Upgrade Plan"
                  }
                >
                  Upgrade Plan
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
          {updateError && (
            <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {updateError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <aside className="space-y-6 xl:col-span-4">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_16px_40px_-20px_rgba(6,182,212,0.45)] backdrop-blur">
                <div className="bg-gradient-to-r from-cyan-600/45 to-blue-600/20 p-6">
                  <div className="flex items-start gap-4">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={formData.name || "User"}
                        className="h-20 w-20 shrink-0 rounded-2xl border border-cyan-200/45 object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 shrink-0 rounded-2xl border border-cyan-200/45 bg-cyan-500/20 text-white flex items-center justify-center text-2xl font-semibold">
                        {avatarInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-semibold text-white">{formData.name || "User"}</h2>
                      <p className="mt-1 truncate text-sm text-cyan-100">@{formData.username || "username"}</p>
                      <p className="mt-1 break-all text-xs text-slate-200">{formData.email || "No email"}</p>
                      <span className="mt-3 inline-flex rounded-full border border-emerald-200/35 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {!isOrgMember && (
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
                    {statCards.map((card) => (
                      <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
                {isOrgUser ? (
                  // Organization Plan Card
                  <>
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5">
                      <p className="text-xs uppercase tracking-wide text-white/75">Organization Plan</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{orgName}</h3>
                      <p className="mt-1 text-xs text-emerald-100">
                        Role: <span className="font-semibold capitalize">{orgRole}</span>
                      </p>
                    </div>
                    <div className="space-y-2 p-5 text-sm text-slate-200">
                      <p>- Organization management dashboard access</p>
                      <p>- Collaborative learning environment</p>
                      <p>- Team performance tracking</p>
                      <p>- Custom learning paths</p>
                    </div>
                  </>
                ) : (
                  // Individual Plan Card
                  <>
                    <div className={`bg-gradient-to-r ${currentPlan.tone} p-5`}>
                      <p className="text-xs uppercase tracking-wide text-white/75">Current Plan</p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{currentPlan.name}</h3>
                      {subscription?.endDate && (
                        <p className={`mt-1 text-xs ${currentPlan.accent}`}>
                          Valid until {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 p-5 text-sm text-slate-200">
                      {currentPlan.features.map((item) => (
                        <p key={item}>- {item}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </aside>

            <main className="space-y-6 xl:col-span-8">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {!isOrgUser && (
                  <>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                      <h3 className="text-lg font-semibold text-white">AI Requests</h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {aiUsage
                          ? `${aiUsage.requestsUsed} of ${aiUsage.requestsLimit} used today`
                          : "Usage data unavailable"}
                      </p>
                      <div className="mt-4 h-3 w-full rounded-full bg-slate-800">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {aiUsage ? `${aiUsage.requestsRemaining} requests remaining` : "No active quota"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                      <h3 className="text-lg font-semibold text-white">File Uploads</h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {aiUsage
                          ? `${aiUsage.fileUploadsUsed} of ${aiUsage.fileUploadsLimit} used today`
                          : "Upload data unavailable"}
                      </p>
                      <div className="mt-4 h-3 w-full rounded-full bg-slate-800">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
                          style={{ width: `${uploadPercent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {aiUsage ? `${aiUsage.fileUploadsRemaining} uploads remaining` : "No active quota"}
                      </p>
                    </div>
                  </>
                )}
                {isOrgUser && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white">Organization Info</h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Organization Name</p>
                        <p className="text-sm font-medium text-white">{orgName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Your Role</p>
                        <p className="text-sm font-medium text-white capitalize">{orgRole}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Organization Type</p>
                        <p className="text-sm font-medium text-white capitalize">{orgType}</p>
                      </div>
                      <Link
                        to={getOrgDashboardRoute()}
                        className="mt-4 inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white hover:from-emerald-700 hover:to-teal-700 transition-all"
                      >
                        Go to Organization Dashboard →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-7">
                <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Update your name, username, email, and avatar URL.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="username">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        placeholder="Username"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="avatar">
                        Avatar URL
                      </label>
                      <input
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4">
                    <p className="text-xs text-cyan-100">
                      Session auth uses secure httpOnly cookies with token rotation. Your account changes are applied immediately.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">Need billing changes? Use the pricing page to switch plans.</p>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
