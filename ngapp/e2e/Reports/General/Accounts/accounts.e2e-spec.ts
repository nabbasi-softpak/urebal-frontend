import {browser} from "protractor";
import {AccountsReportPage} from "./accounts.po";

describe('Accounts report',function () {
  let attr:AccountsReportPage;
  beforeAll(()=>{
    attr=new AccountsReportPage();
  });
  it('Navigate to Accounts Report Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToAccountsReport();
      expect(browser.getCurrentUrl()).toContain('accounts-report');
    }
  );

})
