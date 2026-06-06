import { prisma } from '../../src/lib/db';
import bcrypt from 'bcryptjs';

export async function seedUsers() {
  const adminEmail = process.env.ADMIN_EMAIL || 'dev@franklyndev.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
    },
  });
  console.log(`Usuário administrador criado: "${admin.email}"`);
}
