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

    cy.get('#DESTINO').type('Bariloche,Argentina');
    cy.get('#DESTINO').should('have.value', 'Bariloche,Argentina');

    cy.get('#HUESPEDES').type('2');
    cy.get('#HUESPEDES').should('have.value', '2');

    cy.get('#wifi').check();
    cy.get('#wifi').should('be.checked');

    cy.get('#pets').check();
    cy.get('#pets').should('be.checked');

    const fechaEntrada = '2025-07-15';
    const fechaSalida = '2025-07-20';

    cy.get('input[name="fechaEntrada"]')
      .type(fechaEntrada)
      .should('have.value', fechaEntrada);

    cy.get('input[name="fechaSalida"]')
      .type(fechaSalida)
      .should('have.value', fechaSalida);

    cy.wait(2000);  

    cy.contains('button', 'Buscar').click();

    cy.url().should(
      'include',
      '/app/alojamientosResults?cantidad=2&caracteristicas=WIFI%2CMASCOTAS_PERMITIDAS&ciudad=Bariloche&pais=Argentina&rangoFechas=2025-07-15%2C2025-07-20',
    );

    cy.contains('.alojamiento-container-header', 'Bariloche, Argentina');

    cy.contains('.alojamiento-card h4', 'Cabaña del Bosque')
      .parent() // Sube al div.card-content
      .within(() => {
        cy.get('h4').should('have.text', 'Cabaña del Bosque');
        cy.contains('p', 'Precio por noche: $').should(
          'have.text',
          'Precio por noche: $50000',
        );
      });

    cy.contains('.alojamiento-card h4', 'Loft céntrico con vista al lago')
      .parent() // Sube al div.card-content
      .within(() => {
        cy.get('h4').should('have.text', 'Loft céntrico con vista al lago');
        cy.contains('p', 'Precio por noche: $').should(
          'have.text',
          'Precio por noche: $52000',
        );
      });

    cy.contains('.alojamiento-card h4', 'Dúplex con jardín')
      .parent() // Sube al div.card-content
      .within(() => {
        cy.get('h4').should('have.text', 'Dúplex con jardín');
        cy.contains('p', 'Precio por noche: $').should(
          'have.text',
          'Precio por noche: $45000',
        );
      });
      cy.wait(2000);

    cy.contains('.alojamiento-card h4', 'Cabaña del Bosque')
      .parents('.alojamiento-card-link') // Sube al <a> que contiene toda la card (clickeable)
      .click(); // Click en el enlace de la card

    cy.url().should('include', '/app/alojamiento/');

    cy.get('input[value="dd/mm/yyyy"]').click();

    cy.get('input[placeholder="Early"]').clear().type('jul 15, 2025');
    cy.get('body').type('{enter}');

    cy.get('input[placeholder="Continuous"]').clear().type('jul 20, 2025');
    cy.get('body').type('{enter}');

    cy.get('input[placeholder="Early"]').should('have.value','jul 15, 2025');
    cy.get('input[placeholder="Continuous"]').should('have.value','jul 20, 2025');

    cy.get('body').type('{esc}');

    cy.get('.search-field')
      .contains('label', 'HUÉSPEDES') // Encuentra el field por su label
      .parent() // Sube al div.search-field
      .find('input[name="cantHuespedes"]') // Encuentra el input exacto
      .as('huespedesInput'); // Alias para reutilizar

    cy.get('@huespedesInput')
      .invoke('val', '2')
      .trigger('input') // Dispara el evento que React escucha
      .trigger('change') // Dispara el evento change
      .should('have.value', '2'); // Verificación

    cy.wait(2000);

    cy.contains('button', 'Consultar Disponibilidad').click();

    cy.wait(2000);

    cy.contains('button', 'Reservar').click();

    cy.wait(4000);

      cy.get('button[type="button"]').contains('Cerrar').click();
    
    cy.wait(2000);

    cy.contains('span','H').click();
    
    cy.wait(1000);

    cy.contains('button','Cerrar sesión').click();

    cy.wait(1000);

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

    cy.wait(1000);

    cy.contains('a','Reservas recibidas').click();

    cy.wait(4000);

    cy.contains('span','N').click();
    cy.contains('span','N').click();

    cy.wait(2000);

    cy.contains('a','Notificaciones').click();

    cy.wait(2000);

//cambiar las fechas porque ahora ya fueron reservadas y estan bloqueadas
  });
});
