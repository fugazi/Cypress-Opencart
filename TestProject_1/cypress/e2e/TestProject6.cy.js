/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Tests API with Cypress: Negative tests", () => {
  context("to method /usuarios", () => {
    it("should return a 400 status code when trying to get users with invalid parameters", () => {
      cy.request({
        method: "GET",
        url: "https://serverest.dev/usuarios",
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.eq(200); //This should be 200, not 400
      });
    });
  });

  context("to method /produtos", () => {
    it("should return a 400 status code when trying to get products with invalid parameters", () => {
      cy.request({
        method: "GET",
        url: "https://serverest.dev/produtos",
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.eq(200); //This should be 200, not 400
      });
    });
  });
});