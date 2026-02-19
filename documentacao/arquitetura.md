# Análise da arquitetura adotada

O projeto adota uma Arquitetura em Camadas, organizada dentro de um Monólito Modular (onde frontend e backend coexistem no mesmo repositório, mas são independentes).

**Tipo**: monolito modular (frontend Next.js + backend REST em Node/Express).

**Estilo**: Arquitetura em camadas do backend.
- Controllers: Atuam nos endpoints do sistema, validando a entrada de dados e delegando o processamento para os serviços apropriados.
- Middlewares: Interceptam requisições HTTP para realizar validações antes que cheguem aos controllers.
- Providers: Camada especializada em serviços de infraestrutura, como autenticação e criptografia de dados.
- Repositories: Responsáveis pela lógica de persistência e transações diretas com o banco de dados.
- Services: Camada central que detém a lógica de negócio. Interagem com os repositórios para realizar as operações solicitadas.

### Justificativa
A decisão de separar o backend do frontend em contêineres separados, permite que o desenvolvimento de ambos ocorra de forma independente, ou seja, facilitando o escalonamento, flexibilidade e o deploy do sistema.

Além disso, na parte do backend, a decisão de utilizar a arquitetura em camadas promove a organização, manutenibilidade e os testes realizados nos códigos, centralizando esse módulo como um monolito.

### Diagrama de Componentes

![Diagrama de Componentes](Diagrama_componente.jpeg)

