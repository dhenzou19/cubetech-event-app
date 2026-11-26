import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './login-client';

export default async function StaffLoginPage() {
  const session = await verifyStaffSession();
  
  if (session) {
    redirect('/staff/checkin');
  }

  return <LoginClient />;
}