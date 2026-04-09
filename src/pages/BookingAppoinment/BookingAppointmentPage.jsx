import { CircleAlert, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../features/data/dataSlice";
import {
  getLoading,
  getPatients,
  getServices,
  getStaff,
} from "../../features/data/dataSelector";

function getDefaultAppointmentAt() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  );
  return localDate.toISOString().slice(0, 16);
}

export default function BookingAppointmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patients = useSelector(getPatients);
  const staff = useSelector(getStaff);
  const services = useSelector(getServices);
  const loading = useSelector(getLoading);

  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    patientId: "",
    doctorId: "",
    serviceId: "",
    appointmentAt: getDefaultAppointmentAt(),
    mode: "in-person",
    priority: "routine",
    room: "Room 402",
    notes: "",
  }));

  const effectivePatientId = Number(form.patientId || patients[0]?.id || 0);
  const effectiveDoctorId = Number(form.doctorId || staff[0]?.id || 0);
  const effectiveServiceId = Number(form.serviceId || services[0]?.id || 0);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === effectivePatientId),
    [effectivePatientId, patients],
  );
  const selectedDoctor = useMemo(
    () => staff.find((member) => member.id === effectiveDoctorId),
    [effectiveDoctorId, staff],
  );
  const selectedService = useMemo(
    () => services.find((service) => service.id === effectiveServiceId),
    [effectiveServiceId, services],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedPatient || !selectedDoctor || !selectedService) {
      setError("Please select patient, doctor, and service details.");
      return;
    }

    const appointmentDate = new Date(form.appointmentAt);
    if (Number.isNaN(appointmentDate.getTime())) {
      setError("Please select a valid date and time for the appointment.");
      return;
    }

    const payload = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      appointmentAt: appointmentDate.toISOString(),
      mode: form.mode,
      priority: form.priority,
      room: form.mode === "virtual" ? "Virtual Room" : form.room,
      status: "confirmed",
      estimatedWaitMinutes: Math.max(
        6,
        Math.round(selectedService.durationMinutes / 5),
      ),
      createdAt: new Date().toISOString(),
      notes: form.notes.trim(),
    };

    try {
      await dispatch(createBooking(payload)).unwrap();
      navigate("/bookings");
    } catch {
      setError(
        "Could not create booking. Ensure json-server is running on port 4000.",
      );
    }
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="app-card p-5">
        <h2 className="headline-font text-xl font-semibold text-white">
          Create New Appointment
        </h2>
        <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
          Assign clinician, service, and schedule details in one step.
        </p>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="patientId"
            >
              Patient
              <select
                id="patientId"
                name="patientId"
                value={effectivePatientId ? String(effectivePatientId) : ""}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              >
                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                    className="bg-slate-900"
                  >
                    {patient.fullName}
                  </option>
                ))}
              </select>
            </label>

            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="doctorId"
            >
              Assigned Doctor
              <select
                id="doctorId"
                name="doctorId"
                value={effectiveDoctorId ? String(effectiveDoctorId) : ""}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              >
                {staff.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                    className="bg-slate-900"
                  >
                    Dr. {member.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="serviceId"
            >
              Service
              <select
                id="serviceId"
                name="serviceId"
                value={effectiveServiceId ? String(effectiveServiceId) : ""}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              >
                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                    className="bg-slate-900"
                  >
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="appointmentAt"
            >
              Date &amp; Time
              <input
                id="appointmentAt"
                name="appointmentAt"
                type="datetime-local"
                value={form.appointmentAt}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="mode"
            >
              Consultation Mode
              <select
                id="mode"
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              >
                <option className="bg-slate-900" value="in-person">
                  In-Person
                </option>
                <option className="bg-slate-900" value="virtual">
                  Virtual
                </option>
              </select>
            </label>

            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="priority"
            >
              Priority
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none"
              >
                <option className="bg-slate-900" value="routine">
                  Routine
                </option>
                <option className="bg-slate-900" value="urgent">
                  Urgent
                </option>
              </select>
            </label>

            <label
              className="text-sm text-[var(--on-surface-muted)]"
              htmlFor="room"
            >
              Room
              <input
                id="room"
                name="room"
                type="text"
                value={form.room}
                onChange={handleChange}
                disabled={form.mode === "virtual"}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none disabled:opacity-60"
              />
            </label>
          </div>

          <label
            className="text-sm text-[var(--on-surface-muted)]"
            htmlFor="notes"
          >
            Booking Notes
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add triage notes, required preparation, or follow-up context."
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
            />
          </label>

          {error ? (
            <p className="inline-flex items-center gap-2 rounded-lg border border-rose-300/35 bg-rose-500/12 px-3 py-2 text-sm text-rose-100">
              <CircleAlert size={14} />
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--primary-container)] to-[var(--primary)] px-4 py-3 text-sm font-semibold text-[#00174b] disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Appointment"}
          </button>
        </form>
      </article>

      <article className="app-card p-5">
        <h2 className="headline-font text-xl font-semibold text-white">
          Booking Preview
        </h2>
        <p className="mt-1 text-sm text-[var(--on-surface-muted)]">
          Review your selected clinical context.
        </p>

        <div className="reveal-stagger mt-5 grid gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs text-[var(--on-surface-muted)]">Patient</p>
            <p className="mt-1 headline-font text-base font-semibold text-white">
              {selectedPatient?.fullName ?? "Select patient"}
            </p>
            <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
              MRN: {selectedPatient?.mrn ?? "---"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs text-[var(--on-surface-muted)]">Doctor</p>
            <p className="mt-1 headline-font text-base font-semibold text-white">
              Dr. {selectedDoctor?.name ?? "Select doctor"}
            </p>
            <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
              {selectedDoctor?.specialty ?? "Specialty pending"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs text-[var(--on-surface-muted)]">Service</p>
            <p className="mt-1 headline-font text-base font-semibold text-white">
              {selectedService?.name ?? "Select service"}
            </p>
            <p className="mt-1 text-xs text-[var(--on-surface-muted)]">
              Duration: {selectedService?.durationMinutes ?? "--"} minutes
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
