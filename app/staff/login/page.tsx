import { verifyStaffSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './login-client'; // We will move the client code to a new file

export default async function StaffLoginPage() {
  // ✅ Check if they are already logged in
  const session = await verifyStaffSession();
  
  // If they have a valid cookie, don't show the login page. Send them to check-in.
  if (session) {
    redirect('/staff/checkin');
  }

  return <LoginClient />;
}