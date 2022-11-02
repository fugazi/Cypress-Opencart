/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe('Visit Homepage - Democart', () => {
    beforeEach(() => {
        cy.visit('https://demo.opencart.com')
    })
        
    it('Validate the principal container at Homepage', () => {
        cy.get('#logo').should('be.visible')
        cy.get('h3').should('have.text', 'Featured')
        cy.get('[type="button"]').children()
        cy.get('#menu').should('have.class', 'navbar')
        cy.get('#content').should('have.class', 'col')
        cy.get('footer > .container').should('have.class', 'container')
        
    });

    it('Validate SEO Tags at Homepage', () => {
        cy.get('head title').should('contain', 'Your Store')
        cy.get('head meta[name="description"]').should('have.attr', 'content', 'My Store')
        cy.get('head meta[name="viewport"]').should('have.attr', 'content', 'width=device-width, initial-scale=1')
        cy.get('h3').should('be.visible')
    });
});