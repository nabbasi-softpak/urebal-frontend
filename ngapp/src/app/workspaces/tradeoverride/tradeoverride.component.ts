import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {WorkspaceService} from "../workspace.service";
import {TradeOverrideCalculations} from "../TradeOverrideCalculations";
import {DollarFormatterPipe, NumberFormatterPipe, PercentFormatterPipe} from "../../shared/pipes/NumericFormatterPipe";
import {UILoader} from '../../shared/util/UILoader';
import {AccountService} from "../../account/account.service";
import {URebalService} from "../../services/urebal.service";
import {ResponseContentType} from '../../shared/classes/ResponseContentType.class';
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {ModelService} from "../../model/model.service";
import {LocalStorageService} from "angular-2-local-storage";
import {DatePipe} from '@angular/common';
import {PermissionResolverService, UrebalPermissions} from '../../services/permission-resolver.service';
import {WorkspaceReportsComponent} from "../workspace-reports/workspace-reports.component";
import {TradeSummary} from "../../shared/classes/TradeSummary.class";
import {filterData, gridColumns, gridSource, groupByData, tradeFileFormatList} from "./tradeoverride.datasource";
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import GridColumn = jqwidgets.GridColumn;
import {sortByKey} from "../../shared/util/HelperUtils";
import {SoftpakDropdownComponent} from "../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {DialogModalComponent} from "../../shared/components/dialog-modal/dialog-modal.component";
import {MessageModalComponent} from "../../shared/components/message-modal/message-modal.component";
import {UserService} from "../../user/user.service";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {appConfig} from "../../shared/util/config";
import {AppConfig} from "../../../app.config";

const REPORT_NAME = "TRADE_OVERRIDE_GRID";
const pershingETFCode: number = 110;
const pershingMFCode: number = 120;

