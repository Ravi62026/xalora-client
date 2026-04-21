const PRIVILEGED_ROLES = new Set(["super_admin", "admin", "manager", "viewer"]);

export const getActiveWorkspace = (user) =>
  user?.activeWorkspace ||
  user?.workspaces?.find((workspace) => workspace?.isActive) ||
  null;

export const getActiveOrganizationWorkspace = (user) => {
  const workspace = getActiveWorkspace(user);
  return workspace?.organization ? workspace : null;
};

export const getActiveOrganizationId = (user) =>
  getActiveOrganizationWorkspace(user)?.organization?._id || null;

export const isPrivilegedWorkspace = (workspace) =>
  PRIVILEGED_ROLES.has(String(workspace?.role || ""));

export const isCompanyCandidateWorkspace = (workspace) =>
  workspace?.type === "company" &&
  Array.isArray(workspace?.interviewRounds) &&
  workspace.interviewRounds.length > 0;

export const isCollegeWorkspace = (workspace) => workspace?.type === "college";

export const getDashboardRouteForUser = (user) => {
  const workspace = getActiveWorkspace(user);

  if (!workspace?.organization) {
    return "/dashboard";
  }

  if (workspace.role === "super_admin") {
    return "/org/dashboard";
  }

  if (PRIVILEGED_ROLES.has(String(workspace.role || "")) || user?.userType === "org_team") {
    return "/org/teamdashboard";
  }

  if (workspace.type === "college") {
    return "/org/student/dashboard";
  }

  return "/dashboard";
};
