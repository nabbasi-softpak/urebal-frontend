import {SharesSummaryPage} from "./share.po";
import {browser} from "protractor";

describe('Shares Summary report',function () {
  let attr:SharesSummaryPage;
  beforeAll(()=>{
    attr=new SharesSummaryPage();
  });
  it('Navigate to Shares summary report',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToStockReport();
      expect(browser.getCurrentUrl()).toContain('stock-report');
    }
  );

})
