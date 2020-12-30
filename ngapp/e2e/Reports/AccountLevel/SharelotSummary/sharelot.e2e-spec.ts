
import {SharelotSummaryPage} from "./sharelot.po";
import {browser} from "protractor";

describe('Sharelot Summary report',function () {
  let attr:SharelotSummaryPage;
  beforeAll(()=>{
    attr=new SharelotSummaryPage();
  });
  it('Navigate to Sharelot summary report',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToSharelotReport();
      expect(browser.getCurrentUrl()).toContain('sharelot-report');
    }
  );

})
