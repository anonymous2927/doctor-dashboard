const API = "/api";

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get(path: string) {
  const res = await fetch(`${API}${path}`, { headers: { ...authHeaders() }, credentials: "include" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function post(path: string, body?: any) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export const getDashboardStats = async () => get("/dashboard/stats");

export const getPatients = async () => get("/patients");

export const getPatient = async (data: { id: string }) => get(`/patients/${data.id}`);

export const addPatient = async (data: any) => post("/patients", data);

export const updatePatient = async (data: any) => post(`/patients/${data.id}`, data);

export const dischargePatient = async (data: { id: string }) => post(`/patients/${data.id}`, { status: "Discharged" });

export const getAppointments = async () => get("/appointments");

export const bookAppointment = async (data: any) => post("/appointments", data);

export const cancelAppointment = async (data: { id: string }) => post(`/appointments/${data.id}`, { status: "Cancelled" });

export const getDoctors = async () => get("/doctors");

export const getMedicines = async () => get("/medicines");

export const getLabTests = async () => get("/lab-tests");

export const orderLabTest = async (data: any) => post("/lab-tests", data);

export const getPrescriptions = async () => get("/prescriptions");

export const addPrescription = async (data: any) => post("/prescriptions", data);

export const getBillingRecords = async () => get("/billing");

export const recordPayment = async (data: { id: string; amount: number }) => post("/billing/payment", data);

export const getBeds = async () => get("/beds");
