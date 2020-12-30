import { Injectable } from '@angular/core';
import {URebalService} from "../services/urebal.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ResponseContentType} from "../shared/classes/ResponseContentType.class";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class ReportsService extends URebalService{

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getPriceList(){
    return this.get('securitymaster/prices');
  }

  getTickerReport(ticker) {
    return this.get('securitymaster/getAccountList/'+ticker+'/accounts?sort=accountId:asc');
  }

  downloadReport(ticker) {
    return this.downloadFile('security/reports/excel/' + ticker, ResponseContentType.Blob);
  }

  printReport(ticker) {
    /*return this.http.get('serviceweb/services/security/reports/excel/'+ticker, { responseType: ResponseContentType.Blob }).map((res) => {
        return new Blob([res.blob()], { type: 'application/vnd.ms-excel' })
      })*/
    return this.http.get('serviceweb/services/security/reports/excel/'+ticker, { responseType: 'blob' })
      .pipe(
        map((res) => {
          return new Blob([res], { type: 'application/vnd.ms-excel' })
        })
      )
  }

}
