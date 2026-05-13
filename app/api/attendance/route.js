import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');

    let attendance;
    if (employeeId) {
      attendance = dbOps.getAttendanceByEmployee(employeeId);
    } else if (date) {
      attendance = dbOps.getAttendanceByDate(date);
    } else {
      attendance = [];
    }

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('[v0] Get attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const attendanceData = await request.json();
    const attendance = dbOps.createAttendance(attendanceData);
    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create attendance error:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
}
