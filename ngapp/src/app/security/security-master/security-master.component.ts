import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {jqxGridComponent} from "../../../assets/jqwidgets-ts/angular_jqxgrid";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {URebalService} from "../../services/urebal.service";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import {SecurityMaster} from "./securitymaster";
import {GridLoadingStatus} from "../../shared/util/LazyLoadedGrid";
import {securityMasterGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {AppConfig} from "../../../app.config";


@Component({
    selector: 'app-security-master',
    templateUrl: './security-master.component.html'
})
export class SecurityMasterComponent implements OnInit, OnDestroy {

    @ViewChild('lazyGrid') jqxGrid: jqxGridComponent;

    private _subscription: Subscription = new Subscription();

    private sort: string = "securityId:asc";
    private currentRecords = [];
    private tempHeight: number = 0;
    private gridHeight: number = 0;
    private rowHeight = 32;
    private pageSize: number = 0;
    private gridfilter: boolean = false;
    private filterValue: string = "";
    private DASH_FOR_EMPTY: string = '--';
    keyUp = new Subject<string>();
    isGridLoadingStatus = new BehaviorSubject(GridLoadingStatus.INITIALIZED);

    securityMasterGridCols;
    securityMasterGridAdapter;

    constructor(public urebalService: URebalService, containerElement: ElementRef) {
        this.securityMasterGridCols = this.getSecMasterGridcolumns();
        this.securityMasterGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngOnInit(): void {

        SoftpakGridHelper.rearrangeGridColumns(this.securityMasterGridCols);

        this.keyUp.pipe(
            map(value => value),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            if (value !== "") {
                this.filterValue =
                    `securityId:like:%${value}%,securityDescription:like:%${value}%,ticker:like:%${value}%,cusip8:like:%${value}%,securityType:like:%${value}%,primaryAssetClass:like:%${value}%,size:like:%${value}%,sector:like:%${value}%,style:like:%${value}%`;
                this.jqxGrid.gotopage(0);
            } else {
                this.filterValue = "";
            }

            this.gridfilter = true;
            this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
        });

        setTimeout(() => {
            this.tempHeight = (this.gridHeight > 0) ? this.gridHeight : ($(window).height() - 314);
            this.pageSize = (this.pageSize > 0) ? this.pageSize :
                Math.floor((this.tempHeight - 2 * this.rowHeight) / this.rowHeight);
            this.jqxGrid.pagesize(this.pageSize);
            this.jqxGrid.height(this.tempHeight);
            this.jqxGrid.rowsheight(this.rowHeight);
            this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
        });

        this._subscription = this.isGridLoadingStatus.subscribe(loadStatus => {
            console.log("Grid Status: " + loadStatus);
            if (loadStatus === GridLoadingStatus.LOAD || loadStatus === GridLoadingStatus.LOADING) {
                this.jqxGrid.updatebounddata();
            }
        });
    }

    source: any = {
        datatype: 'json',
        datafields: [
            {name: 'priceDate', type: 'date', format: AppConfig.DATETIME_FORMAT}
        ],
        localdata: {},
        sortable: true,
        totalrecords: 0
    };

    //dataAdapter: any = new jqx.dataAdapter(this.source);

    renderGridRows = (params: any): any[] => {
        let data = [];
        let {pagenum, pagesize, pagescount} = this.jqxGrid.getpaginginformation();

        setTimeout(() => {
            this.jqxGrid.showemptyrow(false);
            this.jqxGrid.showloadelement();
        });

        /**
         * if DASH_FOR_EMPTY string is only set to "--" then while pagination and filtering "--" will be appear in grid
         * DASH_FOR_EMPTY string property is set to "--" while returning data and while requesting data is set to empty string
         */
        if (this.isGridLoadingStatus.getValue() == GridLoadingStatus.LOAD) {
            this.DASH_FOR_EMPTY = "";
            this.loadDataForVirtualPromise(params.startindex, pagesize, this.sort, this.filterValue).then(res => {
                this.currentRecords = res;
                this.gridfilter = false;
                this.isGridLoadingStatus.next(GridLoadingStatus.LOADING);
            });
        } else if (this.isGridLoadingStatus.getValue() == GridLoadingStatus.LOADING) {
            data = this.currentRecords;
            this.DASH_FOR_EMPTY = "--";
            setTimeout(() => {
                this.jqxGrid.showemptyrow(true);
                this.jqxGrid.hideloadelement();
            });

            this.isGridLoadingStatus.next(GridLoadingStatus.DONE);
        }

        return data;
    };

    gridOnSort(event: any): void {
        let sortinformation = event.args.sortinformation;
        let sortdirection = sortinformation.sortdirection.ascending ? 'asc' : 'desc';
        if (!sortinformation.sortdirection.ascending && !sortinformation.sortdirection.descending) {
            sortdirection = 'null';
            this.sort = "";
        } else {
            this.sort = `${sortinformation.sortcolumn}:${sortdirection}`;
        }

        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    };

    emptyStringCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        let cellValue = value;

        if (cellValue === "") {
            cellValue = this.DASH_FOR_EMPTY;
        }

        return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${cellValue}</div>`;
    };

    dollarCellsRenderer = (row: number, columnfield: string, value: string, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string, if value is empty string then return --
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
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

    dateCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
        //Handling for empty string that cause "Invalid Date" exception if empty string passes into Date().
        if (value === "") {
            return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
        }

        let date = new Date(value);
        const formattedDate = jqx.dataFormat.formatdate(date, AppConfig.DATETIME_FORMAT);
        return `<div title="${formattedDate}" style="overflow: hidden; height: 100%; padding-top: 10px;  padding-right: 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ${columnproperties.cellsalign}">${formattedDate}</div>`;
    };

    primaryAssetClassItems = ['Equity', 'Fixed Income', 'Other'];
    typeItems = ['Equity', 'Mutual Fund', 'Others'];

    private getSecMasterGridcolumns(){
        let data = [
            {
                text: "Security ID",
                cellsalign: "left",
                align: "center",
                datafield: "securityId",
                filtertype: 'input',
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Security Name",
                cellsalign: "left",
                align: "center",
                datafield: "securityDescription",
                width: '18%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Ticker",
                align: "center",
                cellsalign: "left",
                datafield: "ticker",
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Price (USD)",
                align: "center",
                cellsalign: "right",
                datafield: "price",
                cellsformat: "d2",
                width: '8%',
                cellsrenderer: this.dollarCellsRenderer
            },
            {
                text: "CUSIP",
                align: "center",
                cellsalign: "left",
                datafield: "cusip8",
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Primary Asset Class",
                align: "center",
                cellsalign: "left",
                datafield: "primaryAssetClass",
                filtertype: 'checkedlist',
                filteritems: this.primaryAssetClassItems,
                width: '10%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Type",
                align: "center",
                cellsalign: "left",
                datafield: "securityType",
                width: '8%',
                filtertype: 'list',
                filteritems: this.typeItems,
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Sector",
                align: "center",
                cellsalign: "left",
                datafield: "sector",
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Size",
                align: "center",
                cellsalign: "left",
                datafield: "size",
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Style",
                align: "center",
                cellsalign: "left",
                datafield: "style",
                width: '8%',
                cellsrenderer: this.emptyStringCellsRenderer
            },
            {
                text: "Price Updated On",
                cellsalign: "center",
                align: "center",
                datafield: "priceDate",
                filtertype: 'range',
                width: '8%',
                cellsrenderer: this.dateCellsRenderer,
                enabletooltips: false
            }
        ];

        SoftpakGridHelper.mergeGridColumnProperties(data, securityMasterGridColsMeta);

        return data;
    }

    loadDataForVirtualPromise = async (offset, limit, sort?, filter_value?) => {
        let response = await this.urebalService.get(
            `securitymaster/?offset=${offset}&limit=${limit}&sort=${sort}&filter=${encodeURIComponent(filter_value)}`)
        .toPromise();
        let {code, responsedata} = await response;
        let securityMasterList: SecurityMaster[];

        if (code == 200) {
            securityMasterList = responsedata.items;
        } else {
            //jqxGrid.clear method is used to set 0-0 of 1 at page footer otherwise show 1-1 of 1
            securityMasterList = [];
            setTimeout(() => {
                this.jqxGrid.clear()
            });
        }

        this.source.totalrecords = responsedata.total_records;
        return await securityMasterList;
    };

    refreshGrid() {
        this.sort = "securityId:asc";
        this.filterValue = "";
        this.gridfilter = false;
        $('#textSearch').val("");
        this.jqxGrid.clearfilters()
        setTimeout(() => {
            this.jqxGrid.clear()
        });
        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    }

    updateFilterConditions = (type: string, defaultconditions: any): string[] => {
        let stringcomparisonoperators = ['CONTAINS', 'DOES_NOT_CONTAIN'];
        let numericcomparisonoperators = ['LESS_THAN', 'GREATER_THAN'];
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

    onFilter(): void {
        let filterinfo = this.jqxGrid.getfilterinformation();
        let appliedFilters: string = "";

        for (let i = 0; i < filterinfo.length; i += 1) {
            //filterinfo[i].filtercolumntext
            let {filtercolumntext, datafield, filter} = filterinfo[i];
            let filterValue: string = "";
            console.log(filter);
            console.log(filter.getfilters(), filter.getfilters().length);
            console.log(filtercolumntext, datafield, filter.getfilters()[0].value);
            if (filter.getfilters().length > 1) {
                for (let f = 0; f < filter.getfilters().length; f++) {
                    filterValue = `${filter.getfilters()[f].value}`;
                    appliedFilters += `${datafield}:like:%${filterValue}%,`;
                }
            } else {
                filterValue = filter.getfilters()[0].value;
                appliedFilters += `${datafield}:like:%${filterValue}%,`;
            }
        }

        console.log(appliedFilters.replace(/,\s*$/, ""));
        this.filterValue = appliedFilters.replace(/,\s*$/, "");
        this.gridfilter = true;
        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    }

    pageChanged(event: any) {
        if (this.filterValue !== "" && event.args['pagenum'] != 0)
            this.jqxGrid.clearselection();

        this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    }

    ngOnDestroy(): void {
        this.currentRecords = null;
        this.keyUp.complete();
        this.jqxGrid.destroy();
        this._subscription.unsubscribe();
        //console.log('Destroyed called ...');
    }
}
