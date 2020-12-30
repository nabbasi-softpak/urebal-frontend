import { Injectable } from '@angular/core';
import {URebalService} from "../services/urebal.service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class AuditService extends URebalService{
  private readonly GET_AUDIT_TRAIL= "auditTrail/auditTrails";

  private readonly GET_AUDIT_TRAIL_PAGE= "auditTrail/?sort=timeStamp:dsc&offset=0&limit=10";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http,localStorage);
  }

  //offset=0&limit=8&sort=accountNumber:asc&filter=
  getAuditTrail() {
    return this.get(this.GET_AUDIT_TRAIL_PAGE);
  }
}
