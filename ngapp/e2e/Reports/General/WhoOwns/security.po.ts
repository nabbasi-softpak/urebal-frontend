import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class WhoOwnsPage extends DashboardPage{
  navigateToWhoOWns(){
    return browser.get('/reports/who-owns');
  }

}
