import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  selectFilteredBookings,
  setBookingQuery,
  setBookingStatusFilter,
  updateBookingStatus,
} from "../../features/data/dataSlice";
import { formatDateTime } from "../../lib/format";

const statuses = ["all", "confirmed", "pending", "completed", "cancelled"];
const PAGE_SIZE = 8;

export default function AllBookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector(selectFilteredBookings);
  const query = useSelector((state) => state.data.filters.query);
  const statusFilter = useSelector((state) => state.data.filters.status);
  const [page, setPage] = useState(1);
  const [updatingIds, setUpdatingIds] = useState(() => new Set());

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  // Reset to page 1 if filter changes shrink the list
  const safePage = Math.min(page, totalPages);
  const paginated = bookings.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleQuery = (value) => {
    dispatch(setBookingQuery(value));
    setPage(1);
  };

  const handleStatus = (value) => {
    dispatch(setBookingStatusFilter(value));
    setPage(1);
  };

  const changeStatus = async (id, status) => {
    setUpdatingIds((previous) => {
      const next = new Set(previous);
      next.add(id);
      return next;
    });

    try {
      await dispatch(updateBookingStatus({ id, status })).unwrap();
    } finally {
      setUpdatingIds((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <section className="page-enter space-y-4">
      <article className="app-card p-5">
        {/* ── Header ── */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="headline-font text-xl font-semibold text-white">
              All Bookings
            </h2>
            <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
              Search, filter, and update booking states in real time.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {/* Search */}
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Search bookings</span>
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-muted)]"
              />
              <input
                type="text"
                aria-label="Search bookings"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                placeholder="Search patient, doctor, service…"
                className="field-input pl-9"
              />
            </label>

            {/* Status filter */}
            <select
              aria-label="Filter bookings by status"
              value={statusFilter}
              onChange={(e) => handleStatus(e.target.value)}
              className="field-select"
            >
              {statuses.map((s) => (
                <option key={s} className="bg-slate-900" value={s}>
                  {s === "all"
                    ? "All statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden overflow-hidden rounded-xl border border-white/10 lg:block">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-black/30 text-left text-xs uppercase tracking-wide text-[var(--on-surface-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-white/10 bg-black/15 transition hover:bg-white/4"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">
                      {booking.patientName}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--on-surface-muted)]">
                      Dr. {booking.doctorName}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--on-surface-muted)]">
                    {booking.serviceName}
                  </td>
                  <td className="px-4 py-3 text-[var(--on-surface-muted)]">
                    {formatDateTime(booking.appointmentAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <ActionBtn
                        color="blue"
                        label="Confirm"
                        disabled={updatingIds.has(booking.id)}
                        onClick={() => changeStatus(booking.id, "confirmed")}
                      />
                      <ActionBtn
                        color="emerald"
                        label="Complete"
                        disabled={updatingIds.has(booking.id)}
                        onClick={() => changeStatus(booking.id, "completed")}
                      />
                      <ActionBtn
                        color="rose"
                        label="Cancel"
                        disabled={updatingIds.has(booking.id)}
                        onClick={() => changeStatus(booking.id, "cancelled")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="grid gap-3 lg:hidden">
          {paginated.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-black/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="headline-font text-base font-semibold text-white">
                    {booking.patientName}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--on-surface-muted)]">
                    {booking.serviceName}
                  </p>
                  <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
                    Dr. {booking.doctorName}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-2 text-xs text-blue-200/70">
                {formatDateTime(booking.appointmentAt)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <ActionBtn
                  color="blue"
                  label="Confirm"
                  disabled={updatingIds.has(booking.id)}
                  onClick={() => changeStatus(booking.id, "confirmed")}
                />
                <ActionBtn
                  color="emerald"
                  label="Complete"
                  disabled={updatingIds.has(booking.id)}
                  onClick={() => changeStatus(booking.id, "completed")}
                />
                <ActionBtn
                  color="rose"
                  label="Cancel"
                  disabled={updatingIds.has(booking.id)}
                  onClick={() => changeStatus(booking.id, "cancelled")}
                />
              </div>
            </article>
          ))}
        </div>

        {/* ── Empty state ── */}
        {!bookings.length && (
          <p className="mt-4 rounded-xl border border-dashed border-white/20 px-4 py-10 text-center text-sm text-[var(--on-surface-muted)]">
            No bookings match your current filter.
          </p>
        )}

        {/* ── Pagination ── */}
        <div className="mt-2 flex items-center justify-between text-xs text-[var(--on-surface-muted)]">
          <span>
            Showing {bookings.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}
            –{Math.min(safePage * PAGE_SIZE, bookings.length)} of{" "}
            {bookings.length}
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

function ActionBtn({ color, label, onClick, disabled = false }) {
  const colors = {
    blue: "border-blue-300/30 bg-blue-500/15 text-blue-100 hover:bg-blue-500/30",
    emerald:
      "border-emerald-300/30 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/30",
    rose: "border-rose-300/30 bg-rose-500/15 text-rose-100 hover:bg-rose-500/30",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${colors[color]}`}
    >
      {label}
    </button>
  );
}
