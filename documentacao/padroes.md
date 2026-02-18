## Princípios e padrões de projeto

Aplicação de princípios SOLID
- Single Responsibility (S): observado — responsabilidades separadas por pastas (`controllers`, `services`, `repositories`, `providers`). Ex.: `UserRepository` cuida apenas de persistência.
- Open/Closed (O): parcial — código é extensível por novas classes, mas faltam abstrações formais (interfaces) que facilitem extensão sem modificação.
- Liskov (L): indeterminado — ausência de interfaces dificulta verificação automática, mas implementações respeitam contratos esperados.
- Interface Segregation (I): parcial — não há muitas interfaces explícitas; classes expõem apenas os métodos necessários.
- Dependency Inversion (D): parcial — há inversão manual (passagem do `prisma` para repositórios), mas falta um container IoC e abstrações (interfaces).

Padrões de projeto identificados

1) Singleton / instancia exportada
- Ex.: `authenticatorInstance`, `encrypterInstance`, `userRepositoryInstance`.
- Código de exemplo:

```ts
export class Authenticator { /* ... */ }
export const authenticatorInstance = new Authenticator()
```

2) Repository Pattern
- `UserRepository` encapsula acesso ao banco (Prisma) e fornece métodos `create`, `update`, `findById`, `findByEmail`.

Padrões sugeridos (valem para melhorias)

- Strategy: para suportar diferentes implementações de storage (local vs S3) ou provedores de autenticação.
- Factory: para montagem de controllers e injeção de dependências durante testes.

Exemplo real do repositório (trecho)

```ts
export class UserRepository {
  constructor(private readonly repository: PrismaClient) {}

  async create(params) { return this.repository.user.create({ data: params }) }
  async findByEmail(email) { return this.repository.user.findUnique({ where: { email } }) }
}

export const userRepositoryInstance = new UserRepository(prisma)
```

Recomendações
- Definir interfaces para repositórios e providers para permitir injeção de dependências e facilitar testes.
- Substituir instâncias globais por fábricas ou usar um container DI para maior flexibilidade.

Arquivo: `documentacao/padroes.md`
