// In-memory data store — resets on server restart
// In production, replace with a real database (PostgreSQL, Supabase, etc.)

export interface User {
  id: string;
  doctorName: string;
  dob: string;
  aadhaar: string;
  hospitalName: string;
  licenseNo: string;
  username: string;
  mobileNumber: string;
  passCode: string;
  email?: string;
  role: "doctor" | "admin" | "nurse" | "staff";
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  admissionDate: string;
  department: string;
  status: "Stable" | "Critical" | "Discharged" | "In Treatment";
  diagnosis?: string;
  doctor?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  contact: string;
  email: string;
  availability: "Available" | "Busy" | "Off Duty";
}

export interface Appointment {
  id: string;
  patient: string;
  patientId: string;
  time: string;
  date: string;
  type: string;
  status: "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  doctor: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  medicines: { name: string; dosage: string; duration: string; instructions: string }[];
  date: string;
  notes?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patient: string;
  test: string;
  orderedBy: string;
  status: "Pending" | "In Progress" | "Completed" | "Critical";
  date: string;
  results?: string;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  paid: number;
  due: number;
  date: string;
  items: { description: string; cost: number }[];
  status: "Paid" | "Pending" | "Overdue" | "Partial";
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  price: number;
  expiry: string;
}

export interface Bed {
  id: string;
  label: string;
  type: "ICU" | "HDU" | "General";
  status: "Available" | "Occupied" | "Reserved";
  patient?: string;
}

class DataStore {
  users: User[] = [
    { id: "U-001", doctorName: "Dr. Mehta", dob: "1975-03-12", aadhaar: "1234 5678 9012", hospitalName: "Apollo Hospital", licenseNo: "MCI-12-34567", username: "dr.mehta", mobileNumber: "9876543210", passCode: "demo1234", email: "dr.mehta@hospital.in", role: "doctor", createdAt: "2024-01-15" },
    { id: "U-002", doctorName: "Dr. Sharma", dob: "1980-07-22", aadhaar: "2345 6789 0123", hospitalName: "Apollo Hospital", licenseNo: "MCI-23-45678", username: "dr.sharma", mobileNumber: "9876543211", passCode: "demo1234", email: "dr.sharma@hospital.in", role: "admin", createdAt: "2024-01-15" },
  ];

  patients: Patient[] = [
    { id: "P-1001", name: "Priya Sharma", age: 45, gender: "Female", bloodGroup: "B+", contact: "+91 98765 43210", admissionDate: "2026-05-28", department: "Cardiology", status: "Stable", diagnosis: "Hypertension", doctor: "Dr. Mehta" },
    { id: "P-1002", name: "Rahul Verma", age: 62, gender: "Male", bloodGroup: "A+", contact: "+91 98765 43211", admissionDate: "2026-05-30", department: "Neurology", status: "Critical", diagnosis: "Stroke", doctor: "Dr. Sharma" },
    { id: "P-1003", name: "Sunita Patel", age: 38, gender: "Female", bloodGroup: "O+", contact: "+91 98765 43212", admissionDate: "2026-06-01", department: "Orthopedics", status: "Stable", diagnosis: "Fracture", doctor: "Dr. Mehta" },
    { id: "P-1004", name: "Amit Kumar", age: 55, gender: "Male", bloodGroup: "AB+", contact: "+91 98765 43213", admissionDate: "2026-05-25", department: "General Medicine", status: "Discharged", diagnosis: "Viral Fever", doctor: "Dr. Verma" },
    { id: "P-1005", name: "Meena Devi", age: 70, gender: "Female", bloodGroup: "A-", contact: "+91 98765 43214", admissionDate: "2026-06-02", department: "ICU", status: "In Treatment", diagnosis: "Sepsis", doctor: "Dr. Shah" },
    { id: "P-1006", name: "Vikram Singh", age: 50, gender: "Male", bloodGroup: "B-", contact: "+91 98765 43215", admissionDate: "2026-06-03", department: "Emergency", status: "In Treatment", diagnosis: "Cardiac Arrest", doctor: "Dr. Mehta" },
  ];

  doctors: Doctor[] = [
    { id: "D-001", name: "Dr. Mehta", specialization: "Cardiologist", department: "Cardiology", contact: "+91 98765 43201", email: "dr.mehta@hospital.in", availability: "Available" },
    { id: "D-002", name: "Dr. Sharma", specialization: "Neurologist", department: "Neurology", contact: "+91 98765 43202", email: "dr.sharma@hospital.in", availability: "Busy" },
    { id: "D-003", name: "Dr. Verma", specialization: "General Physician", department: "General Medicine", contact: "+91 98765 43203", email: "dr.verma@hospital.in", availability: "Available" },
    { id: "D-004", name: "Dr. Shah", specialization: "Critical Care", department: "ICU", contact: "+91 98765 43204", email: "dr.shah@hospital.in", availability: "On Call" },
    { id: "D-005", name: "Dr. Patel", specialization: "Orthopedic Surgeon", department: "Orthopedics", contact: "+91 98765 43205", email: "dr.patel@hospital.in", availability: "Off Duty" },
  ];

