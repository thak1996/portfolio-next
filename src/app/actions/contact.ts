'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, error: 'Por favor, preencha todos os campos obrigatórios.' };
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'E-mail inválido. Por favor, verifique.' };
  }

  try {
    // Criar o registro de Lead no banco PostgreSQL
    await prisma.lead.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Revalidar rotas administrativas para refletir o novo contato
    revalidatePath('/admin');
    revalidatePath('/admin/leads');

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar lead de contato:', error);
    return { success: false, error: 'Ocorreu um erro interno ao enviar sua mensagem. Tente novamente.' };
  }
}
