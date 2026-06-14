const API = "/api";

export async function loginClient(username: string, password: string) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("session", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function registerClient(data: { doctorName: string; dob: string; aadhaar: string; hospitalName: string; licenseNo: string; passCode: string }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.success) {
    localStorage.setItem("session", JSON.stringify(result));
    localStorage.setItem("token", result.token);
  }
  return result;
}

export function logoutClient() {
  const token = localStorage.getItem("token");
  fetch(`${API}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
  localStorage.removeItem("session");
  localStorage.removeItem("token");
}

export function getSession() {
  const raw = localStorage.getItem("session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
