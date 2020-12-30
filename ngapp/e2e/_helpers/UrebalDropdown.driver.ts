import {$, $$, browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {timeoutWait, timeoutAnimation} from "./timeouts";
import { clickWhenClickable} from "./helper.func";

export class UrebalDropdownDriver {
  private dropdownSelector: string;
  private dropdown: ElementFinder;
  private dropdownOptionSelector: string;
  private dropdownOption: ElementFinder;
  private optionsSelector: string;
  private EC = ExpectedConditions;

  constructor(selector: string) {
    this.dropdownSelector = selector + " > div";
    this.dropdown = $(this.dropdownSelector)
  }

  async select(value) {
    await clickWhenClickable(this.dropdown, timeoutWait, true); // click dropdown
    await browser.sleep(timeoutAnimation);

    this.dropdownOptionSelector = await this.dropdown.getAttribute("aria-owns");
    this.dropdownOption = $(this.dropdownOptionSelector);
    this.optionsSelector = `#${this.dropdownOptionSelector} div[role=option] span`;

    return clickWhenClickable( // click option
      element(by.cssContainingText(this.optionsSelector, value)),
      timeoutWait)
  }

  async currentValue() {
    return $(this.dropdownSelector + " div[id^=dropdownlistContentjqxWidget]").getText();
  }
}
