
import {browser, ExpectedConditions} from "protractor";
import {SecurityEquivalences} from "./equiv.po";

describe('Security equivalences Page navigation',function () {
  let securityEqui: SecurityEquivalences;
  beforeAll(() => {
    securityEqui = new SecurityEquivalences();
  });
  it('Navigate to security equivalences list by URL', () => {
    securityEqui.navigateToEquivalenceList();
    expect(browser.getCurrentUrl()).toContain('equivalences/list');
  });


})
