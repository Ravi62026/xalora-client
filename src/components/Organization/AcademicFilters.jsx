const selectClass =
  "rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500";

export default function AcademicFilters({
  degreeTypes = [],
  degreeTypeValue = "",
  programValue = "",
  onDegreeTypeChange,
  onProgramChange,
  degreePlaceholder = "All Degree Types",
  programPlaceholder = "All Programs",
}) {
  const selectedDegreeType = degreeTypes.find(
    (entry) => entry.value === degreeTypeValue
  );
  const programs = selectedDegreeType
    ? selectedDegreeType.programs || []
    : degreeTypes.flatMap((entry) => entry.programs || []);

  const uniquePrograms = Array.from(
    new Map(programs.map((program) => [program.value, program])).values()
  );

  return (
    <>
      <select
        value={degreeTypeValue}
        onChange={(event) => onDegreeTypeChange?.(event.target.value)}
        className={selectClass}
      >
        <option value="">{degreePlaceholder}</option>
        {degreeTypes.map((degreeType) => (
          <option key={degreeType.value} value={degreeType.value}>
            {degreeType.label}
            {typeof degreeType.count === "number" ? ` (${degreeType.count})` : ""}
          </option>
        ))}
      </select>

      <select
        value={programValue}
        onChange={(event) => onProgramChange?.(event.target.value)}
        className={selectClass}
      >
        <option value="">{programPlaceholder}</option>
        {uniquePrograms.map((program) => (
          <option key={program.value} value={program.value}>
            {program.label}
            {typeof program.count === "number" ? ` (${program.count})` : ""}
          </option>
        ))}
      </select>
    </>
  );
}
