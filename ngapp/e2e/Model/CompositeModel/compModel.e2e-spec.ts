
import {browser} from "protractor";
import {CompositeModelPAge} from "./compModel.po";

describe('Create composite model page navigation', function () {
  let model: CompositeModelPAge;
  beforeAll(() => {
    model = new CompositeModelPAge();

  });
  it('Navigate to create composite model page', () => {
    model.navigateToCompositeModelPage();
    expect(browser.getCurrentUrl()).toContain('compositemodel');
  });
})
