import React, { useEffect } from "react";

const workspaceTypeLabel = (type) => {
  if (type === "college") return "College";
  if (type === "company") return "Company";
  return "Personal";
};

const workspaceRoleLabel = (workspace) => {
  const role = workspace?.role ? workspace.role.replace(/_/g, " ") : "member";
  return role.replace(/\b\w/g, (char) => char.toUpperCase());
};

const WorkspaceChooserModal = ({
  isOpen,
  workspaces = [],
  activeWorkspaceId = "",
  onSelect,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1.5 rounded-full hover:bg-slate-100 z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 right-8 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.45em] text-emerald-600">
              Workspace Select
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Choose your workspace
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Pick the workspace you want to enter. You can switch later from your profile popup anytime.
            </p>
          </div>
        </div>

        <div className="relative px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {workspaces.map((workspace) => {
              const isActive = workspace.workspaceId === activeWorkspaceId;

              return (
                <button
                  key={workspace.workspaceId}
                  onClick={() => {
                    if (isActive) {
                      onClose?.();
                    } else {
                      onSelect?.(workspace.workspaceId);
                    }
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/50 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]"
                      : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-[0_4px_12px_rgba(16,185,129,0.06)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`truncate text-base font-semibold ${
                          isActive ? "text-slate-900" : "text-slate-800"
                        }`}>
                          {workspace.name}
                        </h3>
                        {isActive && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {workspaceTypeLabel(workspace.type)} workspace
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                      isActive
                        ? "border-emerald-200/60 bg-emerald-500/10 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}>
                      {workspaceRoleLabel(workspace)}
                    </span>
                  </div>

                  {(workspace.requiresPassword || workspace.organization?.name) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      {workspace.requiresPassword && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700 font-medium">
                          Password protected
                        </span>
                      )}
                      {workspace.organization?.name && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
                          {workspace.organization.name}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChooserModal;
