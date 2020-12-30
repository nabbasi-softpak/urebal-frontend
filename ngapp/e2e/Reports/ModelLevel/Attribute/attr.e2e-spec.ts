import {AttributeModelSummaryPage} from "./attr.po";
import {browser} from "protractor";

describe('Attribute Model Summary report',function () {
  let attr:AttributeModelSummaryPage;
  beforeAll(()=>{
    attr=new AttributeModelSummaryPage();
  });
  it('Navigate to Attribute Model Summary report',()=>{
    browser.waitForAngularEnabled(false);
    attr.navigateToAttrModelReport();
      expect(browser.getCurrentUrl()).toContain('attribute-model-report');
    }
  );

})
