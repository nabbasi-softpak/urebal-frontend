import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
    AfterViewInit,
    AfterContentChecked
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'
import {BehaviorSubject} from 'rxjs';
import {FilterGridData} from '../../../shared/util/FilterGridData';
import {GridUtils} from '../../../shared/util/GridUtils';
import {GridLinkInfo} from '../../../shared/classes/GridLinkInfo.class';
import {jqxGridComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxgrid';
import {UrebalPermissions} from '../../../services/permission-resolver.service';
import {URebalService} from '../../../services/urebal.service';
import {SoftpakGridHelper} from "../../jqwidgets/jqx-grid/softpak-grid.helper";

@Component({
    selector: 'urebal-grid',
    templateUrl: 'urebal-grid.component.html'
})

export class UrebalGridComponent implements OnInit, AfterViewInit, AfterContentChecked {

    private gridHeight = $(window).height() - 190;
    private rowHeight = 32;
    @Input() height: number;
    @Input() showEmptyRow: boolean;
    @Input() gridId: string;
    @Input() panelTitle: string;
    @Input() dataUrl: string;
    @Input() debug: boolean = false;
    @Input() tooltip: boolean = true;
    @Input() dataColumns: any;
    @Input() gridColumns: any;
    @Input() rowscount: string;    //JQWidget defined as string
    @Input() columnReorder: boolean = false;
    @Input() columnResize: boolean = false;
    @Input() pageable: boolean = true;
    @Input() autoHeight: boolean = false;
    @Input() editable: boolean = false;
    @Input() dataType: string = "json";
    @Input() pageSize: number = Math.floor((this.height - 1 * this.rowHeight) / this.rowHeight);
    @Input() pageSizeOptions: string[] = ['5', '15', '25', '50', '75', '100'];
    @Input() sortColumn: string;
    @Input() sortDirection: string;
    @Input() rowRendererColumns: any;
    @Input() root: string = '';
    @Input() record: string = '';
    @Input() recordId: string = '';
    @Input() linkRendererParams: any;
    @Input() negativeValueColumns: any;
    @Input() linkRendererPermissions: any;
    @Input() displayHeader: boolean = true;
    @Input() selectionMode: string;
    @Input() data: any;
    @Input() filterRow: boolean = false;
    @Input() actionItems: any;
    @Input() actionItemsPermissions: any;
    @Input() panelAdditionalLabel: string;
    @Input() customTooltipParam: any;
    @Input() actionButton: actionButtonClass;
    @Input() filters: gridFilter[];
    @Input() columnsheight: number = 35;
    @Output() notify = new EventEmitter();
    @Output() myVal = new EventEmitter();
    @Output() selectedRow = new EventEmitter();
    @Output() unSelectedRow = new EventEmitter();
    @Output() onLinkClick = new EventEmitter();
    @Output() onCellEdit = new EventEmitter();
    @Output() onBindingComplete = new EventEmitter();
    @Output() onPageChanged = new EventEmitter();
    @Output() onSort = new EventEmitter();
    @Output() onCellHover = new EventEmitter();
    @Input() rowdetails: boolean = false;
    @Input() rowdetailstemplate: any;
    @Input() initrowdetails: any;
    private filterGroups = {};
    private filterButtonClass = 'slds-filter--selected';
    @Input() customContentClass: string = '';

    @Output() callFunc$ = new EventEmitter<boolean>();
    message: BehaviorSubject<any> = new BehaviorSubject('loading :(');

    @ViewChild('gridReference', {static: true}) jqxGrid: jqxGridComponent;

    private datainformation: any;
    private pagingInfo = {pagenum: 5, pagesize: 10, pagescount: 0};
    private dataColumnsInJson: any[];
    private keepOriginalData: any[];
    public txtSearch: string;
    public serviceErrorMessage: string;
    private tempHeight: number;
    private _activeFilter: string;
    private _activeFilterValue: string;

    constructor(public urebalService: URebalService, private domSanitizer: DomSanitizer, private urebalPermissions: UrebalPermissions) {
        this.callFunc$ = new EventEmitter();
        window.onresize = (e) => {
        };
    }

    fireClickEvent(event: GridLinkInfo): void {
        this.onLinkClick.emit(event);
        $('.gridActionDropdown').remove(); // 26-07-2018 Defect#103. Remove open dropdown menu

    }

    ngOnInit(): void {

        if (this.debug == true) {
            console.log('ngOnInit->Panel Title: ' + this.panelTitle);
            console.log('ngOnInit->dataUrl: ' + this.dataUrl);
            console.log('ngOnInit->columnResize: ' + this.columnResize);
            console.log('ngOnInit->columnReorder: ' + this.columnReorder);
            console.log('ngOnInit->sortColumn: ' + this.sortColumn);
            console.log('ngOnInit->sortDirection: ' + this.sortDirection);
            console.log('ngOnInit->pageable: ' + this.pageable);
            console.log('ngOnInit->pageSize: ' + this.pageSize);
            console.log('ngOnInit->pageSizeOptions: ' + this.pageSizeOptions);
            console.log('ngOnInit->keepOriginalData: ' + this.keepOriginalData);
            console.log('ngOnInit->displayHeader: ' + this.displayHeader);
            console.log('ngOnInit->panelAdditionalLabel: ' + this.panelAdditionalLabel);
        }
        if (this.dataColumns !== undefined) {
            let columns = typeof this.dataColumns == "string" ? JSON.parse(this.dataColumns) : this.dataColumns;
            this.dataColumnsInJson = columns;
        } else {
            console.log('ngOnInit->dataColumns are not defined');
        }

        if (this.gridColumns !== undefined) {
            let columns = typeof this.gridColumns == "string" ? JSON.parse(this.gridColumns) : this.gridColumns;
            let gridUtil: GridUtils;
            gridUtil = new GridUtils(this, this.urebalPermissions, this.debug);
            gridUtil.gridId = this.gridId;
            gridUtil.sanitizer = this.domSanitizer;
            gridUtil.jqxFormatter = jqx.dataFormat;

            if (this.rowRendererColumns !== undefined) {
                this.rowRendererColumns = typeof this.rowRendererColumns == "string" ? JSON.parse(this.rowRendererColumns) : this.rowRendererColumns;
                gridUtil.rowRendererColumns = this.rowRendererColumns;
            }

            if (this.negativeValueColumns !== undefined) {
                this.negativeValueColumns = JSON.parse(this.negativeValueColumns);
                gridUtil.negativeValueColumns = this.negativeValueColumns;
            }

            if (this.customTooltipParam !== undefined) {
                this.customTooltipParam = JSON.parse(this.customTooltipParam);
                gridUtil.customTooltipParam = this.customTooltipParam;
            }

            if (this.linkRendererParams !== undefined) {
                gridUtil.linkRendererParams = this.linkRendererParams;
                let linkColumnCount: number = 0;

                for (let c of columns) {
                    if (c.cellsrenderer != undefined) {
                        if (c.cellsrenderer === "linkRenderer") {
                            linkColumnCount++;
                            c.cellsrenderer = gridUtil.linkRenderer;
                        }
                    }
                }
                gridUtil.linkColumnsCount = linkColumnCount;
            }

            if (this.linkRendererPermissions !== undefined) {
                gridUtil.linkRendererPermissions = this.linkRendererPermissions;
            }

            if (this.actionItems !== undefined) {
                gridUtil.actionItems = this.actionItems;
                let actionItemsCount: number = 0;

                for (let c of columns) {
                    if (c.createwidget != undefined) {
                        if (c.createwidget === "createWidget") {
                            actionItemsCount++;
                            c.createwidget = gridUtil.createWidget;
                        }
                    }
                    if (c.initwidget != undefined && c.initwidget === "initWidget") {
                        c.initwidget = gridUtil.initWidget;
                    }
                }

                gridUtil.actionItemsCount = actionItemsCount;
            }

            if (this.actionItemsPermissions !== undefined) {
                gridUtil.actionItemsPermissions = this.actionItemsPermissions;
            }


            for (let c of columns) {
                if (c.cellsrenderer != undefined) {
                    if (c.cellsrenderer === "cellsRenderer") {
                        c.cellsrenderer = gridUtil.cellsRenderer;
                    } else if (c.cellsrenderer === "actionRenderer") {
                        c.cellsrenderer = gridUtil.actionRenderer;
                    } else if (c.cellsrenderer === "imageRenderer") {
                        c.cellsrenderer = gridUtil.imageRenderer;
                    } else if (c.cellsrenderer === "typeRenderer") {
                        c.cellsrenderer = gridUtil.typeRenderer;
                    }
                }
            }

            this.gridColumns = columns;
        } else {
            console.error('ngOnInit->gridColumns are not defined');
        }

        this.source.datatype = this.dataType.toLowerCase();

        if (typeof (this.pageSizeOptions) === 'string') {
            this.pageSizeOptions = JSON.parse(this.pageSizeOptions);
        }

        if (this.dataType.toLowerCase() === "json") {
            this.source.root = "";
            this.source.record = "";
            this.source.id = "";
        } else if (this.dataType.toLowerCase() === "xml") {
            this.source.root = this.root;
            this.source.record = this.record;
            this.source.id = this.recordId;
        }


        this.source.datafields = this.dataColumnsInJson;

        if (this.selectionMode != undefined) {
            this.settings.selectionmode = this.selectionMode;
        }


        if (this.sortColumn != undefined) {
            this.source.sortcolumn = this.sortColumn;
            this.source.sortdirection = this.sortDirection == undefined ? "asc" : this.sortDirection.toLowerCase();
        }

        this.tempHeight = (this.height) ? this.height : $(window).height() - 180;

        this.settings.columns = this.gridColumns;
        this.settings.columnsreorder = this.columnReorder;
        this.settings.columnsresize = this.columnResize;
        this.settings.pageable = this.pageable;
        this.settings.pagesize = (this.pageSize) ? this.pageSize : Math.floor((this.tempHeight - 2 * this.rowHeight) / this.rowHeight);
        this.settings.pagesizeoptions = this.pageSizeOptions;
        this.settings.autoheight = this.autoHeight;
        this.settings.editable = this.editable;
        this.settings.enabletooltips = this.tooltip;
        this.settings.showfilterrow = this.filterRow;
        this.settings.filterable = this.filterRow;
        this.settings.showemptyrow = false;
        this.settings.height = this.tempHeight;
        this.settings.cellhover = this.cellHover;
        this.settings.rowdetails = this.rowdetails;
        this.settings.rowdetailstemplate = this.rowdetailstemplate;
        this.settings.initrowdetails = this.initrowdetails;
        this.filterGroups['Search'] = '';
        this.settings.columnsheight = this.columnsheight;
        this.jqxGrid.createComponent(this.settings);

        SoftpakGridHelper.rearrangeGridColumns(this.gridColumns);
    }

    onFilter(filterParam: gridFilter, value?: string) {
        this.filters.forEach(filter => {
            if (filter.id == filterParam.id) {
                if (filter.type == 'Input') {
                    if (value != undefined)
                        filterParam.paramVal = value;
                    $('#' + filter.id + '_button').addClass(this.filterButtonClass);

                } else
                    $('#' + filterParam.id).addClass(this.filterButtonClass);
            } else if (filter.type == 'Input') {
                $('#' + filter.id + '_button').removeClass(this.filterButtonClass);
            } else
                $('#' + filter.id).removeClass(this.filterButtonClass);
        });

        this.filterGroups['filterGroup'] = filterParam;
        this.searchGrid();
    }

    onFilterKeyUp(filterParam: any, event: any) {
        if (event.keyCode == 13)
            this.onFilter(filterParam);
    }

    searchGrid(): void {
        let filterData = new FilterGridData(this.dataColumnsInJson, this.keepOriginalData, this.debug);
        this.source.url = undefined;
        this.source.localdata = filterData.filter('');

        this.jqxGrid.clearfilters();
        let filterParam = this.filterGroups['filterGroup'];

        if (this.filterGroups['Search'] != undefined || this.filterGroups['Search'] != '') {
            let targetVal = this.filterGroups['Search'];
            for (let c of this.dataColumnsInJson) {
                if (c.type == 'string' || c.type == 'link') {
                    let filterGroup = new jqx.filter();
                    filterGroup.operator = 'or';

                    var filter = filterGroup.createfilter('stringfilter', targetVal, 'contains');

                    if (filterParam == undefined || filterParam.dataColumn != c.name) {
                        filterGroup.addfilter(1, filter);
                        this.jqxGrid.addfilter(c.name, filterGroup, true);
                    }
                }
            }
        }

        if (this.filterGroups['filterGroup'] != undefined) {
            filterParam = this.filterGroups['filterGroup'];
            if (filterParam.search != '*') {
                let filterGroup = new jqx.filter();
                filterGroup.operator = 'and';
                var filter;
                if (filterParam.dataType == 'number')
                    filter = filterGroup.createfilter('numericfilter', filterParam.paramVal, filterParam.condition);
                else
                    filter = filterGroup.createfilter('stringfilter', filterParam.search, filterParam.condition);
                filterGroup.addfilter(1, filter);

                this.jqxGrid.addfilter(filterParam.dataColumn, filterGroup, true);
            }

        }
        this.jqxGrid.applyfilters();
    }

    public searchInGrid(event: any): void {

        this.filterGroups['Search'] = event.target.value;
        this.searchGrid();
    }

    customCellHover(tableCell, x, y): void {

    }

    /*
     * cell hover event to get position of hovered cell
     */
    cellHover = (element, x, y): void => {
        let data = {element: element, x: x, y: y};
        this.onCellHover.emit(data);
    }

    actionClick(): void {

        if (this.actionButton)
            this.actionButton.callback();
    }

    ngAfterContentInit(): void {
        if (this.dataUrl != undefined) {
            this.showdataloading();
            this.urebalService.get(this.dataUrl)
                .subscribe(
                    data => {
                        if (data.code == 200) {
                            this.keepOriginalData = data.responsedata;
                            this.source.url = undefined;
                            this.source.localdata = this.keepOriginalData;
                            this.updateGridSource();
                        } else {
                            this.jqxGrid.showemptyrow(this.showEmptyRow);
                            this.serviceErrorMessage = data.message;
                            console.error(data.message);
                        }
                    },
                    error => console.error(error),
                    () => {
                        this.hidedataloading();
                        this.showEmptRow();
                    }
                );
        } else if (this.data != undefined) {
            this.keepOriginalData = this.data;
            this.source.url = undefined;
            this.source.localdata = this.keepOriginalData;
            this.updateGridSource();
        } else {
            this.source.localdata = [];
            this.updateGridSource();
            this.jqxGrid.showemptyrow(true);
            console.log("dataUrl property is missing  ... ")
        }
    }

    ngAfterViewInit(): void {
        /**
         ===========================================
         Description: Remove any opened action dropdown menu when onPagechanged() event fired.
         Author: Waqas K.
         Dated: 30-07-2018
         Against: Defect # 103
         ===========================================
         */
        this.jqxGrid.onPagechanged.subscribe(() => {
            $('.gridActionDropdown').remove();
        });
        /** ========== END ============== */

        if (!this.displayHeader) {
            $('#grid-header-' + this.gridId).css('display', 'none');
        }    //this.getSortingOfFirtNonImageColumn();
        if (this.filters != undefined) {
            this.filters.forEach(filter => {
                if (this._activeFilter != undefined && this._activeFilter.toLowerCase() == filter['caption'].toLowerCase()) {
                    this.onFilter(filter, this._activeFilterValue);
                    return;
                } else if (filter.default) {
                    $('#' + filter.id).addClass(this.filterButtonClass);
                }
            });
        }
    }

    /**
     * Respond after Angular checks the component's views and child views
     */
    ngAfterViewChecked(): void {
        //this.datainformation = this.jqxGrid.getdatainformation();
    }

    /**
     * Respond after Angular checks the content projected into the component.
     */
    ngAfterContentChecked(): void {
        if (this.datainformation !== undefined) {
            let sortingInformation = this.datainformation.sortinformation;
            this.rowscount = this.datainformation.rowscount;

            let pagingInformation = this.jqxGrid.getpaginginformation();
            this.pagingInfo.pagenum = (parseInt(pagingInformation.pagenum) + 1);
            this.pagingInfo.pagesize = pagingInformation.pagesize;
            this.pagingInfo.pagescount = pagingInformation.pagescount;
        }

    }

    rendergridrows = (params: any): any[] => {
        let data = this.keepOriginalData;
        return data;
    }

    source: any = {
        //required in data adapter
    };

    dataAdapter: any = new jqx.dataAdapter(this.source);

    settings: jqwidgets.GridOptions = {
        showsortmenuitems: false,
        source: this.dataAdapter,
        rowsheight: this.rowHeight,
        columnsheight: 40,
        pageable: true,
        sortable: true,
        altrows: true,
        enabletooltips: this.tooltip,
        selectionmode: 'none',
        pagermode: 'simple',
        pagerbuttonscount: 10,
        theme: 'blueleaf',
        width: '100%',
        ready: function () {
        }
    };

    refreshGrid(data?: any): void {
        this.showdataloading();
        this.filterGroups['Search'] = '';

        if (this.dataUrl != undefined) {
            this.urebalService.get(this.dataUrl)
                .subscribe(
                    data => {
                        if (data.code == 200) {
                            this.keepOriginalData = data.responsedata;
                            this.source.url = undefined;
                            this.source.localdata = this.keepOriginalData;
                            this.updateGridSource();
                        } else {
                            this.jqxGrid.showemptyrow(true);
                            this.keepOriginalData = [];
                            this.source.url = undefined;
                            this.source.localdata = this.keepOriginalData;
                            this.serviceErrorMessage = data.message;
                            this.updateGridSource();
                            console.error(data.message);
                        }

                    },
                    error => console.error(error),
                    () => {
                        console.log("Data fetched successfully ...")
                        this.showEmptRow();
                    }
                );
        } else if (data != undefined) {
            this.keepOriginalData = data;
            this.source.url = undefined;
            this.source.localdata = this.keepOriginalData;
            this.updateGridSource();
        } else {
            this.source.url = undefined;
            this.source.localdata = this.keepOriginalData;
            this.updateGridSource();
        }
        this.txtSearch = '';

        if (this.jqxGrid.getfilterinformation().length > 0) {
            this.jqxGrid.clearfilters();
        }

        if (this.filters != undefined) {
            this.filters.forEach(filter => {
                if (filter.default) {
                    this.onFilter(filter);
                    return;
                }

            });
        }
    }

    updateGridSource() {
        setTimeout(() => {
            this.jqxGrid.updatebounddata();
            this.hidedataloading();
        }); // To run off the angular's timer...
    }

    sortBy(fieldname: string, direction: string): void {
        setTimeout(() => {
            this.jqxGrid.sortby(fieldname, direction);
        }, 300);
    }

    showdataloading() {
        this.jqxGrid.showloadelement();
    }

    hidedataloading() {
        this.jqxGrid.hideloadelement();
    }

    showEmptRow() {
        this.jqxGrid.showemptyrow(this.showEmptyRow);
    }

    columnHide(column) {
        this.jqxGrid.hidecolumn(column);
    }

    exportData(type, name) {
        this.jqxGrid.exportdata(type, name);
    }

    getCellAtPosition(x, y) {
        return this.jqxGrid.getcellatposition(x, y);
    }

    rowSelectGrid(event: any): void {
        //ToDo: Below component classese will get affected and needed to be fixed later (Out of scope for Blueleaf V1)
        /**
         Component class: AttributeModelReportComponent (attribute-model-report.component.ts / attribute-model-report.component.html)
         Component class: CreateHouseHoldComponent (create-household.component.ts / create-household.component.html)
         Component class: WorkspaceSummaryReportComponent (workspace-summary-report.component.ts / workspace-summary-report.component.html)
         */

        this.selectedRow.emit(event);
    }

    rowUnSelectGrid(event: any): void {
        //ToDo: Below component classese will get affected and needed to be fixed later (Out of scope for Blueleaf V1)
        /**
         Component class: AttributeModelReportComponent (attribute-model-report.component.ts / attribute-model-report.component.html)
         Component class: CreateHouseHoldComponent (create-household.component.ts / create-household.component.html)
         Component class: WorkspaceSummaryReportComponent (workspace-summary-report.component.ts / workspace-summary-report.component.html)
         */
        this.unSelectedRow.emit(event);
    }

    cellEdited(event: any): void {
        // event arguments.
        let args = event.args;
        // column data field.
        let dataField = event.args.datafield;
        // row's bound index.
        let rowBoundIndex = event.args.rowindex;
        // cell value
        let value = args.value;
        // cell old value.
        let oldvalue = args.oldvalue;
        // row's data.
        let rowData = args.row;

        let data = {
            args: args,
            currentValue: value,
            oldValue: oldvalue,
            rowData: rowData
        };

        this.onCellEdit.emit(data);
    }

    bindingComplete(event) {

        this.onBindingComplete.emit(event);

    }

    pageChanged(event){
        this.onPageChanged.emit(event);
    }

    onGridSort(event){
        this.onSort.emit(event);
    }

    checkSelectedRow(selectedRows: any): void {
        setTimeout(() => {
            for (let originalData of this.keepOriginalData) {
                for (let row of selectedRows) {
                    if (originalData == row) {
                        this.jqxGrid.selectrow(this.source.localdata.indexOf(originalData));
                    }
                }
            }
        }, 1000);
    }

    uncheckAllRow(selectedRows: any): void {

        this.onBindingComplete.subscribe(grid => {
            for (let originalData of this.keepOriginalData) {
                for (let row of selectedRows) {
                    if (originalData == row) {
                        this.jqxGrid.unselectrow(this.source.localdata.indexOf(originalData));
                    }
                }
            }
        });
    }

    rowData(index) {
        return this.jqxGrid.getrowdata(index);
    }

    cellValue(rowIndex, dataField) {
        return this.jqxGrid.getcellvalue(rowIndex, dataField);
    }

    getColumns() {
        return this.jqxGrid.columns();
    }

    setColumn(columnName: string, attributeName: string, value: any) {
        this.jqxGrid.setcolumnproperty(columnName, attributeName, value);
    }

    getRows() {
        return this.jqxGrid.getrows();
    }

    getSortingOfFirtNonImageColumn() {
        console.log("sortColumn:" + this.sortColumn + " " + this.sortDirection + " " + this.panelTitle);
        if (this.sortColumn == undefined) {
            this.onBindingComplete.subscribe(grid => {
                for (let c of this.settings.columns) {
                    let columnIndex: number = this.dataColumnsInJson.findIndex(column => column.name == c.datafield);

                    //console.log('column index:' + columnIndex);
                    if (columnIndex > -1 && this.dataColumnsInJson[columnIndex].type == 'number' ||
                        this.dataColumnsInJson[columnIndex].type == 'string' ||
                        this.dataColumnsInJson[columnIndex].type == 'link' ||
                        this.dataColumnsInJson[columnIndex].type == 'date') {
                        this.jqxGrid.sortby(c.datafield, 'asc');
                        break;
                    }
                }
            });
        } else {
            this.onBindingComplete.subscribe(grid => {
                this.jqxGrid.sortby(this.sortColumn, this.sortDirection);
            });

        }
    }

    public set activeFilter(filter: string) {
        this._activeFilter = filter;
    }

    public set activeFilterValue(value: string) {
        this._activeFilterValue = value;
    }
}

export class actionButtonClass {
    private _label: string;
    private _callback: () => any;

    constructor(label: string, callback: () => any) {
        this._label = label;
        this._callback = callback;
    }

    get label(): string {
        return this._label;
    }

    get callback(): () => any {
        return this._callback;
    }
}


export class gridFilter {
    private _dataColumn: string;
    private _dataType: string;
    private _caption: string;
    private _type: string;
    private _default: boolean;
    private _id: string;
    private _search: string;
    private _condition: string;
    private _defaultValue: string;
    private _placeHolder: string;
    private _paramVal: string;
    private _min: number;
    private _max: number;

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }

    constructor(dataColumn: string, dataType: string, caption: string, type: string, def: boolean, id: string, search: string, condition: string, defaultValue: string, placeholder: string, min: number, max: number) {
        this._dataColumn = dataColumn;
        this._dataType = dataType;
        this._caption = caption;
        this._type = type;
        this._default = def;
        this._id = id;
        this._search = search;
        this._condition = condition;
        this._defaultValue = defaultValue;
        this._placeHolder = placeholder;
        this._paramVal = '0';
        this._min = min;
        this._max = max;
    }

    get paramVal(): string {
        return this._paramVal;
    }

    set paramVal(value: string) {
        this._paramVal = value;
    }

    get dataColumn(): string {
        return this._dataColumn;
    }

    set dataColumn(value: string) {
        this._dataColumn = value;
    }

    get dataType(): string {
        return this._dataType;
    }

    set dataType(value: string) {
        this._dataType = value;
    }

    get caption(): string {
        return this._caption;
    }

    set caption(value: string) {
        this._caption = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get default(): boolean {
        return this._default;
    }

    set default(value: boolean) {
        this._default = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get search(): string {
        return this._search;
    }

    set search(value: string) {
        this._search = value;
    }

    get condition(): string {
        return this._condition;
    }

    set condition(value: string) {
        this._condition = value;
    }

    get defaultValue(): string {
        return this._defaultValue;
    }

    set defaultValue(value: string) {
        this._defaultValue = value;
    }


}


