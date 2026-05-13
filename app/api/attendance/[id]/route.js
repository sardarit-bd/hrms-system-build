import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const allAttendance = [
      ...(dbOps.getAttendanceByEmployee(id) || []),
    ];

    const record = allAttendance.find((a) => a.id === id);

    if (!record) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ attendance: record });
  } catch (error) {
    console.error('[v0] Get attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance record' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    const attendance = dbOps.updateAttendance(id, updateData);

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('[v0] Update attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance record' },
      { status: 500 }
    );
  }
}
