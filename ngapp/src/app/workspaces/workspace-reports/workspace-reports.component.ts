import {Component, OnInit, Inject, ViewChild, AfterViewInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';

import {WorkspaceService} from '../workspace.service';
import {DollarFormatterPipe, PercentFormatterPipe} from '../../shared/pipes/NumericFormatterPipe'
import {URebalAccountTreeGridComponent} from '../../shared/components/urebal-account-tree-grid/urebal-account-tree-grid.component';
import {TradeOverrideComponent} from '../tradeoverride/tradeoverride.component';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {URebalTreeGridComponent} from '../../shared/components/urebal-tree-grid/urebal-tree-grid.component';
import {WorkspaceSwapDetailsComponent} from '../workspace-swap-details/workspace-swap-details.component';
import {BehaviorSubject} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {URebalService} from '../../services/urebal.service';
import {GridExpand} from '../../shared/classes/GridExpand.class';
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {rebalanceStockReportGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import { AppConfig } from 'app.config';
import {appConfig} from "../../shared/util/config";
import {SoftpakComboBoxComponent} from "../../shared/jqwidgets/jqx-combobox/softpak-combobox.component";


@Component({
    selector: 'app-workspace-reports',
    templateUrl: './workspace-reports.component.html',
    styles: []
})
export class WorkspaceReportsComponent extends UrebalPermissions implements OnInit, AfterViewInit {
    public paramValue: string;
    public portfoliosList: any;
    private keepPortfoliosList: any;
    public portfolio: any;
    private stockReport: any;
    private shareLotReport: any;
    private tradeReportData: any;
    private attributeSummaryReport: any;
    public summaries: any;
    public accountsSummary: any;
    private taxSummary: any;
    public accountsDropdown: any;
    private taxShowIn: string = "Dollar";
    public selectedAccountTax: any;
    public selectedAccount: string;
    private selectedPorfolio: string;
    public modalMessage: string;
    private accountsArray = [];
    public noDataFound: boolean = false;
    private attributeAccountSummaryReport: any;
    public allocationView = ['Household Asset Allocation', 'Account Asset Allocation'];
    public selectedView = 'Household Asset Allocation';
    private servicesCount = 6;
    private servicesLoaded = 0;
    private isTradeOverrideLoading = new BehaviorSubject(false);
    private newPortfolio;
    public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;
    appConfig = appConfig;

    public isSupportZipEnabled: boolean = false;

    @Input() portfolioName: string;
    @ViewChild('stockReportGrid') stockReportGrid: UrebalGridComponent;
    @ViewChild('sharelotReportGrid') sharelotReportGrid: UrebalGridComponent;
    @ViewChild('attributeReportGrid') attributeReportGrid: URebalTreeGridComponent;
    @ViewChild('accountAttributeReportGrid') accountAttributeReportGrid: URebalAccountTreeGridComponent;
    @ViewChild('tradeOverrideGrid') tradeOverrideGrid: TradeOverrideComponent;
    @ViewChild('modalWorkspaceReport') modalWorkspaceReport: ModalComponent;
    @ViewChild('workspaceDetailReport') workspaceDetailReport: WorkspaceSwapDetailsComponent;
    @ViewChild('accountComboxBoxRef') accountComboBox: SoftpakComboBoxComponent;
    @BlockUI() blockUI: NgBlockUI;

    constructor(permissionResolverService: PermissionResolverService, private route: ActivatedRoute,
                public urebalService: URebalService,
                private workspaceService: WorkspaceService,
                private dollarFormatter: DollarFormatterPipe,
                private percentFormatter: PercentFormatterPipe,
                private accountService: AccountService
    ) {
        super(permissionResolverService);
    }

    onServiceLoad(serviceName: string) {
        this.servicesLoaded++;
        console.log("loading service name=" + serviceName + " count=" + this.servicesLoaded);
        if (this.servicesLoaded >= this.servicesCount) {
            console.log("loading service done so stopping loader=" + serviceName);
            this.blockUI.stop();
        }
    }

    ngOnInit() {
        this.workspaceService.isDataChanged = false;
        setTimeout(() => {
            this.route.params.subscribe(params => {
                this.paramValue = URebalUtil.decodeparams(params['workspace_name']);
                this.workspaceService.getWorkspaceProjectsList(encodeURIComponent(this.paramValue)).subscribe(
                    response => {
                        if (response.code == 200) {
                            this.portfoliosList = response.responsedata;
                            this.keepPortfoliosList = response.responsedata;
                            this.loadProjectReport(this.portfoliosList[0]);
                        }
                    }
                );
            });
        }, 500);

        this.isTradeOverrideLoading.subscribe(isDone => {
            console.log(isDone);
        })
    }

    ngAfterViewInit() {
        $('.sideTabs li a').on('click', function (e) {
            if ($(e.currentTarget).parent().hasClass('active')) {
                e.preventDefault();
            } else {
                $('.sideTabs li').removeClass('active');
                $(e.currentTarget).parent().addClass('active');
                let scroll_target = "." + $(e.currentTarget).data("scroll");
                $('.sidePanelRight').animate({
                    scrollTop: $(scroll_target).offset().top
                }, 500);
            }
        });

        //Toggle Collapse Sidebar
        $('.btn-collapse-sidepanel').click((event) => {
            $('.collapsed-sidebar').toggleClass('slds-hide');
            $(event.currentTarget).css({transform: 'rotate(90deg)'});

            if ($(event.currentTarget).parent().width() > 100) {
                $(event.currentTarget).parent().width('1%');
                $('.leftPanel').removeClass('slds-size--10-of-12').addClass('slds-size--1-of-1');
            } else {
                $(event.currentTarget).parent().removeAttr('style');
                $(event.currentTarget).css({transform: 'rotate(-90deg)'});
                $('.leftPanel').removeClass('slds-size--1-of-1').addClass('slds-size--10-of-12');
            }
            this.sharelotReportGrid.jqxGrid.render();
            this.tradeOverrideGrid.tradeGrid.render();

        });
    }


    loadProjectReport(portfolio) {
        this.checkSupportZipEnabled();

        this.workspaceDetailReport.clearAll();
        this.servicesLoaded = 0;
        if (this.workspaceService.isDataChanged) {
            this.modalMessage = "Unsaved changes will be lost, are you sure you want to continue?";
            /*$("#btnYes").css("visibility", "visible");
            $("#btnNo").css("visibility", "visible");
            $("#btnYes").html("Yes");
            $("#btnNo").html("No");*/
            this.modalWorkspaceReport.open('modalWorkspaceReport');
            this.newPortfolio = portfolio;
            return;
        } else {
            /*this.selectedPorfolio = 'project-' + portfolio.portfolioId;

            if ($('#' + this.selectedPorfolio).hasClass('list-active1')) {
                return;
            }*/

            this.blockUI.start("Loading reports...");
            //Loading portfolio information
            this.accountService.getPortfolioDetails(portfolio.portfolioId).subscribe(result => {
                    this.onServiceLoad("Portfolios/getPortfolioDetails");
                    this.portfolio = result.responsedata;
                    this.portfolio.pushedBy = null;
                    this.portfolio.pushedTime = null;
                    this.tradeOverrideGrid.portfolio = this.portfolio;
                    this.tradeOverrideGrid.setCustodian(this.portfolio.custodianName);
                    this.tradeOverrideGrid.setTradeApproved(this.portfolio.isApproved);
                    if (this.portfolio.isApproved) {
                        if (this.portfolio.pushedBy == null && this.portfolio.pushedTime == null) {
                            this.tradeOverrideGrid.tradeExportErrorMessage =
                                "Trades approved by " + this.portfolio.approvedBy + " on " + this.tradeOverrideGrid.datePipe.transform(
                                this.portfolio.approvedTime, this.DATETIME_FORMAT);
                        }/*else if(this.portfolio.approvedTime > this.portfolio.pushedTime) {
              this.tradeOverrideGrid.tradeExportErrorMessage = "Trades approved by " + this.portfolio.approvedBy + " on " + this.tradeOverrideGrid.datePipe.transform(this.portfolio.approvedTime, 'MMMM dd, yyyy hh:mm a');
            } */ else {
                            this.tradeOverrideGrid.tradeExportErrorMessage =
                                "Trades have been sent to OMS by " + this.portfolio.pushedBy + " on " + this.tradeOverrideGrid.datePipe.transform(
                                this.portfolio.pushedTime, this.DATETIME_FORMAT);
                        }
                    } else {
                        this.tradeOverrideGrid.tradeExportErrorMessage = "";
                    }
                    this.tradeOverrideGrid.workspaceName = this.paramValue;
                    this.accountsArray = [];

                    for (let account of this.portfolio.accounts) {
                        this.accountsArray.push({
                          'accountNumber': account.accountNumber,
                          'accountId': account.id,
                        });
                    }

                    if (this.portfolio.isHouseHold) {
                        this.accountsArray.push({
                          'accountNumber': 'HOUSEHOLD',
                          'accountId': 'HOUSEHOLD',
                        });
                    }

                    //$( "ul.level-2" ).children().css( "background-color", "red" );
                    let activeTab = '#tab-' + $('.tabList .active a').data("target");

                    //Loading cash/tax/trade summaries
                    this.workspaceService.get("portfolios/" + portfolio.portfolioId + "/reports/portfolio-summary")
                    .subscribe(result => {
                        if (result.code == 200) {
                            this.summaries = result.responsedata;
                            this.setActiveAccountMenuItem();
                        } else {
                            this.summaries = null;
                        }
                        this.onServiceLoad("SummaryWS/getPortfolioSummary");

                    });


                    //Loading account/sleeve summary
                    this.workspaceService.get(
                        "portfolios/" + portfolio.portfolioId + "/reports/sleeve-summary?sort=account_id:asc")
                    .subscribe(result => {
                        if (result.code == 200) {
                            this.accountsSummary = result.responsedata;
                            this.enableTabClick(activeTab, true);
                        } else {
                            this.accountsSummary = null;
                          this.enableTabClick(activeTab, false);
                        }
                        this.onServiceLoad("SummaryWS/getSleeveSummary");
                    });

                    //Loading tax summary
                    if(this.isAllowed('accountModifyTaxSettings')){
                        this.workspaceService.get("portfolios/" + portfolio.portfolioId + "/reports/enhanced-tax-summary")
                        .subscribe(result => {
                            if (result.code == 200) {
                                this.taxSummary = result.responsedata;
                                this.accountsDropdown = new Array<string>();
                                for (let summary of this.taxSummary) {
                                    this.accountsDropdown.push(summary.account_id);
                                    if (summary.account_id == "HOUSEHOLD") {
                                        this.selectedAccount = summary.account_id;
                                        this.loadTaxData();
                                    }
                                }
                                this.accountsDropdown.sort();
                                if (this.accountsDropdown.indexOf('HOUSEHOLD')) {
                                    this.accountsDropdown.splice(this.accountsDropdown.indexOf('HOUSEHOLD'), 1);
                                    this.accountsDropdown.unshift('HOUSEHOLD')
                                }
                                if (!this.portfolio.isHouseHold && this.accountsDropdown) {
                                    this.accountsDropdown.splice(this.accountsDropdown.indexOf('HOUSEHOLD'), 1);
                                    this.selectedAccount = this.accountsDropdown[0];
                                }
                                if (activeTab == '#tab-tax-summary') {
                                    $(activeTab).removeClass('slds-hide').addClass('slds-show');
                                }
                            } else {
                                this.taxSummary = null;
                                if (activeTab == '#tab-tax-summary') {
                                    $(activeTab).removeClass('slds-show').addClass('slds-hide');
                                }
                            }
                            this.onServiceLoad("SummaryWS/enhancedTaxSummary");
                        });
                    }


                    //Loading sharelot
                    if(this.isAllowed('accountModifyTaxSettings')){
                        this.workspaceService.get(
                            "portfolios/" + portfolio.portfolioId + "/reports/sharelot?sort=accountId:asc,ticker:asc,shareLotId:asc")
                        .subscribe(result => {
                            if (result.code == 200) {
                                this.shareLotReport = result.responsedata;
                                this.tradeReportData = [];
                                for (let row of result.responsedata) {
                                    this.tradeReportData.push($.extend({}, row));
                                }

                                if (activeTab === "#tab-sharelot-report") {
                                    this.sharelotReportGrid.refreshGrid(this.shareLotReport);
                                }
                            } else {
                                this.shareLotReport = [];
                                this.sharelotReportGrid.jqxGrid.clear();
                                this.tradeOverrideGrid.clearTradeSummary();
                            }
                            this.onServiceLoad("sharelot/getShareLotsListId");

                        });
                    }


                    //Loading Asset Allocation
                    if(this.isAllowed('modelViewAssetModel')){
                        this.workspaceService.get("portfolios/" + portfolio.portfolioId + "/reports/asset-allocation")
                        .subscribe(result => {
                                // this.blockUI.start("Loading reports...");
                                if (result.code == 200) {
                                    this.attributeAccountSummaryReport = result.responsedata.data['asset_attributes'];
                                    this.attributeSummaryReport = result.responsedata.data['aggregate_attributes'];


                                    $('#noAssetAllocationRecords').addClass('slds-hide').removeClass('slds-show');

                                    if (this.portfolio != undefined && !this.portfolio.isHouseHold) {
                                        $('#view-scope-container').css({"display": "none"});
                                        $('#view-scope-container').removeClass('slds-show').addClass('slds-hide');
                                        $('#attributeAccountSummaryReportContainer').removeClass('slds-hide').addClass('slds-show');
                                        $('#attributeReportGridContainer').addClass('slds-hide').removeClass('slds-show');
                                        //this.selectedView = 'Account Asset Allocation';
                                    } else {
                                        $('#view-scope-container').addClass('slds-show').removeClass('slds-hide');
                                        $('#attributeReportGridContainer').removeClass('slds-hide').addClass('slds-show');
                                        $('#attributeAccountSummaryReportContainer').addClass('slds-hide').removeClass('slds-show');
                                        $('#view-scope-container').css({"display": "block"});
                                        this.selectedView = 'Household Asset Allocation';
                                    }
                                    this.accountAttributeReportGrid.refreshGrid(this.attributeAccountSummaryReport,
                                        GridExpand.TREE_GRID_EXPAND_ALL);
                                    this.attributeReportGrid.refreshGrid(this.attributeSummaryReport,
                                        GridExpand.TREE_GRID_EXPAND_ALL);

                                } else {
                                    this.attributeAccountSummaryReport = [];
                                    this.accountAttributeReportGrid.jqxTreeGrid.clear();
                                    this.attributeSummaryReport = [];
                                    this.attributeReportGrid.jqxTreeGrid.clear();
                                    $('#attributeReportGridContainer').addClass('slds-hide').removeClass('slds-show');
                                    $('#attributeAccountSummaryReportContainer').addClass('slds-hide').removeClass('slds-show');
                                    $('#noAssetAllocationRecords').removeClass('slds-hide').addClass('slds-show');
                                    //$('#view-scope-container').removeClass('slds-show').addClass('slds-hide');
                                    $('#view-scope-container').css({"display": "none"});
                                }
                                this.onServiceLoad("portfolios/{portfolioId}/reports/asset-allocation");
                            }
                        );
                    }


                    //Loading Trade Override
                    this.workspaceService.get("portfolios/" + portfolio.portfolioId + "/reports/trade-override")
                    .subscribe(result => {
                        if (result.code == 200) {
                            let tradeData = result.responsedata;
                            this.tradeOverrideGrid.clearTradeSummary();
                            this.renderTradeOverrideReport(tradeData);
                        } else {
                            this.tradeReportData = [];
                            this.tradeOverrideGrid.clearTradeSummary();
                            this.onServiceLoad("PortfolioWS/getRestrictionWithoutValidations dummy call"); // To make servicesCount count to 9

                        }
                        this.onServiceLoad("sharelot/getTradeOverrideData");
                    });

                    //if portfolio is a household then overlay stock report shall be loaded otherwise stock report shall be loaded
                    if (this.portfolio.isHouseHold) {
                        this.workspaceService.get(
                            "portfolios/" + portfolio.portfolioId + "/reports/overlay-stock?sort=ticker:asc")
                        .subscribe(result => {
                            if (result.code == 200) {
                                this.stockReport = result.responsedata;
                                if (activeTab === "#tab-stock-report") {
                                    this.stockReportGrid.refreshGrid(this.stockReport);
                                }
                            } else {
                                this.stockReport = [];
                                this.stockReportGrid.jqxGrid.clear();
                            }
                            this.onServiceLoad("overlaystock/byPortfolioId");
                        });
                    } else {
                        if(this.isAllowed('accountModifyTaxSettings')){
                            this.workspaceService.get("portfolios/" + portfolio.portfolioId + "/reports/stock")
                            .subscribe(result => {
                                if (result.code == 200) {
                                    this.stockReport = result.responsedata;
                                    if (activeTab === "#tab-stock-report") {
                                        this.stockReportGrid.refreshGrid(this.stockReport);
                                    }
                                } else {
                                    this.stockReport = [];
                                    this.stockReportGrid.jqxGrid.clear();
                                }
                                this.onServiceLoad("stock/byPortfolioId");
                            });
                        }
                    }
            });
        }
    }

    public checkSupportZipEnabled() {
        this.workspaceService.checkSupportZipEnabled().subscribe(result => {
            this.isSupportZipEnabled = result.responsedata;
        }, (error) => {
            this.onServiceLoad(this.workspaceService.GENERATE_SUPPORT_ZIP_INPUTS);
        }, () => {
            this.onServiceLoad(this.workspaceService.GENERATE_SUPPORT_ZIP_INPUTS);
        });
    }

    private setActiveAccountMenuItem(){
        /**
         * Remove previously selected portfolio and select the current portfolio
         */
        $('.menuitem').removeClass('list-active1');
        $('.menuitem i').css( "color", "#c5cbcf" );
        $('.menuitem * a').children().css( "color", "#36454f" ).css('font-weight','normal');
        $('#' + this.selectedPorfolio).addClass('list-active1');
        $('#' + this.selectedPorfolio + ' *').children().css( "color", "#007dc4" ).css('font-weight','bold');
    }

    private enableTabClick(activeTab, enable: boolean = true){
     if(enable){
         this.bindTabClickEvent(true);
         this.noDataFound = false;
         $('#projectInformation').css('display', 'block');
         $('#project-summary-report').removeClass('slds-hide').addClass('slds-show');

         if (activeTab == '#tab-account-summary') {
             $(activeTab).removeClass('slds-hide').addClass('slds-show');
         }
     }
     else{
         $('.tabList li').eq(0).find('a').click();
         this.noDataFound = true;
         this.bindTabClickEvent(false);
         $('#projectInformation').css('display', 'none');

         if (activeTab == '#tab-account-summary') {
             $(activeTab).removeClass('slds-show').addClass('slds-hide');
         }
     }
    }



    onChangeViewScope() {

        if ((this.portfolio != undefined && this.portfolio.isHouseHold)) {
            if ($('#scopeView').val() != 'Household Asset Allocation') {
                $('#attributeAccountSummaryReportContainer').removeClass('slds-hide').addClass('slds-show');
                $('#attributeReportGridContainer').addClass('slds-hide').removeClass('slds-show');
                this.accountAttributeReportGrid.jqxTreeGrid.render();
                this.accountAttributeReportGrid.jqxTreeGrid.expandAll();
            } else {
                $('#attributeReportGridContainer').removeClass('slds-hide').addClass('slds-show');
                $('#attributeAccountSummaryReportContainer').addClass('slds-hide').removeClass('slds-show');
                this.attributeReportGrid.jqxTreeGrid.render();
                this.attributeReportGrid.jqxTreeGrid.expandAll();
            }
        } else {
            $('#attributeAccountSummaryReportContainer').removeClass('slds-hide').addClass('slds-show');
            $('#attributeReportGridContainer').addClass('slds-hide').removeClass('slds-show');
            this.accountAttributeReportGrid.jqxTreeGrid.render();
            this.accountAttributeReportGrid.jqxTreeGrid.expandAll();
        }
    }

    exportReport(reportType: string) {

        if (this.portfolio.isHouseHold && reportType == 'stock') {
            reportType = 'overlay';
        }
        this.workspaceService.downloadReport(reportType, this.portfolio.portfolioId)
        .subscribe(data => {
                console.log("File downloaded successfully.")
            },
            error => {
                console.log("Error downloading the file.")
            }
        );
    }

    getSelectedAccount(event) {
        this.selectedAccount = event;
        this.loadTaxData();
    }

    showIn(event) {
        this.taxShowIn = event;
        this.loadTaxData();
    }

    private loadTaxData(): void {
        for (let tax of this.taxSummary) {
            if (tax.account_id === this.selectedAccount) {
                this.selectedAccountTax = this.taxMapToEntity(tax);
                return;
            }
        }
    }

    private taxMapToEntity(taxSummary: any) {
        let mapTempTax = {
            beforeLongTermGain: this.formatValue(taxSummary['beforeLongTermGain' + this.taxShowIn]),
            beforeLongTermLoss: this.formatValue(taxSummary['beforeLongTermLoss' + this.taxShowIn]),
            beforeShortTermGain: this.formatValue(taxSummary['beforeShortTermGain' + this.taxShowIn]),
            beforeShortTermLoss: this.formatValue(taxSummary['beforeShortTermLoss' + this.taxShowIn]),
            beforeShortTermNet: this.formatValue(
                taxSummary['beforeShortTermGain' + this.taxShowIn] + taxSummary['beforeShortTermLoss' + this.taxShowIn]),
            beforeLongTermNet: this.formatValue(
                taxSummary['beforeLongTermGain' + this.taxShowIn] + taxSummary['beforeLongTermLoss' + this.taxShowIn]),
            beforeTotalGain: this.formatValue(
                taxSummary['beforeLongTermGain' + this.taxShowIn] + taxSummary['beforeShortTermGain' + this.taxShowIn]),
            beforeTotalLoss: this.formatValue(
                taxSummary['beforeLongTermLoss' + this.taxShowIn] + taxSummary['beforeShortTermLoss' + this.taxShowIn]),
            beforeTotalNet: this.formatValue(
                (taxSummary['beforeLongTermGain' + this.taxShowIn] + taxSummary['beforeShortTermGain' + this.taxShowIn]) + (taxSummary['beforeLongTermLoss' + this.taxShowIn] + taxSummary['beforeShortTermLoss' + this.taxShowIn])),
            afterLongTermGain: this.formatValue(taxSummary['afterLongTermGain' + this.taxShowIn]),
            afterLongTermLoss: this.formatValue(taxSummary['afterLongTermLoss' + this.taxShowIn]),
            afterShortTermGain: this.formatValue(taxSummary['afterShortTermGain' + this.taxShowIn]),
            afterShortTermLoss: this.formatValue(taxSummary['afterShortTermLoss' + this.taxShowIn]),
            afterShortTermNet: this.formatValue(
                taxSummary['afterShortTermGain' + this.taxShowIn] + taxSummary['afterShortTermLoss' + this.taxShowIn]),
            afterLongTermNet: this.formatValue(
                taxSummary['afterLongTermGain' + this.taxShowIn] + taxSummary['afterLongTermLoss' + this.taxShowIn]),
            afterTotalGain: this.formatValue(
                taxSummary['afterLongTermGain' + this.taxShowIn] + taxSummary['afterShortTermGain' + this.taxShowIn]),
            afterTotalLoss: this.formatValue(
                taxSummary['afterLongTermLoss' + this.taxShowIn] + taxSummary['afterShortTermLoss' + this.taxShowIn]),
            afterTotalNet: this.formatValue(
                (taxSummary['afterLongTermGain' + this.taxShowIn] + taxSummary['afterShortTermGain' + this.taxShowIn]) + (taxSummary['afterLongTermLoss' + this.taxShowIn] + taxSummary['afterShortTermLoss' + this.taxShowIn])),
            changeLongTermGain: this.formatValue(taxSummary['changeLongTermGain' + this.taxShowIn]),
            changeLongTermLoss: this.formatValue(taxSummary['changeLongTermLoss' + this.taxShowIn]),
            changeShortTermGain: this.formatValue(taxSummary['changeShortTermGain' + this.taxShowIn]),
            changeShortTermLoss: this.formatValue(taxSummary['changeShortTermLoss' + this.taxShowIn]),
            changeShortTermNet: this.formatValue(
                taxSummary['changeShortTermGain' + this.taxShowIn] + taxSummary['changeShortTermLoss' + this.taxShowIn]),
            changeLongTermNet: this.formatValue(
                taxSummary['changeLongTermGain' + this.taxShowIn] + taxSummary['changeLongTermLoss' + this.taxShowIn]),
            changeTotalGain: this.formatValue(
                taxSummary['changeLongTermGain' + this.taxShowIn] + taxSummary['changeShortTermGain' + this.taxShowIn]),
            changeTotalLoss: this.formatValue(
                taxSummary['changeLongTermLoss' + this.taxShowIn] + taxSummary['changeShortTermLoss' + this.taxShowIn]),
            changeTotalNet: this.formatValue(
                (taxSummary['changeLongTermGain' + this.taxShowIn] + taxSummary['changeShortTermGain' + this.taxShowIn]) + (taxSummary['changeLongTermLoss' + this.taxShowIn] + taxSummary['changeShortTermLoss' + this.taxShowIn])),
        };

        return mapTempTax;
    }

    private formatValue(value) {
        let args: any[] = [];
        args['html'] = true;
        if (this.taxShowIn == "Dollar") {
            return this.dollarFormatter.transform(value, args);
        } else {
            return this.percentFormatter.transform(value, args);
        }
    }

    filterProject(event) {
        let value = event.target.value;
        this.portfoliosList = new Array<string>();
        value = value.trim().toUpperCase();

        /** highlight selected portfolio */
        setTimeout(() => {
            $('#' + this.selectedPorfolio).addClass('list-active1');
        }, 200);

        if (value.length == 0) {
            this.portfoliosList = this.keepPortfoliosList;
            return;
        }

        for (let portfolio of this.keepPortfoliosList) {
            if (portfolio.portfolioName.toUpperCase().indexOf(value) != -1) {
                this.portfoliosList.push(portfolio);
                $('#' + this.selectedPorfolio).addClass('list-active1');
            }
        }
    }

    getCellEditedValue($event) {
        console.log("Last edited row: ");
        console.log($event);
    }

    continueLoadingProject() {
        this.workspaceService.isDataChanged = false;
        this.closeModal();
        this.portfolio = this.newPortfolio;
        this.setAccountComboText();
        this.loadProjectReport(this.portfolio);
    }

    setAccountComboText(){
        let index = this.accountComboBox.attrSource.findIndex((item)=>{
            return item.portfolioName == this.portfolio.portfolioName;
        });
        this.accountComboBox.clearSelection();
        this.accountComboBox.selectedIndex(index);
    }

    onModalClose(){
        this.setAccountComboText();
        this.closeModal();
    }

    closeModal() {
        this.modalWorkspaceReport.close();
    }


    /**
     * This event will only trigger where each element has data-target attribute is true
     * Tab Function
     **/
    bindTabClickEvent(eventStatus) {
        if (eventStatus) {
            $("body").off('click', '.tabList a');
            $("body").on('click', '.tabList a', (event) => {

                let showTarget = false;

                let target = '#tab-' + $(event.currentTarget).data("target");

                if (target === "#tab-sharelot-report" && this.shareLotReport) {
                    this.sharelotReportGrid.refreshGrid(this.shareLotReport);
                    showTarget = true;
                } else if (target === "#tab-stock-report" && this.stockReport) {
                    this.stockReportGrid.refreshGrid(this.stockReport);
                    showTarget = true;
                } else if (target === "#tab-tax-summary" && this.taxSummary) {
                    showTarget = true;
                } else if (target === "#tab-project-summary") {
                    showTarget = true;
                } else if (target === "#tab-account-summary" && this.accountsSummary) {
                    showTarget = true;
                } else if (target === "#tab-asset-allocation" && this.attributeSummaryReport) {

                    if (this.portfolio != undefined && !this.portfolio.isHouseHold) {
                        this.accountAttributeReportGrid.jqxTreeGrid.render();
                        this.accountAttributeReportGrid.jqxTreeGrid.expandAll();
                    } else {
                        if ($('#scopeView').val() != 'Household Asset Allocation') {
                            this.accountAttributeReportGrid.jqxTreeGrid.render();
                            this.accountAttributeReportGrid.jqxTreeGrid.expandAll();
                        } else {
                            this.attributeReportGrid.jqxTreeGrid.render();
                            this.attributeReportGrid.jqxTreeGrid.expandAll();
                        }
                    }
                    showTarget = true;
                } else if (target === "#tab-trade-override") {
                    showTarget = true;
                } else if (target === "#tab-workspace-swap-details") {
                    showTarget = true;
                }

                //First hide already open tab
                $('div[id^="tab-"]').removeClass('slds-show').addClass('slds-hide');

                if (showTarget) {
                    $(target).removeClass('slds-hide').addClass('slds-show');
                }
                $('.tabList li').removeClass('active');
                //$('.tabList li').removeClass('slds-active');
                //$(event.currentTarget).parent().addClass('slds-active');
                $(event.currentTarget).parent().addClass('active');
            });
        } else {
            $("body").off('click', '.tabList a');
        }
    }

    private renderTradeOverrideReport(tradeData) {
        if (this.isTradeOverrideLoading.getValue() == false) {
            this.isTradeOverrideLoading.next(true);
            setTimeout(() => {
                this.isTradeOverrideLoading.next(false);
                this.tradeOverrideGrid.clearTradeSummary();
                this.tradeOverrideGrid.refreshAccountsDropdown(this.accountsArray);
                this.tradeOverrideGrid.addTradeItems(tradeData);
                this.tradeOverrideGrid.getAccountRestrictions(this);
            });
        }
    }

    expandAll(event) {

        if (event.srcElement.innerHTML == ' Expand All ') {
            if (this.portfolio != undefined && !this.portfolio.isHouseHold)
                this.accountAttributeReportGrid.refreshGrid(this.attributeAccountSummaryReport,
                    GridExpand.TREE_GRID_EXPAND_ALL);
            else {
                if (this.selectedView == 'Household Asset Allocation')
                    this.attributeReportGrid.refreshGrid(this.attributeSummaryReport, GridExpand.TREE_GRID_EXPAND_ALL);
                else
                    this.accountAttributeReportGrid.refreshGrid(this.attributeAccountSummaryReport,
                        GridExpand.TREE_GRID_EXPAND_ALL);
            }
        } else {
            if (this.portfolio != undefined && !this.portfolio.isHouseHold)
                this.accountAttributeReportGrid.refreshGrid(this.attributeAccountSummaryReport,
                    GridExpand.TREE_GRID_COLAPSE_ALL);
            else {
                if (this.selectedView == 'Household Asset Allocation')
                    this.attributeReportGrid.refreshGrid(this.attributeSummaryReport, GridExpand.TREE_GRID_COLAPSE_ALL);
                else
                    this.accountAttributeReportGrid.refreshGrid(this.attributeAccountSummaryReport,
                        GridExpand.TREE_GRID_COLAPSE_ALL);
            }
        }

    }

    getStockReportGridColumns() {
        let data = [
            {
                "text": "Security ID",
                "align": "center",
                "datafield": "ticker",
                "cellsalign": "left",
                "cellsrenderer": "cellsRenderer",
                "minWidth": "200"
            },
            {
                "text": "Attribute Name",
                "align": "center",
                "cellsalign": "left",
                "datafield": "attributeList",
                "cellsrenderer": "cellsRenderer",
                "minWidth": "150"
            },
            {
                "text": "Equivalence Name",
                "align": "center",
                "cellsalign": "left",
                "datafield": "equivalenceName",
                "cellsrenderer": "cellsRenderer",
                "minWidth": "150"
            },
            {
                "text": "Security Type",
                "align": "center",
                "cellsalign": "left",
                "datafield": "securityType",
                "cellsrenderer": "cellsRenderer",
                "minWidth": "150"
            },
            {
                "text": "Action",
                "align": "center",
                "cellsalign": "left",
                "datafield": "tradeType",
                "cellsrenderer": "cellsRenderer",
                "minWidth": "80"
            },
            {
                "text": "Price (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "price",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "80"
            },
            {
                "text": "Trade Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "tradeShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "120"
            },
            {
                "text": "Round Trade Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "roundTradeShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Trade Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "tradeValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "120"
            },
            {
                "text": "Trade %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "tradePct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "120"
            },
            {
                "text": "Init %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "initPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "120"
            },
            {
                "text": "Target %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelTargetPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "120"
            },
            {
                "text": "Min %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelMinPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "80"
            },
            {
                "text": "Max %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelMaxPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "80"
            },
            {
                "text": "Adjusted Target %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "adjustedTargetPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Adjusted Min %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "adjustedMinPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Adjusted Max %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "adjustedMaxPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Proposed %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "optPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "120"
            },
            {
                "text": "Init. Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "initShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Target Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "targetShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Proposed Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "optShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "140"
            },
            {
                "text": "Init. Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "initValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "140"
            },
            {
                "text": "Target Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "targetValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "140"
            },
            {
                "text": "Proposed Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "optValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "140"
            },
            {
                "text": "Round Trade Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "roundTradeValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "160"
            },
            {
                "text": "Round Trade %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "roundTradePct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "160"
            },
            {
                "text": "Adjusted Target Shares",
                "align": "center",
                "cellsalign": "right",
                "datafield": "adjustedTargetShares",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2",
                "minWidth": "160"
            },
            {
                "text": "Adjusted Target Dollar (USD)",
                "align": "center",
                "cellsalign": "right",
                "datafield": "adjustedTargetValue",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "c2",
                "minWidth": "160"
            }
        ]

        SoftpakGridHelper.mergeGridColumnProperties(data, rebalanceStockReportGridColsMeta);

        return data;
    }

    accountOnChange(){
        const selectedItem = this.accountComboBox.getSelectedItem();
        if (selectedItem){
            this.loadProjectReport(selectedItem.originalItem);
        }

    }

}

