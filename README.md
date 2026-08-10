# Cadastro de Clientes — API REST

Backend REST API para cadastro e gerenciamento de usuários e clientes, com autenticação JWT e recuperação de senha por email.

---

## Pré-requisitos

| Software | Versão mínima | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org) | 20.x | Runtime da aplicação |
| npm | 10.x | Gerenciador de pacotes |
| [Docker](https://www.docker.com) | 24.x | Banco de dados PostgreSQL |
| [Docker Compose](https://docs.docker.com/compose/) | v2 | Orquestração do container |

> PostgreSQL roda via Docker — não é necessário instalá-lo separadamente.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados (deve coincidir com as credenciais do docker-compose.yml)
DATABASE_URL="postgresql://root:root@localhost:5432/cadastro-clientes-node-ts"

# JWT — use strings longas e aleatórias em produção
JWT_SECRET="sua_chave_secreta_jwt"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="sua_chave_secreta_refresh"
```

---

## Instalação e Execução

**1. Instalar dependências**

```bash
npm install
```

**2. Subir o banco de dados**

```bash
docker-compose up -d
```

**3. Aplicar as migrations**

```bash
npx prisma migrate deploy
```

**4. Gerar o Prisma Client**

```bash
npx prisma generate
```

**5. Iniciar o servidor em desenvolvimento**

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Servidor com hot reload + logs formatados |
| `npm run build` | Compila para produção (tsc + tsup) |
| `npm start` | Inicia o build de produção |
| `npm test` | Executa testes com cobertura |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | Verifica problemas de lint (ESLint) |
| `npm run prettier` | Formata o código |

---

## Estrutura de Pastas

```
src/
├── index.ts                        # Entry point (porta 3000)
├── infra/http/                     # Server Express e registro de rotas
├── middleware/authMiddleware.ts     # Validação JWT
├── modules/
│   ├── Auth/                       # Login e refresh token
│   ├── User/                       # CRUD de usuário
│   ├── UserClient/                 # CRUD de clientes do usuário (paginado)
│   └── ResetPassword/              # Recuperação de senha por código
├── prisma/
│   ├── schema.prisma               # Modelos do banco
│   ├── migrations/                 # Histórico de migrations
│   └── generated/                  # Prisma Client gerado
└── shared/
    ├── config/env.ts               # Validação das variáveis de ambiente
    ├── infra/
    │   ├── database/prisma.ts      # Singleton do PrismaClient
    │   └── storage/                # Armazenamento local de arquivos
    └── types/                      # AppError, Result<T>, interfaces
```

---

## Observações

- Arquivos de clientes são armazenados localmente em `assets/files/{userId}/{clientId}/`
- O envio de email para recuperação de senha está preparado no código mas desabilitado — configure o SMTP em `src/modules/ResetPassword/utils/SendEmailUtils.ts` para habilitar
- A documentação da API está em `docs/swagger.yaml`
- A documentação de arquitetura está em `docs/ARCHITECTURE.md`
