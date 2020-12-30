import { Injectable } from '@angular/core';
import { URebalService } from '../../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class DataImportService extends URebalService {

  UPLOAD_ACCOUNT = "accounts/upload";
  UPLOAD_MODEL = "models/upload";
  UPLOAD_PRICE = "price/upload";
  UPLOAD_ATTRIBUTE = "attributes/upload";
  UPLOAD_SECURITY_TYPE = "rounding/upload";
  UPLOAD_TILT_PARAMETER = "tiltingParameter/upload";
  UPLOAD_RANK_PARAMETER = "securityRank/upload";
  UPLOAD_SEC_MASTER = "securitymaster/upload";
  GET_SUPPORT_LIST = "importsupport/info";
  UPLOAD_SUPPORT_DATA = "importsupport/upload";
  RESOLVE_SUPPORT_DATA = "importsupport/markasresolved";

  constructor(httpClient: HttpClient, localStorage: LocalStorageService) {
    super(httpClient, localStorage);
  }

  public uploadSupportData(data){
    return this.postFormData(this.UPLOAD_SUPPORT_DATA, data);
  }

  public getSupportDataList(){
    return this.get(this.GET_SUPPORT_LIST);
  }

  public deleteSupportData(data){
    return this.post(this.RESOLVE_SUPPORT_DATA, data);
  }

  public uploadAccount(data){
    return this.postFormData(this.UPLOAD_ACCOUNT, data);
  }

  public uploadModel(data){
    return this.postFormData(this.UPLOAD_MODEL, data);
  }

  public uploadPrice(data){
    return this.postFormData(this.UPLOAD_PRICE, data);
  }

  public uploadAttribute(data){
    return this.postFormData(this.UPLOAD_ATTRIBUTE, data);
  }

  public uploadSecurityType(data){
    return this.postFormData(this.UPLOAD_SECURITY_TYPE, data);
  }

  public uploadTiltingParamter(data){
    return this.postFormData(this.UPLOAD_TILT_PARAMETER, data);
  }

  public uploadRankParamter(data){
    return this.postFormData(this.UPLOAD_RANK_PARAMETER, data);
  }

  public uploadSecMaster(data){
    return this.postFormData(this.UPLOAD_SEC_MASTER, data);
  }

}
