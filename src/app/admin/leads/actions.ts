'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { LeadStatus } from '@prisma/client';
import { requireAuth } from '@/lib/session';

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await requireAuth();
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status do lead:', error);
    return { success: false, error: 'Não foi possível atualizar o status.' };
  }
}

export async function deleteLead(leadId: string) {
  try {
    await requireAuth();
    await prisma.lead.delete({
      where: { id: leadId },
    });
    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir lead:', error);
    return { success: false, error: 'Não foi possível excluir a mensagem.' };
  }
}
