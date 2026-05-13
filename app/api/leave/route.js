import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const filters = {};
    if (status) filters.status = status;
    if (employeeId) filters.employeeId = employeeId;

    const leaves = dbOps.getLeaveApplications(filters);
    return NextResponse.json({ leaves });
  } catch (error) {
    console.error('[v0] Get leaves error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave applications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const leaveData = await request.json();
    const leave = dbOps.createLeaveApplication(leaveData);
    return NextResponse.json({ leave }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create leave error:', error);
    return NextResponse.json(
      { error: 'Failed to create leave application' },
      { status: 500 }
    );
  }
}
