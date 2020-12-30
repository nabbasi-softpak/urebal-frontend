import {Injectable, Inject} from '@angular/core';
import {URebalService} from "../services/urebal.service";
import { ResponseContentType} from '../shared/classes/ResponseContentType.class';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class WorkspaceService extends URebalService {

  GET_WORKFLOWLIST = "workflow/workflowList";
  REBALANCES_VIA_CRITERIA = "workflow/getRebalancesFromCriteria";
  GET_WORKFLOW = "workflow/getWorkflow";
  SAVE_WORKFLOW = "workflow/saveWorkflow";
  DELETE_WORKFLOW = "workflow/deleteWorkflow";
  EXECUTE_WORKFLOW = "workflow/executeWorkflow";
  GET_REBALANCE_OF_WORKFLOW = "workflow/getWorkflowRebalances";
  WORKFLOW_PROJECTS = "workflow/getWorkflowRebalances";
  WORKFLOW_PROJECTLIST = "workflow/getRebalancesList";
  EXPORT_SHARELOT_REPORT = "sharelot/reports/excel/";
  EXPORT_STOCK_REPORT = "stock/reports/excel/";
  EXPORT_OVERLAY_STOCK_REPORT = "overlaystock/reports/excel/";
  GET_REB_TEMPLATE_LIST = "RebalanceWS/getRebalanceTemplateList";
  GET_REB_TEMPLATE = "RebalanceWS/getTemplateByName";
  SAVE_REB_TEMPLATE = "RebalanceWS/saveRebalanceTemplate";
  SAVE_REBALANCE_SETTINGS = "RebalanceWS/saveRebalanceSettings";
  APPROVE_TRADES = "tradeExport/approveTrades";
  PUSH_TRADES = "tradeExport/pushTrades/";
  GET_TILTPARAM_LIST = "tiltingParameter/getTiltingParameterList";
  SAVE_TILT_PARAM_ACC = "tiltingParameter/saveAccTiltParam";
  CLEAR_TILT_PARAM_ACC = "tiltingParameter/deleteAccTiltParam";
  GET_TILT_PARAM_SEC = "tiltingParameter/getTiltingParameterSecurities";
  GET_RANK_SET_SECURITIES = "securityRank/getSecurityRankSet";
  GET_TAX_COST_CURVE_REPORT = "report/getTaxCostCurve";
  GET_TRADE_COST_CURVE_REPORT = "report/getTradeCostCurve";
  REBALANCE_ACCOUNT = "workflow/rebalance";
  GET_WORKSPACE_DETAILS_REPORT = "workflow/getWorkspaceSwapReport";
  CHECK_SUPPORT_ZIP_ENABLED = "PortfolioWS/isSupportZipEnabled";
  GENERATE_SUPPORT_ZIP_INPUTS = "PortfolioWS/generateSupportZipInputs";

  public _isDataChanged : any = false;

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  public getWorkspace(workspaceName){
    return this.get(this.GET_WORKFLOW + "?workflowName=" + encodeURIComponent(workspaceName));
  }
  public getWorkspaceList(){
    return this.get(this.GET_WORKFLOWLIST);
  }

  public getRebalanceListByCriteria(criteria,isWorkspace){
    return this.get(this.REBALANCES_VIA_CRITERIA + "?q=" + criteria +  "&w="+isWorkspace);
  }

  public getWorkspaceProjects(workspaceName){
    return this.get(this.WORKFLOW_PROJECTS + "?workflowName=" + workspaceName);
  }
  public getWorkspaceProjectsList(workspaceName){
    return this.get(this.WORKFLOW_PROJECTLIST + "?workflowName=" + workspaceName);
  }

  public saveWorkspace(workspace){
    return this.post(this.SAVE_WORKFLOW,workspace);
  }

  public deleteWorkspace(workspace){
    return this.post(this.DELETE_WORKFLOW,workspace);
  }

  public executeWorkspace(workspace){
    return this.postForm(this.EXECUTE_WORKFLOW,workspace);
  }
  public getRebalanceOfWorkspace(workspaceName){
    return this.get(this.GET_REBALANCE_OF_WORKFLOW + "?workflowName=" + encodeURIComponent(workspaceName));
  }

  public downloadReport(reportType,portfolioId){
    let url = '';
    if(reportType == "stock"){
      url = this.EXPORT_STOCK_REPORT + portfolioId;
    }else if(reportType == "overlay"){
      url = this.EXPORT_OVERLAY_STOCK_REPORT + portfolioId;
    }else{
      url = this.EXPORT_SHARELOT_REPORT + portfolioId;
    }
    return this.downloadFile(url, ResponseContentType.Blob);
  }

  public getRebalanceTemplateList(){
    return this.get(this.GET_REB_TEMPLATE_LIST);
  }

  public getRebalanceTemplateByName(template){
    return this.get(this.GET_REB_TEMPLATE + "?template=" + template);
  }

  saveRebalanceTemplate(rebalanceTemplate){
    return this.postForm(this.SAVE_REB_TEMPLATE,rebalanceTemplate);
  }

  saveRebalanceSettings(rebalanceSettings){
    return this.postForm(this.SAVE_REBALANCE_SETTINGS,rebalanceSettings);
  }

  set isDataChanged( value : any) {
    this._isDataChanged = value
  }

  get isDataChanged():any {
    return this._isDataChanged;
  }

  public approveTrades(portfolio){
    return this.post(this.APPROVE_TRADES,portfolio);
  }

  public pushTrades(portfolioId,workspaceName){
    return this.get(this.PUSH_TRADES + portfolioId+'/'+workspaceName);
  }

  public getTiltParameterList(){
    return this.get(this.GET_TILTPARAM_LIST);
  }

  saveTiltingParameter(tiltingParameter){
    return this.postForm(this.SAVE_TILT_PARAM_ACC,tiltingParameter);
  }
  deleteTiltingParameter(accountId){
    return this.get(this.CLEAR_TILT_PARAM_ACC + "?accountId=" + accountId);
  }

  public getTiltParamterWithSecurities(paramName){
    return this.get(this.GET_TILT_PARAM_SEC + "?paramName=" + paramName);
  }

  public getRankSetSecurities(setId){
    return this.get(this.GET_RANK_SET_SECURITIES + "?setId=" + setId);
  }

  public getTaxCostCurveReport(accountId){
    return this.get(this.GET_TAX_COST_CURVE_REPORT + "/" + accountId);
  }

  public getTradeCostCurveReport(accountId){
    return this.get(this.GET_TRADE_COST_CURVE_REPORT + "/" + accountId);
  }

  public rebalanceAccount(portfolioId, toleranceBand, numberOfSteps){
    return this.get(this.REBALANCE_ACCOUNT + "/" + portfolioId + "/" + toleranceBand+ "/" + numberOfSteps);
  }

  public getWorkspaceDetails(portfolioId){
    return this.get(this.GET_WORKSPACE_DETAILS_REPORT + "?portfolioId=" + portfolioId );
  }

  public checkSupportZipEnabled() {
      return this.get(this.CHECK_SUPPORT_ZIP_ENABLED);
  }

  public generateSupportZipInputs(portfolioId) {
    return this.GENERATE_SUPPORT_ZIP_INPUTS + "?portfolioId=" + portfolioId;
  }
}
