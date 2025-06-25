/// <reference types="cypress" />

describe("Tests API with Cypress using Mocks - POST method", () => {
  beforeEach(() => {
    cy.visit("about:blank");
  });

  context("/usuarios", () => {
    it("should create a new user", () => {
      cy.intercept("POST", `${Cypress.env("apiBaseUrl")}/usuarios`, {
        statusCode: 201,
        body: {
          message: "Cadastro realizado com sucesso",
          _id: "1a2b3c4d5e6f7g8h",
        },
      }).as("postUser");

      cy.window().then(win => {
        win.fetch(`${Cypress.env("apiBaseUrl")}/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "Test User" }),
        });
      });

      cy.wait("@postUser").then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body.message).to.eq("Cadastro realizado com sucesso");
      });
    });
  });

  context("/produtos", () => {
    it("should create a new product", () => {
      cy.intercept("POST", `${Cypress.env("apiBaseUrl")}/produtos`, {
        statusCode: 201,
        body: {
          message: "Cadastro realizado com sucesso",
          _id: "1a2b3c4d5e6f7g8h",
        },
      }).as("postProduct");

      cy.window().then(win => {
        win.fetch(`${Cypress.env("apiBaseUrl")}/produtos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "Test Product" }),
        });
      });

      cy.wait("@postProduct").then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body.message).to.eq("Cadastro realizado com sucesso");
      });
    });
  });
});