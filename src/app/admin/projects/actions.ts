'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

type ProjectInput = {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  detailsLink?: string | null;
  githubLink?: string | null;
  featured?: boolean;
};

export async function createProject(data: ProjectInput) {
  try {
    await requireAuth();

    if (data.featured) {
      const featuredCount = await prisma.project.count({ where: { featured: true } });
      if (featuredCount >= 4) {
        return { success: false, error: 'Limite máximo de 4 projetos em destaque atingido. Remova o destaque de outro projeto primeiro.' };
      }
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags,
        detailsLink: data.detailsLink || '#',
        githubLink: data.githubLink,
        featured: data.featured ?? false,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    return { success: true, project };
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return { success: false, error: 'Não foi possível salvar o projeto.' };
  }
}

export async function updateProject(id: string, data: ProjectInput) {
  try {
    await requireAuth();

    if (data.featured) {
      const featuredCount = await prisma.project.count({ 
        where: { featured: true, id: { not: id } } 
      });
      if (featuredCount >= 4) {
        return { success: false, error: 'Limite máximo de 4 projetos em destaque atingido. Remova o destaque de outro projeto primeiro.' };
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags,
        detailsLink: data.detailsLink || '#',
        githubLink: data.githubLink,
        featured: data.featured ?? false,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    return { success: true, project };
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    return { success: false, error: 'Não foi possível atualizar o projeto.' };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAuth();

    await prisma.project.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return { success: false, error: 'Não foi possível excluir o projeto.' };
  }
}

export async function uploadImage(formData: FormData) {
  try {
    await requireAuth();

    const file = formData.get('image') as File;
    if (!file) {
      return { success: false, error: 'Nenhum arquivo foi enviado.' };
    }

    // Validação estrita de extensão e tipo
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.pdf'];
    const ext = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return { success: false, error: 'Tipo de arquivo não permitido. Envie apenas imagens ou PDF.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return { success: false, error: 'Erro ao fazer upload da imagem.' };
  }
}
