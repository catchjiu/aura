import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear all tables first (order respects no FK deps here)
  await prisma.transaction.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.budgetCategory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.linkedAccount.deleteMany();

  // ─── Transactions ─────────────────────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      { dateLabel: 'Jan 18', merchant: 'Whole Foods Market',  merchantIcon: '🛒', category: 'Groceries',      categoryVariant: 'emerald', amount: 84.32,   type: 'debit'  },
      { dateLabel: 'Jan 17', merchant: 'Netflix',             merchantIcon: '🎬', category: 'Entertainment',  categoryVariant: 'purple',  amount: 15.99,   type: 'debit'  },
      { dateLabel: 'Jan 17', merchant: 'Salary Deposit',      merchantIcon: '💼', category: 'Income',         categoryVariant: 'teal',    amount: 4800.00, type: 'credit' },
      { dateLabel: 'Jan 16', merchant: 'Shell Gas Station',   merchantIcon: '⛽', category: 'Transport',      categoryVariant: 'blue',    amount: 62.40,   type: 'debit'  },
      { dateLabel: 'Jan 15', merchant: 'Amazon',              merchantIcon: '📦', category: 'Shopping',       categoryVariant: 'orange',  amount: 127.80,  type: 'debit'  },
      { dateLabel: 'Jan 14', merchant: 'Freelance Payment',   merchantIcon: '💰', category: 'Income',         categoryVariant: 'teal',    amount: 850.00,  type: 'credit' },
      { dateLabel: 'Jan 13', merchant: 'Spotify',             merchantIcon: '🎵', category: 'Entertainment',  categoryVariant: 'purple',  amount: 9.99,    type: 'debit'  },
      { dateLabel: 'Jan 12', merchant: "Trader Joe's",        merchantIcon: '🛍️', category: 'Groceries',      categoryVariant: 'emerald', amount: 67.45,   type: 'debit'  },
      { dateLabel: 'Jan 11', merchant: 'Uber',                merchantIcon: '🚗', category: 'Transport',      categoryVariant: 'blue',    amount: 24.50,   type: 'debit'  },
      { dateLabel: 'Jan 10', merchant: 'Target',              merchantIcon: '🎯', category: 'Shopping',       categoryVariant: 'orange',  amount: 56.22,   type: 'debit'  },
      { dateLabel: 'Jan 9',  merchant: 'Dr. Smith Dental',    merchantIcon: '🦷', category: 'Healthcare',     categoryVariant: 'rose',    amount: 120.00,  type: 'debit'  },
      { dateLabel: 'Jan 8',  merchant: 'Chipotle',            merchantIcon: '🌯', category: 'Food & Dining',  categoryVariant: 'orange',  amount: 14.75,   type: 'debit'  },
      { dateLabel: 'Jan 7',  merchant: 'Dividend Income',     merchantIcon: '📈', category: 'Income',         categoryVariant: 'teal',    amount: 320.00,  type: 'credit' },
      { dateLabel: 'Jan 6',  merchant: 'Planet Fitness',      merchantIcon: '🏋️', category: 'Healthcare',     categoryVariant: 'rose',    amount: 24.99,   type: 'debit'  },
      { dateLabel: 'Jan 5',  merchant: 'Apple Store',         merchantIcon: '🍎', category: 'Shopping',       categoryVariant: 'orange',  amount: 79.00,   type: 'debit'  },
    ],
  });
  console.log('  ✔ Transactions');

  // ─── Savings Goals ────────────────────────────────────────────────────────
  await prisma.savingsGoal.createMany({
    data: [
      { title: 'Emergency Fund',   current: 8500, target: 12000, deadline: 'Jun 2025', color: 'emerald' },
      { title: 'Vacation to Japan', current: 3200, target: 5000,  deadline: 'Aug 2025', color: 'blue'    },
      { title: 'New MacBook Pro',  current: 1800, target: 2500,  deadline: 'Mar 2025', color: 'violet'  },
    ],
  });
  console.log('  ✔ Savings Goals');

  // ─── Budget Categories ────────────────────────────────────────────────────
  await prisma.budgetCategory.createMany({
    data: [
      { name: 'Housing',        spent: 1800, total: 2000, status: 'ok'      },
      { name: 'Food & Dining',  spent: 680,  total: 700,  status: 'warning' },
      { name: 'Transportation', spent: 320,  total: 400,  status: 'ok'      },
      { name: 'Entertainment',  spent: 290,  total: 250,  status: 'danger'  },
      { name: 'Healthcare',     spent: 120,  total: 300,  status: 'ok'      },
      { name: 'Shopping',       spent: 840,  total: 600,  status: 'danger'  },
    ],
  });
  console.log('  ✔ Budget Categories');

  // ─── Notifications ────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { title: 'Budget Alert',    message: 'Shopping budget exceeded by $240 this month.',          time: '2h ago',  read: false, type: 'warning' },
      { title: 'Goal Milestone',  message: "Emergency fund is 70% complete — you're on track!",     time: '5h ago',  read: false, type: 'success' },
      { title: 'Large Transaction', message: 'Amazon purchase of $127.80 was recorded.',            time: '1d ago',  read: true,  type: 'info'    },
      { title: 'Bill Due Soon',   message: 'Electricity bill of ~$95 is due in 3 days.',            time: '1d ago',  read: true,  type: 'warning' },
    ],
  });
  console.log('  ✔ Notifications');

  // ─── Linked Accounts ──────────────────────────────────────────────────────
  await prisma.linkedAccount.createMany({
    data: [
      { name: 'Chase Checking',    bank: 'Chase Bank',         type: 'checking',   balance:  12480.50, lastFour: '4291', color: 'secondary' },
      { name: 'Chase Savings',     bank: 'Chase Bank',         type: 'savings',    balance:  15969.50, lastFour: '8834', color: 'primary'   },
      { name: 'Fidelity Investments', bank: 'Fidelity',        type: 'investment', balance:  98340.50, lastFour: '2201', color: 'emerald'   },
      { name: 'Amex Platinum',     bank: 'American Express',   type: 'credit',     balance:  -4280.00, lastFour: '7745', color: 'violet'    },
    ],
  });
  console.log('  ✔ Linked Accounts');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
