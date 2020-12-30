import {WhoOwnsPage} from "./security.po";
import {browser} from "protractor";

describe('Who owns report',function () {
  let attr:WhoOwnsPage;
  beforeAll(()=>{
    attr=new WhoOwnsPage();
  });
  it('Navigate to who owns Report Page by URL',()=>{
    browser.waitForAngularEnabled(false);
      attr.navigateToWhoOWns();
      expect(browser.getCurrentUrl()).toContain('who-owns');
    }
  );

})
