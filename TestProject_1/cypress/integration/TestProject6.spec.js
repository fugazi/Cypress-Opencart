/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe('Test API with Cypress', () => {
    beforeEach(() => {
        cy.request({
            method: 'GET',
            url: 'https://serverest.dev/usuarios',
        }).as('getUsers');
    });

    it('GET users - Verify the header', () => {
        cy.get('@getUsers')
        .its('headers')
        .its('content-type')
        .should('include', 'application/json; charset=utf-8')
    });

    it('GET users - Verify the server response: status code', () => {
        cy.get('@getUsers')
        .its('status')
        .should('be.equal', 200)
    });

    it('GET users - Verify the response body: usuarios', () => {
        cy.get('@getUsers').should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.usuarios[0]).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
            expect(response.body.usuarios[0].nome).to.equal('Rachel Ondricka')
            expect(response.body.usuarios[0].email).to.equal('Margarett_Kris87@hotmail.com')
            expect(response.body.usuarios[0].password).to.not.be.null
            expect(response.body.usuarios[0]._id).to.equal('0NcJCS5K2EIhZ4Qu')
        });
    });
});
