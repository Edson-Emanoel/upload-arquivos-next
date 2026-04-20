# Projeto de Upload e CRUD de Imagens com Autenticacao

## Objetivo

Construir uma aplicacao web com:

- cadastro de usuarios
- login e logout
- upload de imagens
- listagem de imagens
- visualizacao de imagem
- edição de dados da imagem
- exclusão de imagem

## Stack Recomendada

Para este projeto, considerando que não podemos utilizar sites de terceiros, a stack mais viavel é:

- Frontend: Next.js
- Backend: Next.js Route Handlers
- Banco de dados: SQLite
- ORM: Prisma
- Autenticação: sessoes proprias com cookie seguro + bcrypt
- Armazenamento das imagens: sistema de arquivos local do servidor
- Estilização: Tailwind CSS
- Validação: Zod
- Deploy: servidor proprio ou VPS com Node.js

## Por que essa stack?

- `Next.js` permite frontend e backend no mesmo projeto, reduzindo complexidade.
- `SQLite` e simples, leve e muito pratico para projetos locais e estudo.
- `Prisma` acelera o desenvolvimento e facilita o CRUD.
- armazenamento local evita dependencia de servicos externos.
- cookie de sessao com `bcrypt` resolve autenticacao sem depender de provedores externos.

# Funcionalidades do Projeto

### Usuários

- cadastrar usuario
- fazer login
- obter perfil do usuario autenticado

### Imagens

- fazer upload de imagem
- listar imagens do usuario
- buscar imagem por id
- atualizar titulo, descricao ou arquivo
- excluir imagem

## Estrutura Sugerida

```txt
app/
  login/
  cadastro/
  dashboard/
  imagens/
app/api/
  auth/register/
  auth/login/
  auth/me/
  images/
  images/[id]/
components/
lib/
prisma/
```

## Modelagem Inicial do Banco

### Tabela `users`

- `id`
- `name`
- `email`
- `password`
- `createdAt`
- `updatedAt`

### Tabela `images`

- `id`
- `title`
- `description`
- `filename`
- `originalName`
- `mimeType`
- `size`
- `path`
- `userId`
- `createdAt`
- `updatedAt`

Relacao:

- um usuario pode ter varias imagens
- uma imagem pertence a um usuario

# Passo a Passo do Projeto

## 1. Criar o projeto

```bash
npx create-next-app@latest nome-do-projeto
```

Na criacao, escolha:

- TypeScript: sim
- ESLint: sim
- Tailwind CSS: sim
- App Router: sim

## 2. Instalar dependencias principais

```bash
npm install prisma @prisma/client bcryptjs zod cookie
npm install -D tsx
```

## 3. Configurar o Prisma

Inicialize o Prisma:

```bash
npx prisma init
```

