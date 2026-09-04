const FIELDS: Array<[string, string, boolean?]> = [
  ["BIN", "3021458"],
  ["Block / Lot", "987 / 34"],
  ["Borough", "Brooklyn"],
  ["Job type", "ALT-2"],
  ["Work on floor(s)", "2, 3"],
  ["Proposed use", "R-2"],
];

export default function FilingCard({ className = "", full = false }: { className?: string; full?: boolean }) {
  const fields = full
    ? [...FIELDS, ["Applicant of record", "on file", true], ["Estimated cost", "not stated on filing", true]]
    : FIELDS;

  return (
    <div className={`relative rounded-md border border-hairline-strong bg-surface p-6 shadow-e2 ${className}`}>
      <span className="absolute -top-3 left-6 rounded-sm border border-amber/30 bg-amber-bg px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide text-amber">
        Sample filing · for illustration
      </span>
      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-3 font-mono text-sm sm:grid-cols-2">
        {fields.map(([k, v, empty]) => (
          <div key={k as string} className="flex flex-col gap-0.5 border-b border-dashed border-hairline-strong pb-2">
            <span className="text-xs tracking-wide text-ink-soft">{k}</span>
            <span className={empty ? "italic text-ink-soft" : "text-ink"}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
