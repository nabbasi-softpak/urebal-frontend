import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class TradeCostPage extends DashboardPage{
  navigateToTradeCostCurveReport(){
    return browser.get('/reports/tradeCostCurveReport');
  }

}
