'use server';

import { db } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'; // <-- Added redirect to the top imports

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-fallback-key-change-this');

export async function loginStaff(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Please enter both username and password.' };
  }

  // 1. Find the staff user in the database
  const staff = await db.orm.public.StaffUser.where({ username }).first();

  if (!staff) {
    return { error: 'Invalid username or password.' };
  }

  // 2. Compare the password with the hashed password in the database
  const isValid = await bcrypt.compare(password, staff.passwordHash);

  if (!isValid) {
    return { error: 'Invalid username or password.' };
  }

  // 3. Create a secure JWT session token
  const token = await new SignJWT({ 
    staffId: staff.id, 
    role: staff.role,
    name: staff.name 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  // 4. Set the cookie (HTTP-Only for security)
  const cookieStore = await cookies();
  cookieStore.set('staff_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { success: true };
}

// ✅ The logout function, using the top-level imports
export async function logoutStaff() {
  const cookieStore = await cookies();
  cookieStore.delete('staff_session');
  redirect('/');
}