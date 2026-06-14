import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  db = new Database(":memory:");
  return db;
}

export function initDb() {
  const d = getDb();
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      specialization TEXT DEFAULT 'General',
      department TEXT DEFAULT 'General Medicine'
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      blood_group TEXT,
      contact TEXT,
      admission_date TEXT,
      department TEXT,
      status TEXT DEFAULT 'Stable',
      diagnosis TEXT DEFAULT '',
      doctor TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT,
      department TEXT,
      contact TEXT,
      email TEXT,
      availability TEXT DEFAULT 'Available'
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient TEXT NOT NULL,
      patient_id TEXT,
      time TEXT,
      date TEXT,
      type TEXT,
      status TEXT DEFAULT 'Confirmed',
      doctor TEXT
    );
    CREATE TABLE IF NOT EXISTS medicines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0,
      threshold INTEGER DEFAULT 500,
      price REAL DEFAULT 0,
      expiry TEXT
    );
    CREATE TABLE IF NOT EXISTS lab_tests (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient TEXT,
      test TEXT,
      ordered_by TEXT,
      status TEXT DEFAULT 'Pending',
      date TEXT,
      results TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      doctor TEXT,
      medicines TEXT DEFAULT '[]',
      date TEXT
    );
    CREATE TABLE IF NOT EXISTS billing_records (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      amount REAL DEFAULT 0,
      paid REAL DEFAULT 0,
      due REAL DEFAULT 0,
      date TEXT,
      items TEXT DEFAULT '[]',
      status TEXT DEFAULT 'Pending'
    );
    CREATE TABLE IF NOT EXISTS beds (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT,
      status TEXT DEFAULT 'Available',
      patient TEXT
    );
  `);
}
