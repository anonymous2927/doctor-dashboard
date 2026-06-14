import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getDb, initDb } from "./db";
import { seedDb } from "./db/seed";

initDb();
seedDb();
let sessions: Record<string, any> = {};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}

function auth(req: Request): any | null {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return sessions[token || ""] || null;
}

function all(sql: string, params?: any[]): any[] {
  try { return getDb().prepare(sql).all(params || []); } catch { return []; }
}

function one(sql: string, params?: any[]): any | null {
  try { return (getDb().prepare(sql).get(params || []) as any) || null; } catch { return null; }
}

function run(sql: string, params?: any[]) {
  try { getDb().prepare(sql).run(params || []); } catch {}
}

async function handleApi(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization" } });
  }

  try {
    // ── Auth ──
    if (path === "/api/login" && method === "POST") {
      const { username, password } = await req.json();
      const user = one("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
      if (!user) return json({ error: "Invalid credentials" }, 401);
      const token = "tok_" + Math.random().toString(36).slice(2);
      sessions[token] = { userId: user.id, ...user };
      return json({ success: true, token, user: { id: user.id, name: user.name, username: user.username, specialization: user.specialization, department: user.department } });
    }

    if (path === "/api/register" && method === "POST") {
      const { doctorName, passCode } = await req.json();
      if (!doctorName || !passCode) return json({ error: "Missing fields" }, 400);
      const username = doctorName.toLowerCase().replace(/\s+/g, "");
      run("INSERT INTO users (username, password, name, specialization, department) VALUES (?, ?, ?, 'General', 'General Medicine')", [username, passCode, doctorName]);
      const token = "tok_" + Math.random().toString(36).slice(2);
      const user = { id: one("SELECT last_insert_rowid() as id")?.id as number, name: doctorName, username, specialization: "General", department: "General Medicine" };
      sessions[token] = user;
      return json({ success: true, token, user });
    }

    if (path === "/api/logout" && method === "POST") {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      delete sessions[token || ""];
      return json({ success: true });
    }

    // ── Public (no auth) ──
    if (path === "/api/public/hub" && method === "GET") {
      const totalBeds = one("SELECT COUNT(*) as c FROM beds")?.c ?? 0;
      const availableBeds = one("SELECT COUNT(*) as c FROM beds WHERE status = 'Available'")?.c ?? 0;
      const occupiedBeds = one("SELECT COUNT(*) as c FROM beds WHERE status = 'Occupied'")?.c ?? 0;
      const icuBeds = one("SELECT COUNT(*) as c FROM beds WHERE type = 'ICU' AND status = 'Available'")?.c ?? 0;
      const hduBeds = one("SELECT COUNT(*) as c FROM beds WHERE type = 'HDU' AND status = 'Available'")?.c ?? 0;
      const criticalCases = one("SELECT COUNT(*) as c FROM patients WHERE status IN ('Critical','In Treatment')")?.c ?? 0;
      const totalPatients = one("SELECT COUNT(*) as c FROM patients")?.c ?? 0;
      const activeDoctors = one("SELECT COUNT(*) as c FROM doctors WHERE availability IN ('Available','Busy')")?.c ?? 0;
      return json({ totalBeds, availableBeds, occupiedBeds, icuBeds, hduBeds, criticalCases, totalPatients, activeDoctors });
    }

    // Protected routes
    const session = auth(req);
    if (!session) return json({ error: "Not authenticated" }, 401);

    // ── Dashboard Stats ──
    if (path === "/api/dashboard/stats" && method === "GET") {
      const totalPatients = one("SELECT COUNT(*) as c FROM patients")?.c ?? 0;
      const criticalCases = one("SELECT COUNT(*) as c FROM patients WHERE status IN ('Critical','In Treatment')")?.c ?? 0;
      const availableBeds = one("SELECT COUNT(*) as c FROM beds WHERE status = 'Available'")?.c ?? 0;
      const todayAppointments = one("SELECT COUNT(*) as c FROM appointments WHERE status != 'Cancelled'")?.c ?? 0;
      const totalRevenue = one("SELECT COALESCE(SUM(paid),0) as s FROM billing_records")?.s ?? 0;
      const pendingBills = one("SELECT COUNT(*) as c FROM billing_records WHERE status IN ('Pending','Overdue')")?.c ?? 0;
      const activeDoctors = one("SELECT COUNT(*) as c FROM doctors WHERE availability IN ('Available','Busy')")?.c ?? 0;
      return json({ totalPatients, criticalCases, availableBeds, todayAppointments, totalRevenue, pendingBills, activeDoctors });
    }

    // ── Patients ──
    if (path === "/api/patients" && method === "GET") return json({ data: all("SELECT * FROM patients") });
    if (path === "/api/patients" && method === "POST") {
      const body = await req.json();
      const id = "P-" + Date.now();
      run("INSERT INTO patients (id, name, age, gender, blood_group, contact, department, diagnosis, doctor, admission_date, status) VALUES (?,?,?,?,?,?,?,?,?,?,'Stable')",
        [id, body.name, body.age, body.gender, body.bloodGroup, body.contact, body.department, body.diagnosis || "", body.doctor || "", new Date().toISOString().split("T")[0]]);
      return json({ data: { id, ...body, admissionDate: new Date().toISOString().split("T")[0], status: "Stable" }, message: "Patient admitted" });
    }
    const pm = path.match(/^\/api\/patients\/(P-\d+)$/);
    if (pm) {
      if (method === "GET") { const p = one("SELECT * FROM patients WHERE id = ?", [pm[1]]); if (!p) return json({ error: "Not found" }, 404); return json({ data: p }); }
      if (method === "POST" || method === "PUT") {
        const body = await req.json();
        const keys = Object.keys(body).filter(k => k !== "id");
        const cols = keys.map(k => k === "bloodGroup" ? "blood_group" : k.replace(/[A-Z]/g, c => "_" + c.toLowerCase())).join(" = ?, ") + " = ?";
        const vals = keys.map(k => body[k]);
        run(`UPDATE patients SET ${cols} WHERE id = ?`, [...vals, pm[1]]);
        return json({ data: one("SELECT * FROM patients WHERE id = ?", [pm[1]]), message: "Patient updated" });
      }
    }

    // ── Appointments ──
    if (path === "/api/appointments" && method === "GET") return json({ data: all("SELECT * FROM appointments") });
    if (path === "/api/appointments" && method === "POST") {
      const body = await req.json();
      const id = "A-" + Date.now();
      run("INSERT INTO appointments (id, patient, patient_id, time, date, type, status, doctor) VALUES (?,?,?,?,?,?,'Confirmed',?)",
        [id, body.patient, body.patientId, body.time, body.date, body.type, body.doctor]);
      return json({ data: { id, ...body, status: "Confirmed" }, message: "Appointment booked" });
    }
    const am = path.match(/^\/api\/appointments\/(A-\d+)$/);
    if (am) {
      if (method === "POST" || method === "PUT") {
        const body = await req.json();
        const keys = Object.keys(body).filter(k => k !== "id");
        if (keys.length) {
          const cols = keys.join(" = ?, ") + " = ?";
          run(`UPDATE appointments SET ${cols} WHERE id = ?`, [...keys.map(k => body[k]), am[1]]);
        }
        return json({ data: one("SELECT * FROM appointments WHERE id = ?", [am[1]]) });
      }
    }

    // ── Doctors ──
    if (path === "/api/doctors" && method === "GET") return json({ data: all("SELECT * FROM doctors") });

    // ── Medicines ──
    if (path === "/api/medicines" && method === "GET") return json({ data: all("SELECT * FROM medicines") });
    const mm = path.match(/^\/api\/medicines\/(M-\d+)\/stock$/);
    if (mm) {
      const { stock } = await req.json();
      run("UPDATE medicines SET stock = ? WHERE id = ?", [stock, mm[1]]);
      return json({ data: one("SELECT * FROM medicines WHERE id = ?", [mm[1]]) });
    }

    // ── Lab Tests ──
    if (path === "/api/lab-tests" && method === "GET") return json({ data: all("SELECT * FROM lab_tests") });
    if (path === "/api/lab-tests" && method === "POST") {
      const body = await req.json();
      const id = "L-" + Date.now();
      run("INSERT INTO lab_tests (id, patient_id, patient, test, ordered_by, status, date) VALUES (?,?,?,?,?,'Pending',?)",
        [id, body.patientId, body.patient, body.test, body.orderedBy, new Date().toISOString().split("T")[0]]);
      return json({ data: { id, ...body, status: "Pending" }, message: "Lab test ordered" });
    }

    // ── Prescriptions ──
    if (path === "/api/prescriptions" && method === "GET") return json({ data: all("SELECT * FROM prescriptions") });
    if (path === "/api/prescriptions" && method === "POST") {
      const body = await req.json();
      const id = "Rx-" + Date.now();
      run("INSERT INTO prescriptions (id, patient_id, patient_name, doctor, medicines, date) VALUES (?,?,?,?,?,?)",
        [id, body.patientId, body.patientName, body.doctor, JSON.stringify(body.medicines), new Date().toISOString().split("T")[0]]);
      return json({ data: { id, ...body }, message: "Prescription created" });
    }

    // ── Billing ──
    if (path === "/api/billing" && method === "GET") return json({ data: all("SELECT * FROM billing_records") });
    if (path === "/api/billing/payment" && method === "POST") {
      const { id, amount } = await req.json();
      const bill = one("SELECT * FROM billing_records WHERE id = ?", [id]);
      if (!bill) return json({ error: "Not found" }, 404);
      const newPaid = bill.paid + amount;
      const newDue = Math.max(0, bill.amount - newPaid);
      const newStatus = newDue <= 0 ? "Paid" : "Partial";
      run("UPDATE billing_records SET paid = ?, due = ?, status = ? WHERE id = ?", [newPaid, newDue, newStatus, id]);
      return json({ data: one("SELECT * FROM billing_records WHERE id = ?", [id]), message: `Payment of Rs.${amount} recorded` });
    }

    // ── Beds ──
    if (path === "/api/beds" && method === "GET") return json({ data: all("SELECT * FROM beds") });
    const bo = path.match(/^\/api\/beds\/(.+)\/occupy$/);
    if (bo) {
      const b = one("SELECT * FROM beds WHERE id = ? AND status = 'Available'", [bo[1]]);
      if (!b) return json({ error: "Bed unavailable" }, 400);
      const { patient } = await req.json();
      run("UPDATE beds SET status = 'Occupied', patient = ? WHERE id = ?", [patient, bo[1]]);
      return json({ data: one("SELECT * FROM beds WHERE id = ?", [bo[1]]) });
    }
    const br = path.match(/^\/api\/beds\/(.+)\/release$/);
    if (br) {
      const b = one("SELECT * FROM beds WHERE id = ?", [br[1]]);
      if (!b) return json({ error: "Not found" }, 404);
      run("UPDATE beds SET status = 'Available', patient = NULL WHERE id = ?", [br[1]]);
      return json({ data: one("SELECT * FROM beds WHERE id = ?", [br[1]]) });
    }

    return null;
  } catch (e: any) {
    return json({ error: e.message || "Internal error" }, 500);
  }
}

type ServerEntry = { fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response };
let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization" } });
    }
    if (url.pathname.startsWith("/api/")) {
      const apiResponse = await handleApi(request);
      if (apiResponse) return apiResponse;
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
    }
  },
};
