## 👋 End-to-End Automation Testing with Cypress
This is a example of End-to-End Automation Testing with Cypress, developed by Douglas Urrea Ocampo using Cypress as framework.
Besides I am testing a Democart homepage to practicing writing advanced tests in Cypress

## 🏠 Tester details
* Name: `Douglas Urrea Ocampo`
* Country: `Colombia`
* City: `Medellin`
* E-mail: `douglas`
* LinkedIn: [https://www.linkedin.com/in/douglasfugazi](https://www.linkedin.com/in/douglasfugazi)
* Contact: [https://douglasfugazi.co](https://douglasfugazi.co)

## ✨ Pre-requisites:
1. Install Node.js from [here](https://nodejs.org/en/)
2. Install npm from [here](https://www.npmjs.com)
3. Install git from [here](https://git-scm.com)

## 🛠️ Running the project:
1. Download the project from GitHub
    * Option 1: `git clone https://github.com/fugazi/Cypress-Opencart.git`
    * Option 2: Download it as a Zip file and extract it
2. CD into the `TESTPROJECT_1` folder
3. Set up environment variable `APPLITOOLS_API_KEY` with your own API key.
    * Login to Applitools > Click on the Person icon > My API Key
    * Option Linux/Mac: `export APPLITOOLS_API_KEY=<your_key>`
    * Option Windows: `set APPLITOOLS_API_KEY=<your_key>`
    * Option Manual: Open the file `applitools.config.js` and add the `apiKey:''`
4. run `npm install`
5. run `npx eyes-setup`
6. run `npm test`

### ✏️ Cypress tutorial

Please see => [here](https://applitools.com/tutorials/cypress.html) for all the details.
Cypress Best Practices => [here](https://dev.to/cypress/cypress-best-practices-55j0)

### 🚴 Project configuration
* Cypress project Baseline: `TestProject1.spec.js` into folder `cypress\e2e`
* Cypress project Checkpoint-Register: `TestProject2.spec.js` into folder `cypress\e2e`
* batchName: `Democart`
* appName: `Opencart`
* testName: `Cross-Device Elements Test`
