import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function GET() {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);

    try {
        const events = await prisma.event.findMany();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);

    try {
        const body = await request.json();
        const event = await prisma.event.create({
            data: {
                title: body.title,
                start: new Date(body.start),
                end: body.end ? new Date(body.end) : null,
                allDay: body.allDay,
                description: body.description,
                userId: 'user-1', // 仮のユーザーID
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
