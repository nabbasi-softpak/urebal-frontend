import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";
import {map} from "rxjs/operators";

@Injectable()
export class AccountService extends URebalService{

  GET_PORTFOLIO_DETAILS_BY_NAME = "PortfolioWS/getPortfolioDetailsByName";
  GET_PORTFOLIOS_AUTOCOMPLETE = "portfolios/list?type=";
  GET_PORTFOLIOS = "portfolios";
  GET_PORTFOLIOS_BRIEF = "portfolios/searchPortfolio";
  GET_SINGLE_ACCOUNTS_BRIEF = "accounts/brief";
  UPLOAD_WASHSALES = "washsales/upload";
  SAVE_RESTRICTIONS = "restriction/saveRestrictions?id=";
  GET_ACCOUNT_SETTINGS = "accounts/accountSettings";
  GET_ACCOUNT_ATTRIBUTES = "attributes/attributes-by-account/";
  GET_ATTRIBUTE_LIST = "attributes/types";
  GET_ATTRIBUTE_DETAIL = "attributes/types/";
  GET_ATTRIBUTE_SECURITIES = "attributes";
  SAVE_ACCOUNT_ATTRIBUTE = "attributes/save-account-attributes";
  SECURITY_RANKING = "securityRank/getSecurityRankSetList";
  TRADABLE_POSITIONS = "accounts/updatePositionsTradeableInfo?accountId=";
  SAVE_HOUSEHOLD_DATA = "households/";
  GET_ACCOUNTS_LIST = "portfolios/accounts";
  GET_INDIVIDUAL_ACCOUNTS="accounts"//for equivalance dropdown

  GET_PORTFOLIO_DETAILS = "portfolios/";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  public getPortfoliosList(){
    return this.get(this.GET_PORTFOLIOS);
  }

  public getPortfoliosListBrief(){
    return this.get(this.GET_PORTFOLIOS_BRIEF);
  }

  public searchAccount(value, limit = 10) {
    let filterValue = `portfolioName:like:${value}`;
    return this.getSingleAccounts(filterValue, limit).pipe(map(this._filterResponse));
  }

  public searchByAccountID(securityID) {
    let filterValue = `portfolioName:eq:${securityID}`;
    return this.getAccounts(filterValue, 1).pipe(map(this._filterResponse));
  }

  public getAccounts(filterValue, limit) {

    let url: string = this.GET_PORTFOLIOS_BRIEF + `?offset=0&limit=${limit}&filter=${encodeURIComponent(filterValue)}`;
    return this.get(url);
  }

  public getSingleAccounts(filterValue, limit) {

    let url: string = this.GET_SINGLE_ACCOUNTS_BRIEF + `?offset=0&limit=${limit}&filter=${encodeURIComponent(filterValue)}`;
    return this.get(url);
  }

  private _filterResponse(response) {
    if (response.code == 200) return response.responsedata;
    return [];
  }

  //Shall be called on change. query param needs to be appended with key
  public getPortfoliosListBriefFilter(key){

    return this.get(this.GET_PORTFOLIOS_BRIEF,key);
  }


  public getPositions(id){
    return this.get("portfolios/1/accounts/"+encodeURIComponent(id) +"/positions?sort=ticker:asc,buyDate:asc");
  }

  public getWashSales(id){
    return this.get("portfolios/1/accounts/"+id+"/wash-sales");
  }

  public uploadWashSales(data){
    return this.postFormData(this.UPLOAD_WASHSALES, data);
  }

  public getRestriction(portfolioId, id) {
    return this.get("portfolios/"+portfolioId+"/accounts/"+id+"/restrictions");
  }

  public getRestrictionWithoutValidations(portfolioId) {
    return this.get("portfolios/"+portfolioId+"/accounts/ /restrictions");
  }

  public saveRestrictions(id, data) {
    return this.put("portfolios/1/accounts/"+id+"/restrictions",data);
  }

  public getAccountSetting(id) {
    return this.get("portfolios/1/accounts/"+id+"/tax-settings");
  }

  public saveAccountSetting(id, data) {
    return this.put("portfolios/1/accounts/"+id+"/tax-settings",data);
  }

  public createHousehold(portfolioParam){
    return this.post("portfolios",portfolioParam);
  }

    public getPortfolioDetailsByName(id){

     // let portfolioName = this.escapeFilterField(id);
     // return this.get('portfolios?filter=portfolioName:eq:' + portfolioName);

    return this.post(this.GET_PORTFOLIO_DETAILS_BY_NAME, id);
  }

