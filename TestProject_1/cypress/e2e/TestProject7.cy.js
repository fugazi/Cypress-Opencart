/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Test API with Cypress: POST method", () => {
  let token;
  let fakeUser;

  before(() => {
    cy.task("generateUser").then((user) => {
      fakeUser = user;
    });
    cy.request({
      method: "POST",
      url: "https://serverest.dev/login",
      body: {
        email: "fulano@qa.com",
        password: "teste",
      },
    }).then((response) => {
      token = response.body.authorization;
    });
  });

  context("/usuarios", () => {
    it("POST users - Create a new user", () => {
      cy.request({
        method: "POST",
        url: "https://serverest.dev/usuarios",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: fakeUser,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).eq("Cadastro realizado com sucesso");
        expect(response.body).to.have.all.keys("message", "_id");
      });
    });
  });

  context("/produtos", () => {
    it("POST produtos - Create a new product", () => {
      cy.request({
        method: "POST",
        url: "https://serverest.dev/produtos",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: token,
        },
        body: {
          nome: "LG Monitor Ultra-Wide XX",
          preco: 1600,
          descricao: "Monitor",
          quantidade: "10",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).eq("Cadastro realizado com sucesso");
        expect(response.body).to.have.all.keys("message", "_id");
      });
    });
  });
});
