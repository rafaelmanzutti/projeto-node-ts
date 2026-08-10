# Cadastro de Clientes — Arquitetura do Projeto

## Visão Geral

Backend REST API para cadastro e gerenciamento de usuários e clientes.
Cada usuário autenticado gerencia sua própria lista de clientes.
O projeto adota **DDD (Domain-Driven Design)** com **interfaces** como contratos de domínio,
garantindo desacoplamento entre regras de negócio e implementações externas (banco, storage, email).

---

## Stack Tecnológica

| Camada         | Tecnologia                         |
| -------------- | ---------------------------------- |
| Runtime        | Node.js 20+ (ESM)                  |
| Linguagem      | TypeScript 5                       |
| Framework HTTP | Express 5                          |
| ORM / Banco    | Prisma 7 + PostgreSQL              |
| Autenticação   | JWT (access token + refresh token) |
| Validação      | Zod 4                              |
| Hash de senha  | bcrypt                             |
| Email          | Nodemailer (integração preparada)  |
| Logging        | Pino                               |
| Testes         | Jest + ts-jest                     |
| Build          | tsc + tsup                         |

---

## Estrutura de Módulos (DDD)

Cada módulo representa um bounded context com 3 camadas:

```
módulo/
├── application/
│   ├── dtos/         # Contratos de entrada e saída (Input/Output)
│   └── service/      # Regras de negócio (casos de uso)
├── domain/
│   ├── IXRepository  # Interface (contrato) do repositório
│   └── X.ts          # Entidade de domínio
└── infra/
    ├── http/          # Controller + Routes (camada HTTP)
    └── repositories/  # Implementações concretas (Prisma)
```

### Módulos presentes

| Módulo          | Responsabilidade                                            |
| --------------- | ----------------------------------------------------------- |
| `Auth`          | Login com email/senha, renovação de token via refresh token |
| `User`          | CRUD do usuário; cria pasta no filesystem ao registrar      |
| `UserClient`    | CRUD de clientes por usuário; paginação + busca por nome    |
| `ResetPassword` | Recuperação de senha em 3 etapas via código secreto         |

---

## Camada Shared

```
shared/
├── config/env.ts                    # Validação e exportação de variáveis de ambiente (Zod)
├── infra/
│   ├── database/prisma.ts           # Instância singleton do PrismaClient
│   └── storage/
│       └── FileStorageRepository.ts # Implementa IStorageRepository no filesystem
└── types/
    ├── AppError.ts                  # Erro customizado com statusCode
    ├── Result.ts                    # Tipo discriminado Result<T> (ok | err)
    ├── IStorageRepository.ts        # Contrato de armazenamento
    └── express-request.ts           # Extensão do Request do Express (tokenUserId)
```

---

## Pattern Result

Os services nunca lançam exceções para fluxos de negócio esperados — retornam `Result<T>`:

```typescript
type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
```

O controller verifica `result.ok` e traduz para a resposta HTTP adequada.
Erros `>= 500` são logados via Pino e a mensagem retornada ao cliente é genérica.

---

## Autenticação e Autorização

Todas as rotas de `User` (exceto `POST /user`) e todas as rotas de `UserClient` exigem JWT.

Header obrigatório: `Authorization: Bearer <accessToken>`

O `AuthMiddleware`:

1. Valida presença e formato do header
2. Verifica a assinatura do JWT com `JWT_SECRET`
3. Injeta `userId` em `req.tokenUserId`
4. Para rotas com `:id` no path, garante que `userId` do token === `:id` (impede acesso cruzado entre usuários)

---

## Armazenamento de Arquivos

`FileStorageRepository` gerencia pastas locais:

- Criação de usuário → cria `assets/files/{userId}/`
- Criação de cliente → cria `assets/files/{userId}/{clientId}/`
- Deleção de cliente → remove `assets/files/{userId}/{clientId}/` (recursivo)
- Deleção de usuário → remove `assets/files/{userId}/` (recursivo)

---

## Banco de Dados — Modelos

```
User
 └── id, name?, email (único), password (bcrypt), createdAt, updatedAt
      ├── ResetPasswordSecret (1:1) — id, userId, secret (código numérico 6 dígitos)
      └── UserClient[] (1:N)

UserClient
 └── id, name, email?, phone?, createdAt, updatedAt, userId (FK → User)
```

---

## Fluxo de Recuperação de Senha

```
1. POST /reset-password          { email }                       → gera código secreto (6 dígitos)
2. POST /reset-password/validate { email, secret }              → valida o código
3. PATCH /reset-password         { email, secret, newPassword } → redefine a senha
```

> A integração com Nodemailer está preparada no código (`SendEmailUtils`) mas comentada.
> O código secreto é retornado na resposta do passo 1 durante o desenvolvimento.
