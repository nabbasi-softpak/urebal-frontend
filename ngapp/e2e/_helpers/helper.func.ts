import {$, browser, until, ExpectedConditions as EC} from "protractor";
import {isNull} from "util";
import {timeoutAnimation, timeoutSearch, timeoutWait} from "./timeouts";

export async function waitForElement(el, timeout) {
  return browser.wait(EC.presenceOf(el), timeout);
};

export async function waitForClickable(el, timeout, jqxDropdown = false) {
  await waitForElement(el, timeout);
  await browser.wait(EC.visibilityOf(el), timeout);
  if (jqxDropdown) {
    return browser.wait(()=>{
      return el.getAttribute("aria-disabled").then((value)=> {
        return (isNull(value) || value == "false") // no attribute or set value is "false"
      })
    }, timeout); // disable check using aria-disabled attribute
  }
  else {
    return await browser.wait(el.isEnabled(), timeout);
  }
}

export async function clickWhenClickable(el, timeout_ms, jqxDropdown = false) {
  await waitForClickable(el, timeout_ms, jqxDropdown);
  return el.click();
}

export async function isNotPresent(el) {
  return browser.wait(EC.not(EC.presenceOf(el)), timeoutWait);
}

export async function waitForBlockUIToFinish() {
  await browser.sleep(timeoutSearch);
  await browser.wait(async () => {
    return (await $("block-ui-content div[class*=block-ui-main]").getAttribute("active") == undefined)
  }, timeoutWait);
  return browser.sleep(timeoutSearch);
}
