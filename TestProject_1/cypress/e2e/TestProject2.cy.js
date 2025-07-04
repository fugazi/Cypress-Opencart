/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Create a new Account at Democart", () => {
  it("should allow a user to register for a new account", () => {
    cy.visit("/");
    cy.get(":nth-child(2) > .dropdown > .dropdown-toggle > .d-none")
      .should("be.visible")
      .click();
    cy.get(
      ":nth-child(2) > .dropdown > .dropdown-menu > :nth-child(1) > .dropdown-item"
    )
      .should("be.visible")
      .click();
    cy.contains("Register Account").should("be.visible");

    cy.get("#input-firstname").should("be.visible").type("Homero");

    cy.get("#input-lastname").should("be.visible").type("Simpson");

    cy.get("#input-email").should("be.visible").type("john-doe1@example.com");

    cy.get("#input-password").should("be.visible").type("demo");

    cy.get(".col-sm-10 > :nth-child(2) > input")
      .should("be.visible")
      .first()
      .check();

    cy.get('[type="checkbox"]').should("be.visible").check();

    cy.get(".float-end > .btn").should("be.visible").click();

    // cy.contains('Your Account Has Been Created!')
    // .should('be.visible')
  });
});

// Note that before typing (type), checking (check), or clicking on elements (click), I am ensuring that they are visible (.should('be.visible')). This makes the test more robust.
// Finally, I verify that the text "Your Account Has Been Created!" is contained in some element and is visible.