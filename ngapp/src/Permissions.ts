/**
 * Created by moazzam.qaisar on 1/9/2018.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class Permissions{

  public readonly userPermissions : Map<string,string> = new Map<string,string>();

  constructor()
  {
    /** Account permissions **/
    this.userPermissions.set('accountModifyApprovedAccount','account:ModifyApprovedAccount');
    this.userPermissions.set('accountModifyAttributes','account:ModifyAttributes');
    this.userPermissions.set('accountModifyEquivalances','account:ModifyEquivalances');
    this.userPermissions.set('accountModifyRestrictions','account:ModifyRestrictions');
    this.userPermissions.set('accountModifyTaxSettings','account:ModifyTaxSettings');
    this.userPermissions.set('accountViewAccountSummaryReport','account:ViewAccountSummaryReport');
    this.userPermissions.set('accountModifyTiltingParameters','account:ModifyTiltingParameters');
    this.userPermissions.set('accountUploadWashsales','account:UploadWashsales');
    this.userPermissions.set('accountViewData','account:ViewData');
    this.userPermissions.set('accountImport','account:Import');
    this.userPermissions.set('accountModifyLotStatus','account:ModifyLotStatus');
    this.userPermissions.set('accountOverview','account:Overview');

    /** Attributes Permissions **/
    this.userPermissions.set('attributesImport','attributes:Import');

    /** Audit Permissions **/
    this.userPermissions.set('auditView','audit:View');

    /** Equivalence Permissions **/
    this.userPermissions.set('equivalenceCreate','equivalence:Create');
    this.userPermissions.set('equivalenceDelete','equivalence:Delete');
    this.userPermissions.set('equivalenceList','equivalence:List');
    this.userPermissions.set('equivalenceModify','equivalence:Modify');

    /** Firm Permissions **/
    this.userPermissions.set('firmBilling','firm:Billing');
    this.userPermissions.set('firmFirmSettings','firm:FirmSettings');
    this.userPermissions.set('firmModifyComplianceRestrictions','firm:ModifyComplianceRestrictions');
    this.userPermissions.set('firmTomsItegration','firm:TomsItegration');

    /** Model Permissions **/
    this.userPermissions.set('modelCloneSecurityModel','model:CloneSecurityModel');
    this.userPermissions.set('modelCloneModelOfModel','model:CloneModelOfModel');
    this.userPermissions.set('modelCloneAssetModel','model:CloneAssetModel');
    this.userPermissions.set('modelCreateAssetModel','model:CreateAssetModel');
    this.userPermissions.set('modelCreateModelOfModel','model:CreateModelOfModel');
    this.userPermissions.set('modelCreateSecurityModel','model:CreateSecurityModel');
    this.userPermissions.set('modelDeleteAssetModel','model:DeleteAssetModel');
    this.userPermissions.set('modelDeleteModelOfModel','model:DeleteModelOfModel');
    this.userPermissions.set('modelDeleteSecurityModel','model:DeleteSecurityModel');
    this.userPermissions.set('modelImport','model:Import');
    this.userPermissions.set('modelList','model:List');
    this.userPermissions.set('modelModifyAssetModel','model:ModifyAssetModel');
    this.userPermissions.set('modelModifyModelOfModel','model:ModifyModelOfModel');
    this.userPermissions.set('modelModifySecurityModel','model:ModifySecurityModel');
    this.userPermissions.set('modelViewAssetModel','model:ViewAssetModel');
    this.userPermissions.set('modelViewAssociatedPortfolios','model:ViewAssociatedPortfolios');
    this.userPermissions.set('modelViewModelOfModel','model:ViewModelOfModel');
    this.userPermissions.set('modelViewSecurityModel','model:ViewSecurityModel');

    /** Portfolios Permissions **/
    this.userPermissions.set('portfolioApproveTrades','portfolio:ApproveTrades');
    this.userPermissions.set('portfolioAssignUser','portfolio:AssignUser');
    this.userPermissions.set('portfolioCreateHousehold','portfolio:CreateHousehold');
    this.userPermissions.set('portfolioEditTrades','portfolio:EditTrades');
    this.userPermissions.set('portfolioExportTrades','portfolio:ExportTrades');
    this.userPermissions.set('portfolioList','portfolio:List');
    this.userPermissions.set('portfolioModifyHousehold','portfolio:ModifyHousehold');
    this.userPermissions.set('portfolioModifyRebalanceSettings','portfolio:ModifyRebalanceSettings');
    this.userPermissions.set('portfolioPushTrades','portfolio:PushTrades');
    this.userPermissions.set('portfolioRunDrift','portfolio:RunDrift');
    this.userPermissions.set('portfolioRunRebalance','portfolio:RunRebalance');
    this.userPermissions.set('portfolioViewDrift','portfolio:ViewDrift');
    this.userPermissions.set('portfolioViewRebalanceSettings','portfolio:ViewRebalanceSettings');
    this.userPermissions.set('portfolioViewReports','portfolio:ViewReports');
    this.userPermissions.set('portfolioModifyHousehold','portfolio:ModifyHousehold');

    /** Price Permissions **/
    this.userPermissions.set('priceImport','price:Import');

    /** Ranks Permissions **/
    this.userPermissions.set('ranksImport','ranks:Import');

    /** Reports Permissions **/
    this.userPermissions.set('reportWhoOwns','report:WhoOwns');
    this.userPermissions.set('reportInsights','report:Insights');


    /** Security Master Permissions **/
    this.userPermissions.set('securityMasterImport','securitymaster:Import');
    this.userPermissions.set('securitymasterView','securitymaster:View');

    /** Security Type Permissions **/
    this.userPermissions.set('securityTypeImport','securitytype:Import');

    /** Template Permissions **/
    this.userPermissions.set('templateCreate','template:Create');
    this.userPermissions.set('templateModify','template:Modify');
    this.userPermissions.set('templateDelete','template:Delete');

    /** Tilting Param Permissions **/
    this.userPermissions.set('tiltingParamImport','tiltingparam:Import');

    /** TOMS Permissions **/
    this.userPermissions.set('tomsCancelOrder','toms:CancelOrder');
    this.userPermissions.set('tomsCreateOrder','toms:CreateOrder');
    this.userPermissions.set('tomsCreateTradeAllocationFile','toms:CreateTradeAllocationFile');
    this.userPermissions.set('tomsImportTrades','toms:ImportTrades');
    this.userPermissions.set('tomsModifyOrder','toms:ModifyOrder');
    this.userPermissions.set('tomsViewOrder','toms:ViewOrder');

    /** User Permissions **/
    this.userPermissions.set('userCreate','user:Create');
    this.userPermissions.set('userModify','user:Modify');
    this.userPermissions.set('userModifyRights','user:ModifyRights');
    this.userPermissions.set('userModifyRoles','user:ModifyRoles');

    /** Workspace Permissions **/
    this.userPermissions.set('workspaceCreate','workspace:Create');
    this.userPermissions.set('workspaceList','workspace:List');
    this.userPermissions.set('workspaceView','workspace:View');
    this.userPermissions.set('workspaceModify','workspace:Modify');

    this.userPermissions.set('workspaceObjectiveFunctionRebalancing','workspace:ObjectiveFunctionRebalancing');
    this.userPermissions.set('workspaceRebalanceTypeSettings','workspace:RebalanceTypeSettings');

    /** Data Import **/
    this.userPermissions.set('importData','import:Data');
    this.userPermissions.set('supportZipImport','import:SupportData');
  }

}
