import {$, $$, browser, by, element, ElementFinder} from 'protractor';
import {NavigatablePage} from "../_helpers/navigatablePage.class";
import {UrebalDropdownDriver} from "../_helpers/UrebalDropdown.driver";
import {timeoutAnimation, timeoutWait} from "../_helpers/timeouts";
import {waitForElement} from "../_helpers/helper.func";

export class SecurityAdvancedSearchPage extends NavigatablePage {
  urlPath = '/app/secure/model/attributeModel';
  componentSelector = 'security-advanced-search';

  constructor(){
    super();
  }

  async getSelectedFilters() {
    return await this.getAppliedFilters().$$("span > span").map((element)=>{
      return element.getText().then((value) => {
        return value;
      });
    });
  }

  async selectedFiltersHas(value) {
    return (await this.getSelectedFilters()).filter((filter) => filter == value).length != 0;
  }

  removeSelectedFilters(filterName) {
    return this.getAppliedFilters().$$("span > span").each((element)=>{
      return element.getText().then((value) => {
        let [filterName, filterValue] = value.split(":").map(item => item.trim());
        if (name == filterName) {
          element.parentElementArrayFinder.$("button").click(); // clicks "close" button
        }
      });
    });
  }

  getMoreFilters() {
    return $("#more-filters");
  }

  getAppliedFilters() {
    return $("#applied-filters");
  }

  getSearchInput() {
    return $("#text-input-01");
  }

  getCancelBtn() {
    return $("#cancel");
  }

  getAddBtn() {
    return $("#add");
  }

  getSearchBtn() {
    return $("#search");
  }

  getDropdownSecurityType() {
    return new UrebalDropdownDriver("jqxdropdownlist#dropdownSecurityType");
  }

  getDropdownPrimaryAssetClass() {
    return new UrebalDropdownDriver("jqxdropdownlist#dropdownPrimaryAssetClass");
  }

  getMoreFiltersWithTarget() {
    return this.getMoreFilters().$$("a").map(async (element) => {
      return {
        filterName: await element.getText(),
        filterTarget: await element.getAttribute("target")
      }
    });
  }

  async getMoreFiltersName() {
    return (await this.getMoreFiltersWithTarget()).map((filter) => {
      return filter['filterName']
    })
  }

  getSearchResultGrid() {
    return $("jqxgrid[id^=security-search-grid-securitySearchModal]");
  }

  async getSearchResultCount() {
    let pagerValue = await this.getSearchResultGrid().$("div[id^=pagerjqxWidget] > div > div:last-child").getText();
    return parseInt(pagerValue.split("of")[1].trim());
  }
}
