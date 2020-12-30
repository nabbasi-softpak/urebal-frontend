import {$, $$, browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {timeoutWait, timeoutAnimation} from "./timeouts";
import { clickWhenClickable} from "./helper.func";

export class UrebalDropdownDriver {
  private gridSelector: string;
  private grid: ElementFinder;

  constructor(selector: string) {
    this.gridSelector = selector;
    this.grid = $(this.gridSelector);
  }

  // getRecords() {
  //   $("jqxgrid div[id^=contenttable] div[role=row]").filter((elem)={
  //     return elem.getText()
  //   })
  // }
}
