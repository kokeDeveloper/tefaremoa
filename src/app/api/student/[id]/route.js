import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = params; // Extract the ID from the request parameters

    try {
        const student = await prisma.student.findUnique({
            where: { id: Number(id) }, // Ensure the ID is a number
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json(student, {
            status: 200,
            statusText: 'Student Retrieved Successfully',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}