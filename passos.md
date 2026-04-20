# Passos do Projeto

## Objetivo

Construir uma aplicacao com:

- cadastro de usuarios
- login e logout
- upload de imagens
- CRUD de imagens

### Etapa 1: Estrutura inicial

Status: concluida

Concluido:

- definicao da stack base com `Next.js`, `SQLite` e `Prisma`
- validacao da pasta do projeto `upload-imagens`
- instalacao das dependencias iniciais de backend
- criacao da infraestrutura base para banco, sessao e armazenamento local
- configuracao do `Prisma 7` com adapter oficial do SQLite
- configuracao do banco local em `dev.db`
- criacao e aplicacao da migration inicial do banco

Comandos de instalacao utilizados:

```bash
npm install prisma @prisma/client bcryptjs zod
npm install better-sqlite3 @prisma/adapter-better-sqlite3
npx prisma migrate dev --name init
```

Arquivos principais criados nesta etapa:

- `.env.example`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `lib/prisma.ts`
- `lib/env.ts`
- `lib/password.ts`
- `lib/session.ts`
- `lib/storage.ts`

Proximo passo:

- criar as rotas de autenticacao
- construir as paginas de cadastro e login

### Etapa 2: Autenticação inicial

Status: concluida

Concluido:

- criacao das rotas `register`, `login`, `logout` e `me`
- criacao das paginas `/cadastro`, `/login` e `/dashboard`
- criacao de sessao com cookie `httpOnly`
- protecao inicial da dashboard por sessao

Proximo passo:

- testar cadastro e login com banco local
- iniciar o CRUD de imagens

## Checklist Geral

- [x] Definir stack do projeto
- [x] Criar projeto base em Next.js
- [x] Instalar dependencias iniciais
- [x] Preparar infraestrutura de banco e utilitarios
- [x] Configurar Prisma e migration inicial
- [x] Implementar cadastro de usuario
- [x] Implementar login
- [x] Implementar logout
- [x] Proteger rotas privadas
- [ ] Implementar upload de imagem
- [ ] Implementar listagem de imagens
- [ ] Implementar visualizacao por id
- [ ] Implementar edicao de imagem
- [ ] Implementar exclusao de imagem
- [ ] Construir dashboard
- [ ] Validar fluxo completo