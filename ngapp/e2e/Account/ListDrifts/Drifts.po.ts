import {browser, element, by, Key, protractor, ExpectedConditions} from "protractor";
import {DashboardPage} from "../../Dashboard/dashboard.po";

export class DriftPage extends DashboardPage {
  navigateToDriftList() {
    return browser.get('/drift/list');
  }

}
