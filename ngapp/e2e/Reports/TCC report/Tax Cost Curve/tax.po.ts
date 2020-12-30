import {DashboardPage} from "../../../Dashboard/dashboard.po";
import {browser} from "protractor";

export class TaxCostPage extends DashboardPage{
  navigateToTaxCostCurveReport(){
    return browser.get('/reports/taxCostCurveReport');
  }

}
