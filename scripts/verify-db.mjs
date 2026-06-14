import { Client } from 'pg';

const client = new Client({
  host: 'db.wjvdzmpkyqbqmstzwwqz.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Rayyan2904#',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables 
     WHERE table_schema = 'public' ORDER BY table_name`
  );
  console.log('Tables created:');
  rows.forEach(r => console.log('  ✓', r.table_name));
  
  // Check RLS
  const { rows: rls } = await client.query(
    `SELECT tablename, rowsecurity FROM pg_tables 
     WHERE schemaname = 'public' AND tablename NOT LIKE '\\_%'`
  );
  console.log('\nRLS enabled:');
  rls.forEach(r => console.log('  ✓', r.tablename, '-', r.rowsecurity));
  
  await client.end();
}

run().catch(console.error);
