'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { verifySession, signSession, requireAuth } from '@/lib/session';

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const currentPassword = formData.get('currentPassword') as string;
    const newEmail = formData.get('email') as string;
    const newPassword = formData.get('newPassword') as string;

    if (!currentPassword || !newEmail) {
      return { success: false, error: 'E-mail e Senha Atual são obrigatórios.' };
    }

    // 1. Get current session
    const session = await requireAuth();
    const currentEmail = session.email;

    // 2. Fetch user
    const user = await prisma.user.findUnique({
      where: { email: currentEmail },
    });
    if (!user) return { success: false, error: 'Usuário não encontrado.' };

    // 3. Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) return { success: false, error: 'Senha atual incorreta.' };

    // 4. Update data
    const updateData: any = { email: newEmail };
    if (newPassword && newPassword.length >= 6) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    } else if (newPassword) {
      return { success: false, error: 'A nova senha deve ter pelo menos 6 caracteres.' };
    }

    // Check if new email is already used by someone else
    if (newEmail !== currentEmail) {
      const existing = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existing) return { success: false, error: 'Este e-mail já está em uso.' };
    }

    const updatedUser = await prisma.user.update({
      where: { email: currentEmail },
      data: updateData,
    });

    // 5. Update session if email changed
    if (newEmail !== currentEmail) {
      const secret = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-12345678';
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
      const newToken = await signSession({ email: updatedUser.email, expiresAt }, secret);
      const cookieStore = await cookies();
      cookieStore.set('admin_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 60,
        path: '/',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, error: 'Erro interno ao salvar o perfil.' };
  }
}
