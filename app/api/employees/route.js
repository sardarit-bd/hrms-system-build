import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request) {
  try {
    const employees = dbOps.getEmployees();
    return NextResponse.json({ employees });
  } catch (error) {
    console.error('[v0] Get employees error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const employeeData = await request.json();
    const employee = dbOps.createEmployee(employeeData);
    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create employee error:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