No arquivo `.env`, configure:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="sua_chave_secreta"
UPLOAD_DIR="./uploads"
```

## 4. Criar o schema do Prisma

Exemplo inicial:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  images    Image[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Image {
  id          String   @id @default(cuid())
  title       String
  description String?
  filename    String
  originalName String
  mimeType    String
  size        Int
  path        String
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Depois rode:

```bash
npx prisma migrate dev --name init
```

## 5. Criar a conexao com o banco

Criar um arquivo `lib/prisma.ts` para centralizar a instancia do Prisma Client.

Objetivo:

- evitar multiplas conexoes em desenvolvimento
- reutilizar o client em toda a aplicacao

## 6. Implementar cadastro de usuario

Criar rota:

- `POST /api/auth/register`

Regras:

- validar nome, email e senha
- verificar se o email ja existe
- criptografar senha com `bcrypt`
- salvar usuario no banco
- retornar mensagem de sucesso

## 7. Implementar login

Criar rota:

- `POST /api/auth/login`

Regras:

- validar email e senha
- buscar usuario pelo email
- comparar senha com `bcrypt`
- criar sessao autenticada
- salvar identificacao do usuario em cookie `httpOnly` e seguro

## 8. Criar middleware de autenticacao

O middleware ou funcao auxiliar deve:

- ler o cookie da sessao
- validar os dados da sessao
- identificar o usuario autenticado
- proteger rotas privadas

## 9. Implementar rota de perfil

Criar rota:

- `GET /api/auth/me`

Objetivo:

- retornar os dados do usuario logado

## 10. Configurar o armazenamento local

Criar uma pasta para uploads, por exemplo:

```txt
uploads/
```

Criar um arquivo `lib/storage.ts` para centralizar regras de armazenamento.

Essa camada sera usada para:

- salvar imagem no disco
- gerar nome unico para cada arquivo
- remover imagem antiga quando necessario

## 11. Implementar upload de imagem

Criar rota:

- `POST /api/images`

Regras:

- permitir apenas usuario autenticado
- receber titulo, descricao e arquivo
- validar tipo e tamanho do arquivo
- salvar o arquivo no servidor
- salvar os metadados da imagem no banco

## 12. Implementar listagem de imagens

Criar rota:

- `GET /api/images`

Regras:

- listar apenas imagens do usuario autenticado
- ordenar por data de criacao

## 13. Implementar busca por id

Criar rota:

- `GET /api/images/[id]`

Regras:

- retornar apenas se a imagem pertencer ao usuario autenticado

## 14. Implementar atualizacao da imagem

Criar rota:

- `PUT /api/images/[id]`

Possibilidades:

- editar titulo
- editar descricao
- trocar a imagem enviada

Se o arquivo for substituido:

- remover a imagem antiga do servidor
- salvar a nova imagem
- atualizar os metadados no banco

## 15. Implementar exclusao da imagem

Criar rota:

- `DELETE /api/images/[id]`

Regras:

- remover o registro no banco
- remover a imagem do servidor
- garantir que a imagem pertence ao usuario logado

## 16. Criar as paginas do frontend

Paginas principais:

- `/cadastro`
- `/login`
- `/dashboard`
- `/imagens/nova`
- `/imagens/[id]`
- `/imagens/[id]/editar`

## 17. Componentes sugeridos

- formulario de cadastro
- formulario de login
- formulario de upload
- card de imagem
- lista de imagens
- modal de confirmacao para exclusao

## 18. Fluxo do usuario

1. usuario cria conta
2. usuario faz login
3. usuario acessa o dashboard
4. usuario envia uma imagem
5. usuario visualiza sua lista de imagens
6. usuario edita ou exclui uma imagem

## 19. Validacoes importantes

- bloquear upload de arquivos nao permitidos
- limitar tamanho da imagem
- validar campos obrigatorios
- impedir acesso de um usuario aos dados de outro
- proteger rotas privadas
- sanitizar nome de arquivo
- garantir que a pasta `uploads` exista antes de salvar

## 20. Melhorias futuras

- recuperacao de senha
- paginacao da lista de imagens
- busca por titulo
- categorias ou tags
- upload multiplo
- compressao automatica
- testes automatizados
- permissao por perfil

## Ordem Recomendada de Desenvolvimento

1. criar projeto e instalar dependencias
2. configurar banco e Prisma
3. criar cadastro de usuario
4. criar login e autenticacao
5. proteger rotas
6. configurar armazenamento local
7. implementar CRUD de imagens
8. construir telas do frontend
9. validar fluxos
10. fazer deploy

## Endpoints Esperados

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/images
GET    /api/images
GET    /api/images/[id]
PUT    /api/images/[id]
DELETE /api/images/[id]
```

## Como armazenar as imagens sem servicos externos

A abordagem mais direta e:

- salvar os arquivos em uma pasta local como `uploads/`
- registrar no SQLite apenas os metadados da imagem
- servir os arquivos pelo proprio backend

Metadados recomendados no banco:

- nome interno do arquivo
- nome original
- tipo MIME
- tamanho
- caminho relativo
- usuario dono da imagem

## Observacoes Importantes

- essa estrategia funciona muito bem para estudo, portfolio e sistemas internos
- em producao, o servidor precisa manter persistencia em disco
- se houver troca de servidor sem copiar a pasta `uploads`, as imagens serao perdidas
- backups do banco e da pasta de uploads devem ser feitos juntos

## Conclusao

Este projeto pode ser desenvolvido de forma organizada em blocos:

- autenticacao
- upload
- CRUD
- interface
- deploy

A melhor estrategia e comecar pelo backend e autenticacao, depois partir para o armazenamento local e CRUD de imagens, e por fim construir o frontend conectado com as rotas da API.
