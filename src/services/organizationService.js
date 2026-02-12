import axiosInstance from "../utils/axios";
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
    const response = await axiosInstance.post(ApiRoutes.organization.invite(orgId), { members });
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
