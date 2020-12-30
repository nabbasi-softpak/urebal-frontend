import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {DriftService} from "../drift.service";
import {jqxTooltipComponent} from '../../../../src/assets/jqwidgets-ts/angular_jqxtooltip';
import {GridLoadingStatus, LazyLoadedGrid} from "../../shared/util/LazyLoadedGrid";
import {AccountService} from "../../account/account.service";
import {UILoader} from "../../shared/util/UILoader";
import {WorkspaceService} from "../../workspaces/workspace.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

import {URebalService} from "../../services/urebal.service";
import {from, interval, Observable, of, Subject, Subscription, timer} from "rxjs";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {accountTypes, driftListGridColumns, driftStatues, taxableItems} from "./drifts-list.datasource";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {
    debounceTime, delay,
    distinctUntilChanged,
    map, retryWhen,
    switchMap
} from "rxjs/operators";
import {Guid} from 'app/shared/util/GUID';
import {modelTypePermissions} from "../../model/model.datasource";
import {SoftpakComboBoxComponent} from "../../shared/jqwidgets/jqx-combobox/softpak-combobox.component";
import {AppConfig} from "../../../app.config";
import {NotificationService} from "../../shared/components/notification/notification.service";
import {ExecutionServiceStatus, ExecutionStatus} from "../../shared/enums/ExecutionStatus.enum";
import jqxInput = jqwidgets.jqxInput;
import {CustomResponse} from "../../shared/classes/CustomResponse.class";
import {SoftpakDropdownComponent} from "../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {
    UrebalDropdownMenuLink
} from "../../shared/components/urebal-dropdown-button/urebal-dropdown-button.component";
import {EquivalenceService} from "../../equivalences/equivalence.service";
import {ApplyEquivalenceModalComponent} from "../apply-equivalence-modal/apply-equivalence-modal.component";
import {TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND} from "../../templates/template-list/template-list.datasource";
import {TemplateService} from "../../templates/template.service";

enum DriftExecutionType {
    RUN_ALL,
    RUN_SELECTED
}

