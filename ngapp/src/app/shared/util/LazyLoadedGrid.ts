import {jqxGridComponent} from "../../../assets/jqwidgets-ts/angular_jqxgrid";
import {ViewChild} from "@angular/core";
import {URebalService} from "../../services/urebal.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {AppConfig} from "../../../app.config";
import {UILoader} from "./UILoader";

export enum GridLoadingStatus {
    INITIALIZED, LOAD, LOADING, DONE
}

export class LazyLoadedGrid<T> extends UrebalPermissions {
    @ViewChild("lazyLoadedGrid", {static: true}) jqxGrid: jqxGridComponent;
    startIndex: number = -1;
    endIndex: number = -1;
    sort: string = "";
    tempHeight: number = 0;
    rowHeight = 30;
    pageSize: number = 0;
    gridfilter: boolean = false;
    filterValue: string = "";
    orFilterFields: string[] = [];
    DASH_FOR_EMPTY: string = '--';
    menuState: string = 'out';

    currentRecords = [];
    selectedRows: any = [];
    tempSelectedRows: any = [];
    isGridLoadingStatus = new BehaviorSubject(GridLoadingStatus.INITIALIZED);

    keyColumn: string = '';
    gridKeyColumn: string = '';


    constructor(permissionResolverService: PermissionResolverService, protected router: Router = null, protected urebalService: URebalService = null) {
        super(permissionResolverService);

        if (router != null) {
            $("body")
            .off("click", "a[u-rebel-link-navigator]")
            .on("click", "a[u-rebel-link-navigator]", (event) => {
                event.preventDefault();
                const internalRoute = event.target.getAttribute("href");
                this.router.navigate([internalRoute]);
            });
        }
    }

    source: any = {
        datatype: 'json',
        datafields: [],
        localdata: {},
        sortable: true,
        totalrecords: 0
    };

    dataAdapter: any = new jqx.dataAdapter(this.source);

    accountTypeRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
        /*If we dont return "" string then single.png will be shown while navigating*/
        if (value === "") {
            return "";
        }