@Component({
    selector: 'trade-override',
    templateUrl: './tradeoverride.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeOverrideComponent extends UrebalPermissions implements OnInit, AfterViewInit {
    @Input() gridId: string;
    @Input() displayHeader: boolean = true;
    @Input() panelTitle: string;
    @Input() rowRendererColumns: any;

    @Output() onCellEdited: EventEmitter<any> = new EventEmitter();
    @ViewChild('tradeGridRef', {static: true}) tradeGrid: SoftpakGridComponent;
    @ViewChild('dialogModalRef') modalComponent: DialogModalComponent;
    @ViewChild('messageModalRef') messageModal: MessageModalComponent;
    @ViewChild('tradeFileFormatModalComponent') tradeFileFormatModalComponent: ModalComponent;
    @ViewChild('showColumnDropdownRef', {static: true}) showColumnDropdown: SoftpakDropdownComponent;
    @ViewChild('tradeSummaryDropdownRef') tradeSummaryDropdown: SoftpakDropdownComponent;
    @ViewChild('tradeFileFormatDropDownRef') tradeFileFormatDropDown: SoftpakDropdownComponent;
    @ViewChild('filterDropDownRef') filterDropDown: SoftpakDropdownComponent;

    private tradeCalculations = new TradeOverrideCalculations(this);
    private actualShareLotReport: any = [];
    private shareLotChangeData: any = [];
    public accountsDropdown: any[];
    public selectedAccount: string;
    public dropdownData: any[];
    public tradesErrorMessage: string = "";//"This is a test message";
    public closeButtonLabel: string;
    private tradeFileFormatList: any;
    private tradeFileFormatName: string;
    public tradeExportErrorMessage: string = "";
    public tradeExportModalErrorMessage: string = "";
    public appComponentContext: string;

    source = gridSource;
    gridColumns: GridColumn[];
    gridAdapter = new jqx.dataAdapter(this.source);

    portfolio: any;
    accountsTradeSummary: TradeSummary[] = [];
    householdTradeSummary: TradeSummary = new TradeSummary;
    currentTradeSummary: TradeSummary = new TradeSummary;
    cashTrades: any = [];
    accountRestrictions: any = [];
    tradesApproved: boolean = false; // set value for this using setter
    workspaceName: string;

    gridData: any = {
        keepOriginalData: null,
        oldRowData: null,
        newRowData: null,
        oldColumnAndValue: null,
        editedRowId: null
    };

    filterData = filterData;
    groupByData = groupByData;
    currentFilterIndex: number = 0;
    groupBy: any = [];
    isValidForm: boolean = false;
    gridState: any = null;
    stateUpdate: boolean = false;
    custodianName: string;

    constructor(public workspaceService: WorkspaceService,
                private dollarFormatter: DollarFormatterPipe,
                private percentFormatter: PercentFormatterPipe,
                private numberFormatter: NumberFormatterPipe,
                private urebalService: URebalService,
                private accountService: AccountService,
                private modelService: ModelService,
                private userService: UserService,
                permissionResolverService: PermissionResolverService,
                private localStorage: LocalStorageService,
                public datePipe: DatePipe,
                public ref: ChangeDetectorRef
    ) {
        super(permissionResolverService);
        this.appComponentContext = this.workspaceService.getAppContext();
    }

    ngOnInit() {
        this.setGridColumns();
        this.initShowHideDropdownData();

        this.tradeFileFormatList = tradeFileFormatList;
        this.tradeFileFormatName = this.tradeFileFormatList[0].value;

        if (this.rowRendererColumns !== undefined && typeof (this.rowRendererColumns) === "string") {
            this.rowRendererColumns = JSON.parse(this.rowRendererColumns);
        }
    }

    ngAfterViewInit(): void {
        this.selectShowColumnCheckbox({showSelected: true});

    }

    setGridColumns() {
        this.gridColumns = gridColumns.call(null, this, this.tradeGrid);
    }

    initShowHideDropdownData() {
        let allEnabled = true;

        for (let column of this.gridColumns) {
            if (column.hidden == true) {
                allEnabled = false;
                break;
            }
        }

        this.dropdownData = [{
            display: 'Show All Columns',
            value: 'showHiddenColumns',
            checked: allEnabled
        }]
        .concat(
            Object.assign([], this.gridColumns)
            //.sort((a,b)=>{return a.text > b.text ? 1 : a.text < b.text ? -1 : 0;})
            .filter((item) => {
            // Hide these options from hide dropdowns
            return [
                "ticker",
                "action",
                "roundTradeShares",
                "roundTradeValue",
                "securityName",
                "securityType",
                "price",
                "equivalenceName"
            ].indexOf(item.datafield) == -1;
        }).map((item) => {
            return {
                display: item.text.replace('<br>', ' '),
                value: item.datafield,
                checked: !item.hidden
            }
        }));

        this.showColumnDropdown.source(this.dropdownData);
    }

    rowdetailstemplate: any = {
        rowdetails: `<div  style='border: 1px solid #d8dde6; height: 32px'></div>`,
        rowdetailsheight: 32
    };

    initrowdetails = (index: any, parentElement: any, gridElement: any, datarecord: any): void => {
        let rowDetailsColor : string = (index % 2) == 0 ? '#ffffff' : '#f3f8fc';
        if(parentElement){
            let notes = parentElement.children[0];
            if (notes) {
                let notesContainer = document.createElement('div');
                let securityName = datarecord.securityName ? datarecord.securityName : '--';
                let securityType = datarecord.securityType ? datarecord.securityType : '--';
                let price = datarecord.price ? this.formatCurrency(datarecord.price) : '--';
                let equivalenceName = datarecord.equivalenceName ? datarecord.equivalenceName : '--';
                let log = `<div style='margin: auto; width: 100%; padding: 8px;  background-color: ${rowDetailsColor} '>
                    <span class="slds-p-right--x-small blueleaf-text-truncate">Security Name :</span><span title="${securityName}" class="slds-p-right--medium blueleaf-text-truncate" style="font-weight: bold; max-width: 280px;">${securityName}</span>
                    <span class="slds-p-right--x-small blueleaf-text-truncate">Security Type :</span><span title="${securityType}" class="slds-p-right--medium  blueleaf-text-truncate" style="font-weight: bold">${securityType}</span>
                    <span class="slds-p-right--x-small blueleaf-text-truncate">Price :</span><span title="${price}" class="slds-p-right--medium blueleaf-text-truncate" style="font-weight: bold">${price}</span>
                    <span class="slds-p-right--x-small blueleaf-text-truncate">Equivalence Name :</span><span title="${equivalenceName}" class="blueleaf-text-truncate" style="font-weight: bold; max-width: 140px">${equivalenceName}</span>
                </div>`
                notesContainer.innerHTML = log;
                notes.appendChild(notesContainer);
            }
        }
    }

    private selectShowColumnCheckbox({showSelected = false, showAll = false, hideAll = false}) {
        this.dropdownData.forEach((item) => {
            if (showSelected && item.checked) {
                this.showColumnDropdown.checkItem(item.value);
            } else if (showAll) {
                this.showColumnDropdown.checkItem(item.value);
                this.tradeGrid.showcolumn(item.value);
            } else if (hideAll) {
                this.showColumnDropdown.uncheckItem(item.value);
                this.tradeGrid.hidecolumn(item.value);
            } else {
                this.showColumnDropdown.uncheckItem(item.value);
                this.tradeGrid.hidecolumn(item.value);
            }
        });
    }

    alterLotData(actualData) {
        // For appending composite field such as SL (Short and Long)
        return actualData.map((item) => {
            item.marketValue = item.price * item.roundTradeShares;

            if (item.action == 'Sell') {
                item.sl = TradeOverrideCalculations.isLongTerm(item.purchaseDate) ? 'LT' : 'ST';
            } else {
                item.sl = appConfig.DASH_FOR_EMPTY
            }

            return item;
        });
    }

    static sortLotData(lotData) {
        lotData = sortByKey(lotData, 'ticker');
        lotData = sortByKey(lotData, 'accountId');
        return lotData;
    }

    getZeroTradeLot(lotData: any[], ticker, accountId) {
        let zeroTradeLots = [];
        let zeroTradeLotsIndexes = [];

        for (let index in lotData) {
            let lot = lotData[index];
            // Select zero trade lot which are not buy lot.
            if (lot.ticker == ticker && lot.accountId == accountId && (lot.action == 'Zero Trade' && lot.shareLotId != '{BUY LOT}')) {
                zeroTradeLots.push(lotData[index]);
                zeroTradeLotsIndexes.push(index);
            }
        }

        return {zeroTradeLots, zeroTradeLotsIndexes};
    }

    mergeBuyLotWithZeroTradeLot(lot, zeroTradeLots) {
        for (let zeroTradeLot of zeroTradeLots) {
            lot.roundOptValue += zeroTradeLot.roundOptValue;
            lot.initShares += zeroTradeLot.initShares;
            lot.initValue += zeroTradeLot.initValue;
            lot.initPercent += zeroTradeLot.initPercent;

            lot.roundOptPctWt += zeroTradeLot.roundOptPctWt;
            lot.roundOptPctWtClone += zeroTradeLot.roundOptPctWtClone;

            lot.roundOptShares += zeroTradeLot.roundOptShares;
            lot.roundOptSharesClone += zeroTradeLot.roundOptSharesClone;

            lot.proposedShares += zeroTradeLot.proposedShares;
            lot.optPctWt += zeroTradeLot.optPctWt;
            lot.optValue += zeroTradeLot.optValue;
        }
        return lot;
    }

    processLotData(lotData: any[]) {
        let processedLotData: any[] = lotData;
        let indexesToRemove = [];

        for (let lot of processedLotData) {
            if (lot.shareLotId == "{BUY LOT}") {
                let {zeroTradeLots, zeroTradeLotsIndexes} = this.getZeroTradeLot(lotData, lot.ticker, lot.accountId);
                indexesToRemove = indexesToRemove.concat(zeroTradeLotsIndexes);

                if (zeroTradeLots.length > 0) {
                    lot = this.mergeBuyLotWithZeroTradeLot(lot, zeroTradeLots);
                }
            }
        }

        // Removing data from given index in reverse order
        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
            processedLotData.splice(indexesToRemove[i], 1);
        }

        return processedLotData;
    }

    addTradeItems(lotData: any[]) {
        lotData = this.processLotData(lotData);

        this.update(lotData, true, null, false);
        this.setGridState();
        if(!this.isAllowed('portfolioEditTrades')){
            this.resetGridMetaData();
            this.tradeGrid.editable(false);
            this.ref.detectChanges();
        }

        /** Resetting and applying filter explicitly while selecting different account */
        this.resetAndApplyFilter();
    }

    private resetAndApplyFilter(){
        this.filterDropDown.selectIndex(this.currentFilterIndex > 0 ? 0 : this.currentFilterIndex + 1);
        this.filterDropDown.selectIndex(this.currentFilterIndex);
    }

    private update(lotData?: any[], updateSummary = true, updateType = null, applyFilter = true): void {

        if (lotData == null) return;

        if(applyFilter){
            lotData = this.getFilteredData(lotData); // Get data after applying filters
            lotData = TradeOverrideComponent.sortLotData(lotData);
            lotData = this.alterLotData(lotData); // adding composite field such ShortLong
        }

        this.source.localdata = lotData;
        this.tradeGrid.updatebounddata(updateType);

        if (updateSummary && lotData.length != 0) {
            this.updateSummary(lotData);
        }

        this.tradeGrid.groups(this.groupBy);

        this.ref.detectChanges();
    }

    updateSummary(actualData) {
        this.tradeCalculations.selectedAccount = this.selectedAccount;
        this.tradeCalculations.portfolio = this.portfolio;

        if (this.tradeCalculations.sharesData.length == 0) {
            this.tradeCalculations.cashTrades = [];

            this.tradeCalculations.sharesData = actualData;
            for (let row of this.tradeCalculations.sharesData) {
                if (row.ticker == appConfig.CASH) {
                    this.tradeCalculations.cashTrades[row.accountId] = row;
                }
            }
        }

        //this.tradeCalculations.loadTradeSummaryData(this.portfolio.accountId);
        this.tradeCalculations.calculateTradeSummary();
        this.gridData.keepOriginalData = this.tradeCalculations.sharesData;
    }

    saveShareLotReport() {
        const cashStatus = this.checkNegativeCash();
        if (!cashStatus.isNegative) {
            //$('#resetButton').css('visibility', 'hidden');

            const json = JSON.stringify(this.gridData.keepOriginalData);
            const url = "sharelot/saveSharelotReport?portfolioId=" + this.portfolio.portfolioId;

            UILoader.blockUI.start('Saving Trades...');

            this.workspaceService.post(url, json).subscribe(response => {

                if (response.code == 200) {
                    this.workspaceService.isDataChanged = false;
                    this.messageModal.content = "Your changes have been saved successfully.";
                } else {
                    this.messageModal.content = "Something went wrong while saving changes.";
                }

                this.ref.detectChanges();
                this.messageModal.open();

                this.resetChanges(false); //update from local stored data.

                UILoader.blockUI.stop();
            });
        } else {
            this.messageModal.content = cashStatus.message;
            this.ref.detectChanges();
            this.messageModal.open();
        }
    }

    allowSave() {
        return this.workspaceService.isDataChanged && this.isValidForm;
    }

    checkNegativeCash() {
        let status = false;
        let message = "";
        let data = this.gridData.keepOriginalData;

        for (let account of data) {
            if (account['ticker'] === appConfig.CASH && account['roundOptValue'] < 0) {
                status = true;
                message = `${account['accountId']} cash is negative`;
                break;
            }
        }

        return {
            isNegative: status,
            message: message
        };
    }

    /**
     * This method called by workspace report component when clicked on project
     * Updates scope dropdown with selected project accounts and calls trade summary calculations for the new project
     * @param options
     */
    refreshAccountsDropdown(options) {
        this.accountsDropdown = options;
        if (this.portfolio.isHouseHold) {
            this.selectedAccount = "HOUSEHOLD";
        } else {
            this.selectedAccount = options[0]['accountId'];
        }

        this.tradeSummaryDropdown.source(this.accountsDropdown);
        this.tradeSummaryDropdown.selectedIndex(
            this.accountsDropdown.findIndex((item) => item.accountId === this.selectedAccount));
    }

    clearTradeSummary() {
        this.tradeGrid.clear();
        this.currentTradeSummary = new TradeSummary;
        this.actualShareLotReport = [];
        this.shareLotChangeData = [];
        this.cashTrades = [];
        this.accountRestrictions = [];
        this.tradeCalculations.sharesData = [];
    }

    changeTradeSummary(event) {
        UILoader.blockUI.start("Updating scope...");

        // setTimeout because jqxgrid hang the layout
        setTimeout(() => {
            let data = this.gridData.keepOriginalData;
            this.selectedAccount = event.args.item.value;
            this.tradeCalculations.selectedAccount = this.selectedAccount;

            this.update(data);

            UILoader.blockUI.stop();
        });
    }


    showHideColumns(event) {
        event = event.args.item;
        if (event == null) return;

        UILoader.blockUI.start("Updating grid...");
        // Using setTimeout because JqxGrid blocks the frame on showcolumn(), hidecolumn().
        setTimeout(() => {
            this.tradeGrid.beginupdate(); // performance improvement for showcolumn/hidecolumn

            if (event.value === "showHiddenColumns") {
                if (event.checked) {
                    this.selectShowColumnCheckbox({showAll: true});
                } else {
                    this.setGridColumns();
                    this.selectShowColumnCheckbox({hideAll: true});
                }
                this.showColumnDropdown.close();
            } else if (!event.checked) {
                this.tradeGrid.hidecolumn(event.value);

                const selectedItem = this.showColumnDropdown.getCheckedItems().length;
                if (selectedItem == this.dropdownData.length - 1) {
                    this.showColumnDropdown.uncheckItem("showHiddenColumns");
                }
            } else if (event.checked) {
                this.tradeGrid.showcolumn(event.value);

                const selectedItem = this.showColumnDropdown.getCheckedItems().length;
                if (selectedItem == this.dropdownData.length - 1) {
                    this.showColumnDropdown.checkItem("showHiddenColumns");
                }
            }

            this.tradeGrid.endupdate();
            UILoader.blockUI.stop();
            this.saveGridState();
            this.tradeGrid.groups(this.groupBy);
        }, 100); // 100ms for UX
    }

    selectTradeFileFormat(event) {
        this.tradeFileFormatName = event.args.item.value;
    }

    setCustodian(custodianName: string) {
        this.custodianName = custodianName;
    }

    private setSelectedTradeFileFormatIndex(custodianName) {
        // Reset to first file format
        this.tradeFileFormatName = this.tradeFileFormatList[0].value;
        this.tradeFileFormatDropDown.selectedIndex(0);

        if (custodianName) {
            const index = this.tradeFileFormatList.findIndex(tradeFileFormat => {
                return tradeFileFormat.code.toUpperCase() === custodianName.toUpperCase();
            });

            if (index !== -1) {
                this.tradeFileFormatDropDown.selectedIndex(index);
            }
        }
    }

    approveTrades() {
        UILoader.blockUI.start('Approving Trades...'); // Start blocking
        this.workspaceService
        .approveTrades({"portfolioId": this.portfolio.portfolioId})
        .subscribe(
            result => {
                if (result.code == 200) {
                    this.resetGridMetaData();
                    this.setTradeApproved(true);
                    this.tradeExportErrorMessage = "Trades approved by " + this.localStorage.get(
                        "userFirstName") + " on " + this.datePipe.transform(Date(), AppConfig.DATETIME_FORMAT);
                } else {
                    this.tradeExportErrorMessage = result.message;
                }
                UILoader.blockUI.stop();
                this.ref.detectChanges();
            },
            err => {
                console.log(err);
                UILoader.blockUI.stop();
            }
        );
    }

    chooseTradeFileFormatModal() {
        this.tradeExportModalErrorMessage = "";
        this.setSelectedTradeFileFormatIndex(this.custodianName);
        this.tradeFileFormatModalComponent.open('tradeFileFormatModalComponent');
    }

    exportTrades() {
        if (this.tradeFileFormatName != undefined) {
            let format = parseInt(this.tradeFileFormatName);

            return this.getTradeFile(format);

        } else {
            this.tradeExportModalErrorMessage = "Please choose trade file format";
        }

    }

    exportToExcel(){
        let selectedAccountNumber = '';
        try{
            if(this.portfolio.isHouseHold){
                selectedAccountNumber = this.portfolio.portfolioName; //this.portfolio.accountNumber;
            }else{
                selectedAccountNumber = this.portfolio.accounts[0].accountNumber; //this.portfolio.accountNumber;
            }
        }
        catch(e){
            console.error(`unable to fetch 'Account Number' for the selected account`)
        }

        this.replaceColumnText('<br>', '  '); // remove <br> tag from report header
        this.tradeGrid.exportdata('csv', `RecommendedTrades_${selectedAccountNumber}`,true,null,false);
        this.replaceColumnText('  ', '<br>'); // add <br> tag to report header
    }

    private replaceColumnText(searchValue: string, replaceValue: string){
        this.tradeGrid.attrColumns.forEach(column=>{
            column.text = column.text.replace(searchValue,replaceValue)
        });
        this.tradeGrid.updatebounddata();
    }

    pushOnToms() {
        UILoader.blockUI.start('Pushing trades on OMS...'); // Start blocking
        this.workspaceService
        .pushTrades(this.portfolio.portfolioId, this.workspaceName)
        .subscribe(
            response => {
                $('#resetButton').css('visibility', 'hidden');
                if (response.code == 200) {
                    this.tradeExportErrorMessage = "Trades have been sent to OMS by " + this.localStorage.get(
                        "userFirstName") + " on " + this.datePipe.transform(Date(), 'MMMM dd, yyyy hh:mm a');
                } else {
                    this.tradeExportErrorMessage = response.message;
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

    getTradeFile(format) {
      //AF20200327-[RBL-2559]:
      // For Pershings format only
      // Checking if mutualFund trades exist in trade-override report. If they do, only then sending request for Mutual Funds format.
      // Not handling zero trades cases, so if only zero trades exist for mutual funds or even ETF and Stocks, empty files will still be downloaded.
      if (format === pershingETFCode) {// pershingETFCode is sent from dropdown when Pershing is selected
        let sendMFRequestFlag = false;
        let sendETFRequestFlag = true;
        if (this.source.localdata.every(value => value.securityType === 'mutualFund' ||
               value.securityType.toUpperCase() === 'OTHERS')) {
          sendMFRequestFlag = true;
          sendETFRequestFlag=false;
        }else if(this.source.localdata.some(value => value.securityType === 'mutualFund' && value.action != 'Zero Trade')) {
          sendMFRequestFlag = true;
        }
        if(sendETFRequestFlag){
          this.accountService.downloadFile('tradeExport/getTradeFile/' + this.portfolio.portfolioId + '/' + format,
            ResponseContentType.Text)
            .subscribe(data => {
                this.tradeFileFormatModalComponent.close();
              },
              error => {
                this.tradeExportModalErrorMessage = "Unable to export trade file";
                this.ref.detectChanges();
              }
            );
        }
        if(sendMFRequestFlag){
          //sending request for mutual funds file as pershing has separate file for MF
          this.getTradeFile(pershingMFCode);
        }
      } else{
        this.accountService.downloadFile('tradeExport/getTradeFile/' + this.portfolio.portfolioId + '/' + format,
          ResponseContentType.Text)
          .subscribe(data => {
              this.tradeFileFormatModalComponent.close();
            },
            error => {
              this.tradeExportModalErrorMessage = "Unable to export trade file";
              this.ref.detectChanges();
            }
          );
    }


        return false;
    }

    closeModal() {
        this.modalComponent.close();
    }

    getResetConfirmation() {
        if (this.workspaceService.isDataChanged) {
            $('#resetButton').css('visibility', 'visible');
            this.modalComponent.content = "Unsaved changes will be lost, are you sure you want to continue?";
            this.modalComponent.open();
        }
    }

    resetGridMetaData() {
        // Removing edited status
        if (this.gridData.keepOriginalData) {
            const cleanTradeReport = this.gridData.keepOriginalData.map((item) => {
                item.edited = false;
                item.warningMessage = '';
                return item;
            });

            this.update(cleanTradeReport, true, null, false);
            /** Resetting and applying filter explicitly while click "Reset" or "Save Changes" button*/
            this.resetAndApplyFilter();
        }
    }

    resetChanges(remote = true) {
        this.tradeGrid.clearselection();
        if (!remote) {
            this.resetGridMetaData();
        } else if (this.workspaceService.isDataChanged) {
            this.modalComponent.close();
            this.reloadLotData();
        }
    }

    reloadLotData() {
        UILoader.blockUI.start("Resetting trades...");

        setTimeout(() => {
            const url = "sharelot/resetSharelotReport/" + this.portfolio.portfolioId;
            this.workspaceService.get(url).subscribe(result => {
                if (result.code == 200) {
                    this.actualShareLotReport = result.responsedata;
                    this.tradeCalculations.sharesData = [];
                    let tradeReportData = [];
                    for (let row of result.responsedata) {
                        tradeReportData.push($.extend({}, row));
                    }

                    this.gridData.editedRowId = null;
                    this.workspaceService.isDataChanged = false;

                    this.addTradeItems(tradeReportData);

                    this.closeButtonLabel = "Cancel";

                } else {
                    this.actualShareLotReport = [];
                    this.tradeGrid.clear();
                    this.clearTradeSummary();
                }
                this.modalComponent.close();
                UILoader.blockUI.stop()
            }, (err) => {
                this.modalComponent.close();
                UILoader.blockUI.stop();
            });
        });
    }

    getAccountRestrictions(component: WorkspaceReportsComponent) {
        this.accountService.getRestrictionWithoutValidations(this.portfolio.portfolioId).subscribe((result) => {
            if (result.code == 200) {
                for (let account of this.portfolio.accounts) {
                    if (result.responsedata[account.id] != undefined)
                        this.accountRestrictions[account.id] = result.responsedata[account.id];
                }
            }
            component.onServiceLoad("PortfolioWS/getRestrictionWithoutValidations");
        });
    }

    filterGrid(event: any) {
        UILoader.blockUI.start("Filtering trades...");

        // setTimeout because jqxgrid hang the layout
        setTimeout(() => {
            const index = event.args.index;
            this.currentFilterIndex = index;

            let data = JSON.parse(JSON.stringify(this.gridData.keepOriginalData)); // deep copy
            const filteredData = this.getFilteredData(data, index);

            this.update(filteredData, false);
            this.tradeGrid.refresh();

            UILoader.blockUI.stop();
        });
    }

    getFilteredData(actualData, ruleIndex?) {
        if (ruleIndex == undefined) {
            ruleIndex = this.currentFilterIndex;
        }

        const rule = this.filterData[ruleIndex].rule;
        const [datafield, operand, value] = rule;

        let data = actualData.filter((item) => {
            return eval(`'${item[datafield]}' ${operand} '${value}'`);
        });

        // Applying scope filter
        if (this.selectedAccount != 'HOUSEHOLD') {
            data = data.filter((item) => {
                return item.accountId == this.selectedAccount;
            });
        }

        return data;
    }

    editTrades(gridData: any, dataField: any) {
        UILoader.blockUI.start("Adjusting trades...");

        setTimeout(() => {
            this.workspaceService.isDataChanged = true;

            const sharesData = this.tradeCalculations.editTrades(gridData, dataField);
            this.update(sharesData, true, 'cells');
            this.tradesErrorMessage = this.tradeCalculations.errorMessage;

            UILoader.blockUI.stop();
        });
    }

    setTradeApproved(value) {
        this.tradesApproved = value;
        this.setRTGridEditState();
    }

    private setRTGridEditState(){
        this.tradeGrid.setcolumnproperty('roundTradeShares', 'editable', !this.tradesApproved);
        this.tradeGrid.setcolumnproperty('roundTradeValue', 'editable', !this.tradesApproved);
    }

    groupByGrid(event: any) {
        UILoader.blockUI.start("Grouping trades...");

        // setTimeout because jqxgrid hang the layout
        setTimeout(() => {
            const datafields = event.args.item.value;
            this.groupBy = [];
            if (datafields.length > 0) {
                this.groupBy = datafields;
            }
            this.tradeGrid.groups(this.groupBy);

            UILoader.blockUI.stop();
        });
    }

    tradeOverrideColumnReordered(event: any) {
        this.saveGridState();
    }

    saveGridState() {
        if (this.stateUpdate == true) return;

        const gridState = this.tradeGrid.getstate();
        let gridStateString = JSON.stringify(gridState);

        this.userService.saveUserReportLayout(REPORT_NAME, gridStateString).subscribe((response) => {

        });

        this.tradeGrid.editable(!this.tradesApproved);
    }


    loadGridState() {
        this.stateUpdate = true; // this variable is used as lock to stop recurring update caused by onColumnreordered event
        //this.tradeGrid.loadstate(this.gridState); // this is not working on initial loading
        this.applyGridState(this.gridState);
        this.stateUpdate = false;

        this.initShowHideDropdownData();
        this.selectShowColumnCheckbox({showSelected: true});
    }

    setGridState() {
        this.userService.getUserReportLayout(REPORT_NAME).subscribe((response) => {
            if (response.code == 200 && !response.responsedata) {
                this.showDefaultColumns(true);
            } else if (response.code == 200 && response.responsedata) {
                this.gridState = JSON.parse(response.responsedata);
                this.loadGridState();
                this.showDefaultColumns();
            }
        });
        this.ref.detectChanges();
    }

    private showDefaultColumns(showAllDefaultColumns: boolean = false){
        this.tradeGrid.beginupdate();
        this.tradeGrid.showcolumn('ticker');
        this.tradeGrid.showcolumn('action');
        this.tradeGrid.showcolumn('roundTradeShares');
        this.tradeGrid.showcolumn('roundTradeValue');
        if(showAllDefaultColumns){
            /** show below default columns also, when Recommended Trade grid state is not saved **/
            this.tradeGrid.showcolumn('initPercent');
            this.tradeGrid.showcolumn('optPctWt');
            this.tradeGrid.showcolumn('modelTargetPct');
        }
        this.tradeGrid.endupdate();
    }

    private applyGridState(gridState) {
        // Load column ordering and hidden state only.
        const columnState = gridState.columns;
        let currentGridColumns = this.gridColumns;
        let gridColumnsOrdered = [];

        if (URebalUtil.isEmptyObject(columnState)) return;

        // Reordering columns based on saved stats
        for (let column of currentGridColumns) {
            const columnDatafield = column.datafield;
            const savedColumn = columnState[columnDatafield];
            const savedColumnIndex = (savedColumn) ? savedColumn.index : -1;

            if(savedColumnIndex >= 0){
                column.hidden = savedColumn.hidden;
                gridColumnsOrdered[savedColumnIndex] = column;
            }
        }

        this.gridColumns = gridColumnsOrdered;
        this.tradeGrid.columns(this.gridColumns);
    }

    public isHousehold(): boolean {
        return this.tradeCalculations &&
            this.tradeCalculations.portfolio &&
            this.tradeCalculations.portfolio.isHouseHold;
    }

    private formatNumber(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    private formatCurrency(num) {
        return '$' + this.formatNumber(num);
    }
}
