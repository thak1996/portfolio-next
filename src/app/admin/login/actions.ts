'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signSession } from '@/lib/session';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Por favor, preencha todos os campos.' };
  }

  try {
    // 1. Buscar usuário no banco PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }

    // 2. Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }

    // 3. Gerar sessão assinada com expiração de 2 horas
    const secret = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-12345678';
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas
    const token = await signSession({ email: user.email, expiresAt }, secret);

    // 4. Salvar nos cookies seguros (HTTP-Only)
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60, // 2 horas em segundos
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Erro no loginAction:', error);
    return { success: false, error: 'Ocorreu um erro interno. Tente novamente mais tarde.' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return { success: true };
}
