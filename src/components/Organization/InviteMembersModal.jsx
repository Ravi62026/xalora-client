import React, { useState } from "react";
import axios from "axios";

const InviteMembersModal = ({ isOpen, onClose, orgId, onSuccess }) => {
  const [invites, setInvites] = useState([{ email: "", role: "member", department: "", batch: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "member", label: "Member (Student)", icon: "👤" },
    { value: "manager", label: "Manager (Coordinator)", icon: "👥" },
    { value: "admin", label: "Admin (Faculty)", icon: "🔑" },
  ];

  const addInviteField = () => {
    if (invites.length < 100) {
      setInvites([...invites, { email: "", role: "member", department: "", batch: "" }]);
    }
  };

  const removeInviteField = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleInviteChange = (index, field, value) => {
    const updatedInvites = [...invites];
    updatedInvites[index][field] = value;
    setInvites(updatedInvites);
  };

  const handleSendInvites = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const filledInvites = invites.filter((i) => i.email.trim());
      if (filledInvites.length === 0) {
        setError("Please enter at least one email address");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const invite of filledInvites) {
        if (!emailRegex.test(invite.email.trim())) {
          setError(`Invalid email: ${invite.email}`);
          return;
        }
      }

      const response = await axios.post(
        `/api/v1/organization/${orgId}/invites/send`,
        { invites: filledInvites },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess(
          `Successfully sent ${response.data.data.summary.successful} invite(s).`
        );

        setTimeout(() => {
          setInvites([{ email: "", role: "member", department: "", batch: "" }]);
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to send invites");
      }
    } catch (err) {
      console.error("Invite error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to send invites"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h2 className="text-xl font-bold text-white">Invite Members & Team</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
              ✅ {success}
            </div>
          )}

          {/* Invite Fields */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {invites.map((invite, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-900/50 border border-gray-700 space-y-3"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={invite.email}
                      onChange={(e) =>
                        handleInviteChange(index, "email", e.target.value)
                      }
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  {invites.length > 1 && (
                    <button
                      onClick={() => removeInviteField(index)}
                      className="self-end text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Role
                    </label>
                    <select
                      value={invite.role}
                      onChange={(e) =>
                        handleInviteChange(index, "role", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.icon} {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={invite.department}
                      onChange={(e) =>
                        handleInviteChange(index, "department", e.target.value)
                      }
                      placeholder="e.g., CSE, ECE"
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Batch/Year
                    </label>
                    <input
                      type="text"
                      value={invite.batch}
                      onChange={(e) =>
                        handleInviteChange(index, "batch", e.target.value)
                      }
                      placeholder="e.g., 2024, 2025"
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {invites.length < 100 && (
            <button
              onClick={addInviteField}
              className="w-full py-2 rounded-lg border-2 border-dashed border-emerald-500/50 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all font-medium"
            >
              + Add Another
            </button>
          )}

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
            <p className="font-medium mb-1">📋 Role Guide:</p>
            <ul className="text-xs space-y-1 ml-2">
              <li>• <strong>Member</strong>: Student who solves problems</li>
              <li>• <strong>Manager</strong>: Coordinator managing students</li>
              <li>• <strong>Admin</strong>: Faculty with full management</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900/50 to-slate-900/50 border-t border-gray-700 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendInvites}
            disabled={loading || invites.every((i) => !i.email.trim())}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send ({invites.filter((i) => i.email.trim()).length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMembersModal;
