import { createElement } from "react";

export default function MetricCard({ icon, value, label, helper }) {
  return (
    <article className="app-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/20 text-blue-100">
          {createElement(icon, { size: 18 })}
        </span>
        <span className="text-xs text-[var(--on-surface-muted)]">live</span>
      </div>
      <h3 className="headline-font text-3xl font-bold text-[var(--on-surface)]">
        {value}
      </h3>
      <p className="mt-2 text-sm text-[var(--on-surface-muted)]">{label}</p>
      {helper ? (
        <p className="mt-3 text-xs text-blue-100/80">{helper}</p>
      ) : null}
    </article>
  );
}
