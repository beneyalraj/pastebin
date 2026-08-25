require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const schemaSQL = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

async function initDb() {

  try {
    await pool.query(schemaSQL);
    console.log('Database initialized successfully (table "pastes" created).');
  } 
  catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  } 
  finally {
    await pool.end();
  }
}

initDb();