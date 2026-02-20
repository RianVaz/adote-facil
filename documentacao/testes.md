
---

# Documentação de Testes - Adote Fácil

Este projeto utiliza testes unitários no Backend (com Jest) e testes de aceitação/End-to-End (E2E) no Frontend (com Cypress) para garantir a qualidade e a integração contínua do sistema.

---

## 1. Análise e Propostas de Melhorias para os Testes Unitários

Analisando os arquivos `create-user.spec.ts` e `create-animal.spec.ts`, nota-se que os testes cobrem bem os fluxos principais. No entanto, existem pontos de melhoria estruturais e arquiteturais importantes para garantir a confiabilidade da sua suíte.

### Melhorias Estruturais (Gerais)

* **Substituir `beforeAll` por `beforeEach`:** Atualmente, a instância da classe sob teste (`sut`) e os *mocks* são inicializados no `beforeAll`. Isso significa que o estado é compartilhado entre todos os blocos `test`. Se um teste modificar o comportamento de um *mock* (como feito em `userRepository.findByEmail.mockResolvedValueOnce`), isso pode vazar e quebrar testes subsequentes se a ordem de execução mudar. O ideal é isolar completamente o contexto usando `beforeEach`.

### Melhorias para `create-user.spec.ts`

* **Cobertura de Exceções Inesperadas:** O que acontece se o banco de dados cair e o `userRepository.create` lançar um erro (`throw new Error`)? É importante ter um teste validando se o serviço lida bem com exceções não mapeadas.
* **Validação de Dados:** Se o seu serviço for responsável por alguma validação de domínio (ex: não aceitar senhas muito curtas), seria interessante adicionar esses casos de teste.

### Melhorias para `create-animal.spec.ts`

* **Evitar `@ts-expect-error`:** No teste de falha, o uso de `// @ts-expect-error` para forçar o retorno `null` indica que a tipagem do seu repositório não prevê retorno nulo na criação, ou que ele deveria lançar uma exceção em caso de erro. O ideal é que, se a criação falhar, o repositório lance um erro e o serviço use um bloco `try/catch` para retornar um *Failure*.
* **Falha no Relacionamento (Imagens):** O teste verifica o *loop* de salvamento de imagens, mas não testa o que acontece se o `animalImageRepository.create` falhar no meio do processo. O sistema deixa um animal "órfão" sem imagens? Adicionar um teste para essa falha ajudaria a desenhar e validar uma transação de banco de dados (*rollback*).

---

## 2. Cenários de Teste de Aceitação (Linguagem Natural)

Estes cenários focam na perspectiva do usuário final, testando a integração de ponta a ponta simulando o comportamento real.

### Cenário 1: Cadastro de usuário com sucesso (Caminho Principal)

**Objetivo:** Garantir que um novo visitante consegue criar uma conta no sistema.

> * **Dado** que o usuário está na página de `/cadastro`
> * **Quando** ele preenche o campo "Nome" com dados válidos
> * **E** preenche o campo "E-mail" com um e-mail não utilizado
> * **E** preenche o campo "Senha" com uma senha segura
> * **E** clica no botão "Cadastrar"
> * **Então** o sistema deve exibir uma mensagem de sucesso
> * **E** o usuário deve ser redirecionado para a página de `/login` (ou área logada).
> 
> 

### Cenário 2: Tentativa de cadastro com e-mail já existente (Caminho Alternativo)

**Objetivo:** Garantir que o sistema impede a duplicação de contas.

> * **Dado** que o usuário está na página de `/cadastro`
> * **Quando** ele preenche os campos corretamente
> * **Mas** utiliza um e-mail que já está registrado no banco de dados
> * **E** clica no botão "Cadastrar"
> * **Então** o sistema deve permanecer na página de cadastro
> * **E** deve exibir uma mensagem de erro informando *"Email já cadastrado"*.
> 
> 

### Cenário 3: Disponibilizar um novo animal para adoção (Caminho Principal)

**Objetivo:** Validar se um usuário autenticado consegue cadastrar um animal.

> * **Dado** que o usuário está autenticado no sistema
> * **E** acessa a página `/area_logada/disponibilizar_animal`
> * **Quando** ele preenche os dados do animal (Nome, Tipo, Gênero, Raça e Descrição)
> * **E** faz o upload de pelo menos uma foto do animal
> * **E** clica no botão "Disponibilizar"
> * **Então** o sistema deve exibir uma notificação de sucesso
> * **E** o animal deve aparecer na lista de "Meus Animais" ou "Animais Disponíveis".
> 
> 

---

## 3. Guia de Execução: Testes Unitários (Backend)

Os testes unitários focam nas regras de negócio e serviços da aplicação, utilizando *mocks* para isolar o banco de dados.

**Como executar:**

1. Navegue até a pasta do backend:
`cd backend`
2. Instale as dependências (se ainda não o fez):
`npm install`
3. Execute a suíte de testes:
`npm run test` *(ou `npm test`)*
4. Para ver a cobertura de código (se configurado no `package.json`):
`npm run test:coverage`

---

## 4. Guia de Execução: Testes de Aceitação / E2E (Frontend/Fullstack)

Os testes automatizados com Cypress simulam a jornada real do usuário no navegador, testando a integração entre o frontend e a API.

> **⚠️ Pré-requisitos:** Certifique-se de que o **Backend** e o **Frontend** estejam rodando localmente antes de iniciar os testes E2E, e que o banco de dados esteja acessível.

**Como executar:**

1. Navegue até a pasta raiz (ou a pasta do frontend onde o Cypress foi configurado).
2. Instale as dependências do Cypress:
`npm install cypress --save-dev`
3. **Modo Interativo (Recomendado para desenvolvimento):**
Execute o comando abaixo para abrir a interface gráfica do Cypress, onde você pode ver os testes rodando passo a passo no navegador:
`npx cypress open`
4. **Modo Headless (Recomendado para CI/CD):**
Execute o comando abaixo para rodar todos os testes em segundo plano no terminal e gerar um relatório de saída:
`npx cypress run`

---

A documentação ficou bem mais limpa e legível agora! Gostaria que eu te ajudasse a escrever o código de algum desses testes sugeridos no Cypress ou no Jest?