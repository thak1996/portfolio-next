# Portfolio Next - Fullstack Portfolio & Painel Administrativo 🚀

Este é um portfólio de desenvolvedor moderno, responsivo e de alta performance construído com Next.js 15, Tailwind CSS, PostgreSQL e Prisma 7. Ele inclui uma interface pública elegante que exibe dinamicamente projetos e habilidades, um formulário de contato integrado ao banco de dados e um **Painel Administrativo** seguro (`/admin`) para gerenciamento completo do conteúdo.

---

## ✨ Principais Funcionalidades

* **Conteúdo Dinâmico**: Projetos e habilidades são carregados diretamente do banco de dados PostgreSQL em tempo de execução.
* **Design Moderno e Responsivo**: Layout premium com cores refinadas (tema Deep Slate e neon Electric Blue) construído com Tailwind CSS, repleto de micro-interações elegantes.
* **Formulário de Contato Inteligente**: Mensagens enviadas por visitantes são salvas imediatamente no banco de dados como "Leads".
* **Painel Administrativo Seguro (`/admin`)**:
  * Protegido por Edge Middleware com sessões autenticadas via Web Crypto HMAC-SHA256 (100% compatível com a Edge do Next.js).
  * **Métricas do Dashboard**: Painel com indicadores rápidos sobre Leads, Projetos e Habilidades.
  * **Gerenciamento de Leads**: Listagem em tempo real de mensagens de contato com detalhes de data, status (`NEW`, `READ`, `CONTACTED`, `ARCHIVED`) e controle para leitura completa e alteração de status.
  * **CRUD de Projetos**: Criação, edição e exclusão de projetos com suporte a títulos, descrições, URLs de imagens, tags dinâmicas de tecnologias, links personalizados e destaque (*featured*).
  * **CRUD de Habilidades (Skills)**: Controle total de habilidades por categoria, incluindo descrição, tags e seleção de ícone baseado no Material Symbols do Google.
* **Infraestrutura Moderna**: Integração com PostgreSQL via Docker Compose e Prisma 7 configurado com Driver Adapters (`@prisma/adapter-pg` + `pg`) para alta eficiência de conexões.

---

