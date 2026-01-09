import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'parking_db',
  password: 'postgres',
  port: 5432,
});

export default {
  query: (text, params) => pool.query(text, params),
  rawQuery: (text) => pool.query(text),
};