@Component({
    selector: 'app-drifts',
    templateUrl: './drifts.list.component.html',
    styles: [],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DriftsListComponent extends LazyLoadedGrid<any> implements OnInit, OnDestroy, AfterContentInit {
    DriftExecutionType = DriftExecutionType;
    AppConfig = AppConfig;

    @ViewChild('applyEquivalenceModalRef') applyEquivalenceModalRef: ApplyEquivalenceModalComponent;
    @ViewChild('driftDetailTooltip') driftDetailTooltip: jqxTooltipComponent;
    @ViewChild('rebalanceNameInput') rebalanceNameInput: jqxInput;
    @ViewChild('autocompletehouseholdName') autocompletehouseholdName : jqxInput;
    @ViewChildren(ModalComponent) modalComponent: QueryList<ModalComponent>;
    @ViewChild('modelComboxBoxRef') modelComboxBox: SoftpakComboBoxComponent;
    @ViewChild('driftStatusDropDownList') driftStatusDropDownList: SoftpakDropdownComponent;
    @ViewChild('modelAssignAllModalRef') modelAssignAllModalRef: ModalComponent;
    @ViewChild('defaultTemplateNotFoundModal') defaultTemplateNotFoundModal: ModalComponent;

    private _subscription: Subscription = new Subscription();
    private _subscriptionKeyUP: Subscription = new Subscription();

    private _driftStatus: ExecutionStatus = ExecutionStatus.STOPPED;

    driftStatusSubscription: Subscription;
    showDriftDropdown = false;
    filterConditions: string = '';
    filterConditionsList: string[] = [];
    driftDate = null;
    statusDescription: string;
    portfolioName: string;
    rebalanceName: string;
    errMsg: string = '';
    errModelMsg: string = null;
    addToHHErrorMsg = '';
    responseMsg: string;
    prepareRebalance = {
        name: "",
        type: "static",
        criteriaString: "__No Criteria__",
        workflowPortfolioList: null,
        workflowRebalanceList: null
    };
    fieldFiltersMap: any;
    householdList: any = [];
    rebalanceList: any[];
    rebalanceNamesList: string[];
    selectedRowsModal: any = [];
    serverMessages: string = '';
    disableContentAfterSave: boolean = false;
    parentHousehold: any;
    serverResponseSuccess: boolean;
    householdData = {
        portfolioId: '',
        portfolioName: '',
        accounts: [{accountId: 0, accountName: '', status: ''}]
    };
    parentRebalance: any;
    existingRebalanceList: any;
    accountsWithRebalanceAssociations: any;
    rebalanceCreateMode: boolean;
    messageModalTitle: string;
    messageModalContent: string;
    existingHouseholdName: string;
    existingRebalanceName: string;
    private remoteFilter: boolean = false;
    private queryParams: Params;
    tempElementIndex: number;
    private stringColumnIndexesMap: any;
    private cachedFilterMap: any;
    public defaultTemplateNotFoundMessage: string="";
    selectedModel;
    modelList: any = [];

    driftStatues = driftStatues.map(item => item === 'Out of tolerance, Cash In' ? 'Cash In' : item).sort();
    taxableItems = taxableItems;
    accounTypes = accountTypes;

    columns: any[];

    selectedDriftStatus: string = 'All';
    selectedAccountName: string = '';
    selectedModelName: string = '';
    selectedRebalanceName: string = '';
    isRefreshData: boolean = false;
    keyUp = new Subject<string>();
    public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;

    public btnBulkActionsDropdownLinks: UrebalDropdownMenuLink[] = [
        {
            title: "Assign Model",
            isAllowed: true,
            clickHandler: () => {
                this.validateModelAssignment();
            }
        },
        {
            title: "Apply Equivalence",
            isAllowed: this.isAllowed('equivalenceModify'),
            clickHandler: () => {
                this.openApplyEquivalence();
            }
        },
        {
            title: "Assign Model to All",
            isAllowed: true,
            clickHandler: () => {
                this.modelAssignAllModalRef.open();
            }
        },
        {
            title: "Apply Equivalence to All",
            isAllowed: this.isAllowed('equivalenceModify'),
            clickHandler: () => {
                this.openApplyEquivalence(true);
            }
        }
    ];

    public btnRebalanceDropdownLinks: UrebalDropdownMenuLink[] = [
        {
            title: "Add to Existing Rebalance",
            isAllowed: this.isAllowed('workspaceModify'),
            clickHandler: () => {
                this.addToRebalance();
            }
        }
    ];

    public btnHouseholdDropdownLinks: UrebalDropdownMenuLink[] = [
        {
            title: "Add to Existing Household",
            isAllowed: this.isAllowed('portfolioModifyHousehold'),
            clickHandler: () => {
                this.addToHousehold();
            }
        }
    ];
  public noDefaultSettingsTitle: string = "";

    constructor(permissionResolverService: PermissionResolverService, public urebalService: URebalService,
                private route: ActivatedRoute, router: Router,
                public accountService: AccountService, private service: DriftService,
                public urebalPermissions: UrebalPermissions, private workspaceService: WorkspaceService, private ref: ChangeDetectorRef,
                private notificationService: NotificationService, private equivalenceService: EquivalenceService, private templateService:TemplateService
    ) {
        super(permissionResolverService, router, urebalService);
        this.fieldFiltersMap = new Map();

        this.fieldFiltersMap.set("isHouseHold", "list");
        this.fieldFiltersMap.set("accountId", "string");
        this.fieldFiltersMap.set("accountNumber", "string");
        this.fieldFiltersMap.set("portfolioName", "string");
        this.fieldFiltersMap.set("workspaceName", "string");
        this.fieldFiltersMap.set("taxStatus", "list");
        this.fieldFiltersMap.set("drift", "number");
        this.fieldFiltersMap.set("driftStatus", "list");
        this.fieldFiltersMap.set("modelName", "string");
        this.fieldFiltersMap.set("marketValue", "number");
        this.fieldFiltersMap.set("coreCash", "number");
        this.fieldFiltersMap.set("lastRebalanced", "range");

        this.columns = driftListGridColumns.call(null, this);

        // Watch if drift is already running
        this.watchDriftStatus(true); // Set to true to avoid reload of page on first attempt.
    }

    ngOnInit() {

        this.keyColumn = 'accountId';

        SoftpakGridHelper.rearrangeGridColumns(this.columns);

        this._subscriptionKeyUP = this.keyUp.pipe(
            map(value => value),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            this.applyCustomFilter();
        });

        this.jqxGrid.onBindingcomplete.subscribe(grid => {
                if (this.jqxGrid.getrows().length > 0) {
                    this.jqxGrid.setcolumnproperty('cashDrift', 'cellsrenderer',
                        (row, colum, value, defaulthtml, columnproperties, rowdata) => {
                            let coreCashPct = rowdata.coreCashPct * 4;
                            let targetCash = rowdata.targetCash * 4;

                            if (!isNaN(coreCashPct) && !isNaN(targetCash)) {
                                let cell = '<div class="drift-status-bar">';
                                cell +=
                                    '<div class="drift-init" style="width: ' + ((coreCashPct > 100) ? 100 :
                                    coreCashPct) + '%"></div>';
                                cell +=
                                    '<div class="drift-target" style="width: ' + ((targetCash > 100) ? 100 :
                                    targetCash) + '%"></div>';
                                cell += '</div>';
                                return cell;
                            } else {
                                return "";
                            }
                        })
                }
            }
        );

        let that = this;

        $("#driftsGrid").on("mouseleave", function () {
            that.driftDetailTooltip.close(0);
        });

        if (this.urebalPermissions.isAllowed('portfolioCreateHousehold') ||
            this.urebalPermissions.isAllowed('portfolioModifyHousehold')) {
            this.accountService.getHouseholdsList().subscribe(response => {
                if (response.code == 200) {
                    this.householdList = response.responsedata;
                }
            });
        }

        this.workspaceService.getWorkspaceList().subscribe(response => {
            if (response.code == 200) {
                this.rebalanceList = response.responsedata;

                this.rebalanceNamesList = this.rebalanceList.map(rebalance => {
                    return rebalance.name;
                });
            }
        });

        this.updateDriftLastRun().subscribe();

        this._subscription = this.isGridLoadingStatus.subscribe(loadStatus => {
            if (loadStatus === GridLoadingStatus.LOAD || loadStatus === GridLoadingStatus.LOADING) {
                this.jqxGrid.updatebounddata('data');
            } else if (loadStatus == GridLoadingStatus.DONE) {

                setTimeout(() => {
                    this.showSelectedRow();
                }, 0);

                this.remoteFilter = false;
            }
        });

        this.route.queryParams.subscribe(params => {
            if (params) {//Cash in,Out of tolerance, Cash In,Unassigned,Model Unassigned,Error
                if (params.filter === "Cash in") {
                    this.applyFilter("Out of tolerance, Cash In");
                    this.selectedDriftStatus = "Out of tolerance, Cash In";
                } else if (params.filter === "Unassigned") {
                    this.applyFilter("Model Unassigned");
                    this.selectedDriftStatus = "Model Unassigned";
                } else {
                    this.applyFilter(params.filter);
                    if (params.filter && params.filter != '')
                        this.selectedDriftStatus = params.filter;
                }
                this.queryParams = params;
            }

        });

        if (!this.queryParams.filter) {
            this.isRefreshData = true;
            this.refreshGrid(false);
        }


        this.stringColumnIndexesMap = new Map();
        this.stringColumnIndexesMap.set("accountId", 0);
        this.stringColumnIndexesMap.set("portfolioName", 1);
        this.stringColumnIndexesMap.set("workspaceName", 2);
        this.stringColumnIndexesMap.set("drift", 3);
        this.stringColumnIndexesMap.set("modelName", 4);
        this.stringColumnIndexesMap.set("marketValue", 5);
        this.stringColumnIndexesMap.set("cashDrift", 6);
        this.stringColumnIndexesMap.set("lastRebalanced", 7);

        this.cachedFilterMap = new Map();

        this.getModelsList();

        //console.log($('#autocompletehouseholdName').find('.handle'));
        $('#autocompletehouseholdName').find('.handle').css('position','unset');
    }

    ngAfterContentInit(): void {
        this.driftStatusDropDownList.getItemByValue('Cash In').value = 'Out of tolerance, Cash In'; // Reassign value
        let itemIndex = this.driftStatusDropDownList.getItems()
        .findIndex(item => item.value.toString().toLowerCase() === this.selectedDriftStatus.toLowerCase());
        this.driftStatusDropDownList.selectIndex(itemIndex);
    }

    updateDriftLastRun() {
        this.driftDate = ''; // This will trigger "Updating drift status" message
        this.ref.detectChanges();

        return this.service.getDriftExecutionInfo().pipe(map(response => {
            if (response.code == 200) {
                let {asOfDate} = (response.responsedata && response.responsedata.length > 0) ?
                    response.responsedata[0] : '';
                this.driftDate = asOfDate;
                this.ref.detectChanges();
            } else {
                this.driftDate = null; // Hack way to hide drift status message by setting null
                this.ref.detectChanges();
            }
        }));
    }

    applyFilter(filter: string) {

        this.remoteFilter = true;
        if (filter) {
            this.jqxGrid.clearfilters();
            let filterMin = new jqx.filter();
            let filter_and_operator = 0;
            let filtervalue = filter;
            let filtercondition = 'contains';
            let filterMin1 = filterMin.createfilter('stringfilter', filtervalue, filtercondition);

            filterMin.addfilter(filter_and_operator, filterMin1);

            // add the filters.
            this.jqxGrid.addfilter("driftStatus", filterMin);
            // apply the filters.
            this.jqxGrid.applyfilters();

        }
    }

    triggerFilter() {
        this.keyUp.next(Guid.generateNewGuid())
    }

    onChangeDriftStatus() {
        this.selectedDriftStatus = this.driftStatusDropDownList.getSelectedItem().value;
        this.applyCustomFilter();
    }

    applyCustomFilter() {

        this.orFilterFields = [];
        this.jqxGrid.clearfilters();
        let filter_and_operator = 0;
        let filtercondition = 'contains';

        //Drift Status
        if (this.selectedDriftStatus && this.selectedDriftStatus.toLowerCase() != 'all') {
            let driftfilter = new jqx.filter();
            let driftStatusfiltervalue = this.selectedDriftStatus;
            let driftStatusfilter = driftfilter.createfilter('stringfilter', driftStatusfiltervalue, filtercondition);
            driftfilter.addfilter(filter_and_operator, driftStatusfilter);
            // add the Drift Status filter.
            this.jqxGrid.addfilter("driftStatus", driftfilter);
        }

        //Account Name
        if (this.selectedAccountName && this.selectedAccountName != '') {
            let accountfilter = new jqx.filter();
            let accountNamefiltervalue = this.selectedAccountName;
            let accountNamefilter = accountfilter.createfilter('stringfilter', accountNamefiltervalue, filtercondition);
            accountfilter.addfilter(1, accountNamefilter);
            // add the Account Name filter.
            this.jqxGrid.addfilter("portfolioName", accountfilter);

            let accountfilter1 = new jqx.filter();
            let accountNamefiltervalue1 = this.selectedAccountName;
            let accountNamefilter1 = accountfilter1.createfilter('stringfilter', accountNamefiltervalue1,
                filtercondition);
            accountfilter1.addfilter(1, accountNamefilter1);
            // add the Account Number filter.
            this.jqxGrid.addfilter("accountNumber", accountfilter1);
        }

        //Rebalance Name
        if (this.selectedRebalanceName && this.selectedRebalanceName != '') {
            let rebalancefilter = new jqx.filter();
            let rebalanceNamefiltervalue = this.selectedRebalanceName;
            let rebalanceNamefilter = rebalancefilter.createfilter('stringfilter', rebalanceNamefiltervalue,
                filtercondition);
            rebalancefilter.addfilter(filter_and_operator, rebalanceNamefilter);
            // add the Rebalance Name filter.
            this.jqxGrid.addfilter("workspaceName", rebalancefilter);
        }

        //Model Name
        if (this.selectedModelName && this.selectedModelName != '') {
            let modelfilter = new jqx.filter();
            let modelNamefiltervalue = this.selectedModelName;
            let modelNamefilter = modelfilter.createfilter('stringfilter', modelNamefiltervalue, filtercondition);
            modelfilter.addfilter(filter_and_operator, modelNamefilter);
            // add the Model Name filter.
            this.jqxGrid.addfilter("modelName", modelfilter);
        }

        if (this.selectedDriftStatus.toLowerCase() == 'all' && this.selectedModelName == '' && this.selectedAccountName == '' && this.selectedRebalanceName == '') {
            this.isRefreshData = true;
        }

        /* Add fields to apply OR filter */
        this.orFilterFields.push('portfolioName');
        this.orFilterFields.push('accountNumber');
        /* --- */

        // apply the filters.
        this.jqxGrid.applyfilters();
    }

    refreshData() {
        this.selectedDriftStatus = 'All';
        this.selectedAccountName = '';
        this.selectedModelName = '';
        this.selectedRebalanceName = '';
        this.isRefreshData = true;
        if (this.driftStatusDropDownList.getSelectedIndex() !== 0)
            this.driftStatusDropDownList.selectIndex(0);
        else
            this.refreshGrid();
    }

    reloadData() {
        this.applyCustomFilter();
        this.updateDriftLastRun().subscribe();
    }

    /**
     * cell hover property for grid
     * apply tootlip if hovered cell is cashDrift
     */
    cellHover = (element, x, y) => {
        if (x && y) {
            let cell = this.getCellAtPosition(x, y);
            if (cell.column.toString() === "cashDrift") {
                let coreCashPct = this.cellValue(cell.row, 'coreCashPct');
                let targetCash = this.cellValue(cell.row, 'targetCash');
                let cashDrift = this.cellValue(cell.row, 'cashDrift');

                let tooltipContent = "<div style='color: #000000;float: left;'>Actual Pct: " + ((coreCashPct != null) ?
                    this.service.convertToPercent(coreCashPct, undefined, 2) + '%' :
                    '--') + "</div><div class='slds-clear'></div>";
                tooltipContent += "<div style='color: #000000;float: left;'>Model Target: " + ((targetCash != null) ?
                    this.service.convertToPercent(targetCash, undefined, 2) + '%' :
                    '--') + "</div><div class='slds-clear'></div>";
                tooltipContent += "<div style='color: #000000;float: left;'>Drift: " + ((cashDrift != null) ?
                    this.service.convertToPercent(cashDrift, undefined, 2) + '%' : '--') + "</div>";

                this.driftDetailTooltip.content(tooltipContent);
                this.driftDetailTooltip.open(x + 15, y + 15);
            }
            // else if (cell.column.toString() === "lastRebalanced") {
            //
            // }
            else {
                this.driftDetailTooltip.close(0);
            }
        }
    };

/*    OnLinkActive(event: GridLinkInfo) {
        // Call the relevant method as per data in event object
        if (event.linkType == "routeToAccountDetails") {

            this.routeToAccountDetails(event.linkParams["portfolioId"], event.linkParams["portfolioName"],
                event.linkParams["isHouseHold"]);
        }
    }*/

    routeToAccountDetails(portfolioId: string,  isHousehold) {
        this.router.navigate(
            ['/secure/accounts/', encodeURIComponent(portfolioId), isHousehold]);
    }

    showMessageModal(title, content) {
        this.messageModalTitle = title;
        this.messageModalContent = content;
        this.openModal('messageModal');
    }

    public handleDriftAction(type) {
        if (type == DriftExecutionType.RUN_SELECTED && this.selectedRows.length < 1) {
            this.showMessageModal("Drift Status", "Please select at least one account to run drift.");
        } else {
            this.runDrift(type);
        }
    }

    private setDriftStatus(status) {
        if (status == ExecutionStatus.RUNNING) {
            this.driftStatus(ExecutionStatus.RUNNING);
            this.showDriftDropdown = false;
        }
        else {
            this.driftStatus(ExecutionStatus.STOPPED);
        }

        this.ref.detectChanges();
    }

    poll(serviceFn, syncCond, pollDelay = 1000) {
        return of({}).pipe(
            switchMap(() => serviceFn.pipe(
                map(response => {
                    if (syncCond(response)) {
                        throw 'retry' // keep retying
                    }
                    return of (response)
                })
            )),
            retryWhen(errors => errors.pipe(delay(pollDelay)))
        );
    }

    watchDriftStatus(firstAttempt = false) {
        if (firstAttempt == false) {
            this.reloadData();
        }

        this.driftStatusSubscription = this.poll(
            this.service.getDriftStatus(),
            (response: CustomResponse) => {
                if (response.message === ExecutionServiceStatus.STOPPED) {
                    this.setDriftStatus(ExecutionStatus.STOPPED);
                } else {
                    this.setDriftStatus(ExecutionStatus.RUNNING);
                }

                return response.message === ExecutionServiceStatus.RUNNING;
            },
            2000
        ).subscribe();
    }

    private runDrift(type) {
        this.setDriftStatus(ExecutionStatus.RUNNING);

        this.service.getDriftStatus().subscribe(
            (result) => {
                if (result.code == 200 && result.message == 'running') {
                    // Disable drift button and show loading.
                    this.setDriftStatus(ExecutionStatus.RUNNING);

                    this.showMessageModal("Drift Status", "Drift is already running.");

                    this.watchDriftStatus();
                } else {
                    let selectedPortfolioIds = this.selectedRows.map((item) => item.portfolioId);

                    this.service.runDrift(selectedPortfolioIds).subscribe(
                        result => {
                            if (result) {
                                let message = "";
                                if (result) {
                                    message = "Drift calculation is completed.";
                                } else {
                                    message = "Drift calculation failed.";
                                }

                                this.notificationService.showDriftStatus("", message, () => {
                                    if (this.jqxGrid)
                                        this.reloadData();

                                    this.notificationService.close();
                                });

                                this.setDriftStatus(ExecutionStatus.STOPPED);
                            }
                        }
                    );

                }
            }
        );
    }

    /**
     * Account list for server side pagination
     * if DASH_FOR_EMPTY string is only set to "--" then while pagination and filtering "--" will be appear in grid
     * DASH_FOR_EMPTY string property is set to "--" while returning data and while requesting data is set to empty string
     */
    renderGridRows = (params: any): any[] => {
        let data = [{firmId: "", portfolioId: "", portfolioName: "", accountId: "", marketValue: ""}];
        let {pagesize} = this.jqxGrid.getpaginginformation();
        setTimeout(() => {
            this.jqxGrid.showemptyrow(false);
            this.jqxGrid.showloadelement();

        });

        if (this.isGridLoadingStatus.getValue() == GridLoadingStatus.LOAD) {
            this.DASH_FOR_EMPTY = "";
            this.loadDataForVirtualPromise(this.service, 'portfolios/drifts', params.startindex, pagesize, this.sort,
                this.filterValue, this.orFilterFields).then(res => {
                this.currentRecords = [];
                let selectedRows: [];
                /*if (this.filterValue !== "" && params.startindex == 0) {
                    selectedRows = Object.assign([], this.tempSelectedRows);
                    for (let selectedFilterRow of selectedRows) {
                        delete selectedFilterRow['boundindex'];
                        delete selectedFilterRow['uid'];
                        delete selectedFilterRow['uniqueid'];
                        delete selectedFilterRow['visibleindex'];
                        this.currentRecords.push(selectedFilterRow);

                    }

                }*/

                let subtractSelectedRows = this.source.totalrecords;
                for (let row of res) {
                    if (this.checkSeletedItem(row, selectedRows)) {
                        this.currentRecords.push(row);
                    } else {
                        subtractSelectedRows--;
                    }
                }

                if ((this.filterValue !== "" && params.startindex == 0) || res.length == 0) {
                    //this.source.totalrecords = subtractSelectedRows + this.tempSelectedRows.length;
                }

                this.gridfilter = false;
                this.startIndex = params.startindex;
                this.endIndex = params.endindex;

                this.isGridLoadingStatus.next(GridLoadingStatus.LOADING);


            });
        } else if (this.isGridLoadingStatus.getValue() == GridLoadingStatus.LOADING) {
            data = this.currentRecords;
            this.DASH_FOR_EMPTY = "--";

            setTimeout(() => {
                this.jqxGrid.showemptyrow(true);
                this.jqxGrid.hideloadelement();
            });
            this.getFilterDisplayConditions();

            this.isGridLoadingStatus.next(GridLoadingStatus.DONE);
        }


        return data;
    };

    gridOnSort(event: any): void {
        let sortinformation = event.args.sortinformation;
        let sortdirection = sortinformation.sortdirection.ascending ? 'asc' : 'desc';
        if (!sortinformation.sortdirection.ascending && !sortinformation.sortdirection.descending) {

            this.sort = "";
        } else {

           /* let selectedRows = Object.assign([], this.selectedRows);
            for (let row of selectedRows) {
                if (this.checkSeletedItem(row, this.tempSelectedRows)) {
                    this.tempSelectedRows.push(row);
                }
            }*/
            this.sort = `${sortinformation.sortcolumn}:${sortdirection}`;
        }

        this.startIndex = -1;
        this.endIndex = -1;
        this.jqxGrid.clearselection();
        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    };

    onFilter(): void {

        this.resetRowsSelection();

        let filterinfo = this.jqxGrid.getfilterinformation();

        // Below line of code prevents data te be fetched multiple times
        if (filterinfo && filterinfo.length == 0 && !this.isRefreshData)
            return;

        let appliedFilters: string = "";
        this.filterConditions = "";
        this.filterConditionsList = [];
        let filterMap: any = new Map();

        for (let i = 0; i < filterinfo.length; i += 1) {

            let {filtercolumntext, datafield, filter} = filterinfo[i];
            let filterValue: string = "";

            if (filter.getfilters().length > 1) {
                let appliedFiltersTemp: any = new Map();
                for (let f = 0; f < filter.getfilters().length; f++) {
                    filterValue = `${filter.getfilters()[f].value}`;
                    if (datafield == "lastRebalanced") {

                        appliedFiltersTemp.set(f, filterValue);

                    }//only last rebalanced field can send multiple filters right now

                }

                appliedFilters += `${datafield}:ge:${Date.parse(appliedFiltersTemp.get(0))},`;
                appliedFilters += `${datafield}:le:${Date.parse(appliedFiltersTemp.get(1))},`;
                this.filterConditionsList.push(`${filtercolumntext} between ('${new Date(
                    appliedFiltersTemp.get(0)).toDateString()}' AND '${new Date(
                    appliedFiltersTemp.get(1)).toDateString()}')`);

            } else {
                if (filter.getfilters().length > 0) {
                    filterValue = filter.getfilters()[0].value;
                    let selectedFilterCondition = filter.getfilters()[0].condition;
                    appliedFilters += this.getFilterCriteria(datafield, filterValue, selectedFilterCondition);
                    this.appendFilterDisplayCondition(datafield, filtercolumntext, filterValue,
                        selectedFilterCondition);
                }
            }

            if (this.fieldFiltersMap.get(datafield) === "string" || this.fieldFiltersMap.get(datafield) === "number") {
                filterMap.set(datafield, filterValue.toString());
            }

        }

        //finding index of filter input currently edited (in focus)
        let changedIndex: number;
        if (filterMap.size > 0) {
            filterMap.forEach((value: boolean, key: string) => {

                if (filterMap.get(key) != this.cachedFilterMap.get(key)) {
                    changedIndex = this.stringColumnIndexesMap.get(key);
                    return;
                }
            });

            this.cachedFilterMap = filterMap;//caching current filters so they can be compared next time onFilter is called
            this.tempElementIndex = changedIndex;

        } else {
            if (this.cachedFilterMap && this.cachedFilterMap.size > 0) {
                var iterator = this.cachedFilterMap.keys();
                while (iterator.next().value) {
                    changedIndex = this.stringColumnIndexesMap.get(iterator.value);
                }
            }

            this.cachedFilterMap = filterMap;
        }

        this.filterValue = appliedFilters.replace(/,\s*$/, "");
        this.gridfilter = true;


        /*let selectedRows = Object.assign([], this.selectedRows);
        for (let row of selectedRows) {
            if (this.checkSeletedItem(row, this.tempSelectedRows)) {
                this.tempSelectedRows.push(row);
            }
        }*/


        this.isRefreshData = false;
        /*To select previous selected items*/
        this.jqxGrid.clearselection();
        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);


    };

    pageChanged(event: any) {
        if (this.queryParams.filter) {
            this.remoteFilter = true;
        }

        let pageInfo = this.jqxGrid.getpaginginformation();


        /*let selectedRows = Object.assign([], this.selectedRows);
        for (let row of selectedRows) {
            if (this.checkSeletedItem(row, this.tempSelectedRows)) {
                this.tempSelectedRows.push(row);
            }
        }*/

        if (this.filterValue !== "" && event.args['pagenum'] != 0)
            this.jqxGrid.clearselection();

        /*if (!this.checkFilterApplied()) {
            this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
        } else if (this.checkFilterApplied()) {
            this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
        }*/

        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);

    }

    checkFilterApplied(): boolean {
        let isApplied = false;
        $('.jqx-filter-input').each((i, obj) => {
            if (obj.nodeName === "INPUT" && obj['value'] !== "") {
                isApplied = true;
                return false;
            }
        });

        return isApplied;
    }

    updatefilterconditions = (type: string, defaultconditions: any): string[] => {
        let stringcomparisonoperators = ['CONTAINS'];
        let numericcomparisonoperators = ['GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL', 'EQUAL'];
        let datecomparisonoperators = ['LESS_THAN', 'GREATER_THAN'];
        let booleancomparisonoperators = ['EQUAL', 'NOT_EQUAL'];
        switch (type) {
            case 'stringfilter':
                return stringcomparisonoperators;
            case 'numericfilter':
                return numericcomparisonoperators;
            case 'datefilter':
                return datecomparisonoperators;
            case 'booleanfilter':
                return booleancomparisonoperators;
        }
    };

    ready = (): void => {

        let localizationObject = {
            filterstringcomparisonoperators: ['contains'],
            // filter numeric comparison operators.
            filternumericcomparisonoperators: ['greater than equal', 'less than equal', 'equal'],
            // filter date comparison operators.
            filterdatecomparisonoperators: ['less than', 'greater than'],
            // filter bool comparison operators.
            filterbooleancomparisonoperators: ['equal', 'not equal']
        };
        this.jqxGrid.localizestrings(localizationObject);
    };


    getFilterCriteria(dataField: string, filterValue: any, filterCondition?: any) {

        let operator = this.fieldFiltersMap.get(dataField);
        let field = filterValue;
        if (operator == "string") {
            return `${dataField}:like:%${field}%,`;
        } else if (operator == "list") {
            if (dataField == "driftStatus" && filterValue == "Out of tolerance") {
                return `${dataField}:like:%Out of tolerance%,`;
            } else if (dataField == "driftStatus" && filterValue == "Out of tolerance, Cash In") {
                return `${dataField}:like:%Cash In%,`;
            } else if (dataField == "isHouseHold") {
                operator = "eq";
                filterValue = filterValue != "Individual";
            } else if (dataField === "taxStatus") {
                if (filterValue === "Taxable") {
                    operator = "ne";
                    filterValue = "Non-Taxable";
                } else {
                    operator = "ne";
                    filterValue = "Taxable";
                }

            } else {
                operator = "eq"
            }

        } else if (operator == "number") {
            if (filterCondition) {
                if (filterCondition == "EQUAL") {
                    return `${dataField}:eq:${filterValue},`;
                } else if (filterCondition == "GREATER_THAN_OR_EQUAL") {
                    return `${dataField}:ge:${filterValue},`;
                } else if (filterCondition == "LESS_THAN_OR_EQUAL") {
                    return `${dataField}:le:${filterValue},`;
                }
            }
        }
        return `${dataField}:${operator}:${filterValue},`;

    }

    appendFilterDisplayCondition(dataField: string, columnTitle: string, filterValue: any, selectedFilterCondition?: any) {
        let operator = this.fieldFiltersMap.get(dataField);

        if (!(this.filterConditions == "" || this.filterConditions == "No filters applied")) {
            this.filterConditions += " AND";
        }

        if (operator == "string") {
            this.filterConditionsList.push(`${columnTitle} contains ('${filterValue}')`);
        } else if (operator == "list") {
            this.filterConditionsList.push(`${columnTitle} = '${filterValue}'`);
        } else if (operator == "number") {
            if (selectedFilterCondition) {

                if (selectedFilterCondition == "GREATER_THAN_OR_EQUAL") {
                    this.filterConditionsList.push(`${columnTitle} >= ${filterValue}`);
                } else if (selectedFilterCondition == "LESS_THAN_OR_EQUAL") {
                    this.filterConditionsList.push(`${columnTitle} <= ${filterValue}`);
                } else if (selectedFilterCondition == "EQUAL") {
                    this.filterConditionsList.push(`${columnTitle} = ${filterValue}`);
                }
            }
        } else {
            this.filterConditionsList.push(`${columnTitle} contains ('${filterValue}')`);
        }
    }

    getFilterDisplayConditions() {
        this.filterConditions = "";
        for (let i = 0; i < this.filterConditionsList.length; i++) {
            this.filterConditions += this.filterConditionsList[i];
            if (i != this.filterConditionsList.length - 1)
                this.filterConditions += " AND ";
        }
    }

    clearFilteringBtnOnClick(): void {
        this.cachedFilterMap = [];
        this.jqxGrid.clearfilters();


    };

    /*To create a household*/
    askPorftolioName() {
        this.errMsg = '';
        this.serverMessages = '';
        this.disableContentAfterSave = false;

        let householdSelectedForMerging = false;
        for (let i = 0; i < this.selectedRows.length; i++) {
            if (this.selectedRows[i]["isHouseHold"] == true) {
                householdSelectedForMerging = true;
                break;
            }
        }
        this.modalComponent.forEach((modalInstance) => {
            if (householdSelectedForMerging) {
                this.showMessageModal('Create New Household', 'Households can be made with individual accounts only. Please remove households from your selection.');
                return;
            } else if (this.selectedRows.length == 0 || this.selectedRows.length < 2) {
                this.showMessageModal('Create New Household', 'Households are made up of two or more accounts. Please select at least two accounts to create a new household.');
                return;
            } else if (this.selectedRows.length > 15) {
                this.showMessageModal('Create New Household', 'Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.');
                return;
            } else {
                if (modalInstance.id === 'askPortfolioNameModal') {
                    this.selectedRowsModal = [];
                    for (let i = 0; i < this.selectedRows.length; i++) {

                        this.selectedRows[i]["removeFlag"] = false;
                        this.selectedRowsModal.push(this.selectedRows[i]);
                    }

                    this.portfolioName = '';
                    modalInstance.open();
                    return;
                }
            }
        });
    }

    createHousehold() {
        this.checkHouseHoldName(() => {
            if (this.errMsg === '') {
                if (typeof this.portfolioName == 'undefined' || this.portfolioName == '') {
                    this.errMsg = "Please enter household name";
                } else if (this.checkActiveSelectionsCount() < 2) {
                    this.errMsg =
                        "Households are made up of two or more accounts. Please select at least two accounts to create a new household.";
                } else {
                    this.mergeAccounts();
                }
            }
        });
    }

    checkActiveSelectionsCount() {
        let activeSelectionsCount = 0;
        for (let i = 0; i < this.selectedRowsModal.length; i++) {
            if (!this.selectedRowsModal[i]["removeFlag"]) {
                activeSelectionsCount++;
            }
        }
        return activeSelectionsCount;
    }

    mergeAccounts() {

        let accounts: any = [];
        for (let i = 0; i < this.selectedRowsModal.length; i++) {
            if (this.selectedRowsModal[i]["removeFlag"]) {
                continue;
            }
            let account = {
                portfolioId: this.selectedRowsModal[i]["portfolioId"],
                accountId: this.selectedRowsModal[i]["accountId"],
                portfolioName: this.selectedRowsModal[i]["portfolioName"]

            };
            accounts.push(account);

        }

        let portfolio = {"portfolioName": this.portfolioName, "accounts": accounts};

        UILoader.blockUI.start('Saving Household...'); // Start blocking

        this.accountService.createHousehold(portfolio).subscribe(result => {
            if (result.code == 200) {
                this.responseMsg = result.message;
                this.serverMessages = "Household created successfully";
                this.serverResponseSuccess = true;
                this.disableContentAfterSave = true;

                this.openSavedHousehold(result.responsedata.portfolioId);
                UILoader.blockUI.stop();
            } else {
                UILoader.blockUI.stop();
                this.responseMsg = result.message;
                this.serverMessages = "Error creating household";
                this.serverResponseSuccess = false;
                console.error(result.message);
            }
            //display success message here
        }, error =>{
            UILoader.blockUI.stop();
            console.log(error);
        });

    }

    checkHouseHoldName(callback = () => {
    }) {
        this.errMsg = '';
        if (typeof this.portfolioName != 'undefined') {
            this.portfolioName = this.portfolioName.replace(/(^\s+|\s+$)/g, '');
            if (this.portfolioName) {

                UILoader.blockUI.start('Please wait...'); // Start blocking
                this.accountService.getPortfolioDetailsByName(this.portfolioName).subscribe(result => {

                    if (result.code !== 200) {

                        this.errMsg = '';
                        this.existingHouseholdName = '';
                        callback();
                    } else {
                        this.existingHouseholdName = "Household with name " + this.portfolioName + " already exists";
                        this.errMsg = 'Household name already exists.';
                    }
                    UILoader.blockUI.stop(); // Stop blocking
                }, error =>{
                    UILoader.blockUI.stop(); // Stop blocking
                    console.log(error);
                });
            } else {
                this.errMsg = "Please enter household name";
            }
        }
    }

    addAccountToList(household) {
        this.errMsg = "";
        if (household.accounts.length + this.selectedRows.length > 15) {
            this.errMsg =
                "Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.";

        }

        this.parentHousehold = household;


    }

    addSelectedAccountsToHousehold() {
        if (this.parentHousehold === '' || this.parentHousehold === undefined || this.parentHousehold === null) {
            this.errMsg = "Please enter name of an existing household";
            return;
        }
        if (this.checkActiveSelectionsCount() < 1) {
            this.errMsg = "Please select at least one account.";
        }
        this.householdData.portfolioId = this.parentHousehold.portfolioId;
        this.householdData.portfolioName = this.parentHousehold.portfolioName;
        //let accounts : [{ accountId : 0, accountName : '', status: ""}];
        let accounts: any = [];

        for (let i = 0; i < this.selectedRowsModal.length; i++) {

            if (this.selectedRowsModal[i]["removeFlag"]) {
                continue;
            }
            accounts.push({
                accountId: this.selectedRowsModal[i]["accountId"],
                accountName: this.selectedRowsModal[i]["portfolioName"],
                status: "added"
            });

        }
        this.householdData.accounts = accounts;
        UILoader.blockUI.start('Updating Household...');
        this.accountService.saveHouseHoldData(this.householdData).subscribe(result => {
            if (result.code === 200) {
                this.serverMessages = "Accounts added successfully";
                this.serverResponseSuccess = true;
                this.disableContentAfterSave = true;
                this.openSavedHousehold(this.householdData.portfolioId);
                UILoader.blockUI.stop();
            } else {
                this.serverMessages = "Error adding accounts to the household";
                this.serverResponseSuccess = false;
                UILoader.blockUI.stop();
            }
        }, error =>{
            UILoader.blockUI.stop();
            console.log(error);
        });

    }

    // rebalanceSelected(rebalance) {
    //     this.errMsg = "";
    //     this.parentRebalance = rebalance;
    //
    //     this.workspaceService.getRebalanceOfWorkspace(rebalance.name).subscribe(response => {
    //         if (response.code == 200) {
    //             this.existingRebalanceList = response.responsedata;
    //             let error = this.validateAcctsInSelectedRebalance(rebalance.name);
    //             if (error) {
    //                 this.errMsg = error;
    //             }
    //         }
    //
    //     });
    // }

    rebalanceNameSelected(event) {
        const rebalanceName = event.target.value;

        this.errMsg = '';
        this.parentRebalance = this.rebalanceList.find(rebalance => {
            return rebalance.name.toUpperCase() === rebalanceName.toUpperCase();
        });

        this.workspaceService.getRebalanceOfWorkspace(rebalanceName).subscribe(response => {
            if (response.code == 200) {
                this.existingRebalanceList = response.responsedata;
                let error = this.validateAcctsInSelectedRebalance(rebalanceName);
                if (error) {
                    this.errMsg = error;
                }
            }
        });
    }

    validateAcctsInSelectedRebalance(rebalanceName) {
        let existingAccounts: any = [];
        let error = '';
        for (let row of this.selectedRowsModal) {

            if (!row["removeFlag"]) {
                if (row["workspaceName"] === rebalanceName) {
                    existingAccounts.push(row["portfolioName"] + ',');
                }
            }
        }

        if (existingAccounts.length > 1) {
            error = "Accounts ";
            for (let i = 0; i < existingAccounts.length; i++) {
                if (i == existingAccounts.length - 1) {

                    error += existingAccounts[i];
                    error = error.slice(0, -1);
                } else {
                    error += existingAccounts[i];
                }
            }
            return error + " already exist in selected rebalance";
        } else if (existingAccounts.length === 1) {
            return "Account " + existingAccounts[0].slice(0, -1) + " already exists in selected Rebalance";
        }
    }

    closeAndRefresh() {
        setTimeout(() => {
            this.refreshGrid();
        });

        this.closeModal();
    }

    closeModal(modalId?: string) {
        /*this.driftLinkErrorModal.forEach(instance => {
          if (instance.id === 'stopLinkModal')
            instance.close();
        });*/

        if (typeof modalId === "string") {
            this.modalComponent.forEach((modalInstance) => {
                if (modalInstance.id === modalId) {
                    if (modalId === 'askPortfolioNameModal' || modalId === 'addToHousehold' || modalId === 'askRebalanceNameModal' || modalId === 'addToRebalanceModal' || modalId === 'assignAccountModal') {
                        this.errModelMsg = null;
                        this.errMsg = '';
                        this.selectedRowsModal = [];
                        this.disableContentAfterSave = false;
                        this.serverMessages = '';
                        this.rebalanceName = '';
                        this.portfolioName = '';
                        this.parentHousehold = null;
                        this.parentRebalance = null;
                        this.existingRebalanceList = '';
                        this.existingHouseholdName = '';
                        this.existingRebalanceName = '';
                        // @ts-ignore
                        this.rebalanceNameInput.val('');
                        /*// @ts-ignore
                        this.autocompletehouseholdName.val('');*/
                        // @ts-ignore
                        $('#autocomplete-householdName')[0].value = "";


                        if (this.serverResponseSuccess) {
                            this.serverResponseSuccess = false;
                            this.refreshGrid();
                        }

                    }
                    modalInstance.close();

                }
            });
        } else {
            this.modalComponent.forEach((modalInstance) => {
                modalInstance.close();
            });

        }
    }

    /*Create rebalance*/
    askRebalanceName() {

        this.rebalanceCreateMode = true;
        this.validateRebalanceManagementConditions(true);

    }

    async validateRebalanceManagementConditions(rebalanceCreate) {
        this.errMsg = '';
        this.serverMessages = '';
        this.disableContentAfterSave = false;
        if (this.selectedRows.length < 1) {
            if (rebalanceCreate) {
                this.showMessageModal("Create New Rebalance", "A rebalance constitutes of at least one account or household. Please select at least one account or household to create a new rebalance.");
            } else {
                this.showMessageModal("Add To Rebalance", "Please select at least one account to add to an existing rebalance.");
            }
            return;
        } else if(await this.isDefaultRebalaneTemplateMissing()===true && this.selectedAccountHasNoTemplateAssociated()){
                  this.defaultTemplateNotFoundMessage=TEMPLATE_DELETION_FAILED_DEFAULT_TEMP_NOT_FOUND;
                  rebalanceCreate?this.noDefaultSettingsTitle='Create Rebalance':this.noDefaultSettingsTitle='Add to Rebalance';
                  this.ref.detectChanges();
                  this.defaultTemplateNotFoundModal.open();
                  return;
        } else if (this.getSelectedAcctsRebAssociations().length > 0) {
            this.openModal('existingAssociationsWarning');
            return;
        } else {
            if (rebalanceCreate) {
                this.openRebalanceManagementModal('askRebalanceNameModal');
            } else {
                this.openRebalanceManagementModal('addToRebalanceModal');
            }
        }

    }


    openRebalanceManagementModal(modalId: string) {

        this.selectedRowsModal = [];
        for (let i = 0; i < this.selectedRows.length; i++) {
            this.selectedRows[i]["removeFlag"] = false;
            this.selectedRowsModal.push(this.selectedRows[i]);
        }
        this.openModal(modalId);

    }

    createRebalance() {
        this.getWorkspace(() => {

            if (this.errMsg === "") {


                let portfolios = [];
                let rebalances = [];

                for (let row of this.selectedRowsModal) {

                    if (row['removeFlag']) {
                        continue;
                    }
                    portfolios.push({portfolioId: row['portfolioId']});
                    rebalances.push({rebalanceId: row['rebalanceId']});
                }

                this.prepareRebalance.name = this.rebalanceName;
                this.prepareRebalance.workflowPortfolioList = portfolios;
                this.prepareRebalance.workflowRebalanceList = rebalances;
                UILoader.blockUI.start('Saving Rebalance...'); // Start blocking

                this.workspaceService.saveWorkspace(this.prepareRebalance).subscribe(result => {

                        if (result.code === 200) {
                            //Show a success message here..
                            this.serverMessages = "Rebalance created successfully";
                            this.serverResponseSuccess = true;
                            this.disableContentAfterSave = true;
                            this.errMsg = '';

                            this.openSavedRebalance(this.prepareRebalance.name);

                            //Not required anymore
                            /*       this.workspaceService.getWorkspaceList().subscribe(response => {
                                     if (response.code == 200) {
                                       this.rebalanceList = response.responsedata;
                                     }
                                   });*/

                        } else {
                            this.serverMessages = "Error creating rebalance";
                            this.serverResponseSuccess = false;
                        }

                        UILoader.blockUI.stop();
                    },
                    err => {
                        console.log(err);
                        UILoader.blockUI.stop();
                    });
            }
        });


    }

    addAccountsToRebalance() {
        if (this.parentRebalance === '' || this.parentRebalance === undefined || this.parentRebalance === null) {
            this.errMsg = "Please enter name of an existing rebalance";
            return;
        }


        if (this.errMsg === "") {
            let portfolios = [];
            let rebalances = [];

            for (let row of this.selectedRowsModal) {

                if (row['removeFlag']) {
                    continue;
                }
                portfolios.push({portfolioId: row['portfolioId']});
                rebalances.push({rebalanceId: row['rebalanceId']});
            }

            if (this.existingRebalanceList) {
                for (let row of this.existingRebalanceList) {
                    portfolios.push({portfolioId: row['portfolioId']});
                    rebalances.push({rebalanceId: row['rebalanceId']});
                }
            }


            this.prepareRebalance.name = this.parentRebalance.name;
            this.prepareRebalance.workflowPortfolioList = portfolios;
            this.prepareRebalance.workflowRebalanceList = rebalances;
            UILoader.blockUI.start('Updating Rebalance...'); // Start blocking


            this.workspaceService.saveWorkspace(this.prepareRebalance).subscribe(result => {

                    if (result.code === 200) {
                        //Show a success message here..
                        this.serverMessages = "Accounts added successfully";
                        this.serverResponseSuccess = true;
                        this.disableContentAfterSave = true;
                        this.errMsg = '';
                        this.openSavedRebalance(this.prepareRebalance.name);

                    } else {
                        this.serverMessages = "Error adding accounts";
                        this.serverResponseSuccess = false;
                    }

                    UILoader.blockUI.stop();
                },
                err => {
                    console.log(err);
                    UILoader.blockUI.stop();
                });
        }
    }

    getWorkspace(callback = () => {
    }) {

        if (this.serverResponseSuccess && this.serverMessages) {
            return;
        }

        if (typeof this.rebalanceName !== 'undefined') {
            this.rebalanceName = this.rebalanceName.replace(/(^\s+|\s+$)/g, '');
        } else {
            this.rebalanceName = '';
        }

        if (this.rebalanceName) {
            this.workspaceService.getWorkspace(this.rebalanceName).subscribe(result => {
                    if (result.code == 200) {
                        this.errMsg = "Rebalance name already exists";
                        this.existingRebalanceName = "Rebalance with name " + this.rebalanceName + " already exists";
                    } else if (result.code == 0) {
                        if (this.checkActiveSelectionsCount() < 1) {
                            this.errMsg = 'Please select at least one account';
                            this.existingRebalanceName = '';
                        } else {
                            if (this.checkActiveSelectionsCount() > 0) {
                                this.errMsg = '';
                                this.existingRebalanceName = '';
                                callback();
                            }
                        }

                    }
                },
                err => {
                    console.log(err);
                });
        } else {
            this.errMsg = "Please enter a Rebalance Name";
        }
    }

    addToRebalance() {
        this.parentRebalance = '';
        this.rebalanceCreateMode = false;
        this.validateRebalanceManagementConditions(false);
    }

    private preselectedAccounts : any[] = null;
    private isDefaultMissing: boolean;

    assignModelToAllAccounts(){
        UILoader.blockUI.start('Please wait...'); // Start blocking
        this.loadDataForVirtualPromise(this.service, 'portfolios/drifts', 0, 0, this.sort,
            this.filterValue, this.orFilterFields)
        .then(res =>{
                this.preselectedAccounts = Object.assign([], this.selectedRows);
                this.selectedRows = [];
                for (let row of res) {
                    this.selectedRows.push(row);
                }
                UILoader.blockUI.stop();// Stop blocking
                this.validateModelAssignment();
        })
        .catch(error =>{
                console.log(error);
                UILoader.blockUI.stop(); // Stop blocking
            });
    }

    restorePreselectedAccounts(){
        if(this.preselectedAccounts){
            this.selectedRows = Object.assign([], this.preselectedAccounts);
            this.preselectedAccounts = [];
            this.preselectedAccounts = null;
        }
    }

    validateModelAssignment() {
        if (this.selectedRows.length < 1) {
            this.showMessageModal("Model Assignment", "Please select at least one account to assign model.");
            return;
        } else if (this.isModelAlreadyAssigned()) {
            this.openModal('existingModelWarning');
            return;
        } else {
            this.gotoModelAssigment();
        }
    }

    isHouseholdSelected() {
        let result = this.selectedRows
            .filter((r) => r.isHouseHold == true);
        return result.length > 0;
    }

    openApplyEquivalence(applyAll= false) {
        if (!applyAll && this.selectedRows.length < 1) {
            this.showMessageModal("Apply Equivalence", "Please select at least one account to apply equivalence.");
            return;
        }
        else if (!applyAll && this.isHouseholdSelected()) {
            this.showMessageModal("Apply Equivalence", "Households are not allowed.");
            return;
        }
        else {
            this.applyEquivalenceModalRef.open(this.selectedRows, applyAll);
        }
    }

    getModelsList() {
        this.urebalService.get("models")
            .subscribe(result => {
                if (result.code == 200) {
                    this.modelList = result.responsedata;

                    if (this.modelList && Array.isArray(this.modelList)) {
                        this.modelList.sort((a, b) => {
                            return a.modelName.localeCompare(b.modelName)
                        });
                    }
                    this.modelComboxBox.source(this.modelList);
                }
            });
    }

    gotoModelAssigment() {
        this.errModelMsg = null;
        this.unselectModel();
        this.openModal('assignAccountModal');
    }

    assignModelToAccounts() {
        if (!this.selectedModel) {
            this.errModelMsg = 'Please select a model to assign';
        } else {
            this.errModelMsg = null;
            let {portfolioIds, modelId} = {
                portfolioIds: this.selectedRows.map(item => item.portfolioId),
                modelId: this.selectedModel.modelId
            };
            this.urebalService.post("portfolios/saveModel", {portfolioIds, modelId})
                .subscribe(result => {
                        if (result.code == 200) {
                            this.refreshData();
                            this.closeModal('assignAccountModal');
                            this.showMessageModal("Model Assignment", "Model is assigned successfully!");
                        }
                    },
                    err => {
                        console.log(err);
                        this.closeModal('assignAccountModal');
                        this.showMessageModal("Model Assignment", "Failed to assign model!");
                    });
        }
    }

    openModelDetails() {
        if (this.selectedModel != null && this.selectedModel.modelName != '') {
            let context = this.workspaceService.getAppContext();
            window.open(context + '/secure/model/detail/' + this.selectedModel.modelId);
        }
    }

    modelOnChange() {
        this.selectModel();
    }

    selectModel() {
        const selectedItem = this.modelComboxBox.getSelectedItem();

        if (selectedItem) {
            this.selectedModel = selectedItem.originalItem;
            this.errModelMsg = null;
        } else {
            this.unselectModel();
        }
    }

    unselectModel() {
        this.selectedModel = undefined;
        this.modelComboxBox.selectedIndex(-1);
        this.modelComboxBox.clearSelection();
    }

    haveModelPermission(modelId, modelTypeNum) {
        let modelTypePermission = modelTypePermissions.find((m) => m.modelType == modelTypeNum);
        return modelTypePermission && this.urebalPermissions.isAllowed(modelTypePermission.permissionName);
    }

    addToHousehold() {
        this.errMsg = '';
        this.parentHousehold = null;
        this.serverMessages = '';
        this.disableContentAfterSave = false;
        let householdSelectedForMerging = false;
        for (let i = 0; i < this.selectedRows.length; i++) {
            if (this.selectedRows[i]["isHouseHold"] == true) {
                householdSelectedForMerging = true;
                break;
            }
        }
        this.modalComponent.forEach((modalInstance) => {
            if (householdSelectedForMerging) {
                this.showMessageModal('Add to Household', 'Households can be made with individual accounts only. Please remove households from your selection.');
                return;
            } else if (this.selectedRows.length == 0) {
                this.showMessageModal('Add to Household', 'Please select at least one account to add to an existing household.');
                return;
            } else if (this.selectedRows.length > 15) {
                this.showMessageModal('Add to Household', 'Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.');
                return;

            } else if (this.selectedRows.length > 0) {
                if (modalInstance.id === 'addToHousehold') {
                    this.selectedRowsModal = [];
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        let portfolio = {
                            portfolioId: this.selectedRows[i]["portfolioId"],
                            portfolioName: this.selectedRows[i]["portfolioName"],
                            accountId: this.selectedRows[i]["accountId"],
                            removeFlag: false
                        };

                        this.selectedRowsModal.push(portfolio);
                    }

                    modalInstance.open();
                }
            }
        });
    }

    setStyleForAccountToBeRemoved(idx) {
        $('#dataState' + idx).text('remove').css("font-style", "italic").css("color", "red");
        // $('#accountNameText' + idx).css("text-decoration", "line-through").css("text-decoration-color", "red");
        $('#btnMarkForDeletion' + idx).css("display", "none");
        $('#btnUndoDeletion' + idx).css("display", "inline");
    }

    resetStyleForAccountToBeRemoved(idx) {
        $('#dataState' + idx).text('');
        // $('#accountNameText' + idx).css("text-decoration", "none");
        $('#btnMarkForDeletion' + idx).css("display", "inline");
        $('#btnUndoDeletion' + idx).css("display", "none");
    }

    undoDeletion(idx, elementPostFix) {
        //add to selection again
        this.selectedRowsModal[idx]["removeFlag"] = false;
        let errMsgCopy = this.errMsg.toString();
        if (this.errMsg != '') {
            if (elementPostFix === '_addToHH') {
                let activeSelectionsCount = this.checkActiveSelectionsCount();
                if (this.parentHousehold) {
                    if (activeSelectionsCount + this.parentHousehold.accounts.length > 15) {
                        this.errMsg =
                            "Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.";
                    } else {
                        this.errMsg = '';
                    }
                } else {
                    if (activeSelectionsCount > 15) {
                        this.errMsg =
                            "Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.";
                    } else {
                        this.errMsg = '';
                    }
                }

            } else if (elementPostFix === '_createHH') {
                if (this.checkActiveSelectionsCount() < 2) {
                    this.errMsg =
                        "Households are made up of two or more accounts. Please select at least two accounts to create a new household.";
                } else {
                    if (this.errMsg === "Households are made up of two or more accounts. Please select at least two accounts to create a new household.") {

                        if (errMsgCopy !== "Households are made up of two or more accounts. Please select at least two accounts to create a new household.") {
                            this.errMsg = errMsgCopy;
                        } else {
                            this.errMsg = '';
                        }

                    }
                }
            }
            // else if (elementPostFix === 'createRB') {
            //     this.errMsg = "Please select at least one account to create rebalance."
            // }
            else if (elementPostFix === 'addToRB') {
                let minAccountsErrorFlag = false;
                if (this.checkActiveSelectionsCount() < 1) {
                    minAccountsErrorFlag = true;
                    this.errMsg = "Please select at least one account."
                }
                let error = this.validateAcctsInSelectedRebalance(this.parentRebalance.name);
                if (error) {
                    this.errMsg = error;
                } else {
                    if (!minAccountsErrorFlag)
                        this.errMsg = '';
                }

            } else {
                if (this.errMsg != '')
                    this.errMsg = '';
            }
        }
        this.resetStyleForAccountToBeRemoved(elementPostFix + idx);

    }


    removeSelection(idx, elementPostFix) {
        //remove from selection
        this.selectedRowsModal[idx]["removeFlag"] = true;
        if (elementPostFix === '_addToHH') {

            let activeSelectionsCount = this.checkActiveSelectionsCount();
            if (this.parentHousehold) {
                if (activeSelectionsCount < 1) {
                    this.errMsg = "Please select at least one account."
                } else if (activeSelectionsCount + this.parentHousehold.accounts.length > 15) {
                    this.errMsg =
                        "Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.";
                } else {
                    this.errMsg = '';
                }
            } else {
                if (activeSelectionsCount < 1) {
                    this.errMsg = "Please select at least one account."
                } else if (activeSelectionsCount > 15) {
                    this.errMsg =
                        "Households can not have more than 15 accounts. Please select up to a maximum of 15 accounts.";
                } else {
                    this.errMsg = '';
                }
            }


        } else if (elementPostFix === '_createHH') {
            if (this.checkActiveSelectionsCount() < 2) {
                this.errMsg =
                    "Households are made up of two or more accounts. Please select at least two accounts to create a new household.";
            }

        } else if (elementPostFix === 'createRB' && this.checkActiveSelectionsCount() < 1) {
            this.errMsg = "Please select at least one account."
        } else if (elementPostFix === 'addToRB') {
            let minAccountsErrorFlag = false;
            if (this.checkActiveSelectionsCount() < 1) {
                minAccountsErrorFlag = true;
                this.errMsg = "Please select at least one account."
            }
            let error = this.validateAcctsInSelectedRebalance(this.parentRebalance.name);
            if (error) {
                this.errMsg = error;
            } else {
                if (!minAccountsErrorFlag)
                    this.errMsg = '';
            }

        } else {
            if (this.errMsg != '')
                this.errMsg = '';
        }

        this.setStyleForAccountToBeRemoved(elementPostFix + idx);
        //delete this.selectedRowsModal[idx];
    }


    openModal(modalId: string) {

        this.modalComponent.forEach((modalInstance) => {
            if (modalInstance.id === modalId) {
                modalInstance.open();
                this.ref.detectChanges();
                return;
            }
        });

    }

    private isModelAlreadyAssigned(): boolean {
        let modelAssigned = this.selectedRows.find(item => {
            return (item.modelName)
        })
        return (modelAssigned != undefined);
    }

    private getSelectedAcctsRebAssociations() {
        let rebalAlreadyAssociated: any = [];
        for (let row of this.selectedRows) {
            let associatedRebal = {portfolioName: '', workspaceName: ''};
            if (row["workspaceName"]) {
                associatedRebal['portfolioName'] = row["portfolioName"];
                associatedRebal['workspaceName'] = row["workspaceName"];
                rebalAlreadyAssociated.push(associatedRebal);
            }
        }
        return this.accountsWithRebalanceAssociations = rebalAlreadyAssociated;
    }

    openSavedHousehold(portfolioId: string) {
        this.router.navigate(['secure/accounts/' + encodeURIComponent(portfolioId) + '/' + 'true']);

    }

    openSavedRebalance(rebalanceName: string) {
        this.router.navigate(['secure/rebalances/executeRebalance/' + URebalUtil.encodeparams(rebalanceName)]);
    }

    private routeToModelDetails(modelId) {
        this.router.navigate(['/secure/model/detail', modelId]);
    }

    modelNameLinkHandler(rowdata) {
        event.preventDefault();
        this.routeToModelDetails(rowdata.modelId);
    }
  accountNumberLinkHandler(rowdata) {
    event.preventDefault();
    this.routeToAccountDetails(rowdata.portfolioId,rowdata.isHouseHold);
  }

    onExistingAssociationWarningModalYesClicked() {
        this.closeModal('existingAssociationsWarning');

        if (this.rebalanceCreateMode) {
            this.openRebalanceManagementModal('askRebalanceNameModal')
        } else {
            this.openRebalanceManagementModal('addToRebalanceModal')
        }
    }

    driftStatus(state = undefined) {
        if (state !== undefined) {
            this._driftStatus = state;
        } else {
            return this._driftStatus;
        }
    }

    isDriftRunning(status = undefined) {
        if (status == 'running') return true;
        else if (status == 'not_running') return false;

        return this.driftStatus() == ExecutionStatus.RUNNING;
    }

    ngOnDestroy() {
        this.currentRecords = null;
        this.jqxGrid.destroy();
        //this.isGridLoadingStatus.unsubscribe();
        this._subscriptionKeyUP.unsubscribe();
        this._subscription.unsubscribe();

        this.jqxGrid = null;

        this.driftStatusSubscription.unsubscribe();
    }

    applyEquivalenceModalClose(message: any) {
        if (message) {
            this.showMessageModal("Apply Equivalence", message);
        }

    }

  private   isDefaultRebalaneTemplateMissing():Promise<boolean>  {
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

  private selectedAccountHasNoTemplateAssociated() {
  // need to fetch rebalance details and check if account has a template associated
    return true;
  }
}
