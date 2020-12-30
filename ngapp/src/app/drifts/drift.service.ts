import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {DriftStatus} from "../account/account.service";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class DriftService  extends URebalService {

  static readonly ACCOUNT_DRIFTS_URL_PATH="account/list";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getDriftsList(filter:boolean){

    if(filter)
      return this.get("portfolios/drifts?filter=statusDescription:ne:"+ encodeURIComponent(DriftStatus.STATUS_ERROR) + ",statusDescription:ne:"+ encodeURIComponent(DriftStatus.STATUS_UNASSINGED));
    else
      return this.get("portfolios/drifts");

//    return this.get("DriftWS/getAllDrifts?filter="+ filter);
  }

  runDrift(portfolioIds: any[]){
    return this.post("DriftWS/run", {
      portfolioIds: portfolioIds
    });
  }

  getDriftStatus(){
    return this.get("DriftWS/status");
  }

  getDriftSummary(porfId){
    return this.get("portfolios/" + porfId + "/reports/drift-summary");
  }

  getDriftReport(porfId) {
    return this.get("portfolios/drift-report?sort=drift:desc&filter=portfolioId:eq:" + porfId);
  }

  getAttrType() {
    return this.get("attributes/types");
  }

  getAttributeWithAttributeType(attrTyp) {
    return this.get("attributes/type/" + attrTyp);
  }

  getDriftExecutionInfo() {
    return this.get("DriftWS/getDriftExecutionInfo");
  }
}
