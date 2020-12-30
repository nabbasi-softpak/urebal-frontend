import {AttributeModelPage} from "./attributemodel.po";
import {browser} from "protractor";
import {reachGuardedPage} from "../../_helpers/reachPage.helper";

describe('Create attribute model page navigation', function () {
  let page: AttributeModelPage;
  beforeAll(async () => {
    page = new AttributeModelPage();
    await reachGuardedPage(page);
    page.fetchComponents();
  });
  it('Navigate to create attribute model page', () => {
    page.navigateToAttributeModelPage();
    expect(browser.getCurrentUrl()).toContain('attributeModel');
  });
})
