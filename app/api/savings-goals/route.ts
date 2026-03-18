import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const goals = await prisma.savingsGoal.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(goals.map((g) => ({
      id: g.id,
      title: g.title,
      current: g.current,
      target: g.target,
      deadline: g.deadline,
      color: g.color,
    })));
  } catch (error) {
    console.error('[GET /api/savings-goals]', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, current, target, deadline, color } = await req.json();
    if (!title || !target || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const goal = await prisma.savingsGoal.create({
      data: { title, current: Number(current ?? 0), target: Number(target), deadline, color: color ?? 'blue' },
    });
    return NextResponse.json({ id: goal.id, title: goal.title, current: goal.current, target: goal.target, deadline: goal.deadline, color: goal.color }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/savings-goals]', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
