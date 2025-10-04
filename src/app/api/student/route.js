import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { calculatePlanAlertWithStatus } from '@/lib/planAlerts';

export async function POST(request) {
    try {
        const data = await request.json();
        const planEnd = data.planEndDate ? new Date(data.planEndDate) : null;
        const { status } = calculatePlanAlertWithStatus(planEnd);
        const student = await prisma.student.create({
            data: {
                ...data,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                planStartDate: data.planStartDate ? new Date(data.planStartDate) : undefined,
                planEndDate: planEnd || undefined,
                planStatus: status,
            }
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