import {CreateHousehold} from "./create-household.po";
import {browser, ExpectedConditions} from "protractor";
import {CR} from "@angular/compiler/src/i18n/serializers/xml_helper";
import {AccountPage} from "../AccountList/account.po";

describe('Create Household navigation', function () {
  let crHousehold: CreateHousehold;
  let accountList: AccountPage;
  beforeAll(() => {
    crHousehold = new CreateHousehold();
    accountList = new AccountPage();

  })
  /* it('Navigate to create household page by URL', () => {
     browser.waitForAngularEnabled(false);
     crHousehold.navigateToCreateHouseholdPage();
     expect(browser.getCurrentUrl()).toContain('accounts/createHousehold');


   })*/
  it('Creating a household with two accounts', async () => {

    accountList.deleteHouseholdIfExist('NW_HOUSEHOLD');
    crHousehold.navigateToCreateHouseholdPage();
    browser.waitForAngularEnabled(false);
    expect(await crHousehold.getHouseholdPageHeading()).toEqual('Create - Household');
    expect(await crHousehold.getHouseholdNameLabel()).toEqual('HOUSEHOLD NAME');
    crHousehold.inputHousehold('NW_HOUSEHOLD');
    crHousehold.selectAccountsToHousehold('ACCOUNT_0000113', 'ACCOUNT_0000114');
    expect(crHousehold.getHouseholdRestrictionError()).not.toContain('You need at-least two accounts to create a household.');
    crHousehold.createHousehold();
  });
  it('Verifying household in the list', () => {
    browser.sleep(2000);
    //accountList.navigateToAccountListPage();
    //browser.waitForAngularEnabled(false);
    accountList.searchAccount('NW_HOUSEHOLD');
    accountList.verifyAccountName((drift) => {
      expect(drift).toEqual('NW_HOUSEHOLD');
    })

  })
 it('Verifying account addition and removal in household editable mode', async () => {
    accountList.addAccountInHousehold('ACCOUNT_0000112');
    expect(accountList.getSuccessMessage()).toContain('Household updated successfully.');
    crHousehold.clickSuccessOk();
    expect(await accountList.getAccountCount()).toEqual(3);

    accountList.removeAccountFromHousehold();
    crHousehold.clickSuccessOk();
    expect(await accountList.getAccountCount()).toEqual(2);
   // expect(accountList.getAccountCount()).toEqual(3);

  })

})
