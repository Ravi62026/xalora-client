import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Loader2,
  Mail,
  User,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Layout } from "../../components";
import organizationService from "../../services/organizationService";
import { initializeAuth } from "../../store/slices/userSlice";

const inputClass =
  "w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all duration-300";
const labelClass = "block text-sm font-medium text-white/90 mb-2";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [invite, setInvite] = useState(null);
  const [validating, setValidating] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getOrgDashboardRoute = (currentUser) => {
    if (!currentUser?.organization?.orgId) return "/dashboard";
    if (currentUser?.organization?.role === "super_admin") return "/org/dashboard";
    if (currentUser?.userType === "org_team") return "/org/teamdashboard";
    return "/org/student/dashboard";
  };

  // ── Validate invite token on mount ──────────────────────────────────
  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setInvalidMsg("No invite token provided");
      setValidating(false);
      return;
    }

    const validate = async () => {
      try {
        const res = await organizationService.validateInvite(token);
        setInvite(res.data?.invite);
        if (res.data?.invite?.name) {
          setName(res.data.invite.name);
        }
      } catch (err) {
        setInvalid(true);
        setInvalidMsg(
          err?.response?.data?.message || "This invite link is invalid or has expired"
        );
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  // ── Accept invite ───────────────────────────────────────────────────
  const handleAccept = async (e) => {
    e.preventDefault();
    setError("");

    // If user is logged in and already has an org
    if (isAuthenticated && user?.organization?.orgId) {
      setError("You are already part of an organization. Please leave it first.");
      return;
    }

    // If NOT logged in → new user, needs password
    if (!isAuthenticated) {
      if (!password) return setError("Password is required");
      if (password.length < 6) return setError("Password must be at least 6 characters");
      if (password !== confirmPassword) return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await organizationService.acceptInvite(token, {
        name: name.trim() || undefined,
        password: !isAuthenticated ? password : undefined,
      });

      // Re-init auth to get updated user
      const refreshedUser = await dispatch(initializeAuth()).unwrap();
      setSuccess(true);

      // Navigate after a brief moment
      setTimeout(() => {
        navigate(getOrgDashboardRoute(refreshedUser), { replace: true });
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────
  if (validating) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Validating invite...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Invalid invite ──────────────────────────────────────────────────
  if (invalid) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Invalid Invite</h2>
            <p className="text-gray-400 mb-6">{invalidMsg}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Success state ───────────────────────────────────────────────────
  if (success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center max-w-md">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-gray-400 mb-2">
              You have successfully joined{" "}
              <strong className="text-white">{invite?.organization?.name}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-6">Redirecting to dashboard...</p>
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  // ── Accept form ─────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-[80vh] py-8 sm:py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Org info card */}
          <div className="text-center mb-6">
            {invite?.organization?.logo ? (
              <img
                src={invite.organization.logo}
                alt=""
                className="w-16 h-16 rounded-xl mx-auto mb-3 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-emerald-400" />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Join {invite?.organization?.name}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              You've been invited as{" "}
              <span className="text-emerald-300 font-medium">{invite?.role}</span>
              {invite?.department && (
                <> in <span className="text-white">{invite.department}</span></>
              )}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 shadow-2xl rounded-2xl border border-white/20">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    Logged in as <strong>{user?.name}</strong> ({user?.email}).
                    Your account will be linked to this organization.
                  </p>
                </div>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Joining...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" /> Accept & Join
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAccept} className="space-y-5">
                <div>
                  <label className={labelClass}>
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </label>
                  <input
                    value={invite?.email || ""}
                    disabled
                    className={inputClass + " opacity-60 cursor-not-allowed"}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <User className="w-4 h-4 inline mr-1" /> Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-1" /> Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Lock className="w-4 h-4 inline mr-1" /> Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" /> Create Account & Join
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  Already have an account?{" "}
                  <a
                    href={`/login?redirect=/org/join/${token}`}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    Log in first
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
