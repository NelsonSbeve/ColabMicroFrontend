describe('Home Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/items', {
      statusCode: 200,
      body: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          street: '123 Street',
          postalCode: '12345'
        }
      ]
    }).as('getItems');
    cy.visit('/');
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
    cy.get('.colaborators-list').should('contain', newItem.name);

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
