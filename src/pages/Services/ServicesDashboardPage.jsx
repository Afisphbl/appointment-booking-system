import { Activity, DollarSign, Flame, Stethoscope } from "lucide-react";
import { createElement } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../lib/format";
import { getBookings, getServices } from "../../features/data/dataSelector";

function ServiceStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-3">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-100">
        {createElement(icon, { size: 15 })}
      </div>
      <p className="text-xs text-[var(--on-surface-muted)]">{label}</p>
      <p className="headline-font mt-1 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

export default function ServicesDashboardPage() {
  const services = useSelector(getServices);
  const bookings = useSelector(getBookings);

  const serviceMetrics = useMemo(() => {
    return services
      .map((service) => {
        const linkedBookings = bookings.filter(
          (booking) => booking.serviceId === service.id,
        );
        const completed = linkedBookings.filter(
          (booking) => booking.status === "completed",
        ).length;
        const load = Math.min(
          100,
          Math.round(
            (linkedBookings.length /
              Math.max(service.capacityPerDay ?? 10, 1)) *
              100,
          ),
        );

        return {
          ...service,
          bookingsCount: linkedBookings.length,
          completed,
          load,
        };
      })
      .sort((a, b) => b.bookingsCount - a.bookingsCount);
  }, [bookings, services]);

  const totalRevenue = serviceMetrics.reduce(
    (total, service) =>
      total + service.price * Math.max(service.bookingsCount, 1),
    0,
  );

  return (
    <section className="space-y-5">
      <div className="reveal-stagger grid gap-4 md:grid-cols-3">
        <ServiceStat
          icon={Stethoscope}
          label="Services Active"
          value={serviceMetrics.length}
        />
        <ServiceStat
          icon={Activity}
          label="Total Procedures"
          value={bookings.length}
        />
        <ServiceStat
          icon={DollarSign}
          label="Projected Revenue"
          value={formatCurrency(totalRevenue)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="headline-font text-xl font-semibold text-white">
                Service Mix
              </h2>
              <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                Monitor throughput and utilization by specialization.
              </p>
            </div>
          </div>

          <div className="reveal-stagger grid gap-3">
            {serviceMetrics.map((service) => (
              <article
                key={service.id}
                className="rounded-xl border border-white/10 bg-black/15 px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="headline-font text-base font-semibold text-white">
                      {service.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                      {service.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--on-surface-muted)]">
                      Price
                    </p>
                    <p className="headline-font text-base font-semibold text-blue-100">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[var(--on-surface-muted)]">
                      Bookings
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {service.bookingsCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--on-surface-muted)]">
                      Completed
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {service.completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--on-surface-muted)]">
                      Duration
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {service.durationMinutes} min
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-[var(--on-surface-muted)]">
                    <span>Capacity load</span>
                    <span>{service.load}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-900/70">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--primary-container)] to-[var(--primary)]"
                      style={{ width: `${service.load}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}

            {!serviceMetrics.length ? (
              <p className="rounded-xl border border-dashed border-white/20 px-4 py-6 text-center text-sm text-[var(--on-surface-muted)]">
                Service data will appear once json-server is running.
              </p>
            ) : null}
          </div>
        </article>

        <article className="app-card p-5">
          <h2 className="headline-font text-xl font-semibold text-white">
            Top Demand Signals
          </h2>
          <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
            Most requested services this week.
          </p>

          <div className="reveal-stagger mt-4 grid gap-3">
            {serviceMetrics.slice(0, 5).map((service, index) => (
              <article
                key={service.id}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="headline-font text-sm font-semibold text-white">
                    {index + 1}. {service.name}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-orange-100">
                    <Flame size={13} />
                    {service.bookingsCount}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
                  {service.department}
                </p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
