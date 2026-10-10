import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSqlFile, closePool } from "./db.js";
import * as q from "./queries.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = (file) => path.join(dir, file);

async function setup() {
  await runSqlFile(sql("structure/schema.sql"));
  await runSqlFile(sql("seed.sql"));
  console.log("Database created and seeded.");
}

async function reset() {
  await runSqlFile(sql("reset.sql"));
  console.log("All tables dropped.");
}

async function demo() {
  console.log("\nAvailable books:");
  console.table(await q.getAvailableBooks());

  console.log("\nBooks with authors and categories:");
  console.table(await q.getBooksWithDetails());

  console.log("\nActive loans:");
  console.table(await q.getActiveLoans());

  console.log("\nLoans per book:");
  console.table(await q.getLoanCountPerBook());
}

const commands = { setup, reset, demo };
const command = process.argv[2] || "demo";

if (!commands[command]) {
  console.error(`Unknown command "${command}". Use: setup | reset | demo`);
  process.exit(1);
}

try {
  await commands[command]();
} catch (err) {
  console.error("Error:", err.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
