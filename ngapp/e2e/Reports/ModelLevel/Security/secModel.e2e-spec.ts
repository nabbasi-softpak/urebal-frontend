import {SecurityModelSummaryPage} from "./secModel.po";
import {browser} from "protractor";

describe('Security Model Summary report',function () {
  let attr:SecurityModelSummaryPage;
  beforeAll(()=>{
    attr=new SecurityModelSummaryPage();
  });
  it('Navigate to Security Model Summary report',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToSecurityModelReport();
      expect(browser.getCurrentUrl()).toContain('security-model-report');
    }
  );

})
