import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      transactions.map((t) => ({
        id: t.id,
        date: t.dateLabel,
        merchant: t.merchant,
        merchantIcon: t.merchantIcon,
        category: t.category,
        categoryVariant: t.categoryVariant,
        amount: t.amount,
        type: t.type,
      })),
    );
  } catch (error) {
    console.error('[GET /api/transactions]', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dateLabel, merchant, merchantIcon, category, categoryVariant, amount, type } = body;

    if (!merchant || !category || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        dateLabel: dateLabel ?? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        merchant,
        merchantIcon: merchantIcon ?? '💳',
        category,
        categoryVariant: categoryVariant ?? 'blue',
        amount: Number(amount),
        type,
      },
    });

    return NextResponse.json(
      {
        id: transaction.id,
        date: transaction.dateLabel,
        merchant: transaction.merchant,
        merchantIcon: transaction.merchantIcon,
        category: transaction.category,
        categoryVariant: transaction.categoryVariant,
        amount: transaction.amount,
        type: transaction.type,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/transactions]', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
