# Estágio 1: Instalação de dependências de desenvolvimento e build
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Estágio 2: Compilação e Build da aplicação
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar o Prisma Client nativamente
RUN npx prisma generate

# Executar a build de produção do Next.js (com output standalone ativado)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Estágio 3: Imagem leve de produção (Runtime)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Criar um usuário sem privilégios para segurança do container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instalar curl para suportar o Healthcheck (conforme a imagem de exemplo GOOD)
RUN apk add --no-cache curl

# Copiar o diretório de build standalone otimizado (gerado pelo Next.js com rastreio de dependências)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Healthcheck robusto monitorando a porta do servidor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Executar o servidor de forma nativa e ultra-leve com Node.js puro
CMD ["node", "server.js"]
