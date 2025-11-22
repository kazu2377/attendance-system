import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getPrisma } from '@/lib/prisma';
// ★この行を追加します
export const runtime = 'edge';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);
    const { id } = await params;

    try {
        const body = await request.json();
        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title: body.title,
                start: new Date(body.start),
                end: body.end ? new Date(body.end) : null,
                allDay: body.allDay,
                description: body.description,
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { env } = getRequestContext();
    const prisma = getPrisma(env.DB);
    const { id } = await params;

    try {
        await prisma.event.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
