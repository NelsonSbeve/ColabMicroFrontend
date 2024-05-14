describe('Home Component', () => {
  beforeEach(() => {
    cy.visit('/'); // Assuming the component is at the root route
  });

  it('should display a form for adding collaborators', () => {
    cy.get('.add-colab-btn').click();
    cy.get('.add-holiday-form').should('be.visible');
    cy.get('.form-container').should('exist');
  });

  it('should add a new collaborator', () => {
    const newItem = {
      email: `newcolab${Math.floor(Math.random() * 100000)}@example.com`, // Random email
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



    cy.get('.colaborators-list').should('contain', newItem.name);

  });

  it('should search for collaborators by name', () => {
    const searchTerm = 'New Colaborator';

    cy.get('.search-bar').type(searchTerm);
    cy.get('.colaborators-list').find('.colaborator-item').each(($item) => {
      cy.wrap($item).find('.colaborator-name').should('contain', searchTerm);
    });
  });

  it('should fetch collaborators on page load', () => {
    cy.intercept('GET', '/api/items', {
      statusCode: 200,
    }).as('getItems');

    cy.reload();

    cy.get('.colaborators-list').should('exist');
    cy.get('.colaborators-list').should('contain', 'New');

  });
});
