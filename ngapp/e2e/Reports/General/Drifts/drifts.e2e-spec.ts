import {DriftsReportPage} from "./drifts.po";
import {browser} from "protractor";

describe('Drifts report',function () {
  let attr:DriftsReportPage;
  beforeAll(()=>{
    attr=new DriftsReportPage();
  });
  it('Navigate to Drifts Report Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToDriftReports();
      expect(browser.getCurrentUrl()).toContain('drifts');
    }
  );

})
