/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Tests API with Cypress: Negative tests to method /usuarios", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/usuarios",
    }).as("getUsers");
  });

  it("GET users - Verify the header", () => {
    cy.get("@getUsers")
      .its("headers")
      .its("content-type")
      .should("include", "application/json; charset=utf-8");
  });

  it("GET users - Verify the response body: usuarios", () => {
    cy.get("@getUsers").should((response) => {
      expect(response.status).to.eq(400); // Bad Request
      expect(response.body.usuarios[0]).to.have.all.keys("nome", "_id");
      expect(response.body.usuarios[0].password).to.be.null;
      expect(response.body.usuarios[0]._id).to.equal("YwPto0xmVh3UYN1Q");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /usuarios to retrieve response status (400 Bad Request) from https://serverest.dev/usuarios
// Then it should return a response status code 400 and validate the content of the response body
// We are testing the response status code as (400) Bad Request because Negative tests are a good practice to test API

describe("Tests API with Cypress: Negative tests to method /produtos", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/produtos",
    }).as("getProducts");
  });

  it("GET produtos - Verify the header", () => {
    cy.get("@getProducts")
      .its("headers")
      .its("content-type")
      .should("include", "application/json; charset=utf-8");
  });

  it("GET produtos - Verify the response body: produtos", () => {
    cy.get("@getProducts").should((response) => {
      expect(response.status).to.eq(400); // Bad Request
      expect(response.body.produtos[0]).to.have.all.keys(
        "nome",
        "preco",
        "_id"
      );
      expect(response.body.produtos[0]._id).to.equal("2LVx3C7ifmbnGaGz");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /produtos to retrieve response status (400 Bad Request) from https://serverest.dev/produtos
// Then it should return a response status code 400 and validate the content of the response body
// We are testing the response status code as (400) Bad Request because Negative tests are a good practice to test API

// Given the Users API
// When I send GET /usuarios
// Then it should return a list with all registered users
// https://github.com/ramesh-khatri/cypress_api_automation/blob/master/cypress/integration/api/gorest/Get_UserList.spec.js
// https://serverest.dev/
// https://dev.to/murillowelsi/api-testing-with-cypress-part-2-creating-your-tests-270i
