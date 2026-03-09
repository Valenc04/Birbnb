describe('Test de búsqueda', () => {
  it('Debe escribir "BARILOCHE" en el campo DESTINO', () => {
    cy.visit('http://localhost:3001/app'); //deberiamos poner el url de netlify
    
    cy.get('#DESTINO').type('Bariloche,Argentina');
    cy.get('#DESTINO').should('have.value', 'Bariloche,Argentina');

    cy.get('#HUESPEDES').type('2');
    cy.get('#HUESPEDES').should('have.value', '2');

    cy.get('#wifi').check();
    cy.get('#wifi').should('be.checked');

    cy.get('#pets').check();
    cy.get('#pets').should('be.checked');

    const fechaEntrada = '2025-07-15';
    const fechaSalida  = '2025-07-20';

    cy.get('input[name="fechaEntrada"]')
      .type(fechaEntrada)
      .should('have.value', fechaEntrada);

    cy.get('input[name="fechaSalida"]')
      .type(fechaSalida)
      .should('have.value', fechaSalida);

    cy.wait(2500);

    cy.contains('button', 'Buscar').click(); // Busca un botón con el texto exacto

    cy.url().should('include', '/app/alojamientosResults?cantidad=2&caracteristicas=WIFI%2CMASCOTAS_PERMITIDAS&ciudad=Bariloche&pais=Argentina&rangoFechas=2025-07-15%2C2025-07-20');

     cy.contains('.alojamiento-container-header', 'Bariloche, Argentina');


     cy.contains('.alojamiento-card h4', 'Cabaña del Bosque')
  .parent() // Sube al div.card-content
  .within(() => {
    cy.get('h4').should('have.text', 'Cabaña del Bosque');
    cy.contains('p', 'Precio por noche: $').should('have.text', 'Precio por noche: $50000');
  });

    cy.contains('.alojamiento-card h4', 'Loft céntrico con vista al lago')
  .parent() // Sube al div.card-content
  .within(() => {
    cy.get('h4').should('have.text', 'Loft céntrico con vista al lago');
    cy.contains('p', 'Precio por noche: $').should('have.text', 'Precio por noche: $52000');
  });

    cy.contains('.alojamiento-card h4', 'Dúplex con jardín')
  .parent() // Sube al div.card-content
  .within(() => {
    cy.get('h4').should('have.text', 'Dúplex con jardín');
    cy.contains('p', 'Precio por noche: $').should('have.text', 'Precio por noche: $45000');
  });

  cy.wait(2000);
  
   cy.contains('.alojamiento-card h4', 'Cabaña del Bosque')
      .parents('.alojamiento-card-link') // Sube al <a> que contiene toda la card (clickeable)
      .click(); // Click en el enlace de la card

    cy.url().should('include', '/app/alojamiento/');

})});