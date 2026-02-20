# Padrões

## 1. Princípios de Projeto e SOLID

A análise do código revela a aplicação de bons princípios de projeto, focando em quebrar um problema maior em partes menores (módulos ou classes). 

### 1.1. Princípio da Responsabilidade Única
O código demonstra uma forte adesão ao Princípio da Responsabilidade Única, que ajuda a manter a coesão das classes. Cada classe apresentada tem um propósito claro e bem definido:
- `CreateUserController`: Lida exclusivamente com a requisição e resposta HTTP do processo de criação de usuário.
- `CreateUserService`: Contém apenas a regra de negócio para a criação do usuário, como verificar se o e-mail já existe e chamar o encriptador de senha.
- `UserRepository`: Fica responsável exclusivamente pela comunicação com o banco de dados (através do Prisma) para as operações de usuário.

### 1.2. Dependency Inversion Principle (Prefira Interfaces a Classes)
O código aplica injeção de dependências por meio dos construtores, o que é uma excelente prática para reduzir o acoplamento estrutural na instanciação. No entanto, há uma **ausência** parcial do Princípio da Inversão de Dependência (DIP) do SOLID, uma vez que as classes dependem de implementações concretas em vez de interfaces ou abstrações. Por exemplo, o `CreateUserService` depende diretamente da classe concreta `UserRepository` e não de uma interface `IUserRepository`. A utilização do princípio "Prefira Interfaces a Classes" poderia ser adotada aqui.

## 2. Padrões de Projeto

Os padrões de projeto facilitam mudanças futuras no código ("design for change") e evitam reinventar a roda.

### 2.1. Singleton (Aplicado implicitamente)
O padrão Singleton garante que uma classe possua, no máximo, uma instância e oferece um ponto único de acesso a ela. O código simula a aplicação deste padrão instanciando e exportando uma única constante (instância) no final de cada arquivo para ser consumida globalmente pela aplicação.

**Exemplo no código:**
```typescript
// Exportação de uma única instância global
export const userRepositoryInstance = new UserRepository(prisma) 
export const encrypterInstance = new Encrypter() 
```
Essa parte do código cria e exporta instâncias singleton das classes UserRepository e Encrypter, seguindo um padrão de injeção de dependências ou singleton para reutilização em toda a aplicação

### 2.2. Strategy (Sugerido)
O padrão Strategy permite parametrizar algoritmos, extraindo diferentes variações ou lógicas de uma classe e delegando-as a objetos intercambiáveis. Atualmente, o provedor Encrypter está rigidamente acoplado à biblioteca `bcrypt`. O padrão Strategy poderia ser aplicado para permitir diferentes algoritmos de hash de forma dinâmica ou para facilitar os testes, substituindo a implementação real por um mock estático.

**Exemplo no código:**
```typescript
// Interface que define a estratégia (Strategy)
export interface IHasherStrategy {
  encrypt(value: string): string;
  compare(value: string, hash: string): boolean;
}

// Estratégia concreta usando Bcrypt
export class BcryptHasherStrategy implements IHasherStrategy {
  encrypt(value: string): string {
    return bcrypt.hashSync(value, 10);
  }
  // ...
}

// Estratégia concreta usando SHA-256 (exemplo)
export class Sha256HasherStrategy implements IHasherStrategy {
  encrypt(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
  // ...
}
```