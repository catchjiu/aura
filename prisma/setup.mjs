/**
 * Database setup script — runs on every container start.
 * Uses pg directly: no Prisma CLI, no tsx, no esbuild required.
 * All statements are idempotent (IF NOT EXISTS / ON CONFLICT DO NOTHING).
 */
import pg from 'pg';
import { randomBytes } from 'crypto';

const { Client } = pg;

function cuid() {
  return 'c' + randomBytes(8).toString('hex');
}

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set — skipping DB setup');
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log('✔ Connected to database');

  // ── Create tables ──────────────────────────────────────────────────────────
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Transaction" (
      "id"              TEXT            NOT NULL,
      "dateLabel"       TEXT            NOT NULL,
      "merchant"        TEXT            NOT NULL,
      "merchantIcon"    TEXT            NOT NULL DEFAULT '💳',
      "category"        TEXT            NOT NULL,
      "categoryVariant" TEXT            NOT NULL DEFAULT 'blue',
      "amount"          DOUBLE PRECISION NOT NULL,
      "type"            TEXT            NOT NULL,
      "createdAt"       TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "SavingsGoal" (
      "id"        TEXT             NOT NULL,
      "title"     TEXT             NOT NULL,
      "current"   DOUBLE PRECISION NOT NULL DEFAULT 0,
      "target"    DOUBLE PRECISION NOT NULL,
      "deadline"  TEXT             NOT NULL,
      "color"     TEXT             NOT NULL DEFAULT 'blue',
      "createdAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SavingsGoal_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "BudgetCategory" (
      "id"     TEXT             NOT NULL,
      "name"   TEXT             NOT NULL,
      "spent"  DOUBLE PRECISION NOT NULL DEFAULT 0,
      "total"  DOUBLE PRECISION NOT NULL,
      "status" TEXT             NOT NULL DEFAULT 'ok',
      CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "Notification" (
      "id"        TEXT         NOT NULL,
      "title"     TEXT         NOT NULL,
      "message"   TEXT         NOT NULL,
      "time"      TEXT         NOT NULL,
      "read"      BOOLEAN      NOT NULL DEFAULT false,
      "type"      TEXT         NOT NULL DEFAULT 'info',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "LinkedAccount" (
      "id"       TEXT             NOT NULL,
      "name"     TEXT             NOT NULL,
      "bank"     TEXT             NOT NULL,
      "type"     TEXT             NOT NULL,
      "balance"  DOUBLE PRECISION NOT NULL,
      "lastFour" TEXT             NOT NULL,
      "color"    TEXT             NOT NULL DEFAULT 'primary',
      CONSTRAINT "LinkedAccount_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx"
      ON "Transaction"("createdAt" DESC);

    CREATE UNIQUE INDEX IF NOT EXISTS "BudgetCategory_name_key"
      ON "BudgetCategory"("name");
  `);
  console.log('✔ Tables ready');

  // ── Seed (only if empty) ───────────────────────────────────────────────────
  const { rows } = await client.query('SELECT COUNT(*) FROM "Transaction"');
  if (parseInt(rows[0].count, 10) > 0) {
    console.log('✔ Data already exists — skipping seed');
    await client.end();
    return;
  }

  console.log('🌱 Seeding...');

  const transactions = [
    [cuid(), 'Jan 18', 'Whole Foods Market', '🛒', 'Groceries',     'emerald',  84.32,   'debit' ],
    [cuid(), 'Jan 17', 'Netflix',            '🎬', 'Entertainment', 'purple',   15.99,   'debit' ],
    [cuid(), 'Jan 17', 'Salary Deposit',     '💼', 'Income',        'teal',   4800.00,  'credit'],
    [cuid(), 'Jan 16', 'Shell Gas Station',  '⛽', 'Transport',     'blue',     62.40,   'debit' ],
    [cuid(), 'Jan 15', 'Amazon',             '📦', 'Shopping',      'orange',  127.80,   'debit' ],
    [cuid(), 'Jan 14', 'Freelance Payment',  '💰', 'Income',        'teal',    850.00,  'credit'],
    [cuid(), 'Jan 13', 'Spotify',            '🎵', 'Entertainment', 'purple',    9.99,   'debit' ],
    [cuid(), 'Jan 12', "Trader Joe's",       '🛍️', 'Groceries',     'emerald',  67.45,   'debit' ],
    [cuid(), 'Jan 11', 'Uber',               '🚗', 'Transport',     'blue',     24.50,   'debit' ],
    [cuid(), 'Jan 10', 'Target',             '🎯', 'Shopping',      'orange',   56.22,   'debit' ],
    [cuid(), 'Jan 9',  'Dr. Smith Dental',   '🦷', 'Healthcare',    'rose',    120.00,   'debit' ],
    [cuid(), 'Jan 8',  'Chipotle',           '🌯', 'Food & Dining', 'orange',   14.75,   'debit' ],
    [cuid(), 'Jan 7',  'Dividend Income',    '📈', 'Income',        'teal',    320.00,  'credit'],
    [cuid(), 'Jan 6',  'Planet Fitness',     '🏋️', 'Healthcare',    'rose',     24.99,   'debit' ],
    [cuid(), 'Jan 5',  'Apple Store',        '🍎', 'Shopping',      'orange',   79.00,   'debit' ],
  ];
  for (const [id, dateLabel, merchant, merchantIcon, category, categoryVariant, amount, type] of transactions) {
    await client.query(
      `INSERT INTO "Transaction" ("id","dateLabel","merchant","merchantIcon","category","categoryVariant","amount","type")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
      [id, dateLabel, merchant, merchantIcon, category, categoryVariant, amount, type],
    );
  }
  console.log('  ✔ Transactions');

  const goals = [
    [cuid(), 'Emergency Fund',    8500, 12000, 'Jun 2025', 'emerald'],
    [cuid(), 'Vacation to Japan', 3200,  5000, 'Aug 2025', 'blue'   ],
    [cuid(), 'New MacBook Pro',   1800,  2500, 'Mar 2025', 'violet' ],
  ];
  for (const [id, title, current, target, deadline, color] of goals) {
    await client.query(
      `INSERT INTO "SavingsGoal" ("id","title","current","target","deadline","color")
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
      [id, title, current, target, deadline, color],
    );
  }
  console.log('  ✔ Savings Goals');

  const budget = [
    [cuid(), 'Housing',        1800, 2000, 'ok'     ],
    [cuid(), 'Food & Dining',   680,  700, 'warning'],
    [cuid(), 'Transportation',  320,  400, 'ok'     ],
    [cuid(), 'Entertainment',   290,  250, 'danger' ],
    [cuid(), 'Healthcare',      120,  300, 'ok'     ],
    [cuid(), 'Shopping',        840,  600, 'danger' ],
  ];
  for (const [id, name, spent, total, status] of budget) {
    await client.query(
      `INSERT INTO "BudgetCategory" ("id","name","spent","total","status")
       VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("name") DO NOTHING`,
      [id, name, spent, total, status],
    );
  }
  console.log('  ✔ Budget Categories');

  const notifications = [
    [cuid(), 'Budget Alert',      'Shopping budget exceeded by $240 this month.',       '2h ago', false, 'warning'],
    [cuid(), 'Goal Milestone',    "Emergency fund is 70% complete — you're on track!",  '5h ago', false, 'success'],
    [cuid(), 'Large Transaction', 'Amazon purchase of $127.80 was recorded.',           '1d ago', true,  'info'   ],
    [cuid(), 'Bill Due Soon',     'Electricity bill of ~$95 is due in 3 days.',         '1d ago', true,  'warning'],
  ];
  for (const [id, title, message, time, read, type] of notifications) {
    await client.query(
      `INSERT INTO "Notification" ("id","title","message","time","read","type")
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
      [id, title, message, time, read, type],
    );
  }
  console.log('  ✔ Notifications');

  const accounts = [
    [cuid(), 'Chase Checking',       'Chase Bank',       'checking',   12480.50, '4291', 'secondary'],
    [cuid(), 'Chase Savings',        'Chase Bank',       'savings',    15969.50, '8834', 'primary'  ],
    [cuid(), 'Fidelity Investments', 'Fidelity',         'investment', 98340.50, '2201', 'emerald'  ],
    [cuid(), 'Amex Platinum',        'American Express', 'credit',    -4280.00,  '7745', 'violet'   ],
  ];
  for (const [id, name, bank, type, balance, lastFour, color] of accounts) {
    await client.query(
      `INSERT INTO "LinkedAccount" ("id","name","bank","type","balance","lastFour","color")
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
      [id, name, bank, type, balance, lastFour, color],
    );
  }
  console.log('  ✔ Linked Accounts');

  console.log('✅ Database ready!');
  await client.end();
}

run().catch((err) => {
  console.error('❌ DB setup failed:', err.message);
  // Don't exit(1) — let the server start anyway
});
