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
    const randomEmail = `newcolab${Math.floor(Math.random() * 1000000)}@example.com`;
    const newItem = {
      email: randomEmail,
      name: 'New Colaborator',
      address: '123 New Street',
      postalCode: '12345'
    };

    cy.get('.colaborators-list .colaborator-item').its('length').then(initialCount => {
      // Convert initialCount to a number
      const initialCountNumber = Number(initialCount);

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

      // Ensure the new collaborator is added to the list
      cy.get('.colaborators-list').should('contain', newItem.name);

      // Reload the count after adding the new collaborator
      cy.get('.colaborators-list .colaborator-item').its('length').then(finalCount => {
        // Convert finalCount to a number
        const finalCountNumber = Number(finalCount);

        // Compare the final count to the initial count plus one
        expect(finalCountNumber).to.equal(initialCountNumber + 1);
      });
    });
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

describe('Projeto Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: []
    }).as('getProjects');

    cy.intercept('GET', '/api/projects/1/items', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Project 1', startDate: '2023-01-01', endDate: '2023-12-31' },
        { id: 2, name: 'Project 2', startDate: '2023-01-01', endDate: '2023-12-31' }
      ]
    }).as('getProjectItems');

    cy.visit('/');
  });

  it('should fetch and display project items on load', () => {
    cy.get('.buttonProject').first().click();
    cy.wait('@getProjects');
    cy.wait('@getProjectItems');

    cy.get('.colaborators-list').should('exist');
    cy.get('.colaborator-item').should('have.length', 2);
  });

  it('should search projects by name', () => {
    cy.get('.buttonProject').first().click();
    cy.wait('@getProjects');
    cy.wait('@getProjectItems');

    cy.get('.search-barProject').type('Project 1');
    cy.get('.colaborator-item').should('have.length', 1);
    cy.get('.colaborator-item').first().should('contain', 'Project 1');
  });

  it('should handle empty project list', () => {
    cy.intercept('GET', '/api/projects/1/items', {
      statusCode: 200,
      body: []
    }).as('getEmptyProjectItems');

    cy.get('.buttonProject').first().click();
    cy.wait('@getEmptyProjectItems');

    cy.get('.colaborators-list').should('not.exist');
    cy.contains('No projects available.').should('exist');
  });
});
