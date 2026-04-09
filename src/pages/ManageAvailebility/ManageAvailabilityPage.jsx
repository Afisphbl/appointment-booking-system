import { CheckCircle2, CircleX, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvailabilityStatus } from "../../features/data/dataSlice";

export default function ManageAvailabilityPage() {
  const dispatch = useDispatch();
  const availability = useSelector((state) => state.data.availability);
  const staff = useSelector((state) => state.data.staff);
  const [updatingIds, setUpdatingIds] = useState(() => new Set());
  const staffById = Object.fromEntries(
    staff.map((member) => [member.id, member]),
  );
  const availableCount = availability.filter((slot) => slot.isAvailable).length;

  const toggleAvailability = async (slot) => {
    setUpdatingIds((previous) => {
      const next = new Set(previous);
      next.add(slot.id);
      return next;
    });

    try {
      await dispatch(
        updateAvailabilityStatus({
          id: slot.id,
          isAvailable: !slot.isAvailable,
        }),
      ).unwrap();
    } finally {
      setUpdatingIds((previous) => {
        const next = new Set(previous);
        next.delete(slot.id);
        return next;
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="app-card p-4">
          <p className="text-xs text-[var(--on-surface-muted)]">
            Available Specialists
          </p>
          <p className="headline-font mt-2 text-3xl font-bold text-white">
            {availableCount}
          </p>
        </article>
        <article className="app-card p-4">
          <p className="text-xs text-[var(--on-surface-muted)]">On Standby</p>
          <p className="headline-font mt-2 text-3xl font-bold text-white">
            {availability.length - availableCount}
          </p>
        </article>
        <article className="app-card p-4">
          <p className="text-xs text-[var(--on-surface-muted)]">
            Total Shift Blocks
          </p>
          <p className="headline-font mt-2 text-3xl font-bold text-white">
            {availability.length}
          </p>
        </article>
      </div>

      <article className="app-card p-5">
        <h2 className="headline-font text-xl font-semibold text-white">
          Staff Availability Matrix
        </h2>
        <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
          Align staffing coverage by day, shift, and specialization.
        </p>

        <div className="reveal-stagger mt-4 grid gap-3">
          {availability.map((slot) => {
            const member = staffById[slot.staffId];

            return (
              <article
                key={slot.id}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-black/28"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="headline-font text-base font-semibold text-white">
                      Dr. {member?.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                      {member?.specialty} • {slot.day} • {slot.shiftStart} -{" "}
                      {slot.shiftEnd}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        slot.isAvailable
                          ? "border-emerald-300/35 bg-emerald-500/15 text-emerald-100"
                          : "border-rose-300/35 bg-rose-500/15 text-rose-100",
                      ].join(" ")}
                    >
                      {slot.isAvailable ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <CircleX size={12} />
                      )}
                      {slot.isAvailable ? "Available" : "Unavailable"}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleAvailability(slot)}
                      disabled={updatingIds.has(slot.id)}
                      className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-[var(--on-surface-muted)] transition hover:bg-white/10 disabled:opacity-60"
                    >
                      {updatingIds.has(slot.id)
                        ? "Updating..."
                        : slot.isAvailable
                          ? "Mark Unavailable"
                          : "Mark Available"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {!availability.length ? (
            <p className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-8 text-sm text-[var(--on-surface-muted)]">
              <ShieldAlert size={16} />
              No availability data available.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  );
}
