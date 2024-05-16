describe('Home Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/items', {
      statusCode: 200,
    }).as('getItems');
    cy.visit('/');
  });

  it('Get number of list', () => {


    // Ensure the collaborators list exists
    cy.get('.colaborators-list').should('exist').its('length').as('initialCollaboratorCount');

    cy.reload();

  // After reloading the page, get the number of items on the collaborators list again
    cy.get('.colaborators-list').its('length').as('finalCollaboratorCount');

    cy.get('@initialCollaboratorCount').then(initialCount => {
      cy.get('@finalCollaboratorCount').then(finalCount => {
        expect(finalCount).to.equal(initialCount);})});



  });


  it('should open and close the add collaborator form', () => {
    cy.get('.add-colab-btn').click();
    cy.get('.add-holiday-form').should('be.visible');
    cy.get('.close').click();
    cy.get('.add-holiday-form', { timeout: 10000 }).should('not.exist');
  });

  it('should add a new collaborator', () => {
    const randomEmail = `newcolab${Math.floor(Math.random() * 100000)}@example.com`;
    const newItem = {
      email: randomEmail,
      name: 'New Colaborator',
      address: '123 New Street',
      postalCode: '12345'
    };
    cy.get('.colaborators-list').should('exist').its('length').as('initialCollaboratorCount');

    cy.intercept('POST', '/api/items', {
      statusCode: 200,
      body: newItem
    }).as('addItem');

    cy.get('.add-colab-btn').click();
    cy.get('#email').type(newItem.email);
    cy.get('#name').type(newItem.name);
    cy.get('#address').type(newItem.address);
    cy.get('#postalCode').type(newItem.postalCode);
    cy.get('form').submit();

    cy.get('.add-holiday-form').should('not.exist');

    cy.get('.colaborators-list').should('contain', newItem.name).its('length').as('finalCollaboratorCount');
    cy.get('@initialCollaboratorCount').then(initialCount => {
      cy.get('@finalCollaboratorCount').then(finalCount => {
        expect(finalCount).to.equal(finalCount);})});

  });

  it('should search for collaborators by name', () => {
    cy.get('.search-bar').type('New');
    cy.get('.colaborators-list').find('.colaborator-item').each(($item) => {
      cy.wrap($item).find('.colaborator-name').should('contain', 'New');
    });
  });

  it('should fetch collaborators on page load', () => {
    cy.reload();

      cy.get('.colaborators-list').should('exist');
      cy.get('.colaborators-list').should('contain', 'New');

  });

  // it('should view holidays for a collaborator', () => {
  //   cy.get('.colaborators-list').contains('Holidays').click();
  //   cy.get('@viewHolidays').should('have.been.called');
  // });

  // it('should view projects for a collaborator', () => {
  //   cy.get('.colaborators-list').contains('Projects').click();
  //   cy.get('@viewProjects').should('have.been.called');
  // });
});
