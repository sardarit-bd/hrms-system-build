import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name, department } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = dbOps.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = dbOps.createUser({
      email,
      password: hashPassword(password),
      name,
      role: 'employee',
      department: department || 'General',
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        },
      },
      { status: 201 }
    );

    // Set secure httpOnly cookie
    response.cookies.set({
      name: 'hrms_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
