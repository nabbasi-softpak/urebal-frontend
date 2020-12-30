import { reachGuardedPage } from '../_helpers/reachPage.helper';
import {$, $$, browser, by, element} from "protractor";
import {SecurityAdvancedSearchPage} from "./security-advanced-search.po";
import {AttributeModelPage} from "../Model/AttrModel/attributemodel.po";
import {timeoutAnimation, timeoutWait} from "../_helpers/timeouts";
import {
  isNotPresent,
  waitForBlockUIToFinish,
} from "../_helpers/helper.func";

describe('SecurityAdvancedSearch', () => {
  let pageAttributeModel: AttributeModelPage;
  let page: SecurityAdvancedSearchPage;
  let pageSignout: SecurityAdvancedSearchPage;

  const attributeType = "Credit Quality";
  const attribute = "High";

  beforeEach(async () => {
    pageAttributeModel = new AttributeModelPage();
    page = new SecurityAdvancedSearchPage();
    await reachGuardedPage(pageAttributeModel);
    pageAttributeModel.fetchComponents();
    await pageAttributeModel.openSecurityAdvancedSearch(attributeType, attribute);
    await waitForBlockUIToFinish();
    // wait for page to load selected filters.
    await browser.wait(async () => {
      return (await page.getSelectedFilters()).length == 3;
    }, timeoutWait);
  });

  it('should have dropdown selected "All" by default', async () => {
    expect(page.getDropdownPrimaryAssetClass().currentValue()).toBe("All")
    expect(page.getDropdownSecurityType().currentValue()).toBe("All")
  });

  it('should default applied filters', async () => {
    let defaultSelectedFilters = ["Primary Asset Class: All", "Security Type: All", `${attributeType}: ${attribute}`];
    expect((await page.getSelectedFilters())).toEqual(defaultSelectedFilters);
  });

  it('should default more filters', async () => {
    let defaultMoreFilters = [ 'Credit Quality', 'Geography', 'Interest Rate Sensitivity', 'Medical', 'Sector', 'Size', 'Style' ];
    expect((await page.getMoreFiltersName())).toEqual(defaultMoreFilters);
  });

  it('should have default filter "more options" disabled', async () => {
    let filters = await page.getMoreFiltersWithTarget();
    let selectedFilter = filters.find((item) => item['filterName'] == attributeType);
    if (selectedFilter) {
      let target = selectedFilter['filterTarget'];
       $$(`${target} div input`).each((elem) => {
        expect(elem.isEnabled).toBe(false);
      });
    }
  });

  it('should try removing default filter', async () => {
    expect((await page.getSelectedFilters()).length).toBe(3);

    let elementCount = await page.getAppliedFilters().$$("button").count();
    for (let i = 0; i < elementCount; i++) {
      // elements are recreated on each click.
      await page.getAppliedFilters().$$("button").get(i).click();
    }

    // it shouldn't be removed
    expect((await page.getSelectedFilters()).length).toBe(3);
  });

  it('should update "selected filters" on selecting PAC', async () => {
    await page.getDropdownPrimaryAssetClass().select("Equity");
    expect(page.selectedFiltersHas("Primary Asset Class: Equity")).toBeTruthy();

    await page.getDropdownPrimaryAssetClass().select("Fixed Income");
    expect(page.selectedFiltersHas("Primary Asset Class: Fixed Income")).toBeTruthy();
  });

  it('should update "selected filters" on selecting "security type"', async () => {
    await page.getDropdownSecurityType().select("Equity");
    expect(page.selectedFiltersHas("Security Type: Equity")).toBeTruthy();

    await page.getDropdownSecurityType().select("ETF");
    expect(page.selectedFiltersHas("Security Type: ETF")).toBeTruthy();
  });

  it('should select more filter\'s sub filters', async () => {
    let moreFilters = await page.getMoreFilters().$$("a");
    for (let moreFiltersIndex = 0; moreFiltersIndex < moreFilters.length; moreFiltersIndex++) {
      let element = moreFilters[moreFiltersIndex];
      let filterName = await element.getText();
      let filterTarget = await element.getAttribute("target");
      await element.click();

      let filters = await page.getMoreFilters().$$(`#${filterTarget} div`);
      for (let subFiltersIndex = 0; subFiltersIndex < filters.length; subFiltersIndex++) {
        let subFilterElement = filters[subFiltersIndex];
        let subFilterName = await subFilterElement.$("label").getText();
        let subFilterInput = await subFilterElement.$("input");
        if (await (subFilterInput.isEnabled()) == false) break;
        await subFilterInput.click();

        if (filters.length - 1 == subFiltersIndex) {
          subFilterName = "All"; // if all sub filter are selected
        }

        let appliedFilterText = `${filterName}: ${subFilterName}`;
        await browser.wait(() => page.selectedFiltersHas(appliedFilterText), timeoutAnimation);
        expect(page.selectedFiltersHas(appliedFilterText)).toBeTruthy();
      }

      await page.getMoreFilters().$$(`#${filterTarget} div input`).each(async (element) => {
        // uncheck all selected filters
        await element.click();
      });
    }
  });

  it('should search for a value', async () => {
    await page.getSearchInput().sendKeys("A")
    await page.getSearchBtn().click();
    await waitForBlockUIToFinish();
    expect(page.getSearchResultCount()).toBeTruthy();
    await page.getSearchInput().clear()
  });

  xit('should not search for when empty', async () => {
    await page.getSearchInput().clear()
    await page.getSearchBtn().click();
    await waitForBlockUIToFinish();

    expect(page.getSearchResultCount()).toBe(0);
  });

  afterAll(async () => {
    await page.getCancelBtn().click();
    await isNotPresent($("security-advanced-search"));
  })
});
