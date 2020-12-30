import {browser} from "protractor";

export class SecurityEquivalences {
  navigateToEquivalenceList()
  {
    return browser.get('/equivalences/list');
  }
}
