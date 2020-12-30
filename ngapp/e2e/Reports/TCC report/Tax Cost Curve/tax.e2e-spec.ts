import {TaxCostPage} from "../Tax Cost Curve/tax.po";
import {browser} from "protractor";

describe('Tax cost curve report',function () {
  let tax:TaxCostPage;
  beforeAll(()=>{
    tax=new TaxCostPage();
  });
  it('Navigate to tax cost curve report',()=>{
    browser.waitForAngularEnabled(false);
      tax.navigateToTaxCostCurveReport();
      expect(browser.getCurrentUrl()).toContain('taxCostCurveReport');
    }
  );

})
