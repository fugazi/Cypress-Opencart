/// <reference types="cypress" />

describe("Tests API with Cypress using Mocks - Negative Scenarios", () => {
  beforeEach(() => {
    cy.visit("about:blank");
  });

  context("GET method /usuarios", () => {
    it("should return a 400 error when trying to get users with invalid parameters", () => {
      cy.intercept("GET", `${Cypress.env("apiBaseUrl")}/usuarios?invalid_param=true`, {
        statusCode: 400,
        body: {
          message: "Invalid parameters",
        },
      }).as("getUsers");

      cy.window().then(win => win.fetch(`${Cypress.env("apiBaseUrl")}/usuarios?invalid_param=true`));

      cy.wait("@getUsers").then((interception) => {
        expect(interception.response.statusCode).to.eq(400);
        expect(interception.response.body.message).to.eq("Invalid parameters");
      });
    });
  });

  context("GET method /produtos", () => {
    it("should return a 400 error when trying to get products with invalid parameters", () => {
      cy.intercept("GET", `${Cypress.env("apiBaseUrl")}/produtos?invalid_param=true`, {
        statusCode: 400,
        body: {
          message: "Invalid parameters",
        },
      }).as("getProducts");

      cy.window().then(win => win.fetch(`${Cypress.env("apiBaseUrl")}/produtos?invalid_param=true`));

      cy.wait("@getProducts").then((interception) => {
        expect(interception.response.statusCode).to.eq(400);
        expect(interception.response.body.message).to.eq("Invalid parameters");
      });
    });
  });
});
