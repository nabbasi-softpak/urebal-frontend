import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {UILoader} from '../../shared/util/UILoader';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';
import {CriteriaBuilderComponent} from '../components/criteria-builder/criteria-builder.component';
import {ActivatedRoute, Router} from '@angular/router';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {WorkspaceService} from '../workspace.service';
import {CriteriaService} from '../components/criteria-builder/criteria.service';

import {PermissionResolverService, UrebalPermissions} from '../../services/permission-resolver.service';
import {columnHeaderRenderer} from "../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {LazyLoadedGrid} from "../../shared/util/LazyLoadedGrid";
import {jqxGridComponent} from "@jqxSource/angular_jqxgrid";
import {TemplateService} from "../../templates/template.service";
import {TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND} from "../../templates/template-list/template-list.datasource";
import {async} from "@angular/core/testing";


@Component({
    selector: 'app-create-workspace',
    templateUrl: 'create-workspace.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWorkspaceComponent extends UrebalPermissions implements OnInit, AfterContentChecked {

    @ViewChild('workspaceNameInput', {read: ViewContainerRef}) workspaceNameInput;
    @ViewChild('saveWorkspaceRef') saveWorkspaceModal: ModalComponent;
    @ViewChild('viewCheckedProjectsModalRef') viewCheckedProjectsModal: ModalComponent;
    @ViewChild('criteriaComponent') criteriaBuilder: CriteriaBuilderComponent;
    @ViewChild('mainGridRef', {static: true}) mainGrid: UrebalGridComponent;
    @ViewChild('modalGridRef') modalGrid: UrebalGridComponent;
    @ViewChild('defaultTemplateNotFoundModal') defaultTemplateNotFoundModal: ModalComponent;

    userCriteria: string;
    displayUserCriteria: string;
    isEdit: boolean = false;
    workspaceName: string;
    isStep1: boolean = true;
    tokensList: any = [];
    workspaceErrorMessage: string;
    workspaceNameErrorMessage: string;
    gridData: any = [];
    gridCriteriaData: any = [];
    invalidWorkspace: boolean = false;
    invalidWorkspaceName: boolean = false;
    selectedRebalanceData: any = [];
    workspaceSuccessMessage: string;
    isWorkspace: boolean = false;
    public containsWorkspaceNamesArray = [];
    private editingWorkspace: boolean = false;

    public lazyLoadGrid: LazyLoadedGrid<any>;

    @ViewChild(CriteriaBuilderComponent) criteriaBuilderComp: CriteriaBuilderComponent;
    public defaultTemplateNotFoundMessage: string="";
    private isDefaultMissing: boolean;

    constructor(public workspaceService: WorkspaceService,
                protected criteriaService: CriteriaService,
                protected route: ActivatedRoute,
                protected router: Router,
                private ref: ChangeDetectorRef,
                public templateService:TemplateService,
                public uRebalPermissionResolver: PermissionResolverService
    ) {
        super(uRebalPermissionResolver);
    }

    onRendering(e) {
        this.tokensList = e;
    }

    ngOnInit() {
        this.initializeLazyLoadGrid(this.mainGrid.jqxGrid, 'accountId', 'accountNumber');
        this.route.params.subscribe(params => {
            if (params['wsName']) {
                this.workspaceName = URebalUtil.decodeparams(params['wsName']);
                this.isEdit = true;
                this.isStep1 = false;
                this.getWorkspace();
                setTimeout(() => {
                    this.fetchWorkspaceRebalance();
                    this.getRebalanceListByCriteria();
                }, 500);
            }
        });

        setTimeout(() => {
            $('#input-01').focus();
        }, 200);
    }

    ngAfterContentChecked() {
        $(".jqx-checkbox").parent().attr("title", "");
    }

    initializeLazyLoadGrid(grid: jqxGridComponent, keycolumn: string, gridkeycolumn: string){
        this.lazyLoadGrid = new LazyLoadedGrid<any>(this.uRebalPermissionResolver);
        this.lazyLoadGrid.jqxGrid = grid;
        this.lazyLoadGrid.keyColumn = keycolumn;
        this.lazyLoadGrid.gridKeyColumn = gridkeycolumn;
    }

    apply() {
      if (!this.validateWorkspaceName()) {
        return;
      }

      this.generateCriteria();
    }

    generateCriteria() {
        for (let i = 0; i < this.criteriaService.componentReferences.length; i++) {
            if (this.criteriaService.componentReferences[i].ref._component.accountName === "") {
                this.validateCriteria(true, 'Account name is required.');
                break;
            } else if (this.criteriaService.componentReferences[i].ref._component.modelName === "") {
                this.validateCriteria(true, 'Model name is required.');
                break;
            } else if (this.criteriaService.componentReferences[i].ref._component.marketValOperator) {
                if (this.criteriaService.componentReferences[i].ref._component.marketValOperator === 'Between') {
                    if ((this.criteriaService.componentReferences[i].ref._component.marketValue1 == null) || (this.criteriaService.componentReferences[i].ref._component.marketValue2 == null)) {
                        this.validateCriteria(true, 'Portfolio market value is required.');
                        break;
                    } else {
                        this.validateCriteria(false, '');
                    }
                } else {
                    if (this.criteriaService.componentReferences[i].ref._component.marketValue1 == null || this.criteriaService.componentReferences[i].ref._component.marketValue1 === "") {
                        this.validateCriteria(true, 'Portfolio market value is required.');
                        break;
                    } else {
                        this.validateCriteria(false, '');
                    }
                }
            } else if (this.criteriaService.componentReferences[i].ref._component.driftValOperator) {
                if (this.criteriaService.componentReferences[i].ref._component.driftValOperator === 'Between') {
                    if ((this.criteriaService.componentReferences[i].ref._component.drift1 == null) || (this.criteriaService.componentReferences[i].ref._component.drift2 == null)) {
                        this.validateCriteria(true, 'Drift value is required.');
                        break;
                    } else {
                        this.validateCriteria(false, '');
                    }
                } else {
                    if (this.criteriaService.componentReferences[i].ref._component.drift1 == null || this.criteriaService.componentReferences[i].ref._component.drift1 === "") {
                        this.validateCriteria(true, 'Drift value is required.');
                        break;
                    } else {
                        this.validateCriteria(false, '');
                    }
                }
            } else if (this.criteriaService.componentReferences[i].ref._component.driftStatus === "") {
                this.validateCriteria(true, 'Drift Status is required.');
                break;
            } else {
                this.validateCriteria(false, '');
            }
        }

        if (!this.invalidWorkspace) {
            this.userCriteria = this.criteriaService.generateCriteriaString(this.tokensList);
            this.displayUserCriteria = this.userCriteria;
            this.evaluateCriteria();
        }

    }

    workspaceNameChanged() {
        this.invalidWorkspaceName = false;
        this.workspaceNameErrorMessage = "";

        this.ref.detectChanges();
    }

    validateWorkspaceName() {
      if (typeof this.workspaceName !== 'undefined') {
        this.workspaceName = this.workspaceName.replace(/(^\s+|\s+$)/g, '');
      } else {
        this.workspaceName = '';
      }

      if (!this.workspaceName) {
        this.invalidWorkspaceName = true;
        this.workspaceNameErrorMessage = "Please enter valid rebalance name";

        this.ref.detectChanges();
        return false;
      }

      this.invalidWorkspaceName = false;
      this.ref.detectChanges();

      return true;
    }

    validateCriteria(invalidWorkspace, errMsg) {
        this.invalidWorkspace = invalidWorkspace;
        this.workspaceErrorMessage = errMsg;

        this.ref.detectChanges();
    }


    private evaluateCriteria() {
        this.criteriaBuilder.invalidCriteria = false;
        this.criteriaBuilder.modalSaveCriteriaSuccess = '';
        this.criteriaBuilder.modalSaveCriteriaError = '';

        if (this.userCriteria && this.workspaceName && !this.invalidWorkspaceName) {
          this.checkWorkspaceExists().subscribe(isExist => {
            if (!isExist || this.isEdit) {
              this.getRebalanceListByCriteria();
            } else {
              this.invalidWorkspaceName = true;
              this.workspaceNameErrorMessage = "Rebalance already exist";

              this.ref.detectChanges();
            }
          });

        } else if (!this.workspaceName) {
          this.invalidWorkspaceName = true;
          this.workspaceNameErrorMessage = "Please enter valid rebalance name";
          this.workspaceNameInput.element.nativeElement.focus();

        } else if (!this.userCriteria && !this.invalidWorkspaceName) {
          this.invalidWorkspace = true;
          this.workspaceErrorMessage = "Please enter valid filter";
        } else {
          this.workspaceNameInput.element.nativeElement.focus();
        }

        this.ref.detectChanges();
    }

    getWorkspace() {
        if (!this.validateWorkspaceName()) {
          return;
        }

        this.invalidWorkspace = false;

        this.workspaceService
        .getWorkspace(this.workspaceName)
        .subscribe(
            result => {
                if (result.code == 200) {
                    if (this.isEdit) {
                        this.displayUserCriteria = result.responsedata.criteriaString;
                        this.userCriteria = this.paseCriteria(result.responsedata.criteriaString);
                        if (this.criteriaBuilder !== undefined) {
                            this.criteriaBuilder.loadCriteria(this.userCriteria);
                        }
                    } else {
                        this.invalidWorkspaceName = true;
                        this.workspaceNameErrorMessage = "Rebalance already exist";
                    }
                } else if (result.code == 0) {
                    this.invalidWorkspaceName = false;
                }

                this.ref.detectChanges();
            },
            err => {
                console.log(err);
            }
        );

    }

    checkWorkspaceExists() : Observable<Boolean> {
      UILoader.start("Loading");

      return this.workspaceService
        .getWorkspace(this.workspaceName)
        .pipe(map(result => {
            UILoader.stop();

            if (result.code == 200) {
              return true;
            } else {
              return false;
            }
          }
        ));
    }

    paseCriteria(criteria): string {
        if (criteria.indexOf("IN") != -1 || criteria.indexOf("in") != -1) {
            return this.parseInClause(criteria);
        } else {
            return criteria;
        }
    }

    parseInClause(criteria): string {
        let openingParentheses: number = criteria.indexOf("(");
        let closingParentheses: number = criteria.indexOf(")");

        if (openingParentheses != -1 && closingParentheses != -1) {
            let in_criteria = criteria.substring(openingParentheses + 1, closingParentheses - 1);
            let replaceMultipleQuotes = in_criteria.replace(/"/g, "");
            let replaceSpaces = replaceMultipleQuotes.replace(/ /g, "_");
            let criteriaString = criteria.substring(0, openingParentheses)
            .concat("(#").concat(replaceSpaces).concat("#)")
            .concat(" " + criteria.substring(closingParentheses + 1, criteria.length).trim());
            return criteriaString.replace(/[()]/g, "");
        }
    }

    /**
     * Method implementation is in child class @see ExecuteWorkspaceComponent
     * @param result
     */
    addFieldsInGrid(result) {
        return result;
    }

    fetchWorkspaceRebalance(grid?) {
        if (this.workspaceName) {
            this.invalidWorkspaceName = false;
            this.invalidWorkspace = false;

            this.gridData = [];
            this.workspaceService
            .getRebalanceOfWorkspace(this.workspaceName)
            .subscribe(
                result => {
                    if (result.code == 404) {
                        this.router.navigate(['404']);
                    }
                    else if (result.code == 200) {
                        this.invalidWorkspace = false;
                        this.gridData = this.addFieldsInGrid(result.responsedata);
                        this.setGridData(this.gridData);
                        this.workspaceErrorMessage = '';
                    }
                    else if (result.code == 0) {
                        this.invalidWorkspace = true;
                        this.workspaceErrorMessage = "Rebalance has no accounts";
                    }

                    this.ref.detectChanges();
                },
                err => {
                    console.log(err);
                }
            );
        } else {
            this.invalidWorkspaceName = true;
            this.workspaceNameErrorMessage = "Please enter valid rebalance name";
            this.ref.detectChanges();
        }
    }

    isValidCriteria() {
        let criteria = this.displayUserCriteria;

        if (!criteria || criteria == '__No Criteria__') {
            return false;
        }
        return true;
    }

    getRebalanceListByCriteria() {
        UILoader.blockUI.start('Loading Filter Result...'); // Start blocking

        if (this.isValidCriteria()) {
            this.isWorkspace = this.criteriaBuilder.isWorkspaceExists;
            this.selectedRebalanceData = [];

            this.workspaceService
                .getRebalanceListByCriteria(encodeURIComponent(this.displayUserCriteria), !this.isWorkspace)
                .subscribe(
                    result => {
                        if (result.code == 200) {
                            this.invalidWorkspace = false;
                            this.gridCriteriaData = result.responsedata;

                            this.setGridData(result.responsedata);

                            this.workspaceErrorMessage = '';
                            this.isStep1 = false;
                        } else if (result.code == 0) {
                            this.invalidWorkspace = true;
                            result.responsedata=[];
                          this.setGridData(result.responsedata);
                          this.gridCriteriaData = null;
                          if(this.isStep1) {
                            this.workspaceErrorMessage = "No results found on the given filter, please enter another filter";
                          }
                        } else {
                            this.invalidWorkspace = true;
                            this.workspaceErrorMessage = result.message;
                        }

                        this.ref.detectChanges();
                        UILoader.blockUI.stop();
                    },
                    err => {
                        console.log(err);
                        UILoader.blockUI.stop();
                    }
                );
        }
        else {
            this.ref.detectChanges();
            UILoader.blockUI.stop();
        }
    }

    setGridData(gridData?: any) {

        if (this.mainGrid !== undefined) {
            if (!this.isEdit) {
                this.gridRefreshState(gridData, 'uncheckRows');
            } else {
                if (this.gridData) {
                    let combineGridData = [];
                    combineGridData.push.apply(combineGridData, this.gridData);
                    this.mainGrid.uncheckAllRow(gridData);
                    if (this.gridCriteriaData) {
                        combineGridData.push.apply(combineGridData, this.gridCriteriaData);
                        for (let criteriaData of this.gridCriteriaData) {
                            for (let wsData of this.gridData) {
                                if (criteriaData.portfolioId == wsData.portfolioId) {
                                    combineGridData.splice(combineGridData.indexOf(criteriaData), 1);
                                }
                            }
                        }
                    }
                    this.mainGrid.refreshGrid(combineGridData);
                    this.mainGrid.checkSelectedRow(this.gridData);

                    this.ref.detectChanges();
                }
            }
        }
    }


    selectRebalance(event: any) {
        this.lazyLoadGrid.rowSelectGrid(event);
        this.selectedRebalanceData = Object.assign([], this.lazyLoadGrid.selectedRows);
    }

    unSelectRebalance(event: any) {
       this.lazyLoadGrid.rowUnSelectGrid(event);
       this.selectedRebalanceData = Object.assign([], this.lazyLoadGrid.selectedRows);
    }

  private  isDefaultTemplateMissing():Promise<boolean>  {
    this.isDefaultMissing=false;
    return this.templateService.getDefaultRebalanceSettings().toPromise().then(
      rebalanceSettings=> {
        if(rebalanceSettings){
          if(rebalanceSettings.code===404){
            this.isDefaultMissing=true;
          }else if(rebalanceSettings.code===200) {
            this.isDefaultMissing=false;
          }
        }
        return this.isDefaultMissing;
      }
    );
  }

async saveWorkspace() {
      if(await this.isDefaultTemplateMissing()===true){
        this.defaultTemplateNotFoundMessage = TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;
        this.ref.detectChanges();
        this.defaultTemplateNotFoundModal.open();
        return;
      }

        if (this.selectedRebalanceData.length > 0) {
            let tempArr = Object.assign([], this.selectedRebalanceData);
            tempArr = this.removeAlreadySavedSelectedRebalances(tempArr);
            this.containsWorkspaceNamesArray = [];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].workspaceName != null) {
                    this.containsWorkspaceNamesArray.push(tempArr[i]);
                }
            }

            if (!this.criteriaBuilderComp.isWorkspaceExists) {
                if (this.containsWorkspaceNamesArray.length > 0) {
                    for (let i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].workspaceName != null) {
                            if (this.workspaceName != tempArr[i].workspaceName) {
                                this.viewCheckedProjectsModal.open();
                                this.editingWorkspace = false;
                                break;
                            } else {
                                this.editingWorkspace = true;
                            }
                        }
                    }
                    if (this.editingWorkspace) {
                        this.navigateToReviewWorkspace();
                    }
                } else {
                    this.navigateToReviewWorkspace();
                }
            } else {
                this.navigateToReviewWorkspace();
            }
        } else {
            this.invalidWorkspace = true;
            this.workspaceErrorMessage = "Please select accounts to save rebalance";

            this.ref.detectChanges();
        }
    }

    navigateToReviewWorkspace() {
        let workspaceRebalanceList = [];
        for (let rebalanceData of this.selectedRebalanceData) {
            let rebalance = {
                'rebalanceId': rebalanceData.rebalanceId
            };

            workspaceRebalanceList.push(rebalance);
        }

        let workflowPortfolioList = [];
        for (let rebalanceData of this.selectedRebalanceData) {
            let portfolio = {
                'portfolioId': rebalanceData.portfolioId
            };
            workflowPortfolioList.push(portfolio);
        }

        let savedWorkspace = {
            name: this.workspaceName,
            type: "Static",
            criteriaString: this.userCriteria,
            workflowRebalanceList: workspaceRebalanceList,
            workflowPortfolioList: workflowPortfolioList
        };

        //this.blockUI.start('Saving Workspace...'); // Start blocking
        UILoader.blockUI.start('Saving Rebalance...'); // Start blocking
        this.workspaceService
        .saveWorkspace(savedWorkspace)
        .subscribe(
            result => {
                if (result.code == 200) {
                    this.invalidWorkspace = false;
                    this.workspaceSuccessMessage = "Rebalance '" + this.workspaceName + "' saved successfully";
                    this.executeWorkspace();
                } else {
                    this.invalidWorkspace = true;
                    this.workspaceErrorMessage = result.message;
                }

                this.ref.detectChanges();
                UILoader.blockUI.stop();
            },
            err => {
                console.log(err);
                this.ref.detectChanges();
                UILoader.blockUI.stop();
            }
        );
    }

    deleteWorkspace() {
        this.viewCheckedProjectsModal.close();
    }

    executeWorkspace() {
        this.router.navigate(['/secure/rebalances/executeRebalance', URebalUtil.encodeparams(this.workspaceName)]);
    }

    cancelCriteria() {
        if (this.isEdit) {
            this.router.navigate(['/secure/rebalances/executeRebalance', URebalUtil.encodeparams(this.workspaceName)]);
        } else {
            this.router.navigate(['/secure/rebalances/list']);
        }
        this.criteriaBuilder.cancelCriteria();
    }

    navigateToRebalanceList() {
        this.router.navigate(['/secure/rebalances/list']);
    }

    backButtonPressed() {
        this.isStep1 = true;
        this.invalidWorkspace = false;
    }

    gridRefreshState(gridData, state) {
        this.mainGrid.refreshGrid(gridData);
        this.selectedRebalanceData = [];

        switch (state) {
            case 'both': {
                this.mainGrid.uncheckAllRow(gridData);
                if (this.mainGrid.jqxGrid.isBindingCompleted()) {
                    this.mainGrid.checkSelectedRow(this.gridData);
                }
                break;
            }
            case 'checkRows': {
                this.mainGrid.checkSelectedRow(this.gridData);
                break;
            }
            case 'uncheckRows': {
                this.mainGrid.uncheckAllRow(gridData);
                break;
            }
        }
        // this.mainGrid.uncheckAllRow(gridData);
    }

    removeAlreadySavedSelectedRebalances(savedRebals) {
        for (let i = 0; i < savedRebals.length; i++) {
            for (let j = 0; j < this.gridData.length; j++) {
                if (savedRebals[i].portfolioId == this.gridData[j].portfolioId) {
                    savedRebals.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return savedRebals;
    }


    getAccountsGridColumns() {
        let data = [
            {
                text: "Type",
                datafield: "isHousehold",
                align: "center",
                cellsalign: "center",
                filterable: false,
                cellsrenderer: "typeRenderer",
                renderer: columnHeaderRenderer,
                width: "3.5%",
                hidden: true
            },
            {
                text: "Account<br/> Number",
                datafield: "accountNumber",
                align: "center",
                cellsalign: "left",
                renderer: columnHeaderRenderer,
                width: "15%"
            },
            {
                text: "Account<br/> Name",
                datafield: "portfolioName",
                align: "center",
                cellsalign: "left",
                renderer: columnHeaderRenderer,
                width: "15%"
            },
            {
                text: "Tax<br/> Status",
                datafield: "isTaxable",
                align: "center",
                cellsalign: "left",
                renderer: columnHeaderRenderer,
                width: "10%"
            },
            {
                text: "Model",
                datafield: "modelName",
                align: "center",
                cellsalign: "left",
                cellsrenderer: "cellsRenderer",
                renderer: columnHeaderRenderer,
                width: "15%"
            },
            {
                text: "Market<br/> Value $",
                datafield: "marketValue",
                align: "center",
                cellsalign: "right",
                cellsformat: "d0",
                renderer: columnHeaderRenderer,
                width: "13.5%"
            },
            {
                text: "Drift %",
                datafield: "drift",
                align: "center",
                cellsalign: "right",
                cellsformat: "d2",
                renderer: columnHeaderRenderer,
                cellsrenderer: "cellsRenderer",
                width: "10%"

            },
            {
                text: "Rebalance",
                datafield: "workspaceName",
                align: "center",
                cellsalign: "left",
                cellsrenderer: "cellsRenderer",
                renderer: columnHeaderRenderer,
                width: "15%"
            }
        ]

        return data;
    }

}
