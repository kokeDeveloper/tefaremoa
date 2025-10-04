import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        const student = await prisma.student.create({
            data: data
        });
        return NextResponse.json(student, {
            status: 201,
            statusText: 'Student Created Successfully',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const existingStudent = await prisma.student.findUnique({
            where: { email },
        });

        return NextResponse.json({ exists: !!existingStudent }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}