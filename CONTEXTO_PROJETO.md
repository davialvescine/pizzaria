# Documentacao de Contexto do Projeto - Sistema de Pizzaria

## Indice

1. [Visao Geral](#visao-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versoes](#tecnologias-e-versoes)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Sistema de Autenticacao](#sistema-de-autenticacao)
7. [Middlewares](#middlewares)
8. [Validacao com Schemas](#validacao-com-schemas)
9. [Endpoints](#endpoints)
10. [Fluxo de Requisicao](#fluxo-de-requisicao)
11. [Configuracoes do Projeto](#configuracoes-do-projeto)

---

## Visao Geral

Sistema backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, utilizando Express 5 como framework web, Prisma ORM para comunicacao com banco de dados PostgreSQL, e Zod para validacao de dados.

**Principais recursos:**

- Autenticacao JWT com Access Token + Refresh Token
- Rotacao de tokens para seguranca
- Rate limiting para prevenir ataques de forca bruta
- Sistema de roles (STAFF/ADMIN)
- Validacao de dados com Zod

---

## Arquitetura

O projeto segue o padrao **MVC + Service Layer**, com a seguinte estrutura:

```text
Requisicao HTTP -> Rotas -> Middlewares -> Controller -> Service -> Banco de Dados
```

### Camadas da Arquitetura

1. **Rotas (`routes.ts`)**: Define os endpoints e aplica os middlewares
2. **Middlewares**: Rate limiting, validacao de schema, autenticacao e autorizacao
3. **Controllers**: Recebem a requisicao, extraem dados e delegam para o Service
4. **Services**: Contem toda a logica de negocio e comunicacao com o banco de dados
5. **Prisma Client**: ORM que gerencia a comunicacao com PostgreSQL

### Principios Seguidos

- **Separacao de Responsabilidades**: Cada camada tem uma responsabilidade especifica
- **Single Responsibility Principle**: Um controller/service para cada operacao
- **Reutilizacao**: Middlewares compartilhados entre rotas
- **Validacao Centralizada**: Schemas Zod validam dados antes de chegarem ao controller

---

## Tecnologias e Versoes

### Dependencias de Producao

| Tecnologia            | Versao   | Finalidade                                    |
| --------------------- | -------- | --------------------------------------------- |
| **express**           | ^5.2.1   | Framework web para criacao de APIs REST       |
| **@prisma/client**    | ^7.2.0   | ORM para comunicacao com banco de dados       |
| **typescript**        | ^5.9.3   | Superset JavaScript com tipagem estatica      |
| **zod**               | ^4.3.5   | Biblioteca de validacao de schemas e tipagem  |
| **bcryptjs**          | ^3.0.3   | Criptografia de senhas                        |
| **jsonwebtoken**      | ^9.0.3   | Geracao e validacao de tokens JWT             |
| **express-rate-limit**| ^8.2.1   | Rate limiting para protecao contra brute force|
| **cors**              | ^2.8.5   | Middleware para habilitar CORS                |
| **dotenv**            | ^17.2.3  | Carregamento de variaveis de ambiente         |
| **tsx**               | ^4.21.0  | Executor TypeScript para desenvolvimento      |
| **pg**                | ^8.16.3  | Driver PostgreSQL                             |
| **multer**            | ^2.0.0   | Processamento de upload de arquivos           |
| **cloudinary**        | ^2.6.0   | Upload de imagens para nuvem                  |
| **sharp**             | ^0.34.0  | Compressao e redimensionamento de imagens     |

### Dependencias de Desenvolvimento

| Tecnologia              | Versao    | Finalidade                     |
| ----------------------- | --------- | ------------------------------ |
| **@types/express**      | ^5.0.6    | Tipos TypeScript para Express  |
| **@types/cors**         | ^2.8.19   | Tipos TypeScript para CORS     |
| **@types/jsonwebtoken** | ^9.0.10   | Tipos TypeScript para JWT      |
| **@types/bcryptjs**     | ^2.4.6    | Tipos TypeScript para bcryptjs |
| **@types/node**         | ^25.0.3   | Tipos TypeScript para Node.js  |
| **prisma**              | ^7.2.0    | CLI do Prisma ORM              |

### Banco de Dados

- **PostgreSQL** (gerenciado via Prisma ORM)

---

## Estrutura de Pastas

```text
backend/
├── prisma/
│   ├── migrations/               # Historico de migracoes do banco
│   └── schema.prisma             # Schema do banco de dados
├── src/
│   ├── @types/                   # Definicoes de tipos TypeScript customizados
│   │   └── express/
│   │       └── index.d.ts        # Extensao de tipos do Express (userId, userName, userEmail)
│   ├── config/                   # Configuracoes de servicos externos
│   │   ├── cloudinary.ts         # Configuracao do Cloudinary (upload de imagens)
│   │   └── multer.ts             # Configuracao do Multer (processamento de arquivos)
│   ├── controllers/              # Controllers (recebem requisicoes)
│   │   ├── Category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoriesController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── DeleteProductController.ts
│   │   │   └── ListProductsByCategoryController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       ├── DetailUserController.ts
│   │       ├── LogoutController.ts
│   │       └── RefreshTokenController.ts
│   ├── generated/                # Codigo gerado pelo Prisma
│   │   └── prisma/
│   │       └── client.ts
│   ├── middlewares/              # Middlewares customizados
│   │   ├── isAdmin.ts            # Verifica se usuario e admin
│   │   ├── isAuthenticated.ts    # Valida JWT token
│   │   ├── rateLimiter.ts        # Rate limiting para login e refresh
│   │   └── validateSchema.ts     # Valida requisicoes com Zod
│   ├── prisma/                   # Configuracao do Prisma Client
│   │   └── index.ts
│   ├── schemas/                  # Schemas de validacao Zod
│   │   ├── categorySchemas.ts
│   │   ├── productSchemas.ts
│   │   └── userSchemas.ts
│   ├── services/                 # Services (logica de negocio)
│   │   ├── Category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoriesService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── DeleteProductService.ts
│   │   │   └── ListProductsByCategoryService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       ├── DetailUserService.ts
│   │       ├── LogoutService.ts
│   │       └── RefreshTokenService.ts
│   ├── routes.ts                 # Definicao de todas as rotas
│   └── server.ts                 # Configuracao e inicializacao do servidor
├── .env                          # Variaveis de ambiente
├── package.json                  # Dependencias e scripts
├── prisma.config.ts              # Configuracoes adicionais do Prisma
└── tsconfig.json                 # Configuracoes do TypeScript
```

### Convencoes de Nomenclatura

- **Controllers**: `<Action><Entity>Controller.ts` (ex: `CreateUserController.ts`)
- **Services**: `<Action><Entity>Service.ts` (ex: `CreateUserService.ts`)
- **Schemas**: `<entity>Schemas.ts` (ex: `userSchemas.ts`)
- **Middlewares**: `<description>.ts` (ex: `isAuthenticated.ts`)

---

## Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```text
User (1) ─────< (N) RefreshToken
  └─ role: STAFF | ADMIN

Category (1) ─────< (N) Product
                         │
                         └─< (N) Item >─┐
                                        │
Order (1) ─────────────────────────────┘
  └─ items: Item[]
```

### Entidades e Atributos

#### **User** (Usuarios do Sistema)

```typescript
{
  id: string (UUID)           // Identificador unico
  name: string                // Nome completo
  email: string (unique)      // Email (unico)
  password: string            // Senha criptografada (bcrypt)
  role: Role                  // STAFF ou ADMIN
  refreshTokens: RefreshToken[] // Tokens de refresh do usuario
  createdAt: DateTime         // Data de criacao
  updatedAt: DateTime         // Data de atualizacao
}
```

**Enum Role:**

- `STAFF` - Funcionario padrao
- `ADMIN` - Administrador (acesso total)

#### **RefreshToken** (Tokens de Refresh)

```typescript
{
  id: string (UUID)           // Identificador unico
  token: string (unique)      // O token JWT em si
  userId: string              // FK para User
  user: User                  // Relacao com usuario
  expiresAt: DateTime         // Data de expiracao (2 dias)
  createdAt: DateTime         // Data de criacao
}
```

**Seguranca do RefreshToken:**

- Cada refresh token e salvo no banco
- Quando usado, e DELETADO e um novo e criado (rotacao)
- Se hacker tentar usar token ja usado -> nao existe no banco -> BLOQUEADO
- No logout, deletamos todos os tokens -> mesmo valido, nao funciona mais

#### **Category** (Categorias de Produtos)

```typescript
{
  id: string (UUID)           // Identificador unico
  name: string (unique)       // Nome da categoria
  products: Product[]         // Produtos desta categoria
  createdAt: DateTime         // Data de criacao
  updatedAt: DateTime         // Data de atualizacao
}
```

#### **Product** (Produtos/Pizzas)

```typescript
{
  id: string (UUID)           // Identificador unico
  name: string                // Nome do produto
  description: string         // Descricao do produto
  price: number (int)         // Preco em centavos
  banner: string              // URL da imagem
  disabled: boolean           // Produto ativo/inativo
  categoryId: string          // FK para Category
  category: Category          // Relacao com categoria
  items: Item[]               // Itens de pedidos deste produto
  createdAt: DateTime         // Data de criacao
  updatedAt: DateTime         // Data de atualizacao
}
```

**Observacao sobre preco**: O preco e armazenado em **centavos** (inteiro) para evitar problemas com aritmetica de ponto flutuante.

#### **Order** (Pedidos)

```typescript
{
  id: string (UUID)           // Identificador unico
  table: number (int)         // Numero da mesa
  status: boolean             // false = aberto, true = fechado
  draft: boolean              // true = rascunho, false = confirmado
  client: string?             // Nome do cliente (opcional)
  name: string?               // Nome opcional para o pedido
  Items: Item[]               // Itens do pedido
  total: number (int)         // Total em centavos
  createdAt: DateTime         // Data de criacao
  updatedAt: DateTime         // Data de atualizacao
}
```

#### **Item** (Itens dos Pedidos)

```typescript
{
  id: string (UUID)           // Identificador unico
  amount: number (int)        // Quantidade
  orderId: string             // FK para Order
  order: Order                // Relacao com pedido
  productId: string           // FK para Product
  product: Product            // Relacao com produto
  createdAt: DateTime         // Data de criacao
  updatedAt: DateTime         // Data de atualizacao
}
```

### Regras de Delecao (Cascade)

- **User** deletado -> Deleta todos os **RefreshTokens** relacionados
- **Product** deletado -> Deleta todos os **Items** relacionados
- **Order** deletado -> Deleta todos os **Items** relacionados
- **Category** deletada -> Deleta todos os **Products** relacionados

---

## Sistema de Autenticacao

### Fluxo de Autenticacao com JWT

O sistema utiliza **Access Token + Refresh Token** para autenticacao segura:

```text
LOGIN (POST /session)
         │
         ▼
┌─────────────────────────────────┐
│  1. Verifica email/senha        │
│  2. Gera Access Token (15 min)  │
│  3. Gera Refresh Token (2 dias) │
│  4. Salva Refresh Token no DB   │
│  5. Retorna ambos os tokens     │
└─────────────────────────────────┘

ACESSO A ROTAS PROTEGIDAS
         │
         ▼
┌─────────────────────────────────┐
│  Header: Authorization: Bearer  │
│  <access_token>                 │
│                                 │
│  Se expirado -> usa /refresh    │
└─────────────────────────────────┘

REFRESH (POST /refresh)
         │
         ▼
┌─────────────────────────────────┐
│  1. Verifica Refresh Token JWT  │
│  2. Verifica se existe no DB    │
│  3. DELETA token antigo (rotacao)│
│  4. Gera novos tokens           │
│  5. Salva novo refresh no DB    │
│  6. Retorna novos tokens        │
└─────────────────────────────────┘

LOGOUT (POST /logout)
         │
         ▼
┌─────────────────────────────────┐
│  Deleta TODOS os refresh tokens │
│  do usuario no banco            │
│  -> Desloga de todos dispositivos│
└─────────────────────────────────┘
```

### Configuracao dos Tokens

| Token         | Expiracao | Armazenado no DB | Uso                     |
|---------------|-----------|------------------|-------------------------|
| Access Token  | 15 minutos| Nao              | Acessar rotas protegidas|
| Refresh Token | 2 dias    | Sim              | Renovar Access Token    |

### Payload dos Tokens

**Access Token:**

```json
{
  "name": "Nome do Usuario",
  "email": "email@exemplo.com",
  "sub": "user-uuid",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Refresh Token:**

```json
{
  "id": "user-uuid",
  "sub": "user-uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Middlewares

### 1. **isAuthenticated** (`middlewares/isAuthenticated.ts`)

**Funcao**: Valida se o usuario esta autenticado verificando o token JWT.

**Fluxo**:

1. Extrai o token do header `Authorization: Bearer <token>`
1. Verifica se o formato e "Bearer"
1. Verifica a validade do token usando `jsonwebtoken`
1. Extrai `sub`, `name`, `email` do payload do token
1. Adiciona `userId`, `userName`, `userEmail` ao objeto `req`
1. Chama `next()` se valido, ou retorna erro 401 se invalido

**Console.log de debug:**

```text
[AUTH] Token valido - Usuario: email@exemplo.com
[AUTH] Erro: Token invalido ou expirado
[AUTH] Token com erro: <token>
```

**Uso**:

```typescript
router.get("/me", isAuthenticated, new DetailUserController().handle);
```

**Respostas de Erro**:

- `401`: Token nao enviado, formato invalido, ou token invalido/expirado

---

### 2. **isAdmin** (`middlewares/isAdmin.ts`)

**Funcao**: Verifica se o usuario autenticado tem permissao de ADMIN.

**Pre-requisito**: Deve ser usado **apos** o middleware `isAuthenticated`.

**Fluxo**:

1. Obtem `userId` do `req` (adicionado pelo `isAuthenticated`)
1. Busca o usuario no banco de dados
1. Verifica se o campo `role` e igual a `"ADMIN"`
1. Chama `next()` se for admin, ou retorna erro 403 se nao for

**Console.log de debug:**

```text
[ADMIN] Acesso permitido - ADMIN: email@exemplo.com
[ADMIN] Acesso negado - Usuario nao e ADMIN: email@exemplo.com
```

**Uso**:

```typescript
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  new CreateCategoryController().handle
);
```

**Respostas de Erro**:

- `401`: Usuario nao encontrado
- `403`: Acesso negado. Apenas administradores.

---

### 3. **validateSchema** (`middlewares/validateSchema.ts`)

**Funcao**: Valida dados da requisicao (body, query, params) usando schemas Zod.

**Fluxo**:

1. Recebe um schema Zod como parametro
1. Valida `req.body`, `req.query` e `req.params` contra o schema
1. Chama `next()` se valido
1. Retorna erro 400 com detalhes da validacao se invalido

**Console.log de debug:**

```text
[VALIDACAO] Iniciando validacao dos dados...
[VALIDACAO] Dados recebidos: {"name":"Pizzas"}
[VALIDACAO] Dados validos! Continuando...
[VALIDACAO] Erro de validacao: [...]
```

**Uso**:

```typescript
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);
```

**Respostas de Erro**:

- `400`: Erro de validacao com detalhes dos campos invalidos
- `500`: Erro interno do servidor

**Exemplo de resposta de erro**:

```json
{
  "Error": "Erro de Validacao",
  "details": [
    { "campo": ["body", "name"], "Mensagem": "Nome da categoria e obrigatorio" }
  ]
}
```

---

### 4. **rateLimiter** (`middlewares/rateLimiter.ts`)

**Funcao**: Limita o numero de requisicoes por IP para prevenir ataques de forca bruta.

**Configuracoes**:

| Rate Limiter       | Tentativas | Janela | Aplicado em   |
|--------------------|------------|--------|---------------|
| loginRateLimiter   | 5          | 15 min | POST /session |
| refreshRateLimiter | 10         | 15 min | POST /refresh |

**Opcoes**:

- `skipSuccessfulRequests: true` - So conta tentativas falhas (status >= 400)
- `standardHeaders: true` - Retorna info de rate limit nos headers

**Respostas de Erro**:

- `429`: "Muitas tentativas de login. Tente novamente em 15 minutos."

---

## Validacao com Schemas

Utilizamos **Zod** para validacao de dados de entrada. Os schemas ficam organizados na pasta `src/schemas/`.

### User Schemas (`schemas/userSchemas.ts`)

#### **createUserSchema**

Valida criacao de novos usuarios:

```typescript
{
  body: {
    name: string (min: 3, max: 30),
    email: email valido,
    password: string (min: 8, com maiuscula, numero e especial)
  }
}
```

**Validacoes de senha**:

- Minimo 8 caracteres
- Pelo menos uma letra maiuscula
- Pelo menos um numero
- Pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)

#### **authenticateUserSchema**

Valida autenticacao de usuarios:

```typescript
{
  body: {
    email: email valido,
    password: string (obrigatorio)
  }
}
```

#### **refreshTokenSchema**

Valida refresh de token:

```typescript
{
  body: {
    refreshToken: string (obrigatorio)
  }
}
```

### Category Schemas (`schemas/categorySchemas.ts`)

#### **createCategorySchema**

Valida criacao de categorias:

```typescript
{
  body: {
    name: string (min: 2 caracteres)
  }
}
```

---

## Endpoints

### **Rotas Publicas** (nao precisa de login)

#### **POST /users**

Cria um novo usuario no sistema.

**Middlewares**: `validateSchema(createUserSchema)`

**Body**:

```json
{
  "name": "Joao Silva",
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

**Resposta de Sucesso (201)**:

```json
{
  "message": "Usuario criado com sucesso",
  "user": {
    "id": "uuid-gerado",
    "name": "Joao Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "createdAt": "2025-01-09T10:30:00.000Z"
  }
}
```

---

#### **POST /session**

Autentica um usuario e retorna tokens JWT.

**Middlewares**: `loginRateLimiter`, `validateSchema(authenticateUserSchema)`

**Body**:

```json
{
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Joao Silva",
    "email": "joao@example.com",
    "role": "STAFF"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### **POST /refresh**

Renova os tokens usando o refresh token.

**Middlewares**: `refreshRateLimiter`, `validateSchema(refreshTokenSchema)`

**Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Sucesso (200)**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Rotas Protegidas** (precisa de login)

#### **GET /me**

Retorna informacoes do usuario autenticado.

**Middlewares**: `isAuthenticated`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-usuario",
  "name": "Joao Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-01-09T10:30:00.000Z"
}
```

---

#### **POST /logout**

Faz logout do usuario (invalida todos os refresh tokens).

**Middlewares**: `isAuthenticated`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Logout realizado com sucesso"
}
```

---

#### **GET /category**

Lista todas as categorias cadastradas no sistema.

**Middlewares**: `isAuthenticated`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-categoria-1",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-01-09T10:30:00.000Z",
    "updatedAt": "2025-01-09T10:30:00.000Z"
  },
  {
    "id": "uuid-categoria-2",
    "name": "Pizzas Doces",
    "createdAt": "2025-01-09T11:00:00.000Z",
    "updatedAt": "2025-01-09T11:00:00.000Z"
  }
]
```

**Console.log de debug**:

```text
[CONTROLLER] ListCategoriesController - Listando categorias...
[SERVICE] ListCategoriesService - Buscando categorias...
[SERVICE] 2 categoria(s) encontrada(s)
[CONTROLLER] Categorias retornadas com sucesso!
```

---

### **Rotas de Admin** (precisa de login + ser ADMIN)

#### **POST /category**

Cria uma nova categoria de produtos.

**Middlewares**: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Body**:

```json
{
  "name": "Pizzas Doces"
}
```

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizzas Doces",
  "createdAt": "2025-01-09T10:30:00.000Z"
}
```

---

#### **POST /product**

Cria um novo produto com upload de imagem para Cloudinary.

**Middlewares**: `isAuthenticated`, `isAdmin`, `upload.single("file")`, `validateSchema(createProductSchema)`

**Headers**:

```text
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (form-data)**:

| Campo       | Tipo   | Descricao                          |
|-------------|--------|------------------------------------|
| name        | string | Nome do produto (min 2 caracteres) |
| description | string | Descricao (min 10 caracteres)      |
| price       | number | Preco em centavos                  |
| categoryId  | string | UUID da categoria                  |
| file        | file   | Imagem do produto (jpg, png)       |

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizza Margherita",
  "description": "Pizza tradicional com molho de tomate e mussarela",
  "price": 4500,
  "banner": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
  "disabled": false,
  "categoryId": "uuid-categoria",
  "createdAt": "2025-01-09T10:30:00.000Z",
  "updatedAt": "2025-01-09T10:30:00.000Z"
}
```

---

#### **DELETE /product**

Deleta um produto existente.

**Middlewares**: `isAuthenticated`, `isAdmin`, `validateSchema(deleteProductSchema)`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Query String**:

```text
DELETE /product?product_id=uuid-do-produto
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Produto deletado com sucesso"
}
```

---

#### **GET /category/product**

Lista todos os produtos de uma categoria (apenas produtos ativos).

**Middlewares**: `isAuthenticated`, `validateSchema(listProductsByCategorySchema)`

**Headers**:

```text
Authorization: Bearer <access_token>
```

**Query String**:

```text
GET /category/product?category_id=uuid-da-categoria
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "description": "Pizza tradicional com molho de tomate e mussarela",
    "price": 4500,
    "banner": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
    "disabled": false,
    "categoryId": "uuid-categoria",
    "createdAt": "2025-01-09T10:30:00.000Z",
    "updatedAt": "2025-01-09T10:30:00.000Z"
  }
]
```

---

## Fluxo de Requisicao

### Exemplo Completo: Criacao de Categoria

```text
1. POST /category
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Adiciona userId, userName, userEmail ao req
   - Se invalido -> 401
   ↓
