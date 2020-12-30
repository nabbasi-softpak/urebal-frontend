import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class DashboardService extends URebalService {

  private readonly GET_ACCOUNTSUMMARY = "portfolios/widget-accounts-summary";
  private readonly GET_HOUSEHOLDSUMMARY = "portfolios/widget-household-summary";
  private readonly GET_TAXABLEACCOUNSUMMARY = "accounts/getTaxableAccountSummary";
  private readonly GET_DRIFTEDACCOUNTSUMMARY = "portfolios/widget-drift-summary";
  private readonly GET_DRIFT_BY_CATEGORY = "DriftWS/getDriftByCategories";
  private readonly GET_TOP_ACCOUNTS_BY_MARKET_VALUE = "portfolios/accountByMarketValue";
  private readonly GET_TOP_DRIFTED_ACCOUNTS = "portfolios/topDriftedAccounts";
  private readonly GET_TOP_ASSIGNED_MODELS_BY_MARKET_VALUE = "models/assigned-models?sort=marketValue:desc&offset=0&limit=10";
  private readonly GET_TOP_HELD_SECURITIES = "securitymaster/assigned-by-market?sort=marketValue:desc&offset=0&limit=10";
  private readonly GET_LAST_TRADES_EXECUTED = "workflow/lastTradesExecuted?numberOfRecords=10&sortingOrder=Descending";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getAccountAgrregatedSummary(){
    return this.get(this.GET_ACCOUNTSUMMARY);
  }

  getHouseholdAgrregatedSummary(){
    return this.get(this.GET_HOUSEHOLDSUMMARY);
  }

  getTaxableAccountAgrregatedSummary(){
    return this.get(this.GET_TAXABLEACCOUNSUMMARY);
  }

  getDriftedAccountAgrregatedSummary(){
    return this.get(this.GET_DRIFTEDACCOUNTSUMMARY);
  }

  getDriftByCategories(){
    return this.get(this.GET_DRIFT_BY_CATEGORY);
  }

  getTopAccountsByMarketValue(){
    return this.get(this.GET_TOP_ACCOUNTS_BY_MARKET_VALUE);
  }

  getTopDriftedAccounts(){
    return this.get(this.GET_TOP_DRIFTED_ACCOUNTS);
  }

  getTopAssignedModelsByMarketValue(){
    return this.get(this.GET_TOP_ASSIGNED_MODELS_BY_MARKET_VALUE);
  }

  getTopHeldSecurities(){
    return this.get(this.GET_TOP_HELD_SECURITIES);
  }

  getLastTradesExecuted(){
    return this.get(this.GET_LAST_TRADES_EXECUTED);
  }

}
