import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { dbOps } from '@/lib/db';

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

    const user = dbOps.findUserById(payload.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('[v0] Me endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
