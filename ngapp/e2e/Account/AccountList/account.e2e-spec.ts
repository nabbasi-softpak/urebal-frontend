import {AccountPage} from "./account.po";
import {browser, By, ExpectedConditions} from "protractor";
import {matcherColumn} from "../../customMatchers";
import {forEach} from "@angular/router/src/utils/collection";
import {promise, WebElement} from "selenium-webdriver";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {StringToIntegerConversionDirective} from "../../../src/app/model/composite-model/composite-model.component";
import {format, isNumber} from "util";
import {stat} from "fs";
import {DriftComponent} from "../../../src/app/account/components/account-settings/drift/drift.component";
import {DriftModule} from "../../../src/app/drifts/drift.module";
import {DriftDetailsPage} from "../../Reports/AccountLevel/DriftDetails/drift.po";
import {windowTime} from "rxjs/operator/windowTime";
import {timestamp} from "rxjs/operator/timestamp";
import {current} from "codelyzer/util/syntaxKind";
import CalendarOptions = jqwidgets.CalendarOptions;
import {DatePipe} from "@angular/common";
import DateTimeFormat = Intl.DateTimeFormat;
import moment = require("moment");
import addMatchers = jasmine.addMatchers;
import {reachGuardedPage} from "../../_helpers/reachPage.helper";






describe('Accounts page navigation', function () {
  let accountList: AccountPage;
  beforeAll(async () => {
    accountList = new AccountPage();
    await reachGuardedPage(accountList);
  })
  //  accountList.fetchComponents();
  /*beforeEach(() => {

  ;*/
   // jasmine.addMatchers(matcherColumn);

    it('Navigate to account list by URL', () => {
      browser.waitForAngularEnabled(false);
      accountList.navigateToAccountListPage();
      expect(browser.getCurrentUrl()).toContain('account/list');
    });


 /*   it('Verifying Run Drift button', () => {
      browser.waitForAngularEnabled(false);
      accountList.runDrift();
      accountList.navigateToAccountListPage();
      expect(browser.getCurrentUrl()).toContain('account/list');
      accountList.verifyDriftRunDate((date1) => {
        expect(date1).toContain('Drift last run at: ' + accountList.getDate());
      });
    });*/

    it('Verifying account list filter "Error"', () => {
      accountList.filter('error');
      var status = accountList.getJqxWidgetColContentsDiv('Drift Status');
      accountList.assertColumnValueForEachRow((drift) => {
        expect(drift).toContain('Error');

      });
    });


    // Click 'Out of Tolerance' button and verify that all values in the 'Drift Status' column are equal to 'Out of Tolerance'
    it('Verifying account list filter "Out Of Tolerance"', () => {
      accountList.clickOutOfToleranceButton();
    });

    it('Verifying account list filter "Cash In"', () => {
      accountList.filter('cash_in');
      accountList.assertColumnValueForEachRow((drift) => {
        expect(drift).toContain('Cash in');
      })
    });
    it('Verifying account list filter "Unassigned"', () => {
      accountList.filter('unassigned');
      accountList.assertColumnValueForEachRow((drift) => {
        expect(drift).toContain('Unassigned');
      })
    });
    it('Verifying account list filter "No drift"', () => {
      accountList.filter('no_drift');
      accountList.assertColumnValueForEachRow((drift) => {
        expect(drift).toContain('No Drift');
      });
    });
    it('Verifying account list filter "Drift not run"', () => {
      accountList.filter('drift_not_run');
      accountList.assertColumnValueForEachRow((drift) => {
        expect('New Account New Household').toContain(drift);
      })
    });
    it('Verifying account list filter "Drift greater than 194"', () => {
      accountList.driftValueInput(194);
      accountList.filter('driftgreater_button');
      accountList.assertDriftPercentage((drift) => {
        expect(drift).toBeGreaterThanOrEqual(194);
      })
    });
    it('Verifying account Id filter by search', () => {
      accountList.refresh().then(() => {
        var text = 'FIRM01_ACCOUNT_000039';
        accountList.searchAccount(text);
        accountList.verifyAccountName((drift) => {
          expect(drift).toEqual(text);
        })
      });
    });
    it('Verifying Tax status filter by search', () => {
      accountList.refresh().then(() => {
        var text = 'Non-Taxable';
        accountList.searchAccount(text);
        accountList.verifyTaxStatus((drift) => {
            expect(drift).toEqual(text);
          }
        )
      })
    })
  });



/* it('Dynamic controls:Changing account settings',()=> {
    accountList.navigateTo();
var res=accountList.accountSettings('FIRM01_ACCOUNT_00003');
  expect(res).toContain('Restrictions have been saved successfully.')})

})
*/
