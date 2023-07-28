/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe("Tests API with Cypress: GET method /usuarios", () => {
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

  it("GET users - Verify the server response: status code", () => {
    cy.get("@getUsers").its("status").should("be.equal", 200);
  });

  it("GET users - Verify the response body: usuarios", () => {
    cy.get("@getUsers").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.usuarios[0]).to.have.all.keys(
        "nome",
        "email",
        "password",
        "administrador",
        "_id"
      );
      expect(response.body.usuarios[0].nome).to.equal("Mr. Cameron Davis");
      expect(response.body.usuarios[0].email).to.equal(
        "pete.goldner@gmail.com"
      );
      expect(response.body.usuarios[0].password).to.not.be.null;
      expect(response.body.usuarios[0]._id).to.equal("0JyiSHdlrjwL1aD6");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /usuarios to retrieve all users data from https://serverest.dev/usuarios and verify the response
// Then it should return a list with all registered users and validate the content of the response body
// Also you can verify the response header and status code

describe("Tests API with Cypress: GET method /produtos", () => {
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

  it("GET produtos - Verify the server response: status code", () => {
    cy.get("@getProducts").its("status").should("be.equal", 200);
  });

  it("GET produtos - Verify the response body: produtos", () => {
    cy.get("@getProducts").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.produtos[0]).to.have.all.keys(
        "nome",
        "preco",
        "descricao",
        "quantidade",
        "_id"
      );
      expect(response.body.produtos[0].nome).to.equal("Logitech MX Vertical");
      expect(response.body.produtos[0].preco).to.equal(470);
      expect(response.body.produtos[0].descricao).to.equal("MoMousenitor");
      expect(response.body.produtos[0].quantidade).to.equal(381);
      expect(response.body.produtos[0]._id).to.equal("BeeJh5lz3k6kSIzA");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /produtos to retrieve all users data from https://serverest.dev/produtos and verify the response
// Then it should return a list with all registered products and validate the content of the response body
// Also you can verify the response header and status code

describe("Tests API with Cypress: GET method /usuarios", () => {
  it("GET users - Then it should return a list with all registered users and verify all keys of the response body", () => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/usuarios",
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.eq(response.body.usuarios.length);
      Cypress._.each(response.body.usuarios, (usuario) => {
        expect(usuario).to.have.all.keys(
          "nome",
          "email",
          "password",
          "administrador",
          "_id"
        );
        expect(usuario.nome).to.not.be.null;
        expect(usuario.email).to.not.be.null;
        expect(usuario.password).to.not.be.null;
        expect(usuario._id).to.not.be.null;
      });
    });
  });
});

// This example above let you test API with Cypress
// To GET method /produtos to retrieve all users data from https://serverest.dev/produtos and verify the response
// Then it should return a list with all registered users even his childs and verify all keys of the response body

describe("Tests API with Cypress: GET method /produtos", () => {
  it("GET produtos - Then it should return a list with all products and verify all keys of the response body", () => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/produtos",
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.eq(response.body.produtos.length);
      Cypress._.each(response.body.produtos, (produto) => {
        expect(produto).to.have.all.keys(
          "nome",
          "preco",
          "descricao",
          "quantidade",
          "_id"
        );
        expect(produto.nome).to.not.be.null;
        expect(produto.preco).to.not.be.null;
        expect(produto.descricao).to.not.be.null;
        expect(produto.quantidade).to.not.be.null;
        expect(produto._id).to.not.be.null;
      });
    });
  });
});

// This example above let you test API with Cypress
// To GET method /produtos to retrieve all products data from https://serverest.dev/produtos and verify the response
// Then it should return a list with all products even his childs and verify all keys of the response body

describe("Tests API with Cypress: GET method /usuarios", () => {
  it("GET usuarios - Verify the method passing id query param - Then it should return only the filtered user", () => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/usuarios",
      qs: {
        _id: "fuLoEh8YJP1wSR3Q",
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.usuarios[0].nome).to.eq("Miss Stacey Nienow");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /usuarios verify the method passing id query param from https://serverest.dev/usuarios and verify the response
// Then it should return only the filtered user by name

describe("Tests API with Cypress: GET method /produtos", () => {
  it("GET produtos - Verify the method passing id query param - Then it should return only the filtered user", () => {
    cy.request({
      method: "GET",
      url: "https://serverest.dev/produtos",
      qs: {
        _id: "K6leHdftCeOJj8BJ",
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.produtos[0].descricao).to.eq("TV");
    });
  });
});

// This example above let you test API with Cypress
// To GET method /produtos verify the method passing id query param from https://serverest.dev/usuarios and verify the response
// Then it should return only the filtered product by description