        if (value) {
            return `<div style='width: 100%; height: 100%;' title='Household'><img class='account-list-icon' src='${this.urebalService.getAppContext()}/assets/images/household.png'></div>`;
        } else {
            return `<div style='width: 100%; height: 100%;' title='Account'><img class='account-list-icon' src='${this.urebalService.getAppContext()}/assets/images/single.png'></div>`;
        }
    };

    linkCellsRenderer = (row: number, columnfield: string, value: string, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        let cellValue = value;

        if (cellValue === "") {
            cellValue = this.DASH_FOR_EMPTY;
        }

        let {portfolioId, isHouseHold} = rowdata;

        return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">

    <a u-rebel-link-navigator href='secure/accounts/${encodeURIComponent(portfolioId)}/${isHouseHold}'>${cellValue}</a>
            </div>`;
    };

    emptyStringCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        let cellValue = value;

        if (cellValue === "") {
            cellValue = this.DASH_FOR_EMPTY;
        }

        return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${cellValue}</div>`;
    };

    dollarCellsRenderer = (row: number, columnfield: string, value: string, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string, if value is empty string then return --
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${this.DASH_FOR_EMPTY}</div>`;
            //return this.DASH_FOR_EMPTY;;
        }

        let dollarValue;
        if (parseFloat(value) < 0) {
            let val = Math.abs(parseFloat(value));
            dollarValue = `(${jqx.dataFormat.formatnumber(val, 'd2')})`;
        } else {
            dollarValue = jqx.dataFormat.formatnumber(value, 'd2') || value;
        }

        return `<div class="jqx-grid-cell-right-align" style="margin-top: 6.5px; text-align: ${columnproperties.cellsalign}">${dollarValue}</div>`;
    };

    percentCellsRenderer = (row: number, columnfield: string, value: string, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string, if value is empty string then return --
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${this.DASH_FOR_EMPTY}</div>`;
            //return this.DASH_FOR_EMPTY;;
        }

        let percentValue;
        if (parseFloat(value) < 0) {
            let val = Math.abs(parseFloat(value));
            percentValue = `(${jqx.dataFormat.formatnumber(val, 'd2')})`;
        } else {
            percentValue = jqx.dataFormat.formatnumber(value, 'd2') || value;
        }

        return `<div class="jqx-grid-cell-right-align" style="margin-top: 6.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${percentValue}</div>`;
    };

    dateCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string that cause "Invalid Date" exception if empty string passes into Date().
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
        }

        let date = new Date(value);
        return `<div style="overflow: hidden; margin-top: 10px;  padding-right: 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ${columnproperties.cellsalign}">${jqx.dataFormat.formatdate(
            date, 'MMM dd, yyyy')}</div>`;
    };

    dateTimeCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string that cause "Invalid Date" exception if empty string passes into Date().
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
        }

        let date = new Date(value);
        let fomattedDate = jqx.dataFormat.formatdate(date, AppConfig.DATETIME_FORMAT);
        return `<div title="${fomattedDate}" style="overflow: hidden; height: 100%; padding-top: 10px;  padding-right: 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ${columnproperties.cellsalign}">${fomattedDate}</div>`;
    };

    loadDataForVirtualPromise = async (service: URebalService, url, offset, limit, sort?, filter_value?, orFilterFields?: string[]) => {
        let _orfilterfields: string = '';
        if (orFilterFields) {
            orFilterFields.forEach(f => {
                _orfilterfields += '&orfilterfields=' + f;
            })
        }

        if (this.sort === "") {
            this.sort = "accountNumber:asc"
        }

        let response = await service.get(
            `${url}?offset=${offset}&limit=${limit}&sort=${this.sort}&filter=${encodeURIComponent(
                filter_value)}${_orfilterfields}`).toPromise();
        let {code, responsedata} = await response;
        let list: T[];

        if (code == 200) {
            list = responsedata.items;
        } else {
            //jqxGrid.clear method is used to set 0-0 of 1 at page footer otherwise shows 1-1 of 1
            list = [];
            setTimeout(() => {
                this.jqxGrid.clear()
            });
        }

        this.source.totalrecords = responsedata.total_records;
        return await list;
    };

    refreshGrid(updatebounddata: boolean = true) {
        this.startIndex = -1;
        this.endIndex = -1;
        this.sort = "";
        this.filterValue = "";
        this.gridfilter = false;
        $('#textSearch').val("");
        this.selectedRows = [];
        setTimeout(() => {
            this.jqxGrid.clearfilters();
            this.jqxGrid.clearselection();
            this.jqxGrid.clear();
            this.jqxGrid.gotopage(1);
            if (updatebounddata) {
                this.jqxGrid.updatebounddata();
            }

            UILoader.stop();
        });
    }

    disableSelectAll(gridId: string) {
        $("#" + gridId).find('.jqx-grid-column-header:first').children().hide();
    }


    rowSelectGrid(event: any): void {
        let args = event.args;
        let rowIndex = args.rowindex;

        if (rowIndex.length == undefined) { // single row selection
            let dataRow = args.row;
            if (dataRow != undefined)
                this.addRow(dataRow);
            /*console.log('rowSelectGrid: Single row selection called');*/

        } else if (rowIndex.length > 0) { // all row selection/unselection
            this.jqxGrid.clearselection();
            this.getCurrentPageRows().forEach(row => this.addRowSelection(row));
            /*console.log('rowSelectGrid: All rows selected called');*/

        } else if (rowIndex.length == 0) { // all row selection (empty grid)
            let rows = this.getCurrentPageRows();
            let rowsExist: boolean = rows.some(row => this.getRowState(row).rowExists);
            rows.forEach(row => rowsExist ? this.removeRow(row) : this.addRowSelection(row));
            /*console.log('rowSelectGrid: all row selection (empty grid) called');*/
        }

        /*console.log(this.selectedRows);*/

        this.renderGridHeaderCheckBox();
    }

    /** This will only call when row is unselected,
     *  To unselect all rowSelectGrid method will call with rowIndex.length zero
     */
    rowUnSelectGrid(event: any): void {
        let dataRow = event.args.row;
        if (dataRow)
            this.removeRow(dataRow);

        this.renderGridHeaderCheckBox();
    }

    /**
     *
     * @param event
     */

    /*pageChanged(event:any){
      this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    }*/

    /**
     *
     * @param newRow
     * @param selectedRows
     */
    checkSeletedItem(newRow, selectedRows): boolean {
        let exists = true;
        if (typeof newRow !== "undefined" && typeof selectedRows !== "undefined") {
            for (let i = 0; i < selectedRows.length; i++) {
                if (newRow[this.keyColumn] === selectedRows[i][this.keyColumn]) {
                    exists = false;
                    break;
                }
            }
        }

        return exists;
    }

    /**
     *
     * @param x
     * @param y
     */
    getCellAtPosition(x, y) {
        return this.jqxGrid.getcellatposition(x, y);
    }

    cellValue(rowIndex, dataField) {
        return this.jqxGrid.getcellvalue(rowIndex, dataField);
    }

    /**
     * sliding panel
     */
    openSidePanel(event?) {
        this.menuState = 'in';

        $('.slidingPanel .slidingPanelHeader h3').text("Selected Account(s)");
    }

    resetRowsSelection() {
        this.selectedRows = [];
    }

    showSelectedRow() {
        this.getCurrentPageRows().forEach(row => {
            if (this.getRowState(row).rowExists)
                this.jqxGrid.selectedrowindex(row.boundindex);
        });
        this.renderGridHeaderCheckBox();
    }

    onGridSort($event) {
        this.showSelectedRow();
    }

    private getCurrentPageRows(): any[] {
        let rows = Object.assign([], this.jqxGrid.getboundrows());

        if (this.gridKeyColumn) {
            let uniqueColumnIndex = Object.keys(this.jqxGrid.getstate().columns)
            .findIndex(item => item.toLowerCase() === this.gridKeyColumn.toLowerCase());
            let currentPageUniqueColumnValues = Array.from($(this.jqxGrid.elementRef.nativeElement)
            .find("div[role='row']"))
            .map(row => $(row).find(`div[columnindex='${uniqueColumnIndex}']`).text());

            let currentPageSelectedRows: any[] = [];

            rows.forEach(row => {
                if (currentPageUniqueColumnValues.some(r => r === row[this.gridKeyColumn])) {
                    currentPageSelectedRows.push(row);
                }
            });

            /*console.log(currentPageSelectedRows);*/
            return Object.assign([], currentPageSelectedRows);
        } else {
            let pageInfo = this.jqxGrid.getpaginginformation();
            let startingIndex: number = Number(pageInfo.pagenum) * Number(pageInfo.pagesize);

            if (rows) { // filter out rows from the array
                rows = rows.splice(startingIndex, Number(pageInfo.pagesize));
                rows = Object.assign([], rows.filter(r => r[this.keyColumn] != ""));
            }
            return Object.assign([], rows);
        }
    }

    private renderGridHeaderCheckBox() {
        setTimeout(() => {
            const selectionState: RowsSelectionState = this.getRowsSelectionState();
            const rowSelectionClasses = ['checked', 'indeterminate', '0'];
            let className = rowSelectionClasses[selectionState];
            let chk = $(this.jqxGrid.elementRef.nativeElement)
            .find('.jqx-grid-header-blueleaf .jqx-grid-column-header-blueleaf:first span');
            if (chk && chk.length > 0) {
                $(chk).removeAttr('class');
                $(chk).addClass(`jqx-checkbox-check-${className} jqx-checkbox-check-${className}-blueleaf`);
            }
        }, 50);
    }

    private getRowsSelectionState(): RowsSelectionState {
        let currentPageRows = $(this.jqxGrid.elementRef.nativeElement)
        .find("div[role='row'] div[class*='jqx-checkbox-default']");
        let checkedRows = $(currentPageRows)
        .find("span[class*='jqx-checkbox-check-checked-blueleaf']");

        return (currentPageRows.length > 0 && currentPageRows.length === checkedRows.length) ?
            RowsSelectionState.FullSelection :
            (checkedRows.length > 0) ? RowsSelectionState.PartialSelection : RowsSelectionState.NoSelection;
    }

    private addRow(row) {
        if (!this.getRowState(row).rowExists) {
            this.selectedRows.push(row);
        }
    }

    private removeRow(row) {
        let rowState: RowState = this.getRowState(row);
        if (rowState.rowExists) {
            this.selectedRows.splice(rowState.rowIndex, 1);
        }
    }

    private addRowSelection(row) {
        this.jqxGrid.selectedrowindex(row.boundindex);
        this.addRow(row);
    }

    private getRowState(row): RowState {
        let rowState: RowState;
        let index = this.selectedRows.findIndex((item) => item[this.keyColumn] === row[this.keyColumn]);
        rowState = {rowExists: (index >= 0), rowIndex: index};
        return rowState;
    }

}

export interface RowState {
    rowExists: boolean;
    rowIndex: number
}

export enum RowsSelectionState {
    FullSelection = 0,
    PartialSelection = 1,
    NoSelection = 2
}
