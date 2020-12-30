import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class PortfolioService extends URebalService{

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getPortfolio(name){
    return this.post("PortfolioWS/getPortfolioByName",name);
  }

  getAccountSummary(portfolioId, accountId){
    return this.get(`portfolios/${portfolioId}/${accountId}/summary`);
  }
}
