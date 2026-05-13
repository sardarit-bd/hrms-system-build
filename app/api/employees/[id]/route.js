import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const employee = dbOps.getEmployeeById(id);

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('[v0] Get employee error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    const employee = dbOps.updateEmployee(id, updateData);

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('[v0] Update employee error:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}