  public getPortfolioDetailsById(id){

    // let portfolioName = this.escapeFilterField(id);
     return this.get('portfolios/'+id);

    //return this.post(this.GET_PORTFOLIO_DETAILS_BY_NAME, id);
  }

  public getPortfolioDetailsByIdForIndividualAccount(id){

    let filterValue = `portfolioId:eq:${id}`;
    return this.get(`portfolios/drifts?offset=&limit=&sort=&filter=${encodeURIComponent(filterValue)}`);
  }

  public getAccountAttributes(id) {
    return this.get(this.GET_ACCOUNT_ATTRIBUTES + id);
  }

  public getAttributeList() {
    return this.get(this.GET_ATTRIBUTE_LIST);
  }

  public getAttributeDetail(type, fetchSecurities) {
    let withSecurities = "?withSecurities=";
    if((typeof fetchSecurities === "undefined" || fetchSecurities === null) || fetchSecurities == false){
      withSecurities += "false";
  }
    else
      withSecurities += "true";

    return this.get(this.GET_ATTRIBUTE_DETAIL + type + withSecurities);
  }

  public saveAccountAttributes(data) {
    return this.put(this.SAVE_ACCOUNT_ATTRIBUTE,data);
  }

  public getAttributeSecuritiesList(id) {
    return this.get(this.GET_ATTRIBUTE_SECURITIES + '/' + id);
  }

  public getSecurityRankingList() {
    return this.get(this.SECURITY_RANKING);
  }

  public updateTradablePositions(account_id,data) {
    return this.put("portfolios/1/accounts/"+account_id+"/positions",data);
    //return this.post(this.TRADABLE_POSITIONS + account_id, data);
  }

  public getSinglePortfolios() {
    //return this.get('portfolios?filter=isHouseHold:eq:false');
    return this.get(this.GET_PORTFOLIOS_AUTOCOMPLETE + PortfolioType.Single);
  }

  public saveHouseHoldData(data) {
    return this.post(this.SAVE_HOUSEHOLD_DATA + data.portfolioId,data);
  }

  public getAccountsList() {
    return this.get(this.GET_ACCOUNTS_LIST);
  }
  public getAllIndividualAccounts()
  {
    return this.get(this.GET_INDIVIDUAL_ACCOUNTS);
  }
  public getPortfolioDetails(portfolioId){
    return this.get(this.GET_PORTFOLIO_DETAILS + portfolioId );
  }

  getDriftDetails(portfolioId: number) {
    return this.get('DriftWS/getDriftStatusByPortfolioId/' + portfolioId);

    //return this.get(this.GET_DRIFT_DETAILS+portfolioId);
  }

  getHouseholdsList(){
    return this.get("portfolios?filter=isHouseHold:eq:true");
  }
}

enum PortfolioType{
  All = 1,
  Household = 2,
  Single = 3
}

@Injectable()
export class DriftStatus
{
  public static readonly STATUS_ERROR = 'Error';
  public static readonly STATUS_UNASSINGED = 'Model Unassigned';
  public static readonly STATUS_NO_DRIFT = 'No Drift';
  public static readonly STATUS_DRIFT_NOT_RUN = 'Drift not run';
  public static readonly STATUS_CASH_IN = 'Cash in';
  public static readonly STATUS_OUT_OF_TOLERANCE = 'Out of tolerance';
  public static readonly STATUS_OUT_OF_TOLERANCE_AND_CASH_IN = DriftStatus.STATUS_OUT_OF_TOLERANCE+', '+DriftStatus.STATUS_CASH_IN;
  public static readonly STATUS_OUT_OF_TOLERANCE_OR_CASH_IN = `${DriftStatus.STATUS_OUT_OF_TOLERANCE}","${DriftStatus.STATUS_OUT_OF_TOLERANCE_AND_CASH_IN}`;
  public static readonly STATUS_NEW_HOUSEHOLD = 'New Household';
  public static readonly STATUS_NEW_ACCOUNT = 'New Account';

  //Following getters are being used to render on HTML,
  //Static properties can't be use on html page
  public get CASH_IN():string {
    return DriftStatus.STATUS_CASH_IN;
  }

  public get OUT_OF_TOLERANCE():string {
    return DriftStatus.STATUS_OUT_OF_TOLERANCE;
  }

  public get UNASSIGNED():string {
    return DriftStatus.STATUS_UNASSINGED;
  }

  public get ERROR():string {
    return DriftStatus.STATUS_ERROR;
  }
}
