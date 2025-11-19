import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.event.findMany();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, start, end, allDay, description, userId } = await request.json();
        const event = await prisma.event.create({
            data: {
                title,
                start: new Date(start),
                end: end ? new Date(end) : null,
                allDay,
                description,
                userId,
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
