const BASE_CLS =
  "w-full rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors";

function cntColor(len: number, max: number) {
  const r = len / max;
  if (r >= 1) return "text-red-500";
  if (r >= 0.8) return "text-orange-400";
  return "text-(--muted)";
}

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-(--muted)">{label}</label>
      {multiline ? (
        <div className="relative">
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`${BASE_CLS} resize-none${maxLength ? " pb-5" : ""}`}
          />
          {maxLength && (
            <span className={`pointer-events-none absolute bottom-2 right-3 text-[10px] ${cntColor(value.length, maxLength)}`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`${BASE_CLS}${maxLength ? " pr-12" : ""}`}
          />
          {maxLength && (
            <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] ${cntColor(value.length, maxLength)}`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
