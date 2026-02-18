## Análise da arquitetura adotada

Resumo curto
- Tipo: monolito modular (frontend Next.js + backend REST em Node/Express).
- Estilo: arquitetura em camadas (Presentation -> Controllers -> Services -> Repositories -> Database), com camadas de infra/fornecedores (providers), middlewares e config isolada.

Justificativa (evidências no código)
- Estrutura de pastas do backend mostra separação por responsabilidade: `controllers/`, `services/`, `repositories/`, `providers/`, `middlewares/`, `config/`.
- `src/app.ts` monta o servidor Express e registra middlewares e rotas — camada de apresentação (HTTP).

Exemplo (trecho simplificado de `src/app.ts`):

```ts
import express from 'express'
const app = express()
app.use(express.json())
app.use(router)
```

- `src/routes.ts` orquestra rotas e faz ligação entre requests e controllers, aplicando middlewares como autenticação e multer.
- Repositórios usam Prisma (`src/database.ts` exporta `prisma = new PrismaClient()`), por exemplo `repositories/user.ts` encapsula persistência.

Diagrama de componentes
- Há um fluxo claro: Frontend (Next.js) <-> Router/Controllers -> Services -> Repositories -> Prisma (DB). Providers (Authenticator, Encrypter) e Middlewares são componentes transversais.
- Um diagrama PlantUML foi adicionado em `documentacao/diagrama.puml` para visualização gráfica.

Notas sobre estilo arquitetural
- Monolito modular: frontend e backend na mesma repo, separados por contrato HTTP.
- Camadas bem definidas facilitam testes e manutenção. A injeção manual de dependências (instâncias exportadas) fornece desacoplamento simples.

Possíveis melhorias
- Introduzir interfaces (ex.: `IUserRepository`, `IEncrypter`) para permitir mocks e testes isolados.
- Considerar um container de injeção (IoC) para composições mais flexíveis em produção ou testes.

Arquivo: `documentacao/arquitetura.md`

