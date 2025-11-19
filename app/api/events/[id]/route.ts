import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { title, start, end, allDay, description } = await request.json();

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title,
                start: new Date(start),
                end: end ? new Date(end) : null,
                allDay,
                description,
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
    try {
        const { id } = await params;
        await prisma.event.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: 'Event deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
