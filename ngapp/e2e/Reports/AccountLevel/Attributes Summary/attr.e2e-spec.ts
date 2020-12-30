import {browser} from "protractor";
import {AttributesSummaryPage} from "./attr.po";

describe('Attribute Summary report',function () {
  let attr:AttributesSummaryPage;
  beforeAll(()=>{
    attr=new AttributesSummaryPage();
  });
  it('Navigate to attribute summary report',()=>{
    browser.waitForAngularEnabled(false);
    attr.navigateToAttributesummaryPage();
      expect(browser.getCurrentUrl()).toContain('attribute-report');
    }
  );

})
