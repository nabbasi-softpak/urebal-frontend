
import {WhoOwnsMultiSecurityPage} from "./multisecurity.po";
import {browser} from "protractor";

describe('Who owns multisecurity report',function () {
  let attr:WhoOwnsMultiSecurityPage;
  beforeAll(()=>{
    attr=new WhoOwnsMultiSecurityPage();
  });
  it('Navigate to who owns multisecurity Report Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToWhoOWnsMultiSecurity();
      expect(browser.getCurrentUrl()).toContain('who-owns-multisecurity');
    }
  );

})
