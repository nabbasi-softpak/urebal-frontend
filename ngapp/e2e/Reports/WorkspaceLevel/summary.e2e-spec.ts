import {WorkspaceSummaryPage} from "./summary.po";
import {browser} from "protractor";

describe('Workspace Summary report',function () {
  let attr:WorkspaceSummaryPage;
  beforeAll(()=>{
    attr=new WorkspaceSummaryPage();
  });
  it('Navigate to Workspace Summary Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToRebalanceSummaryReport();
      expect(browser.getCurrentUrl()).toContain('rebalance-summary-report');
    }
  );

})
