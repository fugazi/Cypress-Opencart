/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

Cypress._.times(5, () => {
  describe("Visit Homepage - Democart", () => {
    it("Verify Desktop menu multiple times", () => {
      cy.visit("https://demo.opencart.com");
      cy.get(".nav > :nth-child(1) > .dropdown-toggle")
        .should("be.visible")
        .click();

      cy.get(".open > .dropdown-menu > .see-all").should("be.visible").click();
    });
  });
});

// This method let you run a test multiple times with Cypress to prove it is stable
// Cypress has several other famous libraries to make life easier for its users, one of these libraries is Lodash
// Just use "Cypress._" and you can invoke any feature of lodash.
