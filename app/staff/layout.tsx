import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import StaffLayoutClient from './layout-client';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-fallback-key-change-this');

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  let role = null;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_session')?.value;
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      role = payload.role as string;
    }
  } catch (e) {
    // Ignore invalid tokens
  }

  return <StaffLayoutClient role={role}>{children}</StaffLayoutClient>;
}