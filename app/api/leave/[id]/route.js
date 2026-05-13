import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const leaves = dbOps.getLeaveApplications();
    const leave = leaves.find((l) => l.id === id);

    if (!leave) {
      return NextResponse.json(
        { error: 'Leave application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ leave });
  } catch (error) {
    console.error('[v0] Get leave error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave application' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { action, approvedBy } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    let leave;
    if (action === 'approve') {
      leave = dbOps.approveLeave(id, approvedBy);
    } else {
      leave = dbOps.rejectLeave(id, approvedBy);
    }

    if (!leave) {
      return NextResponse.json(
        { error: 'Leave application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ leave });
  } catch (error) {
    console.error('[v0] Update leave error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave application' },
      { status: 500 }
    );
  }
}
