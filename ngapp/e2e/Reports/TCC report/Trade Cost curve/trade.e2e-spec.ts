
import {browser} from "protractor";
import {TradeCostPage} from "./trade.po";

describe('Trade cost curve report',function () {
  let trade:TradeCostPage;
  beforeAll(()=>{
    trade=new TradeCostPage();
  });
  it('Navigate to trade cost curve report',()=>{
    browser.waitForAngularEnabled(false);
    trade.navigateToTradeCostCurveReport();
    expect(browser.getCurrentUrl()).toContain('tradeCostCurveReport');
    }
  );

})
