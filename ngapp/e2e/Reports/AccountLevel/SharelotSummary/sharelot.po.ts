import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class SharelotSummaryPage extends DashboardPage{
  navigateToSharelotReport(){
    return browser.get('/reports/sharelot-report');
  }

}
