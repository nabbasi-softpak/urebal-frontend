
import {browser, ExpectedConditions} from "protractor";
import {SecurityAttribute} from "./attributes.po";

describe('Security attributes Page navigation',function () {
  let attrList: SecurityAttribute;
  beforeAll(() => {
    attrList = new SecurityAttribute();
  });
  it('Navigate to security attributes list by URL', () => {
    attrList.navigateToSecurityAttributes();
    expect(browser.getCurrentUrl()).toContain('attributes/securities');
  });


})
