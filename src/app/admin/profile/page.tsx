import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-12345678';
  
  if (!token) {
    redirect('/admin/login');
  }

  const session = await verifySession(token, secret);
  if (!session || !session.email) {
    redirect('/admin/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-xl max-w-2xl">
      <div className="flex flex-col gap-xs mb-xl">
        <h1 className="font-h2 text-h2 text-primary font-bold">Meu Perfil</h1>
        <p className="text-on-surface-variant font-body-md">
          Atualize suas credenciais de acesso.
        </p>
      </div>
      
      <ProfileClient initialEmail={user.email} />
    </div>
  );
}
