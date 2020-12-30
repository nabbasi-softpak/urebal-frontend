import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class SharesSummaryPage extends DashboardPage{
  navigateToStockReport(){
    return browser.get('/reports/stock-report');
  }

}
