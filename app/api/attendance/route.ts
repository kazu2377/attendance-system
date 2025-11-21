import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// ★この行を追加します
export const runtime = 'edge';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const records = await prisma.attendance.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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
            // Find the latest active record
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
