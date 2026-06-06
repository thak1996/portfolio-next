import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só interceptar rotas que começam com /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    const secret = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-12345678';
    
    const session = token ? await verifySession(token, secret) : null;

    // Se estiver na página de login
    if (pathname === '/admin/login') {
      if (session && session.email) {
        // Já está logado (com a nova sessão), redireciona para o painel principal
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      // Não está logado ou tem sessão antiga
      const response = NextResponse.next();
      if (token && (!session || !session.email)) {
        response.cookies.delete('admin_token');
      }
      return response;
    }

    // Para todas as outras rotas administrativas (/admin, /admin/projects, etc.)
    if (!session || !session.email) {
      // Sem sessão válida, redireciona para o login
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token'); // Força limpar o cookie antigo
      return response;
    }
  }

  return NextResponse.next();
}

// Configurar o matcher para rodar o middleware apenas nas rotas do painel admin
export const config = {
  matcher: ['/admin/:path*'],
};
