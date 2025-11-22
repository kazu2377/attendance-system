import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function GET() {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);

    try {
        const records = await prisma.attendance.findMany({
            orderBy: { startTime: 'desc' },
        });
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);

    try {
        const { userId, action } = await request.json();

        if (action === 'clock-in') {
            const record = await prisma.attendance.create({
                data: {
                    userId,
                    status: 'Working',
                    startTime: new Date(),
                },
            });
            return NextResponse.json(record);
        } else if (action === 'clock-out') {
            const lastRecord = await prisma.attendance.findFirst({
                where: { userId, status: 'Working' },
                orderBy: { startTime: 'desc' },
            });

            if (lastRecord) {
                const record = await prisma.attendance.update({
                    where: { id: lastRecord.id },
                    data: {
                        endTime: new Date(),
                        status: 'Completed',
                    },
                });
                return NextResponse.json(record);
            } else {
                return NextResponse.json({ error: 'No active session found' }, { status: 400 });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
