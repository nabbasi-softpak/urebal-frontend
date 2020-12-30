import { Injectable } from '@angular/core';
import {URebalService} from "../services/urebal.service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class ModelService extends URebalService{

  GET_PRICE_LIST = "securitymaster/prices";
  GET_ATTRIBUTES = "attributes";
  ATTRIBUTES_BY_TYPE = "attributes/types";
  ATTRIBUTE_TYPES_FOR_SECURITY_SEARCH = "attributes";
  MODELS = "models/";
  DISTRIBUTION = "distribution";
  COMP_DISTRIBUTION = "compDistribution";
  DISTRIBUTION_ATTRIBUTE_TYPE = "distribution-attribute-type";
  GET_ATTRIBUTE_SUMMARY_BY_SECURITY = "models/getAttributeSummaryBySecurity";
  GET_ATTRIBUTE_SUMMARY_BY_ALL_SECURITIES = "models/getAttributeSummaryBySleeves?";
  MODEL_EXISTS = "models/model?modelName=";//AF20191112: Using this new endpoint now as this one handles special characters correctly
  PARENT_MODELS = "parent-models";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  checkModelExists(modelName){
    let encodedName = this.escapeFilterFieldWithoutSingleQuotes(modelName);
    return this.get(this.MODEL_EXISTS+encodedName);
  }

  getModel(modelId) {
    return this.get(this.MODELS + modelId );
  }

  getModelElements(modelId) {
    return this.get(this.MODELS + modelId + '/elements');
  }


  getPriceList(){
    return this.get(this.GET_PRICE_LIST);
  }

  createEditModel(model, isEdit, modelId)
  {
    if(isEdit)
      return this.put(this.MODELS + modelId ,model)
    else
      return this.post('models',model);
    }

  getModelDistribution(modelId) {
    return this.get(this.MODELS + modelId + "\/" + this.DISTRIBUTION );
    }
  getModelCompDistribution(modelId) {
    return this.get(this.MODELS + modelId + "\/" + this.COMP_DISTRIBUTION );
  }
  getParentModels(modelId) {
    return this.get(this.MODELS + modelId + "\/" + this.PARENT_MODELS );
  }


  getModelDistributionForAttributeType(modelId, encodedattributeType) {
    return this.get(this.MODELS + modelId + "\/" + this.DISTRIBUTION_ATTRIBUTE_TYPE +'?type='+encodedattributeType );
  }


  getAttributes(){
    return this.get(this.GET_ATTRIBUTES);
  }

  getAttributesByType(attributeType, fetchSecurities){
    let withSecurities = "&withSecurities=";

    if((typeof fetchSecurities === "undefined" || fetchSecurities === null) || fetchSecurities === false ){
      withSecurities += "false";
  }
    else {
      withSecurities += "true";
  }

    return this.get(this.ATTRIBUTES_BY_TYPE + '/' + attributeType  +'?sort=attributeName'+withSecurities);
  }

  getModelsList() {
    return this.get("models");
  }


  delModel(modelId){
    return this.delete(this.MODELS + modelId );
  }


  getAttributeSummarybySecurity(securityID) {
    return this.get(this.GET_ATTRIBUTE_SUMMARY_BY_SECURITY+ '?'+ 'securityID='+ securityID);
  }


  getAttributeForSecuritySearch(){
    return this.get(this.ATTRIBUTE_TYPES_FOR_SECURITY_SEARCH);
  }

  getAttribyteSummaryByAllSecurities(params) {
   return this.get(this.GET_ATTRIBUTE_SUMMARY_BY_ALL_SECURITIES + params);
  }

    // TODO: This service is called from multiple location, move this to single location and call from there.
    getSecurityMaster(filter_value, offset, limit, sort) {
        return this.get(`securitymaster/?offset=0&limit=1&sort=${sort}&filter=${encodeURIComponent(filter_value)}`);
    }

    getSecurityDetails(securityId) {
        const filter_value = `securityId:eq:${securityId}`;
        return this.getSecurityMaster(filter_value, 0, 1, '');
    }

    getModelById(modelId) {
      return this.get(`models/?filter=modelId:eq:${modelId}`);
    }
}
