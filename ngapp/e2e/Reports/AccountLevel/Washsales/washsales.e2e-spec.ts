import {WashsalesPage} from "./washsales.po";
import {browser} from "protractor";

describe('Washsales  report',function () {
  let attr:WashsalesPage;
  beforeAll(()=>{
    attr=new WashsalesPage();
  });
  it('Navigate to Washsales report',()=>{
    browser.waitForAngularEnabled(false);
    attr.navigateToWashsaleReport();
      expect(browser.getCurrentUrl()).toContain('washsale-report');
    }
  );

})
