const { defineConfig } = require("cypress");
const { faker } = require('@faker-js/faker');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        generateUser() {
          return {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: 'true',
          };
        },
      });
    },
    baseUrl: 'https://demo.opencart.com/',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false
  },
  env: {
    apiBaseUrl: 'https://serverest.dev'
  }
});