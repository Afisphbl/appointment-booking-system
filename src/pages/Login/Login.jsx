import { Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

const ROLE_CONFIG = {
  admin: {
    email: "julian.vance@clinic-booking.com",
    label: "Admin",
    description: "Full access to dashboard, bookings, availability & settings.",
    icon: ShieldCheck,
  },
  user: {
    email: "sarah.jones@clinic-booking.com",
    label: "User",
    description: "Browse services, view history, and create appointments.",
    icon: User,
  },
};

function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState(ROLE_CONFIG.admin.email);

  function handleRoleChange(key) {
    setRole(key);
    setEmail(ROLE_CONFIG[key].email);
  }

  function handleEmailChange(value) {
    setEmail(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const cfg = ROLE_CONFIG[role];
  const RoleIcon = cfg.icon;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_15%,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(180,197,255,0.18),transparent_30%)]" />
      <section className="glass-panel page-enter p-6 sm:p-8">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary-light to-primary text-[#00174b]">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="headline-font text-xl font-semibold text-white">
              Welcome Back
            </p>
            <p className="text-sm text-text-muted">
              Select your role and sign in to continue.
            </p>
          </div>
        </div>

        {/* ── Role tabs ── */}
        <div
          className="mb-5 grid grid-cols-2 gap-2"
          role="group"
          aria-label="Login role"
        >
          {Object.entries(ROLE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const active = role === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRoleChange(key)}
                className={[
                  "flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition",
                  active
                    ? "border-blue-400/40 bg-blue-500/20 text-white"
                    : "border-white/10 bg-black/20 text-text-muted hover:bg-white/8 hover:text-white",
                ].join(" ")}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Icon size={14} />
                  {config.label}
                </span>
                <span className="text-xs leading-4 opacity-75">
                  {config.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Form ── */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-text-muted" htmlFor="email">
            Email Address
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2.5">
              <Mail size={16} className="shrink-0 text-blue-100" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                autoComplete="email"
                className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                placeholder={cfg.email}
              />
            </span>
          </label>

          {/* Hidden role field — controlled by tab buttons */}
          <div className="block text-sm text-text-muted">
            Access Role
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2.5">
              <Lock size={16} className="shrink-0 text-blue-100" />
              <span
                aria-live="polite"
                className="inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                <RoleIcon size={14} />
                {cfg.label}
              </span>
            </span>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--primary-container)] to-[var(--primary)] px-4 py-3 text-sm font-semibold text-[#00174b] transition hover:brightness-110 active:scale-[0.98]"
          >
            <RoleIcon size={15} />
            Sign in as {cfg.label}
          </button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-text-muted">
          <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            🔐 Verified Access
          </p>
          <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            🛡️ HIPAA Compliant
          </p>
          <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            📋 Audit Logged
          </p>
          <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            🔒 Secure Session
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
