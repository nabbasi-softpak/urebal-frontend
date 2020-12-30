import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class WashsalesPage extends DashboardPage{
  navigateToWashsaleReport(){
    return browser.get('/reports/washsale-report');
  }

}
