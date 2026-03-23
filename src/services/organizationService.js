import axiosInstance, { setTokens } from "../utils/axios";
import ApiRoutes from "../routes/routes";

const organizationService = {
  // ─── Setup Token (Public) ────────────────────────────────────────────────

  validateSetupToken: async (token) => {
    const response = await axiosInstance.get(ApiRoutes.organization.validateSetupToken(token));
    return response.data;
  },

  createWithToken: async (token, data) => {
    const response = await axiosInstance.post(ApiRoutes.organization.createWithToken(token), data);
    return response.data;
  },

  // ─── Org CRUD ────────────────────────────────────────────────────────────

  create: async (data) => {
    const response = await axiosInstance.post(ApiRoutes.organization.create, data);
    return response.data;
  },

  get: async (orgId) => {
    const response = await axiosInstance.get(ApiRoutes.organization.get(orgId));
    return response.data;
  },

  update: async (orgId, data) => {
    const response = await axiosInstance.put(ApiRoutes.organization.update(orgId), data);
    return response.data;
  },

  getStats: async (orgId) => {
    const response = await axiosInstance.get(ApiRoutes.organization.stats(orgId));
    return response.data;
  },

  // ─── Invites ─────────────────────────────────────────────────────────────

  inviteMembers: async (orgId, members) => {
    console.log(`[INVITE] Sending invites for ${members.length} member(s) to org ${orgId}`);
    const response = await axiosInstance.post(ApiRoutes.organization.invite(orgId), { members });
    
    // Log email send results
    const { sent = [], failed = [], skipped = [] } = response.data || {};
    console.log(`[INVITE-RESULT] ✅ Emails sent: ${sent.length}`, sent);
    if (failed.length > 0) console.log(`[INVITE-RESULT] ❌ Emails failed: ${failed.length}`, failed);
    if (skipped.length > 0) console.log(`[INVITE-RESULT] ⚠️ Emails skipped: ${skipped.length}`, skipped);
    
    return response.data;
  },

  getCollegeFilterOptions: async (orgId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.collegeFilterOptions(orgId)
    );
    return response.data;
  },

  downloadStudentTemplate: async (orgId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.collegeStudentTemplate(orgId),
      { responseType: "blob" }
    );
    return response;
  },

  importCollegeMembers: async (orgId, file, mode = "validate", options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    const { track = false } = options;
    const query = `mode=${mode}${track ? "&track=1" : ""}`;

    const response = await axiosInstance.post(
      `${ApiRoutes.organization.collegeImportMembers(orgId)}?${query}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  getCollegeImportStatus: async (orgId, jobId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.collegeImportStatus(orgId, jobId)
    );
    return response.data;
  },

  getCollegeLeaderboard: async (orgId, params = {}) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.collegeLeaderboard(orgId),
      { params }
    );
    return response.data;
  },

  getCollegeMyRank: async (orgId, params = {}) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.collegeMyRank(orgId),
      { params }
    );
    return response.data;
  },

  getInvites: async (orgId, params = {}) => {
    const response = await axiosInstance.get(ApiRoutes.organization.invites(orgId), { params });
    return response.data;
  },

  revokeInvite: async (orgId, inviteId) => {
    const response = await axiosInstance.delete(ApiRoutes.organization.revokeInvite(orgId, inviteId));
    return response.data;
  },

  // Public
  validateInvite: async (token) => {
    const response = await axiosInstance.get(ApiRoutes.organization.validateInvite(token));
    return response.data;
  },

  // Public
  acceptInvite: async (token, data) => {
    const response = await axiosInstance.post(ApiRoutes.organization.acceptInvite(token), data);
    // Store tokens from response (backend now returns them in body)
    if (response.data?.data?.accessToken) {
      setTokens(response.data.data.accessToken, response.data.data.refreshToken);
    }
    return response.data;
  },

  // ─── Company ─────────────────────────────────────────────────────────────

  downloadCandidateTemplate: async (orgId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.companyCandidateTemplate(orgId),
      { responseType: "blob" }
    );
    return response;
  },

  importCompanyCandidates: async (orgId, file, mode = "validate", options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    const { track = false, deadline } = options;
    if (deadline) formData.append("deadline", String(deadline));

    const query = `mode=${mode}${track ? "&track=1" : ""}`;

    const response = await axiosInstance.post(
      `${ApiRoutes.organization.companyImportCandidates(orgId)}?${query}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  getCompanyImportStatus: async (orgId, jobId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.companyImportStatus(orgId, jobId)
    );
    return response.data;
  },

  getCompanyImportHistory: async (orgId, params = {}) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.companyImportHistory(orgId),
      { params }
    );
    return response.data;
  },

  // ─── Members ─────────────────────────────────────────────────────────────

  getMembers: async (orgId, params = {}) => {
    const response = await axiosInstance.get(ApiRoutes.organization.members(orgId), { params });
    return response.data;
  },

  getMemberDetails: async (orgId, memberId) => {
    const response = await axiosInstance.get(ApiRoutes.organization.memberDetails(orgId, memberId));
    return response.data;
  },

  updateMemberStatus: async (orgId, memberId, status) => {
    const response = await axiosInstance.put(
      ApiRoutes.organization.memberStatus(orgId, memberId),
      { status }
    );
    return response.data;
  },

  removeMember: async (orgId, memberId) => {
    const response = await axiosInstance.delete(ApiRoutes.organization.removeMember(orgId, memberId));
    return response.data;
  },

  // ─── Member Analytics ──────────────────────────────────────────────────

  getMembersAnalytics: async (orgId, params = {}) => {
    const response = await axiosInstance.get(ApiRoutes.organization.membersAnalytics(orgId), { params });
    return response.data;
  },

  getMemberAnalytics: async (orgId, memberId) => {
    const response = await axiosInstance.get(ApiRoutes.organization.memberAnalytics(orgId, memberId));
    return response.data;
  },

  downloadMemberInterviewReport: async (orgId, memberId, sessionId) => {
    const response = await axiosInstance.get(
      ApiRoutes.organization.memberInterviewReportDownload(orgId, memberId, sessionId),
      { responseType: "blob" }
    );
    return response;
  },

  // ─── Team ────────────────────────────────────────────────────────────────

  getTeam: async (orgId) => {
    const response = await axiosInstance.get(ApiRoutes.organization.team(orgId));
    return response.data;
  },

  updateTeamMember: async (orgId, userId, data) => {
    const response = await axiosInstance.put(
      ApiRoutes.organization.updateTeamMember(orgId, userId),
      data
    );
    return response.data;
  },

  removeTeamMember: async (orgId, userId) => {
    const response = await axiosInstance.delete(ApiRoutes.organization.removeTeamMember(orgId, userId));
    return response.data;
  },
};

export default organizationService;
