import { SignedInPage } from './signed-in.po';
import { reachGuardedPage } from '../_helpers/reachPage.helper';
import { SignInPage } from '../sign-in/sign-in.po';
import { DashboardPage } from '../dashboard/dashboard.po';

describe('SignedInPage', () => {
  let page: SignedInPage;

  describe('same page checks', () => {
    beforeAll(async () => {
      page = new SignedInPage();
      await reachGuardedPage(page);
    });

    it('should has sidebar', () => {
      expect(page.hasSidebar()).toBeTruthy();
    });

  });

  describe('navigation to other pages checks', () => {

    it('should move to "Dashboard" page on menu item click', () => {
      page.navigateToDashboard();
      expect(new DashboardPage().isOn()).toBeTruthy();
    });

  });
});
