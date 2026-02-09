import fs from "fs";                    // Node's file system module
import path from "path";                // Node's cross-platform path utility
import { fileURLToPath } from "url";    // a utility to convert ES module URL to file paths
import Database from "better-sqlite3";  // synchronous native SQlite driver

const __filename = fileURLToPath(import.meta.url);  // converts the meta url to a file path
const __dirname = path.dirname(__filename);         // extracts directory containing migrate.ts

const dbPth = path.join(__dirname, "app.db");       // db is in the same path
const db = new Database(dbPth);                     // opens SQlite db, creates if it doesn't exist
db.pragma("foreign_keys = ON");                     // enables FK enforcement (off by default)

// creates a private table to track applied migrations
db.exec(` 
    CREATE TABLE IF NOT EXISTS _migrations (
        id TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )    
`)

// discover applied migrations
const migrationsDir = path.join(__dirname, "migrations");

// we use a set for O(1) lookups later (applied.has(file)), get file ids of all migrations
const applied = new Set(
    db.prepare("SELECT id FROM _migrations").all().map((r: any) => r.id)
);

// read the migration files and sort them lexicographically
// sorting enforces that we run the mgirations in the correct order
const files = fs.readdirSync(migrationsDir).sort();

// apply only unapplied migrations
for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration ${file}`);
    db.exec(sql);
    db.prepare("INSERT INTO _migrations (id) VALUES (?)").run(file);
}

console.log("Migrations complete");