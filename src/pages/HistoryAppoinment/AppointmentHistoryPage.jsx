import { CalendarCheck, Clock3 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import { selectHistoryBookings } from "../../features/data/dataSlice";
import { formatDateTime } from "../../lib/format";

const PAGE_SIZE = 10;

export default function AppointmentHistoryPage() {
  const history = useSelector(selectHistoryBookings);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = history.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <section className="page-enter space-y-4">
      <article className="app-card p-5">
        <h2 className="headline-font text-xl font-semibold text-white">
          Appointment Timeline
        </h2>
        <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
          Completed, cancelled, and past consultations sorted by recency.
        </p>

        <div className="mt-4 space-y-3">
          {paginated.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-black/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="headline-font text-base font-semibold text-white">
                    {booking.patientName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                    {booking.serviceName} with Dr. {booking.doctorName}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-blue-200/80">
                    <CalendarCheck size={13} />
                    {formatDateTime(booking.appointmentAt)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={booking.status} />
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--on-surface-muted)]">
                    <Clock3 size={12} />
                    {booking.mode === "virtual" ? "Virtual" : booking.room}
                  </span>
                </div>
              </div>

              {booking.notes ? (
                <p className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-[var(--on-surface-muted)]">
                  {booking.notes}
                </p>
              ) : null}
            </article>
          ))}

          {!history.length && (
            <p className="rounded-xl border border-dashed border-white/20 px-4 py-10 text-center text-sm text-[var(--on-surface-muted)]">
              No historical appointments found yet.
            </p>
          )}
        </div>

        {/* ── Pagination ── */}
        <div className="mt-4 flex items-center justify-between text-xs text-[var(--on-surface-muted)]">
          <span>
            Showing {history.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, history.length)} of {history.length}
          </span>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </article>
    </section>
  );
}
