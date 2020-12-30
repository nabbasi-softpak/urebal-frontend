import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class AttributeModelSummaryPage extends DashboardPage{
  navigateToAttrModelReport(){
    return browser.get('/reports/attribute-model-report');
  }

}
