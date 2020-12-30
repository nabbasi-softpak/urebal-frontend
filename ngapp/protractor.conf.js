// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 30000,

  specs: [
   './e2e/app.e2e-spec.ts',
    './e2e/sign-in/sign-in.e2e-spec.ts',
    './e2e/Dashboard/dashboard.e2e-spec.ts',
    './e2e/Account/createHousehold/createHousehold.e2e-spec.ts',
   /* './e2e/Model/SecurityModelCreate/secModel.e2e-spec.ts',
    './e2e/Model/ModelList/model.e2e-spec.ts',
    './e2e/Rebalance/Create/create.e2e-spec.ts',
    './e2e/Model/AttrModel/attrModel.e2e-spec.ts',
    './e2e/Model/CompositeModel/compModel.e2e-spec.ts',
    //'./e2e/Model/SecurityModelCreate/secModel.e2e-spec.ts',
    './e2e/Reports/AccountLevel/Attributes Summary/attr.e2e-spec.ts',
    './e2e/Reports/AccountLevel/DriftDetails/drift.e2e-spec.ts',
    './e2e/Reports/AccountLevel/HoldingsSummary/holdings.e2e-spec.ts',
    './e2e/Reports/AccountLevel/SharelotSummary/sharelot.e2e-spec.ts',
    './e2e/Reports/AccountLevel/SharesSummary/shares.e2e-spec.ts',
    './e2e/Reports/AccountLevel/Washsales/washsales.e2e-spec.ts',
    './e2e/Reports/General/Accounts/accounts.e2e-spec.ts',
    './e2e/Reports/General/Drifts/drifts.e2e-spec.ts',
    './e2e/Reports/General/Households/ho.e2e-spec.ts',
    './e2e/Reports/General/WhoOwns/security.e2e-spec.ts',
    './e2e/Reports/General/WhoOwnsMulti/multisecurity.e2e-spec.ts',

    './e2e/Reports/ModelLevel/Attribute/attr.e2e-spec.ts',
    './e2e/Reports/ModelLevel/Security/secModel.e2e-spec.ts',
    './e2e/Reports/TCC report/Tax Cost Curve/tax.e2e-spec.ts',
    './e2e/Reports/TCC report/Trade Cost Curve/trade.e2e-spec.ts',

    './e2e/Reports/WorkspaceLevel/summary.e2e-spec.ts',
    './e2e/Security/SecurityAttributes/attributes.e2e-spec.ts',
    './e2e/Security/SecurityEquivalences/equiv.e2e-spec.ts',
    './e2e/Security/SecurityMaster/security.e2e-spec.ts',

    './e2e/Settings/settings.e2e-spec.ts',
   /!* './e2e/Workspace/Create/createWorkspace.e2e-spec.ts',
    './e2e/Workspace/List/workspace.e2e-spec.ts',

    './e2e/Model/ModelList/model.e2e-spec.ts'*!/*/


  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://owais:8080',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 45000,
    print: function () {
    }
  },
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  },

};
