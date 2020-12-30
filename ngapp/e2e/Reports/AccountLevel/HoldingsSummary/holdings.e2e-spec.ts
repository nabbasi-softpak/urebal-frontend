import {HoldingsSummaryPage} from "./holdings.po";
import {browser} from "protractor";

describe('Holdings Summary report',function () {
  let attr:HoldingsSummaryPage;
  beforeAll(()=>{
    attr=new HoldingsSummaryPage();
  });
  it('Navigate to Holdings summary report',()=>{
    browser.waitForAngularEnabled(false);
    attr.navigateToHoldingsReport();
      expect(browser.getCurrentUrl()).toContain('holdings-report');
    }
  );

})
