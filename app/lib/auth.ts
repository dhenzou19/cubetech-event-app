import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-fallback-key-change-this');

export async function verifyStaffSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}