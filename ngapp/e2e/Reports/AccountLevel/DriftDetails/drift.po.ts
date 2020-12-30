import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class DriftDetailsPage extends DashboardPage{
  navigateToDriftReport(){
    return browser.get('/reports/drift-report');
  }

}
