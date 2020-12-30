import {DriftDetailsPage} from "./drift.po";
import {browser} from "protractor";

describe('Drift Summary report',function () {
  let drift:DriftDetailsPage;
  beforeAll(()=>{
    drift=new DriftDetailsPage();
  });
  it('Navigate to drift summary report',()=>{
    browser.waitForAngularEnabled(false);
    drift.navigateToDriftReport();
      expect(browser.getCurrentUrl()).toContain('drift-report');
    }
  );

})
