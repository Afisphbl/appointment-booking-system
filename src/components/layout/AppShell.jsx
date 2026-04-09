import {
  Activity,
  Bell,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { createElement } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { getUser } from "../../features/auth/authSelector";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Services", icon: Stethoscope },
  { to: "/booking/new", label: "New Booking", icon: CalendarCheck2 },
  { to: "/history", label: "History", icon: CalendarDays },
  { to: "/availability", label: "Availability", icon: CalendarClock },
  { to: "/bookings", label: "All Bookings", icon: ClipboardList },
];

const mobileNavigation = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/booking/new", label: "Book", icon: CalendarCheck2 },
  { to: "/availability", label: "Shift", icon: CalendarClock },
  { to: "/bookings", label: "Queue", icon: ClipboardList },
  { to: "/history", label: "History", icon: CalendarDays },
];

const pageMeta = [
  {
    path: "/dashboard",
    title: "Admin Portal",
    subtitle: "Your medical concierge dashboard is up to date.",
  },
  {
    path: "/services",
    title: "Services Dashboard",
    subtitle: "Monitor procedure demand, pricing, and operational velocity.",
  },
  {
    path: "/booking/new",
    title: "Booking Appointment",
    subtitle: "Efficiently manage patient flow with precision booking.",
  },
  {
    path: "/history",
    title: "Appointment History",
    subtitle: "Review completed and historical patient interactions.",
  },
  {
    path: "/availability",
    title: "Manage Availability",
    subtitle: "Coordinate specialist schedules in real time.",
  },
  {
    path: "/bookings",
    title: "All Bookings",
    subtitle: "Track every appointment across the clinical network.",
  },
];

function getPageMeta(pathname) {
  const match = pageMeta.find((item) => pathname.startsWith(item.path));

  return (
    match ?? {
      title: "Clinical Precision",
      subtitle: "A calm, high-clarity command center for patient operations.",
    }
  );
}

function SidebarNavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-blue-500/30 text-blue-100 shadow-[0_10px_30px_-20px_rgba(180,197,255,0.75)]"
            : "text-[var(--on-surface-muted)] hover:bg-white/8 hover:text-[var(--on-surface)]",
        ].join(" ")
      }
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/6">
        {createElement(icon, { size: 16 })}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[11px] transition",
          isActive
            ? "bg-blue-500/30 text-blue-100"
            : "text-[var(--on-surface-muted)]",
        ].join(" ")
      }
    >
      {createElement(icon, { size: 15 })}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(getUser);
  console.log(user);
  // const { loading } = useSelector((state) => state.data);s
  const meta = getPageMeta(location.pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <div className="mx-auto flex w-full max-w-[1500px] gap-4 px-3 py-4 md:gap-6 md:px-6 md:py-6">
        <aside className="glass-panel hidden w-72 shrink-0 flex-col p-4 md:flex">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-[var(--primary)] text-white shadow-[0_16px_24px_-14px_rgba(180,197,255,0.75)]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="headline-font text-sm tracking-wide text-white">
                Clinical Precision
              </p>
              <p className="text-xs text-[var(--on-surface-muted)]">
                Medical Concierge
              </p>
            </div>
          </div>

          <nav className="scroll-muted flex flex-1 flex-col gap-1 overflow-auto pr-1">
            {navigation.map((item) => (
              <SidebarNavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="headline-font text-sm text-white">
              Dr. {user?.name ?? "Admin User"}
            </p>
            <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
              {user?.title ?? "Clinical Operations"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-[var(--on-surface)] transition hover:bg-white/10"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-panel mb-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
            <div>
              <p className="headline-font text-2xl font-semibold text-white md:text-3xl">
                {meta.title}
              </p>
              <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
                {meta.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/booking/new"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--primary-container)] to-[var(--primary)] px-4 py-2 text-xs font-semibold text-[#00174b] transition hover:brightness-105"
              >
                <CalendarCheck2 size={14} />
                Create Appointment
              </Link>

              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/8 text-[var(--on-surface-muted)]">
                <Bell size={16} />
              </span>

              <span className="hidden h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/8 text-[var(--on-surface-muted)] sm:inline-flex">
                <Activity size={16} />
              </span>
            </div>
          </header>

          {/* {loading ? (
            <div className="mb-4 overflow-hidden rounded-full border border-blue-300/30 bg-blue-900/20">
              <div className="h-1.5 w-2/3 animate-pulse bg-gradient-to-r from-blue-500 to-[var(--primary)]" />
            </div>
          ) : null} */}

          <div className="min-h-[70vh] page-enter">
            <Outlet />
          </div>
        </div>
      </div>

      <nav className="glass-panel fixed bottom-3 left-1/2 z-30 flex w-[min(94vw,560px)] -translate-x-1/2 items-center gap-1 px-2 py-1 md:hidden">
        {mobileNavigation.map((item) => (
          <MobileNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
    </div>
  );
}
