'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

type SkillInput = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
};

export async function createSkill(data: SkillInput) {
  try {
    await requireAuth();
    const skill = await prisma.skill.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        tags: data.tags,
        icon: data.icon,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/skills');
    return { success: true, skill };
  } catch (error) {
    console.error('Erro ao criar skill:', error);
    return { success: false, error: 'Não foi possível salvar a habilidade.' };
  }
}

export async function updateSkill(id: string, data: SkillInput) {
  try {
    await requireAuth();
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        tags: data.tags,
        icon: data.icon,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/skills');
    return { success: true, skill };
  } catch (error) {
    console.error('Erro ao atualizar skill:', error);
    return { success: false, error: 'Não foi possível atualizar a habilidade.' };
  }
}

export async function deleteSkill(id: string) {
  try {
    await requireAuth();
    await prisma.skill.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar skill:', error);
    return { success: false, error: 'Não foi possível excluir a habilidade.' };
  }
}
