import {SecurityPage} from "./security.po";
import {browser, ExpectedConditions} from "protractor";

describe('Security Page navigation',function () {
  let securityList: SecurityPage;
  beforeAll(() => {
    securityList = new SecurityPage();
  });
  it('Navigate to security master list by URL', () => {
    browser.waitForAngularEnabled(false);
    securityList.navigateToSecurityMasterList();
    expect(browser.getCurrentUrl()).toContain('security/master');
  });


})