## 🛠 Tecnologias Utilizadas

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **ORM**: [Prisma 7](https://www.prisma.io/)
* **Banco de Dados**: [PostgreSQL 16](https://www.postgresql.org/) (Containerizado via Docker)
* **Estilização**: [Tailwind CSS v3](https://tailwindcss.com/)
* **Ícones**: [Material Symbols](https://fonts.google.com/icons)
* **Autenticação**: Sessões via Cookie seguro assinadas com Web Crypto API (zero dependências pesadas do Node no Middleware de borda)
* **Linguagem**: TypeScript

---

## 🚀 Como Iniciar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### 1. Pré-requisitos
Certifique-se de possuir instalado:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose

### 2. Configurar as Variáveis de Ambiente
Na raiz do projeto, crie um arquivo `.env` a partir do arquivo `.env.example`:
```bash
cp .env.example .env
```
O arquivo já vem pré-configurado por padrão para apontar para a porta do container Docker (`5433`):
```env
# URL do Banco de Dados PostgreSQL (Local via Docker por padrão)
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5433/portfolio_db?schema=public"

# Configurações de Autenticação Administrativa
JWT_SECRET="super-secret-key-change-this-in-production-12345678"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="adminpassword123"
```

### 3. Iniciar o Banco de Dados no Docker
Suba o container do PostgreSQL em segundo plano:
```bash
docker compose up -d
```
> 💡 **Nota:** O banco roda na porta `5433` localmente para evitar conflitos com outras instalações locais padrão do PostgreSQL que costumam usar a porta `5432`.

### 4. Executar Migrações e Alimentar o Banco de Dados (*Seeding*)
Com o container do PostgreSQL rodando, execute as migrations do Prisma para estruturar as tabelas e rode o script de seed para criar os dados de demonstração (Projetos, Habilidades e Usuário Admin):
```bash
# Executa as migrações no banco
npx prisma migrate dev

# Popula o banco com os dados iniciais e cria o usuário administrador
npx tsx prisma/seed.ts
```

### 5. Iniciar o Servidor de Desenvolvimento
Instale as dependências e inicie o Next.js:
```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o portfólio.

---

## 🔐 Acesso ao Painel Administrativo

Acesse a rota `/admin` (ou [http://localhost:3000/admin](http://localhost:3000/admin)).
Insira as credenciais padrão geradas pelo seed:

* **Usuário**: `admin`
* **Senha**: `adminpassword123`

> ⚠️ **Segurança**: Lembre-se de alterar as variáveis `ADMIN_USERNAME` e `ADMIN_PASSWORD` no arquivo `.env` antes de rodar o comando de seed em produção ou ambientes reais.

---

## 📁 Arquitetura do Projeto

```mermaid
graph TD
    subgraph Cliente [Camada do Cliente / Navegador]
        UI[Portfolio Público]
        AdminUI[Dashboard Admin CRUD]
        Contact[Formulário de Contato]
    end

    subgraph Server [Servidor Next.js 15]
        Middle[Middleware de Borda - Sessão Web Crypto]
        Actions[Server Actions CRUD & Leads]
        Prisma[Prisma Client + Driver Adapter pg]
    end

    subgraph DB [Banco de Dados]
        PG[(PostgreSQL no Docker)]
    end

    UI --> Actions
    Contact -->|Salvar Mensagem| Actions
    AdminUI -->|Autenticação| Middle
    Middle -->|Sessão Válida| AdminUI
    Actions --> Prisma
    Prisma --> PG
```

### Destaques da Estrutura:
* `docker-compose.yml`: Configura o container Postgres 16 em Alpine.
* `prisma/schema.prisma`: Define as entidades (`User`, `Project`, `Skill`, `Lead`) e o enum `LeadStatus`.
* `prisma/seed.ts`: Remove dados antigos e semeia novos registros com senhas devidamente criptografadas via `bcryptjs`.
* `prisma.config.ts`: Define as rotas do schema e migrações no ecossistema Prisma 7.
* `src/middleware.ts`: Protege as rotas `/admin/*` usando verificação de tokens em tempo de execução de borda (*Edge-compatible*).
* `src/lib/db.ts`: Gerencia a instância única (*Singleton*) do `PrismaClient` acoplada ao pool de conexões do driver nativo `pg`.
* `src/lib/session.ts`: Lógica ultraveloz de codificação/verificação de cookies utilizando a API nativa Web Crypto.

---

## 📈 Modelos do Banco de Dados

### `User`
Credenciais seguras de login do painel administrativo.
* `id` (UUID, Chave Primária)
* `username` (Texto, Único)
* `password` (Texto, Hash Bcrypt)
* `createdAt` / `updatedAt`

### `Project`
Modelagem dos projetos do portfólio.
* `id` (UUID, Chave Primária)
* `title` (Texto)
* `description` (Texto)
* `imageUrl` (Texto, link direto para imagem)
* `tags` (Array de Texto nativo do PostgreSQL)
* `detailsLink` (Texto, link de destino)
* `featured` (Booleano para destaque)
* `createdAt` / `updatedAt`

### `Skill`
Modelagem das competências e habilidades técnicas.
* `id` (UUID, Chave Primária)
* `title` (Texto)
* `category` (Texto, ex: 'Web Frontend', 'Mobile')
* `description` (Texto)
* `tags` (Array de Texto)
* `icon` (Texto, correspondente a um ícone da Google Material Symbols)
* `createdAt` / `updatedAt`

### `Lead`
Mensagens de contato recebidas através do formulário público.
* `id` (UUID, Chave Primária)
* `name` (Texto, nome do remetente)
* `email` (Texto, e-mail de contato)
* `message` (Texto, corpo da mensagem)
* `status` (Enum: `NEW`, `READ`, `CONTACTED`, `ARCHIVED`)
* `createdAt` (Data de envio)

---

## 🚀 Scripts Disponíveis

No diretório do projeto, você pode executar:
* `npm run dev`: Executa a aplicação no modo de desenvolvimento local com *hot reloading*.
* `npm run build`: Compila a aplicação para produção de forma altamente otimizada.
* `npm run start`: Inicia o servidor Next.js em ambiente de produção após a conclusão do build.
* `npm run lint`: Executa a análise estática do ESLint para validar boas práticas do código.
* `npm run format`: Executa o Prettier para formatar automaticamente arquivos TS, TSX e CSS.
* `npm run typecheck`: Valida a integridade dos tipos TypeScript em todo o projeto.
