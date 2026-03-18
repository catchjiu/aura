import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      dbTransactions,
      dbGoals,
      dbBudget,
      dbNotifications,
      dbAccounts,
    ] = await Promise.all([
      prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.savingsGoal.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.budgetCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.linkedAccount.findMany(),
    ]);

    return NextResponse.json({
      transactions: dbTransactions.map((t) => ({
        id: t.id,
        date: t.dateLabel,
        merchant: t.merchant,
        merchantIcon: t.merchantIcon,
        category: t.category,
        categoryVariant: t.categoryVariant,
        amount: t.amount,
        type: t.type,
      })),
      savingsGoals: dbGoals.map((g) => ({
        id: g.id,
        title: g.title,
        current: g.current,
        target: g.target,
        deadline: g.deadline,
        color: g.color,
      })),
      budgetCategories: dbBudget.map((c) => ({
        name: c.name,
        spent: c.spent,
        total: c.total,
        status: c.status,
      })),
      notifications: dbNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: n.time,
        read: n.read,
        type: n.type,
      })),
      linkedAccounts: dbAccounts.map((a) => ({
        id: a.id,
        name: a.name,
        bank: a.bank,
        type: a.type,
        balance: a.balance,
        lastFour: a.lastFour,
        color: a.color,
      })),
    });
  } catch (error) {
    console.error('[GET /api/dashboard]', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 },
    );
  }
}