3. Middleware: isAdmin
   - Busca usuario no banco
   - Verifica role === "ADMIN"
   - Se nao for admin -> 403
   ↓
4. Middleware: validateSchema(createCategorySchema)
   - Valida name no body
   - Se invalido -> 400
   ↓
5. CreateCategoryController.handle()
   - Extrai name do req.body
   - Instancia CreateCategoryService
   - Chama service.execute()
   ↓
6. CreateCategoryService.execute()
   - Verifica se categoria ja existe
   - Se existe -> throw Error("Categoria ja cadastrada")
   - Cria categoria no banco via Prisma
   - Retorna dados da categoria
   ↓
7. CreateCategoryController.handle()
   - Recebe dados do service
   - Retorna res.status(201).json(category)
   ↓
8. Resposta HTTP 201 com dados da categoria
```

### Console.log do Fluxo Completo

```text
[AUTH] Token valido - Usuario: admin@teste.com
[ADMIN] Acesso permitido - ADMIN: admin@teste.com
[VALIDACAO] Iniciando validacao dos dados...
[VALIDACAO] Dados recebidos: {"name":"Pizzas"}
[VALIDACAO] Dados validos! Continuando...
[POST /category] Criando categoria: Pizzas
[SERVICE] CreateCategoryService - Iniciando...
[SERVICE] Nome da categoria: Pizzas
[SERVICE] Categoria nao existe, criando...
[SERVICE] Categoria criada com sucesso! ID: abc123
[POST /category] Categoria criada com sucesso: Pizzas
```

---

## Configuracoes do Projeto

### TypeScript (`tsconfig.json`)

**Configuracoes Principais**:

- **Target**: ES2020
- **Module**: CommonJS (compativel com Node.js)
- **Strict Mode**: Ativado
- **Output**: `./dist`
- **Root**: `./src`

---

### Prisma (`prisma/schema.prisma`)

**Generator**:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

**Datasource**:

```prisma
datasource db {
  provider = "postgresql"
}
```

---

### Variaveis de Ambiente (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"

# JWT - Chaves de 128 caracteres geradas com crypto
JWT_SECRET="chave-secreta-access-token-128-caracteres"
JWT_REFRESH_SECRET="chave-secreta-refresh-token-128-caracteres"

# Server
PORT=3333
```