  appointments: Appointment[] = [
    { id: "A-001", patient: "Priya Sharma", patientId: "P-1001", time: "09:00 AM", date: "2026-06-10", type: "Checkup", status: "Confirmed", doctor: "Dr. Mehta" },
    { id: "A-002", patient: "Rahul Verma", patientId: "P-1002", time: "10:30 AM", date: "2026-06-10", type: "Follow-up", status: "In Progress", doctor: "Dr. Sharma" },
    { id: "A-003", patient: "Sunita Patel", patientId: "P-1003", time: "11:45 AM", date: "2026-06-10", type: "Consultation", status: "Confirmed", doctor: "Dr. Mehta" },
    { id: "A-004", patient: "Amit Kumar", patientId: "P-1004", time: "02:00 PM", date: "2026-06-10", type: "Checkup", status: "Completed", doctor: "Dr. Verma" },
    { id: "A-005", patient: "Meena Devi", patientId: "P-1005", time: "03:30 PM", date: "2026-06-10", type: "Emergency", status: "Cancelled", doctor: "Dr. Shah" },
  ];

  medicines: Medicine[] = [
    { id: "M-001", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 2450, threshold: 500, price: 85, expiry: "Dec 2026" },
    { id: "M-002", name: "Insulin Glargine", category: "Diabetes", stock: 128, threshold: 500, price: 450, expiry: "Sep 2026" },
    { id: "M-003", name: "Atorvastatin 10mg", category: "Cardiology", stock: 3800, threshold: 500, price: 120, expiry: "Mar 2027" },
    { id: "M-004", name: "Paracetamol 500mg", category: "Analgesic", stock: 240, threshold: 1000, price: 30, expiry: "Aug 2026" },
    { id: "M-005", name: "Metformin 500mg", category: "Diabetes", stock: 5200, threshold: 500, price: 55, expiry: "Nov 2026" },
  ];

  labTests: LabTest[] = [
    { id: "L-001", patientId: "P-1001", patient: "Priya Sharma", test: "Complete Blood Count", orderedBy: "Dr. Mehta", status: "Completed", date: "2026-06-01", results: "WBC 6.2, RBC 4.8, Hb 13.5" },
    { id: "L-002", patientId: "P-1002", patient: "Rahul Verma", test: "MRI Brain", orderedBy: "Dr. Sharma", status: "In Progress", date: "2026-06-02" },
    { id: "L-003", patientId: "P-1003", patient: "Sunita Patel", test: "X-Ray Chest", orderedBy: "Dr. Mehta", status: "Pending", date: "2026-06-03" },
    { id: "L-004", patientId: "P-1006", patient: "Vikram Singh", test: "ECG", orderedBy: "Dr. Verma", status: "Critical", date: "2026-06-03" },
  ];

  prescriptions: Prescription[] = [
    { id: "Rx-001", patientId: "P-1001", patientName: "Priya Sharma", doctor: "Dr. Mehta", medicines: [{ name: "Amlodipine 5mg", dosage: "1 tablet", duration: "30 days", instructions: "Take after breakfast" }], date: "2026-06-01" },
  ];

  billingRecords: BillingRecord[] = [
    { id: "B-001", patientId: "P-1001", patientName: "Priya Sharma", amount: 45000, paid: 25000, due: 20000, date: "2026-06-01", items: [{ description: "Consultation Fee", cost: 1500 }, { description: "CBC Test", cost: 800 }, { description: "Room Charges (3 days)", cost: 30000 }, { description: "Medicines", cost: 12700 }], status: "Partial" },
    { id: "B-002", patientId: "P-1006", patientName: "Vikram Singh", amount: 125000, paid: 0, due: 125000, date: "2026-06-03", items: [{ description: "Emergency Services", cost: 50000 }, { description: "ICU (1 day)", cost: 60000 }, { description: "ECG & Labs", cost: 15000 }], status: "Pending" },
  ];

  beds: Bed[] = [
    { id: "ICU-01", label: "ICU Bed 01", type: "ICU", status: "Occupied", patient: "Vikram Singh" },
    { id: "ICU-02", label: "ICU Bed 02", type: "ICU", status: "Occupied", patient: "Meena Devi" },
    { id: "ICU-03", label: "ICU Bed 03", type: "ICU", status: "Available" },
    { id: "HDU-01", label: "HDU Bed 01", type: "HDU", status: "Occupied", patient: "Rahul Verma" },
    { id: "HDU-02", label: "HDU Bed 02", type: "HDU", status: "Available" },
    { id: "GEN-01", label: "Ward A-01", type: "General", status: "Available" },
    { id: "GEN-02", label: "Ward A-02", type: "General", status: "Occupied", patient: "Priya Sharma" },
  ];

  private currentSession: { userId: string; role: string } | null = null;

  // Auth
  authenticate(username: string, mobileNumber: string, passCode: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find(u => u.username === username && u.mobileNumber === mobileNumber && u.passCode === passCode);
    if (!user) return { success: false, error: "Invalid credentials." };
    this.currentSession = { userId: user.id, role: user.role };
    return { success: true, user };
  }

