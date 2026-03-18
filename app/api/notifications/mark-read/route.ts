import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH() {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[PATCH /api/notifications/mark-read]', error);
    return NextResponse.json({ error: 'Failed to mark notifications read' }, { status: 500 });
  }
}
