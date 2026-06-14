import { getDb } from "./index";

export function seedDb() {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  if (row.count > 0) return;
  const stmt = db.prepare("INSERT INTO users (username, password, name, specialization, department) VALUES (?, ?, ?, ?, ?)");
  stmt.run("dr.mehta", "demo1234", "Dr. Mehta", "Cardiologist", "Cardiology");
  stmt.run("dr.sharma", "demo1234", "Dr. Sharma", "Neurologist", "Neurology");
  stmt.run("dr.verma", "demo1234", "Dr. Verma", "Physician", "General Medicine");
}
