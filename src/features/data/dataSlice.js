import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_BASE_URL ?? "http://localhost:3001";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      message = await response.text();
    } catch {
      message = "Request failed";
    }

    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeError(error) {
  return error?.message || "Unexpected server error";
}

export const fetchInitialData = createAsyncThunk(
  "data/fetchInitialData",
  async (_, { rejectWithValue }) => {
    try {
      const [bookings, services, staff, availability, patients, insights] =
        await Promise.all([
          apiRequest("bookings"),
          apiRequest("services"),
          apiRequest("staff"),
          apiRequest("availability"),
          apiRequest("patients"),
          apiRequest("insights"),
        ]);

      return {
        bookings,
        services,
        staff,
        availability,
        patients,
        insights,
      };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const createBooking = createAsyncThunk(
  "data/createBooking",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest("bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const updateBookingStatus = createAsyncThunk(
  "data/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await apiRequest(`bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const updateAvailabilityStatus = createAsyncThunk(
  "data/updateAvailabilityStatus",
  async ({ id, isAvailable }, { rejectWithValue }) => {
    try {
      return await apiRequest(`availability/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable }),
      });
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

const initialState = {
  bookings: [],
  services: [],
  staff: [],
  availability: [],
  patients: [],
  insights: [],
  loading: false,
  hasLoaded: false,
  error: null,
  filters: {
    query: "",
    status: "all",
  },
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setBookingQuery: (state, action) => {
      state.filters.query = action.payload;
    },
    setBookingStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    clearDataError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.hasLoaded = true;
        state.bookings = action.payload.bookings;
        state.services = action.payload.services;
        state.staff = action.payload.staff;
        state.availability = action.payload.availability;
        state.patients = action.payload.patients;
        state.insights = action.payload.insights;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not load data";
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not create booking";
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id,
        );

        if (index >= 0) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateAvailabilityStatus.fulfilled, (state, action) => {
        const index = state.availability.findIndex(
          (slot) => slot.id === action.payload.id,
        );

        if (index >= 0) {
          state.availability[index] = action.payload;
        }
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("data/updateBookingStatus") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || "Could not update booking status";
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("data/updateAvailabilityStatus") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || "Could not update availability";
        },
      );
  },
});

const now = () => Date.now();
const toTimestamp = (value) => new Date(value).getTime();

export const selectDashboardMetrics = (state) => {
  const bookings = state.data.bookings;
  const timestamp = now();
  const today = new Date().toDateString();

  const todayBookings = bookings.filter(
    (booking) => new Date(booking.appointmentAt).toDateString() === today,
  );
  const upcoming = bookings.filter(
    (booking) => toTimestamp(booking.appointmentAt) >= timestamp,
  );
  const waitMinutes = bookings.length
    ? Math.round(
        bookings.reduce(
          (total, booking) => total + (booking.estimatedWaitMinutes ?? 12),
          0,
        ) / bookings.length,
      )
    : 0;

  return {
    bookingsToday: todayBookings.length,
    scheduledAhead: upcoming.length,
    averageWait: waitMinutes,
  };
};

export const selectUpcomingBookings = (state) => {
  const timestamp = now();

  return [...state.data.bookings]
    .filter((booking) => toTimestamp(booking.appointmentAt) >= timestamp)
    .sort((a, b) => toTimestamp(a.appointmentAt) - toTimestamp(b.appointmentAt))
    .slice(0, 6);
};

export const selectHistoryBookings = (state) => {
  const timestamp = now();

  return [...state.data.bookings]
    .filter(
      (booking) =>
        ["completed", "cancelled"].includes(booking.status) ||
        toTimestamp(booking.appointmentAt) < timestamp,
    )
    .sort(
      (a, b) => toTimestamp(b.appointmentAt) - toTimestamp(a.appointmentAt),
    );
};

export const selectFilteredBookings = (state) => {
  const { query, status } = state.data.filters;

  return state.data.bookings
    .filter((booking) => (status === "all" ? true : booking.status === status))
    .filter((booking) => {
      if (!query) {
        return true;
      }

      const haystack = [
        booking.patientName,
        booking.doctorName,
        booking.serviceName,
        booking.status,
        booking.room,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.toLowerCase());
    })
    .sort(
      (a, b) => toTimestamp(b.appointmentAt) - toTimestamp(a.appointmentAt),
    );
};

export const { setBookingQuery, setBookingStatusFilter, clearDataError } =
  dataSlice.actions;

export default dataSlice.reducer;