**Variaveis Obrigatorias**:

- `DATABASE_URL`: String de conexao PostgreSQL
- `JWT_SECRET`: Chave secreta para Access Token
- `JWT_REFRESH_SECRET`: Chave secreta para Refresh Token

---

### Scripts NPM (`package.json`)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

**Comandos**:

- `npm run dev` - Desenvolvimento com hot-reload
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa em producao

**Comandos Prisma**:

```bash
npx prisma migrate dev --name nome_da_migracao  # Criar migracao
npx prisma migrate deploy                        # Aplicar migracoes
npx prisma studio                                # Abrir Prisma Studio
npx prisma generate                              # Gerar Prisma Client
```

---

## Seguranca

### Autenticacao

- **JWT** com Access Token (15 min) + Refresh Token (2 dias)
- **Rotacao de tokens** - Refresh token e invalidado apos uso
- Tokens enviados no header: `Authorization: Bearer <token>`

### Autorizacao

- Sistema de roles: `STAFF` e `ADMIN`
- Rotas protegidas por middlewares `isAuthenticated` e `isAdmin`

### Protecao contra Brute Force

- **Rate limiting** no login (5 tentativas/15 min)
- **Rate limiting** no refresh (10 tentativas/15 min)

### Criptografia

- **bcryptjs** com salt de 10 rounds para senhas
- Senhas nunca sao retornadas nas respostas da API