  register(userData: Omit<User, "id" | "createdAt">): { success: boolean; user?: User; error?: string } {
    if (this.users.find(u => u.licenseNo === userData.licenseNo)) {
      return { success: false, error: "A doctor with this license number already exists." };
    }
    const user: User = { ...userData, id: `U-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
    this.users.push(user);
    this.currentSession = { userId: user.id, role: user.role };
    return { success: true, user };
  }

  logout() { this.currentSession = null; return { success: true }; }
  getSession() { return this.currentSession; }

  // Patients CRUD
  getPatients() { return this.patients; }
  getPatient(id: string) { return this.patients.find(p => p.id === id) || null; }
  addPatient(data: Omit<Patient, "id">) {
    const p: Patient = { ...data, id: `P-${Date.now()}` };
    this.patients.push(p);
    return p;
  }
  updatePatient(id: string, data: Partial<Patient>) {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx < 0) return null;
    this.patients[idx] = { ...this.patients[idx], ...data };
    return this.patients[idx];
  }
  deletePatient(id: string) {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx < 0) return false;
    this.patients.splice(idx, 1);
    return true;
  }

  // Appointments CRUD
  getAppointments() { return this.appointments; }
  addAppointment(data: Omit<Appointment, "id">) {
    const a: Appointment = { ...data, id: `A-${Date.now()}` };
    this.appointments.push(a);
    return a;
  }
  updateAppointment(id: string, data: Partial<Appointment>) {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx < 0) return null;
    this.appointments[idx] = { ...this.appointments[idx], ...data };
    return this.appointments[idx];
  }
  cancelAppointment(id: string) { return this.updateAppointment(id, { status: "Cancelled" }); }

  // Doctors
  getDoctors() { return this.doctors; }
  getDoctor(id: string) { return this.doctors.find(d => d.id === id) || null; }

  // Medicines CRUD
  getMedicines() { return this.medicines; }
  updateStock(id: string, qty: number) {
    const m = this.medicines.find(m => m.id === id);
    if (!m) return null;
    m.stock = qty;
    return m;
  }
  reduceStock(id: string, qty: number) {
    const m = this.medicines.find(m => m.id === id);
    if (!m || m.stock < qty) return null;
    m.stock -= qty;
    return m;
  }

  // Lab Tests CRUD
  getLabTests() { return this.labTests; }
  addLabTest(data: Omit<LabTest, "id">) {
    const t: LabTest = { ...data, id: `L-${Date.now()}` };
    this.labTests.push(t);
    return t;
  }
  updateLabTestStatus(id: string, status: LabTest["status"]) {
    const t = this.labTests.find(t => t.id === id);
    if (!t) return null;
    t.status = status;
    return t;
  }

  // Prescriptions CRUD
  getPrescriptions() { return this.prescriptions; }
  addPrescription(data: Omit<Prescription, "id">) {
    const rx: Prescription = { ...data, id: `Rx-${Date.now()}` };
    this.prescriptions.push(rx);
    return rx;
  }

  // Billing CRUD
  getBillingRecords() { return this.billingRecords; }
  addBillingRecord(data: Omit<BillingRecord, "id">) {
    const b: BillingRecord = { ...data, id: `B-${Date.now()}` };
    this.billingRecords.push(b);
    return b;
  }
  recordPayment(id: string, amount: number) {
    const b = this.billingRecords.find(b => b.id === id);
    if (!b) return null;
    const newPaid = b.paid + amount;
    b.paid = newPaid;
    b.due = Math.max(0, b.amount - newPaid);
    b.status = b.due <= 0 ? "Paid" : "Partial";
    return b;
  }

  // Beds
  getBeds() { return this.beds; }
  getAvailableBeds(type?: string) {
    return this.beds.filter(b => b.status === "Available" && (!type || b.type === type));
  }
  occupyBed(id: string, patient: string) {
    const b = this.beds.find(b => b.id === id);
    if (!b || b.status !== "Available") return null;
    b.status = "Occupied";
    b.patient = patient;
    return b;
  }
  releaseBed(id: string) {
    const b = this.beds.find(b => b.id === id);
    if (!b) return null;
    b.status = "Available";
    b.patient = undefined;
    return b;
  }

  // Dashboard stats
  getDashboardStats() {
    const totalPatients = this.patients.length;
    const criticalCases = this.patients.filter(p => p.status === "Critical" || p.status === "In Treatment").length;
    const availableBeds = this.beds.filter(b => b.status === "Available").length;
    const todayAppointments = this.appointments.filter(a => a.date === new Date().toISOString().split("T")[0] || a.status !== "Cancelled").length;
    const totalRevenue = this.billingRecords.reduce((sum, b) => sum + b.paid, 0);
    const pendingBills = this.billingRecords.filter(b => b.status === "Pending" || b.status === "Overdue").length;
    const activeDoctors = this.doctors.filter(d => d.availability === "Available" || d.availability === "Busy").length;
    return { totalPatients, criticalCases, availableBeds, todayAppointments, totalRevenue, pendingBills, activeDoctors };
  }
}

export const store = new DataStore();
