const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const poolConfig = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host:     process.env.DB_HOST     || 'user-db',
        port:     parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME     || 'userdb',
        user:     process.env.DB_USER     || 'admin',
        password: process.env.DB_PASSWORD || 'secret',
    };

const pool = new Pool(poolConfig);

async function initDB() {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('[user-db] Tables initialized');
}

module.exports = { pool, initDB };
