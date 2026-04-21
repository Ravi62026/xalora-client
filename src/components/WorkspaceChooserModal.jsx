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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-gray-950 via-slate-950 to-black shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 right-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative border-b border-emerald-500/15 px-5 py-4 sm:px-6">
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.45em] text-emerald-400/80">
              Workspace Select
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Choose your workspace
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">
              Pick the workspace you want to enter. You can switch later from your profile popup anytime.
            </p>
          </div>
        </div>

        <div className="relative px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {workspaces.slice(0, 3).map((workspace) => {
              const isActive = workspace.workspaceId === activeWorkspaceId;

              return (
                <button
                  key={workspace.workspaceId}
                  onClick={() => onSelect?.(workspace.workspaceId)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    isActive
                      ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_0_1px_rgba(52,211,153,0.15)]"
                      : "border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-white">
                          {workspace.name}
                        </h3>
                        {isActive && (
                          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-400">
                        {workspaceTypeLabel(workspace.type)} workspace
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                      {workspaceRoleLabel(workspace)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-300">
                    {workspace.requiresPassword && (
                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-amber-300">
                        Password protected
                      </span>
                    )}
                    {workspace.organization?.name && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-gray-300">
                        {workspace.organization.name}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            <button
              onClick={onClose}
              className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-left transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-500/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-white">
                    Stay here
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Keep the current workspace and close this popup.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                  Current
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChooserModal;
