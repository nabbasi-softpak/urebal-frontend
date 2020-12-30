import {browser} from "protractor";

export class SecurityAttribute {
  navigateToSecurityAttributes()
  {
    return browser.get('/attributes/securities')
  }
}
