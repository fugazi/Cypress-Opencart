/// <reference types="cypress" />

describe("Tests API with Cypress using Mocks", () => {
  beforeEach(() => {
    cy.visit("about:blank");
  });

  context("GET method /usuarios", () => {
    it("should return a list of users", () => {
      cy.intercept("GET", `${Cypress.env("apiBaseUrl")}/usuarios`, { fixture: "users.json" }).as("getUsers");
      cy.window().then(win => win.fetch(`${Cypress.env("apiBaseUrl")}/usuarios`));
      cy.wait("@getUsers").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.usuarios).to.have.length(2);
        expect(interception.response.body.usuarios[0].nome).to.eq("Fulano da Silva");
      });
    });
  });

  context("GET method /produtos", () => {
    it("should return a list of products", () => {
      cy.intercept("GET", `${Cypress.env("apiBaseUrl")}/produtos`, { fixture: "products.json" }).as("getProducts");
      cy.window().then(win => win.fetch(`${Cypress.env("apiBaseUrl")}/produtos`));
      cy.wait("@getProducts").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.produtos).to.have.length(2);
        expect(interception.response.body.produtos[0].nome).to.eq("Logitech MX Vertical");
      });
    });
  });
});
