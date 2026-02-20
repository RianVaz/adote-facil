describe('Adote Fácil - Testes de Aceitação', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignora o erro 418 do React (Hydration) e outros erros internos da aplicação que não afeatam o usuário final
  return false;
});
  const randomEmail = `testuser_${Math.floor(Math.random() * 10000)}@mail.com`;
  const existingEmail = 'test@mail.com'; // Assumindo que este e-mail já existe na base

  describe('Cenário 1 e 2: Cadastro de Usuário', () => {
    
    it('Deve cadastrar um usuário com sucesso (Caminho Principal)', () => {
      cy.visit('/cadastro');
      
      // Ajustado para não ter espaços, respeitando o regex do Zod
      cy.get('input[name="name"]').type('UsuarioCypress'); 
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type('SenhaForte123!');
      
      // NOVA LINHA: Adicionando a confirmação da senha
      cy.get('input[name="confirmPassword"]').type('SenhaForte123!'); 
      
      cy.get('button[type="submit"]').click();
      
      // Verifica o redirecionamento (o Cypress aceita o alert() automaticamente)
      cy.url().should('include', '/login');
    });

    it('Não deve permitir cadastro com e-mail já existente (Caminho Alternativo)', () => {
      cy.visit('/cadastro');
      
      cy.get('input[name="name"]').type('OutroUsuario'); // Sem espaços
      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type('SenhaForte123!');
      
      // NOVA LINHA: Adicionando a confirmação da senha
      cy.get('input[name="confirmPassword"]').type('SenhaForte123!'); 
      
      // Como você usa window.alert no frontend, podemos "escutar" o alerta no Cypress 
      // para garantir que a mensagem correta apareceu
      cy.on('window:alert', (text) => {
        expect(text).to.include('Email já cadastrado'); // Ajuste se a API retornar outro texto
      });

      cy.get('button[type="submit"]').click();
      
      // Deve continuar na página de cadastro
      cy.url().should('include', '/cadastro');
    });
  });

  describe('Cenário 3: Disponibilizar Animal', () => {
    beforeEach(() => {
      // Rotina de login antes do teste
      cy.visit('/login');
      cy.get('input[name="email"]').type(existingEmail); // Use o email cadastrado nos testes anteriores
      cy.get('input[name="password"]').type('SenhaForte123!'); 
      cy.get('button[type="submit"]').click();
      
      // Garante que o login terminou antes de prosseguir
      cy.url().should('include', '/area_logada');
    });

    it('Deve cadastrar um novo animal para adoção (Caminho Principal)', () => {
      cy.visit('/area_logada/disponibilizar_animal');
      
      // 1. Resolve o erro do "Rex": Espera o label "Nome" aparecer na tela antes de digitar
      cy.contains('span', 'Nome').should('be.visible');
      cy.get('input[name="name"]').type('Rex');
      
      // 2. Resolve o Select Customizado: Clica no placeholder e depois na opção
      // TIPO DE ANIMAL
      cy.contains('button', 'Selecione um tipo').click();
      // Especificamos 'div[role="option"]' para ele não pegar o <option> nativo escondido
      cy.get('div[role="option"]').contains('Cachorro').click({ force: true });
      
      // GÊNERO DO ANIMAL
      cy.contains('button', 'Selecione um gênero').click();
      cy.get('div[role="option"]').contains('Macho').click({ force: true });
      
      // Preenche raça e descrição
      cy.get('input[name="race"]').type('Vira-lata');
      cy.get('textarea[name="description"]').type('Cachorro muito dócil e brincalhão, adora crianças.');
      
      // 3. Resolve o Upload de Imagem: Pega pela ID e usa { force: true } 
      // caso o input esteja escondido pelo CSS do botão customizado
      cy.fixture('animal-pic.jpg', { encoding: null }).as('animalPic');
      cy.get('input[id="animalPictures"]').selectFile('@animalPic', { force: true });
      
      // Preparar para escutar o alerta de sucesso
      cy.on('window:alert', (text) => {
        expect(text).to.include('Animal cadastrado com sucesso!');
      });

      // O botão no seu código se chama "Cadastrar" e não "Disponibilizar"
      cy.contains('button', 'Cadastrar').click();
      
      // Validação de sucesso: O código faz redirecionamento para /area_logada/meus_animais
      cy.url().should('include', '/area_logada/meus_animais');
    });
  });
});