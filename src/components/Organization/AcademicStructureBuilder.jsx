import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const inputClass =
  "w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all";

const normalize = (value = "") => value.trim().toLowerCase();
const createDegreeType = () => ({
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `degree-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: "",
  programs: [],
});

export default function AcademicStructureBuilder({ value = [], onChange }) {
  const updateDegreeType = (index, updates) => {
    onChange(
      value.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...updates } : entry
      )
    );
  };

  const addDegreeType = () => {
    onChange([...value, createDegreeType()]);
  };

  const removeDegreeType = (index) => {
    onChange(value.filter((_, entryIndex) => entryIndex !== index));
  };

  const addProgram = (degreeIndex, programLabel) => {
    const cleaned = programLabel.trim();
    if (!cleaned) return;

    const degreeType = value[degreeIndex];
    if (
      degreeType.programs.some(
        (existingProgram) => normalize(existingProgram) === normalize(cleaned)
      )
    ) {
      return;
    }

    updateDegreeType(degreeIndex, {
      programs: [...degreeType.programs, cleaned],
    });
  };

  const removeProgram = (degreeIndex, programIndex) => {
    updateDegreeType(degreeIndex, {
      programs: value[degreeIndex].programs.filter(
        (_, currentProgramIndex) => currentProgramIndex !== programIndex
      ),
    });
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-4 text-sm text-gray-400">
          Add degree types and the programs available under each one.
        </div>
      )}

      {value.map((degreeType, degreeIndex) => (
        <DegreeTypeCard
          key={degreeType.id || `degree-${degreeIndex}`}
          degreeType={degreeType}
          onChange={(updates) => updateDegreeType(degreeIndex, updates)}
          onAddProgram={(programLabel) => addProgram(degreeIndex, programLabel)}
          onRemoveProgram={(programIndex) =>
            removeProgram(degreeIndex, programIndex)
          }
          onRemove={() => removeDegreeType(degreeIndex)}
          canRemove={value.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={addDegreeType}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
      >
        <Plus className="h-4 w-4" />
        Add Degree Type
      </button>
    </div>
  );
}

function DegreeTypeCard({
  degreeType,
  onChange,
  onAddProgram,
  onRemoveProgram,
  onRemove,
  canRemove,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center gap-3">
        <input
          value={degreeType.label}
          onChange={(event) => onChange({ label: event.target.value })}
          placeholder="Degree type, e.g. BTech or MTech"
          className={inputClass}
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="rounded-lg border border-gray-700 p-2 text-gray-400 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Remove degree type"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ProgramEditor
        programs={degreeType.programs}
        onAddProgram={onAddProgram}
        onRemoveProgram={onRemoveProgram}
      />
    </div>
  );
}

function ProgramEditor({ programs, onAddProgram, onRemoveProgram }) {
  return (
    <div className="space-y-3">
      <ProgramInput onAddProgram={onAddProgram} />

      <div className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-3">
        {programs.length === 0 ? (
          <span className="text-xs text-gray-500">
            No programs added yet
          </span>
        ) : (
          programs.map((program, programIndex) => (
            <span
              key={`${program}-${programIndex}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-200"
            >
              {program}
              <button
                type="button"
                onClick={() => onRemoveProgram(programIndex)}
                className="text-gray-500 transition-colors hover:text-red-300"
                aria-label={`Remove ${program}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function ProgramInput({ onAddProgram }) {
  const [programLabel, setProgramLabel] = useState("");

  return (
    <div className="flex gap-2">
      <input
        value={programLabel}
        onChange={(event) => setProgramLabel(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAddProgram(programLabel);
            setProgramLabel("");
          }
        }}
        placeholder="Program, e.g. Computer Science or AI ML"
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => {
          onAddProgram(programLabel);
          setProgramLabel("");
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    </div>
  );
}
