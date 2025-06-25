/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Check that user was redirected to the correct URL at Democart", () => {
  it("should allow a user to login and logout", () => {
    cy.visit("/");
    //cy.login('john-doe1@example.com', 'demo')
    cy.get(":nth-child(2) > .dropdown > .dropdown-toggle > .d-none")
      .should("be.visible")
      .click();
    cy.get(
      ":nth-child(2) > .dropdown > .dropdown-menu > :nth-child(2) > .dropdown-item"
    )
      .should("be.visible")
      .click();

    cy.url().should("contain", "account/login");

    cy.get("h2").should("be.visible");

    cy.contains("Returning Customer");
    cy.get("#input-email").should("be.visible").type("john-doe1@example.com");

    cy.get("#input-password").should("be.visible").type("demo");

    cy.contains("a", "Forgotten Password").should("have.attr", "href");

    cy.get("#form-login > .btn").should("be.visible").click();

    cy.get("#form-login > h2").should("have.text", "Returning Customer");
    cy.get(".list-group > a:last").should("have.text", "Logout").click();

    cy.url().should("contain", "account/logout");

    cy.get("h1:last").should("have.text", "Account Logout");

    cy.get(".pull-right > .btn").should("be.visible").click();

    cy.url().should("contain", "common/home");
  });
});

// In this test we have learned how to get the current URL of the page that is currently active using cy.url()
// Pass in an options object to change the default behavior of cy.url()
// Also I am ensuring that they are visible (.should('be.visible')). This makes the test more robust.
// Finally, I've verified how to get the first/last DOM element within a set of DOM elements with the command (:first) and (:last)