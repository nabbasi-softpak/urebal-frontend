import {browser, element, by, Key, protractor, ExpectedConditions} from "protractor";
import { NavigatablePage } from '../_helpers/navigatablePage.class';
import {URebalPage} from "../app.po";

export class DashboardPage extends NavigatablePage {
  urlPath = '/app/secure/dashboard';
  componentSelector = 'app-dashboard';

 /* getDashboardIcon() {
    return element(by.id('dashBoardLink'));
  }*/
  getWidget (widgetName: string) {
    return element(by.css(widgetName + '-widget'));
  }

}
