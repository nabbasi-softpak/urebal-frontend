import {CreateRebalancePage} from "./create.po";
import {browser, ExpectedConditions} from "protractor";
import {create} from "domain";
import {RebalancePage} from "../List/list.po";

describe('Rebalance creation navigation', function () {
  let createWorkspace: CreateRebalancePage;
  let listWorkspace: RebalancePage;
  beforeAll(() => {
    createWorkspace = new CreateRebalancePage();
    listWorkspace = new RebalancePage();
  });
  /* it('Navigate to rebalance create page by URL', () => {
     browser.waitForAngularEnabled(false);

     createWorkspace.navigateToCreateRebalancePage();
     expect(browser.getCurrentUrl()).toContain('rebalances/rebalance');

   });*/

  it('Creating a new rebalance with accountName filter and assigning model ', async () => {
    listWorkspace.deleteRebalanceIfExist('NW_ACCT_REBALANCE03');
    createWorkspace.navigateToCreateRebalancePage();
    browser.waitForAngularEnabled(false);
    expect(await createWorkspace.getRebalancePageHeading()).toEqual('Create a New Rebalance');
    expect(await createWorkspace.getNameThisRebalanceLabel()).toEqual('Name this Rebalance');
    expect(await createWorkspace.getfilterAccountHeading()).toEqual('Filter accounts to include in the rebalance');
    createWorkspace.inputRebalanceName('NW_ACCT_REBALANCE03');
    createWorkspace.selectAccountFilter().then(()=>
    {
      createWorkspace.accountFilterCriteria('Equal', 'ACCOUNT_0000110');
      createWorkspace.assignModeltoRebalance('NW_SEC_MODEL01');
    })
    //  expect(createWorkspace.verifyRebalanceNameAsNew()).not.toContain('Rebalance already exist');

  })


})
