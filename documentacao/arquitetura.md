# Análise da arquitetura adotada

O projeto foi organizado usando uma Arquitetura em Camadas. Embora o código do frontend e do backend estejam na mesma pasta para facilitar o trabalho, eles funcionam de forma independente.

**Tipo**: Frontend em Next.js e Backend REST em Node/Express.

**Estilo**: Divisão por camadas no backend.
- Controllers: Recebem as requisições das rotas, conferem se os dados enviados estão certos e passam para os serviços.
- Middlewares: Servem para barrar ou validar algo (como login) antes da requisição chegar ao controller.
- Providers: Funções de apoio para coisas específicas, como gerar senhas criptografadas.
- Repositories: É onde fica o código que mexe direto no banco de dados (usando o Prisma).
- Services: É a parte mais importante, onde ficam as regras de negócio do sistema (o "coração" do projeto).

### Justificativa
A decisão de separar o backend do frontend em contêineres separados, permite que o desenvolvimento de ambos ocorra de forma independente, ou seja, facilitando o escalonamento, flexibilidade e o deploy do sistema.

Além disso, usar camadas no backend ajuda a deixar o código limpo. Se eu precisar mudar a forma como salvo os dados no futuro, eu só mexo na camada de Repositories, sem precisar tocar na regra de negócio que está nos Services. Isso deixa o projeto muito mais fácil de testar e de entender.

### Diagrama de Componentes

![Diagrama de Componentes](diagrama_componente.png)

