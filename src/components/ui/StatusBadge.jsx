import { statusTheme, titleCase } from "../../lib/format";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${statusTheme(status)}`}
    >
      {titleCase(status)}
    </span>
  );
}
