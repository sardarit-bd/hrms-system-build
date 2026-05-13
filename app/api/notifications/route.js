import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('hrms_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const notifications = dbOps.getNotifications(payload.id);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('[v0] Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const notificationData = await request.json();
    const notification = dbOps.addNotification(notificationData);
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
