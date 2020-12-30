import {
    Component,
    ViewChild,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    AfterContentChecked,
    ChangeDetectorRef
} from "@angular/core";
import {CreateWorkspaceComponent} from "../create-workspace/create-workspace.component";
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';

import {ActivatedRoute, Router} from "@angular/router";
import {ExpandableSettingsComponent} from "../../shared/components/expandable-settings/expandable-settings.component";
import {RebalanceSettingsComponent} from "../../account/components/rebalance-settings/rebalance-settings.component";
import {RebalanceTemplateObject} from "../../shared/classes/RebalanceTemplate.class";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {WorkspaceService} from "../workspace.service";
import {CriteriaService} from "../components/criteria-builder/criteria.service";
import {UrebalDropdownComponent} from "../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {UILoader} from "../../shared/util/UILoader";

import {PermissionResolverService, UrebalPermissions} from '../../services/permission-resolver.service';
import {AccountDetailComponent} from "../../account/account-detail/account-detail.component";
import {ModelElementsComponent} from "../../model/components/model-elements/model-elements.component";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {rebalanceAccountsGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import {URebalService} from "../../services/urebal.service";
import {columnHeaderRenderer} from "../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {AppConfig} from "../../../app.config";
import {
    DEFAULT_TEMPLATE_NOT_FOUND_MSG,
    getRebalanceRule,
    selectedTemplateCellRenderer
} from "./execute-workspace.datasource";
import {TemplateService} from "../../templates/template.service";
import {TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND} from "../../templates/template-list/template-list.datasource";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Component({
    selector: 'app-execute-workspace',
    templateUrl: './execute-workspace.component.html'
})
export class ExecuteWorkspaceComponent extends CreateWorkspaceComponent implements AfterContentChecked {
    private workspacesList: string[] = [];
    private currentIndex: number = 0;
    public aSettings: string = "Account Profile";
    public isValid: boolean = true;
    public workspaceMessage: string;
    public applyTemplateError: string;
    protected tiltingParameterList: any[];
    public modalId: string = "";
    private modalIdsArray: string[] = [];
    public modelDetail: any = {};
    private isDefaultTemplateConfigured: boolean = false;
    public defaultTemplateNotFoundMessage: string = TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;

    private _defaultTemplateTooltip: string = "Loading...";
    public get defaultTemplateTooltip() : string {
        return this._defaultTemplateTooltip;
    }

    @ViewChild('mainGridRef', {static: true}) reviewGrid: UrebalGridComponent;
    @ViewChild('exPandRef') expand1: ExpandableSettingsComponent;
    @ViewChild('rebalanceSettingsRef') rebalanceSettingsComponent: RebalanceSettingsComponent;
    @ViewChild('WorkspaceExecutionRef') WorkspaceExecutionRef: ModalComponent;
    @ViewChild('approvalStatusModal') approvalStatusModal: ModalComponent;
    @ViewChild('rebalaceAllModalRef') rebalaceAllModalRef: ModalComponent;
    @ViewChild('templateApplyAllModalRef') templateApplyAllModalRef: ModalComponent;
    @ViewChild(UrebalDropdownComponent) templateDropDown: UrebalDropdownComponent;
    @ViewChild('modelElementsRef') modelElementsDetail: ModelElementsComponent;
    @ViewChild('defaultTemplateNotFoundModal1') defaultTemplateNotFoundModal1: ModalComponent;
    protected rebalanceTemplateList: RebalanceTemplateObject[] = [];
    protected selectedTemplate: RebalanceTemplateObject;
    public defaultTemplateNotFoundMessage1: string="";

    @ViewChildren(ModalComponent) addModalRef: QueryList<ModalComponent>;
    //Add refernec for accoutn settings component to use account settings functionality and screen

    @ViewChild('accountSettingsRef') accountSettings: AccountDetailComponent;
    @Output() testOp: EventEmitter<any> = new EventEmitter();

    constructor(public urebalService: URebalService,
                public workspaceService: WorkspaceService,
                criteriaService: CriteriaService,
                route: ActivatedRoute,
                router: Router,
                ref: ChangeDetectorRef,
                templateService: TemplateService,
                permissionResolverService: PermissionResolverService
    ) {
        super(workspaceService, criteriaService, route, router, ref,templateService, permissionResolverService);
        this.modalId = this.generateNextModalId();
    }

    ngOnInit() {

        this.initializeLazyLoadGrid(this.reviewGrid.jqxGrid, 'accountId','accountNumber');
        this.initializeTemplateToggleMenu();
        this.initializerebalanceMenuButton();

        this.getRebalanceTemplateList();
        this.getDefaultSettingsTooltip().subscribe(tooltip => {
            if (tooltip) {
                this._defaultTemplateTooltip = tooltip;
                this.reviewGrid.refreshGrid();

                if (tooltip != DEFAULT_TEMPLATE_NOT_FOUND_MSG) {
                    this.isDefaultTemplateConfigured = true;
                }
            }
        });
        this.route.params.subscribe(params => {
            if (params['wsName']) {
                this.workspaceName = URebalUtil.decodeparams(params['wsName']);
                this.isEdit = false;
                this.isStep1 = false;
                this.isValid = false;
                this.fetchWorkspaceRebalance();
                this.workspacesList.push(this.workspaceName);
                if(this.isAllowed('objectiveFunctionRebalancing')){
                  this.getTiltParameterList();
                }

            }
        });
    }

    initializeTemplateToggleMenu(){
        $('body').on('click', function (event) {
            if (!event.target.matches('#btnTemplateToggleMenu') && !event.target.matches('#imgTemplateToggleMenu')) {
                $('#divTemplateToggleMenu').addClass('slds-hide');
                $('#imgTemplateToggleMenu').removeClass('slds-button_icon--blueleaf-rotate-90');
            }
        });
    }

    initializerebalanceMenuButton(){
        $('body').on('click', function (event) {
            if (!event.target.matches('#toggleMenuButton') && !event.target.matches('#toggleMenuImage')) {
                $('#rebalanceMenu').addClass('slds-hide');
                $('#toggleMenuImage').removeClass('slds-button_icon--blueleaf-rotate');
            }
        });
    }

    ngAfterContentChecked() {
        $(".jqx-checkbox").parent().attr("title", "");
    }

    addFieldsInGrid(result) {
        for (let entry of result) {
            if (entry.isHousehold)
                entry.accountSettings = "Household Profile";
            else
                entry.accountSettings = "Account Profile";
        }
        return result;
    }

    getRebalanceTemplateList(callback = () => {}) {
        this.workspaceService.getRebalanceTemplateList().subscribe(
            result => {
                if (result.code == 200) {
                    this.rebalanceTemplateList = result.responsedata;
                    if(this.rebalanceTemplateList && Array.isArray(this.rebalanceTemplateList)){
                        this.rebalanceTemplateList.sort((a, b) => a.templateName.localeCompare(b.templateName));
                    }
                    for (let rebTemplate of this.rebalanceTemplateList) {
                        if (this.selectedTemplate && rebTemplate.templateName == this.selectedTemplate.templateName) {
                            this.selectedTemplate = rebTemplate;
                        }
                    }
                    if (this.templateDropDown) {
                        this.templateDropDown.refreshDropDown(this.rebalanceTemplateList);
                    }
                    callback();
                } else {
                    console.error(result.message);
                    if (this.templateDropDown) {
                        this.templateDropDown.refreshDropDown();
                    }
                }
            },
            err => {
                console.error(err);
            });
    }

    getTiltParameterList() {
        this.workspaceService.getTiltParameterList().subscribe(
            result => {
                if (result.code == 200) {
                    this.tiltingParameterList = result.responsedata;
                } else {
                    console.error(result.message);
                }
            },
            err => {
                console.error(err);
            });
    }


    selectRebalanceTemplate(event) {
        let templateName = event.value;
        for (let rebTemplate of this.rebalanceTemplateList) {
            if (rebTemplate.templateName == templateName) {
                this.selectedTemplate = rebTemplate;
                if (this.selectedRebalanceData) {
                    this.applyTemplateError = "";
                }
                break;
            }
        }

    }

    checkTemplateSelected(){
        if(this.selectedTemplate == null){
            this.applyTemplateError = "Please select template to apply";
        }
        else{
            this.templateApplyAllModalRef.open();
        }
    }

    applyReblanceTemplateToAllAccounts(){
        this.templateApplyAllModalRef.close();
        this.selectedRebalanceData = Object.assign([],this.reviewGrid.jqxGrid.getboundrows());
        this.applyRebalanceTemplate(true);
        //console.log(this.selectedRebalanceData);
    }

    applyRebalanceTemplate(isApplyingToAllAccounts : boolean = false) {
      //this.getRebalanceTemplateList(()=>{

        if (this.selectedRebalanceData.length > 0 && this.selectedTemplate) {
          UILoader.blockUI.start('Applying template...'); // Start blocking

          let rebalanceIdList = [];
          this.applyTemplateError = "";
          for (let rebalanceData of this.selectedRebalanceData) {
            rebalanceIdList.push(rebalanceData.rebalanceId);
          }

          let saveRebalanceSettings = {
            templateId: this.selectedTemplate.templateId,
            isSecurityTypeRounding: this.selectedTemplate.isSecurityTypeRounding,
            rebalanceSecTypeRounding:[],
            rebalanceIdsList: rebalanceIdList
          };

          if(saveRebalanceSettings.isSecurityTypeRounding) {
            let securityTypesList: any[] = [];
            let templateData:any={templateId:this.selectedTemplate.templateId};
            this.urebalService.post("RebalanceWS/getSecurityTypesByTemplateId", templateData)
              .subscribe(result => {
                if (result.code == 200) {
                  securityTypesList = result.responsedata;

                  saveRebalanceSettings.rebalanceSecTypeRounding=[];

                  for (let type of securityTypesList) {
                    if (type.roundNearestUnit == "Do not round") {
                      type.roundNearestUnit = 0;
                    }

                    let data = {
                      roundBuyDirection: type.roundBuyDirection,
                      roundNearestUnit: type.roundNearestUnit,
                      roundSellDirection: type.roundSellDirection,
                      securityType: type.securityType
                    };

                    saveRebalanceSettings.rebalanceSecTypeRounding.push(data);
                  }

                  this.workspaceService.saveRebalanceSettings(saveRebalanceSettings)
                    .subscribe(result => {
                      this.WorkspaceExecutionRef.open();
                      if (result.code == 200) {
                        this.selectedRebalanceData = [];
                        this.workspaceMessage =
                          `Template '${this.selectedTemplate.templateName}' has been applied successfully ${(isApplyingToAllAccounts ? 'to all the accounts' : 'on the selected accounts')}`;
                      } else if (result.code == 400) {
                        this.workspaceMessage = "Template apply failed";
                      } else {
                        console.error(result.message);
                      }

                        UILoader.blockUI.stop();
                    }, error => {
                        console.log(error);
                        UILoader.blockUI.stop();
                    });
                }
              }, error => {
                  console.log(error);
                  UILoader.blockUI.stop();
              });


          }else {
            this.workspaceService.saveRebalanceSettings(saveRebalanceSettings)
              .subscribe(result => {
                this.WorkspaceExecutionRef.open();
                if (result.code == 200) {
                  this.selectedRebalanceData = [];
                  this.workspaceMessage =
                      `Template '${this.selectedTemplate.templateName}' has been applied successfully ${(isApplyingToAllAccounts ? 'to all the accounts' : 'on the selected accounts')}`;
                } else if (result.code == 400) {
                  this.workspaceMessage = "Template apply failed";
                } else {
                  console.error(result.message);
                }
                  UILoader.blockUI.stop();
              }, error => {
                  console.log(error);
                  UILoader.blockUI.stop();
              });
          }



        } else {
          this.applyTemplateError = "Please select accounts and choose template to apply";
        }

      //});


    }

    toggleTemplateMenu() {
        let divMenu = $('#divTemplateToggleMenu');
        let imgMenu = $('#imgTemplateToggleMenu');
        imgMenu.hasClass('slds-button_icon--blueleaf-rotate-90') ?
            imgMenu.removeClass('slds-button_icon--blueleaf-rotate-90') :
            imgMenu.addClass('slds-button_icon--blueleaf-rotate-90');
        divMenu.hasClass('slds-hide') ? divMenu.removeClass('slds-hide') : divMenu.addClass('slds-hide');
    }

    toggleRebalanceMenu() {
        let divMenu = $('#rebalanceMenu');
        let imgMenu = $('#toggleMenuImage');
        imgMenu.hasClass('slds-button_icon--blueleaf-rotate') ?
            imgMenu.removeClass('slds-button_icon--blueleaf-rotate') :
            imgMenu.addClass('slds-button_icon--blueleaf-rotate');
        divMenu.hasClass('slds-hide') ? divMenu.removeClass('slds-hide') : divMenu.addClass('slds-hide');
    }

    executeAllWorkspace() {
        this.rebalaceAllModalRef.close();
        this.selectedRebalanceData = Object.assign([],this.reviewGrid.jqxGrid.getrows());
        this.validateWorkspace();
    }

    validateWorkspace() {

        if (this.selectedRebalanceData.length == 0) {
            this.workspaceMessage = "Please select at least one account to execute rebalance.";
            this.WorkspaceExecutionRef.open();
        }
        if (this.selectedRebalanceData.length > 0) {
            let approved = false;
            for (let rebalanceData of this.selectedRebalanceData) {
                if (rebalanceData.isApproved) {
                    this.approvalStatusModal.open();
                    approved = true;
                    break;
                }

                if (!rebalanceData.templateId && !this.isDefaultTemplateConfigured) {
                    this.defaultTemplateNotFoundModal.open();
                    return;
                }
            }

            if (!approved) {
                this.executeWorkspace();
            }
        }
    }

    executeWorkspace() {

        this.approvalStatusModal.close();
        let workspaceRebalanceList = [];
        for (let rebalanceData of this.selectedRebalanceData) {
            let rebalance = {
                'rebalanceId': rebalanceData.rebalanceId
            }
            workspaceRebalanceList.push(rebalance);
        }

        let executeWorkspace = {
            name: this.workspaceName,
            type: "Static",
            criteriaString: this.userCriteria,
            workflowRebalanceList: workspaceRebalanceList,
            timeOffsetFromUTCInMins: new Date().getTimezoneOffset()
        }

        //this.blockUI.start('Executing Workspace...'); // Start blocking
        UILoader.blockUI.start('Executing Rebalance...'); // Start blocking
        this.workspaceService
        .executeWorkspace(executeWorkspace)
        .subscribe(
            post => {
                this.WorkspaceExecutionRef.open();
                if (post.code == 200) {
                    this.invalidWorkspace = false;
                    this.workspaceMessage = "Rebalance has completed successfully";
                } else {
                    this.invalidWorkspace = true;
                    this.workspaceMessage = post.message;
                    this.selectedRebalanceData = [];
                }
                UILoader.blockUI.stop();
            },
            err => {
                console.error(err);
                //this.blockUI.stop();
                UILoader.blockUI.stop();
            }
        );
    }

    rightWorkspaceButton() {
        this.currentIndex++;
        this.currentIndex = this.currentIndex % this.workspacesList.length;
        this.workspaceName = this.workspacesList[this.currentIndex];
        this.fetchWorkspaceRebalance(this.reviewGrid);
    }

    leftWorkspaceButton() {
        this.currentIndex--;
        this.currentIndex = this.currentIndex == -1 ? this.workspacesList.length - 1 : this.currentIndex;
        this.currentIndex = this.currentIndex % this.workspacesList.length;
        this.workspaceName = this.workspacesList[this.currentIndex];
        this.fetchWorkspaceRebalance(this.reviewGrid);

    }

  openRebalanceSettings(portfolioId) {
    this.expand1.openSettingsDrawer();
    this.rebalanceSettingsComponent.isCreateTemplateMode=false;
    this.rebalanceSettingsComponent.getUserRebalanceSettings(portfolioId,this.rebalanceTemplateList,()=>{
      this.rebalanceSettingsComponent.getAccountIdsForRebalance(portfolioId,()=>{
        this.rebalanceSettingsComponent.getSecurityTypeRoundingValuesForRebalance();
      });
      this.rebalanceSettingsComponent.getModelsList();
      this.rebalanceSettingsComponent.createTiltingData();
      this.rebalanceSettingsComponent.getRebalanceTemplateList();
    });
  }


  openCreateTemplate() {
    this.templateService.getDefaultRebalanceSettings().subscribe(
      rebalanceSettings => {
        if (rebalanceSettings) {
          if (rebalanceSettings.code === 200) {
            this.router.navigate(["secure/templates/create", {
              returnUrl: `/secure/rebalances/executeRebalance/${URebalUtil.encodeparams(this.workspaceName)}`
            }]);
          }else if (rebalanceSettings.code === 404) {
            this.defaultTemplateNotFoundMessage1 = TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;
            this.defaultTemplateNotFoundModal1.open();
          }
        }
      });

  }


  openAccountSettings(portfolioId,isHousehold) {
    this.openModal(this.modalId);
    this.accountSettings.initializeModalMode(portfolioId,isHousehold);
  }

    openModelDetail() {
        let context = this.workspaceService.getAppContext();
        window.open(context + "/secure/model/detail/" + this.modelDetail.id);
    }

    accountSettingsOnClose() {
        this.fetchWorkspaceRebalance(this.reviewGrid);
    }

    OnLinkActive(event: GridLinkInfo) {
        // Call the relevant method as per data in event object
        if (event.linkType == "openRebalanceSettings") {
            this.openRebalanceSettings(event.linkParams["portfolioId"]);
        } else if (event.linkType == "openAccountSettings") {
            // openAccountSettings
            this.openAccountSettings(event.linkParams["portfolioId"], event.linkParams["isHousehold"]);

        } else if (event.linkType == "openModelDetail") {
            this.modelDetail = {
                "modelType": event.linkParams["modelType"],
                "attributeType": event.linkParams["attributeType"],
                "name": event.linkParams["modelName"],
                "id": event.linkParams["modelId"],
                "isPartialModel": event.linkParams["isPartialModel"],
                "isModelActive": event.linkParams["isModelActive"],
                "asOfDate": event.linkParams["asOfDate"]
            };
            this.openModelDetail();
        }
    }

    gotoEdit(): void {

        this.router.navigate(['/secure/rebalances/rebalance', URebalUtil.encodeparams(this.workspaceName)]);
    }
  gotoForbidden(): void {
      this.router.navigate(['/user/forbiddenaccess'])
  }


  viewReports(): void {
        this.router.navigate(['/secure/rebalances/viewreports', URebalUtil.encodeparams(this.workspaceName)]);
    }

    onSettingsClose(rebTemplateList) {
        setTimeout(() => {
            this.fetchWorkspaceRebalance(this.reviewGrid);
            this.rebalanceTemplateList = rebTemplateList;
            this.templateDropDown.refreshDropDown(rebTemplateList);
        }, 1000);
    }

  onCreateTemplateClose(rebTemplateList) {
    setTimeout(()=>{
      this.fetchWorkspaceRebalance(this.reviewGrid);
      this.rebalanceTemplateList = rebTemplateList;
      this.templateDropDown.refreshDropDown(rebTemplateList);
    },1000);
  }

    workspaceModalClose() {
        this.fetchWorkspaceRebalance(this.reviewGrid);
    }

    navigateToWorkspaceList() {
        this.router.navigate(['/secure/rebalances/list']);
    }

    closeAccountDetailModal($event) {
        this.fetchWorkspaceRebalance(this.reviewGrid);
        this.closeModal(this.modalId);
        //this.addModalRef.close();
    }

    openModal(id) {
        let instance = this.addModalRef.toArray().find(modal => modal.id == id);
        if (instance != null && instance != undefined) {
            instance.open();
        }
    }

    closeModal(id) {
        let instance = this.addModalRef.toArray().find(modal => modal.id == id);
        if (instance != null && instance != undefined) {
            instance.close();
        }
    }

    generateNextModalId() {
        var nextModalId = "AccountDetailsModal-" + Math.floor((Math.random() * 100000) + 1);
        if (this.modalIdsArray.length > 0) {
            if (this.modalIdsArray.indexOf(nextModalId) > -1) {
                return nextModalId;
            } else {
                return this.generateNextModalId();
            }
        } else {
            return nextModalId;
        }
    }

    getRebalanceAccountsGridColumns() {
        let data = [
            {
                text: "Type",
                align: "center",
                cellsalign: "center",
                filterable: false,
                cellsrenderer: "typeRenderer",
                datafield: "isHousehold",
                renderer: columnHeaderRenderer,
                width: "3.8%",
            },
            {
                text: "Account Number",
                align: "center",
                cellsalign: "left",
                datafield: "accountNumber",
                cellsrenderer: "linkRenderer",
                renderer: columnHeaderRenderer,
                width: "10%"
            },
            {
                text: "Account Name",
                align: "center",
                cellsalign: "left",
                datafield: "portfolioName",
                cellsrenderer: "cellsRenderer",
                renderer: columnHeaderRenderer,
                width: "15%"
            },
            {
                text: "Template ID",
                align: "center",
                cellsalign: "left",
                datafield: "templateId",
                cellsrenderer: "cellsRenderer",
                renderer: columnHeaderRenderer,
                width: "0%"
            },
            {
              text: "Selected<br/> Template",
              align: "center",
              cellsalign: "left",
              datafield: "templateName",
              renderer: columnHeaderRenderer,
              cellsrenderer: selectedTemplateCellRenderer.bind(null, this),
              width: "18%"
            },
            {
                text: "Tax Status",
                datafield: "isTaxable",
                cellsrenderer: "cellsRenderer",
                align: "center",
                cellsalign: "left",
                renderer: columnHeaderRenderer,
                width: "0%"
            },
            {
                text: "Model",
                align: "center",
                datafield: "modelName",
                cellsrenderer: "linkRenderer",
                cellsalign: "left",
                renderer: columnHeaderRenderer,
                width: "13%"
            },
            {
                text: "Market Value (USD)",
                datafield: "marketValue",
                cellsrenderer: "cellsRenderer",
                cellsformat: "d0",
                align: "center",
                cellsalign: "right",
                renderer: columnHeaderRenderer,
                width: "10%"
            },
            {
                text: "Drift %",
                datafield: "drift",
                cellsrenderer: "cellsRenderer",
                cellsformat: "d2",
                align: "center",
                cellsalign: "right",
                renderer: columnHeaderRenderer,
                width: "7%"
            },
            {
                text: "Approval Status",
                datafield: "isApprovedValue",
                cellsrenderer: "cellsRenderer",
                align: "center",
                cellsalign: "left",
                width: "8.2%"
            },
            {
                text: "Last Rebalanced",
                align: "center",
                cellsalign: "center",
                datafield: "lastRunDate",
                cellsformat: AppConfig.DATETIME_FORMAT,
                cellsrenderer: "cellsRenderer",
                renderer: columnHeaderRenderer,
                width: "12%"
            },
            {
                text: " ",
                align: "center",
                datafield: "accountSettings",
                cellsrenderer: "cellsRenderer",
                sortable: false,
                cellsalign: "center",
                renderer: columnHeaderRenderer,
                width: "0%"
            }
        ];

        SoftpakGridHelper.mergeGridColumnProperties(data, rebalanceAccountsGridColsMeta)

        return data;
    }

    getDefaultSettingsTooltip() : Observable<string | undefined> {
        return this.templateService.getDefaultRebalanceSettings().pipe(
            map(response => {
                if (response.code == 200) {
                    const rebalanceSettings = response.responsedata;

                    const isRestrictionApply = rebalanceSettings.isRestrictionApply;
                    const isEquivalenceApply = rebalanceSettings.isEquivalenceApply;
                    const isMTSApply = rebalanceSettings.isMTSApply;
                    const mtsValue = rebalanceSettings.minTradeSize;
                    const rebalanceType = rebalanceSettings.rebalanceType;

                    let toolTip = "System Default Rebalance Settings will be used:\n";
                    toolTip += `- ${getRebalanceRule(rebalanceType)}\n`;
                    toolTip += `- ${isRestrictionApply ? "Apply security restrictions" : "Security restrictions not applied"}\n`;
                    toolTip += `- ${isEquivalenceApply ? "Apply equivalences" : "Equivalences not applied"}\n`;
                    toolTip += `- ${!isMTSApply ? "No minimum trade size" : "Minimum trade size: " + mtsValue.toString()}\n`;

                    return toolTip;
                } else if (response.code == 404) {
                    return DEFAULT_TEMPLATE_NOT_FOUND_MSG;
                }

                return undefined;
            })
        );
    }

    routeToTemplate(templateId: number, event) {
        event.preventDefault();
        this.router.navigate(["/secure/templates/edit", templateId, {
            returnUrl: `/secure/rebalances/executeRebalance/${URebalUtil.encodeparams(this.workspaceName)}`
        }]);
    }
}
