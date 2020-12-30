import {DashboardPage} from "../../Dashboard/dashboard.po";
import {$, $$, browser, by, element} from 'protractor';
import {UrebalDropdownDriver} from "../../_helpers/UrebalDropdown.driver";

export class AttributeModelPage extends DashboardPage {

  navigateToAttributeModelPage() {
    return browser.get('/model/attributeModel');
  }

  public attributeTypesModel: UrebalDropdownDriver;
  public attributes: UrebalDropdownDriver;
  public modelName;

  fetchComponents() {
    this.attributeTypesModel = new UrebalDropdownDriver("app-urebal-dropdown jqxdropdownlist#attributeTypesModel")
    this.attributes = new UrebalDropdownDriver("app-urebal-dropdown jqxdropdownlist#attributes")
    this.modelName = element(by.css("app-attribute-model [name='modelName']"));
  }

  async openSecurityAdvancedSearch(attributeType: string, attribute: string) {
    await this.attributeTypesModel.select(attributeType);
    await this.attributes.select(attribute);

    let securityBtn = element(by.cssContainingText("security-advanced-search a", "Search Securities"))
    return securityBtn.click();
  }
}
