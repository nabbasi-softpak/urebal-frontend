import {browser} from "protractor";
import {DashboardPage} from "../../../Dashboard/dashboard.po";

export class AttributesSummaryPage extends DashboardPage{
  navigateToAttributesummaryPage(){
    return browser.get('/reports/attribute-report');
  }

}
