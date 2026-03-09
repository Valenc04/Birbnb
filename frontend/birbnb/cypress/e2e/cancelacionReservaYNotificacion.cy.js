describe('Test de búsqueda', () => {
  it('', () => {
    cy.visit('http://localhost:3001/app');

    cy.contains('button', 'Iniciar sesión').should('be.visible');
    cy.contains('button', 'Iniciar sesión').click();

    cy.get('#email').type('huspedUnico@Gmail.com');
    cy.get('#email').should('have.value', 'huspedUnico@Gmail.com');

    cy.get('#password').type('12345678Aa?');
    cy.get('#password').should('have.value', '12345678Aa?');

    cy.wait(2000);

    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('include', '/app');

    cy.contains('span','H').click();

    cy.wait(2000);

    cy.contains('a','Mis reservas').click();

    cy.wait(2000);

    cy.get('button[type="button"]').contains('Cancelar').click();

    cy.wait(2000);

    cy.get('button[type="button"]').contains('Confirmar').click();

    cy.wait(2000);

    cy.contains('span','H').click();

    cy.wait(2000);

    cy.contains('button','Cerrar sesión').click();

    cy.contains('button', 'Iniciar sesión').should('be.visible');
    cy.contains('button', 'Iniciar sesión').click();

    cy.get('#email').type('nicolasreypc@gmail.com');
    cy.get('#email').should('have.value', 'nicolasreypc@gmail.com');

    cy.get('#password').type('Contra123!');
    cy.get('#password').should('have.value', 'Contra123!');

    cy.wait(2000);

    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('include', '/app');

    cy.contains('span','N').click();

    cy.wait(2000);

    cy.contains('a','Notificaciones').click();

    cy.url().should('include', '/app/anfitrion/notificaciones');

    cy.wait(2000);
  
  });
});