### Validacao

- **Zod** valida todos os inputs antes de chegarem a logica de negocio
- Mensagens de erro customizadas em portugues

### Upload de Imagens

O sistema utiliza **Multer + Sharp + Cloudinary** para upload otimizado de imagens:

**Fluxo do Upload**:

```text
Imagem -> Multer (memoryStorage) -> Sharp (compressao) -> Cloudinary (nuvem)
```

**Configuracoes do Multer** (`src/config/multer.ts`):

- **Storage**: `memoryStorage` (imagem fica em buffer, nao salva no disco)
- **Limite de tamanho**: 4MB
- **Formatos aceitos**: JPG e PNG

**Compressao com Sharp**:

- Redimensiona para max 800x800 pixels (mantem proporcao)
- Nao aumenta imagens pequenas
- Converte para JPEG com qualidade 80%

**Cloudinary**:

- Imagens armazenadas na pasta `pizzaria/`
- Upload via stream (buffer direto para nuvem)
- Retorna URL segura (HTTPS)

**Variaveis de ambiente necessarias**:

```bash
CLOUDINARY_NAME="seu-cloud-name"
CLOUDINARY_KEY="sua-api-key"
CLOUDINARY_SECRET="sua-api-secret"
```

---

## Como Iniciar o Projeto

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

1. **Configurar variaveis de ambiente**:

   ```bash
   cp .env.example .env
   # Editar .env com suas configuracoes
   ```

1. **Executar migracoes**:

   ```bash
   npx prisma migrate dev
   ```

1. **Iniciar servidor**:

   ```bash
   npm run dev
   ```

1. **Servidor rodando em**: `http://localhost:3333`

---

**Documento gerado em**: 09/01/2026
**Versao do Projeto**: 1.0.0
