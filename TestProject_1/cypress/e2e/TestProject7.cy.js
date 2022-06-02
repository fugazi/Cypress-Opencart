/// <reference types="cypress" />

// This is a example of End-to-End Automation Testing with Cypress
// Besides I am testing a Democart hompepage to practicing writing advanced tests in Cypress
// https://douglasfugazi.co

describe('Test API with Cypress: POST method /usuarios', () => {
    it('POST users - Create a new user', () => {
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/usuarios',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: {
                "nome": "Douglas Fugazi Test 14",
                "email": "douglas-test-14@test.com",
                "password": "test",
                "administrador": "true"
            }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).eq("Cadastro realizado com sucesso")
            expect(response.body).to.have.all.keys('message', '_id')
        });
    });
});

// This example above let you test API with Cypress
// To POST method /usuarios create a new user and verify the response status code
// Then it should return a list with the new user register and validate the content of the response body

describe('Test API with Cypress: POST method /produtos', () => {
    it('POST produtos - Create a new product', () => {
        cy.request({ 
            method: 'POST',
            url: 'https://serverest.dev/produtos',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNjQ1NTcxNzQ2LCJleHAiOjE2NDU1NzIzNDZ9.nwg5Z2-Kcly40OD4jQoEn5AgMDm_b5ON_Pr9np0rvbA"
            },
            body: {
                "nome": "LG Monitor Ultra-Wide XX",
                "preco": 1600,
                "descricao": "Monitor",
                "quantidade": "10"
            }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).eq("Cadastro realizado com sucesso")
            expect(response.body).to.have.all.keys('message', '_id')
        });        
    });
});

// This example above let you test API with Cypress
// To POST method /produtos create a new product and verify the response status code
// Then it should return a list with the new product register and validate the content of the response body

/* let fakeUser;

describe('Test API with Cypress: POST method /usuarios', () => {
    beforeEach(() => {
        cy.task('generateUser').then((user) => {
            fakeUser = user;
            cy.log(JSON.stringify(fakeUser))
        });
    });
    it('POST users - Create a new user with random data using Faker', () => {
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/usuarios',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: fakeUser
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).eq("Cadastro realizado com sucesso")
            expect(response.body).to.have.all.keys('message', '_id')
        });
    });
}); */



// Given the Users API
// When I send GET /usuarios
// Then it should return a list with all registered users
// https://github.com/ramesh-khatri/cypress_api_automation/blob/master/cypress/integration/api/gorest/Get_UserList.spec.js
// https://serverest.dev/
// https://dev.to/murillowelsi/api-testing-with-cypress-part-2-creating-your-tests-270i