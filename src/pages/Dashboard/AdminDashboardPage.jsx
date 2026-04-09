import {
  ArrowRight,
  CalendarRange,
  Clock3,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import store from "../../app/store";
import MetricCard from "../../components/ui/MetricCard";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  fetchInitialData,
  selectDashboardMetrics,
  selectUpcomingBookings,
} from "../../features/data/dataSlice";
import { formatTime } from "../../lib/format";
import {
  getAvailability,
  getInsights,
  getStaff,
} from "../../features/data/dataSelector";

export default function AdminDashboardPage() {
  const metrics = useSelector(selectDashboardMetrics);
  const upcomingBookings = useSelector(selectUpcomingBookings);
  const availability = useSelector(getAvailability);
  const staff = useSelector(getStaff);
  const insights = useSelector(getInsights);

  const activeSpecialists = availability.filter(
    (slot) => slot.isAvailable,
  ).length;
  const insight = insights[0];

  return (
    <section className="space-y-5">
      <div className="reveal-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarRange}
          value={metrics.bookingsToday}
          label="Bookings Today"
          helper="Across all treatment rooms"
        />
        <MetricCard
          icon={UsersRound}
          value={activeSpecialists}
          label="Available Specialists"
          helper={`${staff.length} clinicians in network`}
        />
        <MetricCard
          icon={Clock3}
          value={`${metrics.averageWait}m`}
          label="Avg. Wait Time"
          helper="Patient queue in healthy range"
        />
        <MetricCard
          icon={Sparkles}
          value="98.4%"
          label="System Performance"
          helper="Uptime & flow efficiency"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="headline-font text-xl font-semibold text-white">
                Upcoming Consultations
              </h2>
              <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                View schedule AM
              </p>
            </div>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-[var(--on-surface-muted)] transition hover:bg-white/10"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="reveal-stagger grid gap-3">
            {upcomingBookings.slice(0, 5).map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-white/10 bg-black/15 px-4 py-3 transition hover:bg-black/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="headline-font text-base font-semibold text-white">
                      {booking.patientName}
                    </p>
                    <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                      {booking.serviceName} • {booking.room}
                    </p>
                    <p className="mt-2 text-xs text-blue-100">
                      Dr. {booking.doctorName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-[var(--on-surface-muted)]">
                      {formatTime(booking.appointmentAt)}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </article>
            ))}

            {!upcomingBookings.length ? (
              <p className="rounded-xl border border-dashed border-white/20 px-4 py-6 text-center text-sm text-[var(--on-surface-muted)]">
                No upcoming consultations yet.
              </p>
            ) : null}
          </div>
        </article>

        <div className="grid gap-4">
          <article className="app-card p-5">
            <h3 className="headline-font text-lg font-semibold text-white">
              Create New Appointment
            </h3>
            <p className="mt-2 text-sm text-[var(--on-surface-muted)]">
              Efficiently manage patient flow with precision booking.
            </p>
            <Link
              to="/booking/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--primary-container)] to-[var(--primary)] px-4 py-2 text-xs font-semibold text-[#00174b]"
            >
              Launch Scheduler
            </Link>
          </article>

          <article className="app-card p-5">
            <h3 className="headline-font text-lg font-semibold text-white">
              Staff Availability
            </h3>
            <p className="mt-3 text-sm text-[var(--on-surface-muted)]">
              Cardiology Ward {Math.max(1, Math.round(activeSpecialists / 2))}{" "}
              specialists
            </p>
            <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
              General Surgery{" "}
              {Math.max(1, staff.length - Math.round(activeSpecialists / 2))}{" "}
              specialists
            </p>
            <Link
              to="/availability"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-[var(--on-surface-muted)] transition hover:bg-white/10"
            >
              Manage Shifts
            </Link>
          </article>

          <article className="app-card p-5">
            <h3 className="headline-font text-lg font-semibold text-white">
              Precision Insights
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--on-surface-muted)]">
              {insight?.message ??
                "System has detected a measurable increase in surgical recovery rates since the last protocol update."}
            </p>
            <p className="mt-3 text-xs text-blue-100">
              {insight?.summary ?? "View full analytics for details."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export async function loader() {
  const { data } = store.getState();

  if (!data.hasLoaded && !data.loading) {
    await store.dispatch(fetchInitialData()).unwrap();
  }

  return null;
}
