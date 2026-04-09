const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
export async function usePatients() {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`);
    if (!res.ok) throw new Error("Failed to fetch patients");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}
