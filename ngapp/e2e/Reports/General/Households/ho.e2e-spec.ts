import {browser} from "protractor";
import {HouseholdsReportPage} from "./ho.po";

describe('Households report',function () {
  let attr:HouseholdsReportPage;
  beforeAll(()=>{
    attr=new HouseholdsReportPage();
  });
  it('Navigate to households Report Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToHouseholdReports();
      expect(browser.getCurrentUrl()).toContain('households-report');
    }
  );

})
