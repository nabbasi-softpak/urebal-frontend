import {Component, OnInit, ViewChild} from '@angular/core';
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {AuditService} from "../audit.service";
import {Subject, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import {Guid} from "../../shared/util/GUID";
import {SoftpakDropdownComponent} from "../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {jqxDateTimeInputComponent} from "@jqxSource/angular_jqxdatetimeinput";
import {GridLoadingStatus, LazyLoadedGrid} from "../../shared/util/LazyLoadedGrid";
import {URebalService} from "../../services/urebal.service";
import {jqxGridComponent} from "@jqxSource/angular_jqxgrid";
import {AuditList} from "./audit-list";
import {AppConfig} from "../../../app.config";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {auditTrailGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import GridColumn = jqwidgets.GridColumn;

export const actions = ['All', 'Saved', 'Updated', 'Deleted', 'Rebalance Start/End'];

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent extends LazyLoadedGrid<any> implements OnInit {
  @ViewChild("lazyLoadedGrid", {static: true}) jqxGrid: jqxGridComponent;
  @ViewChild('auditTrailGridRef' ,{static: true} ) auditTrailGrid: SoftpakGridComponent;
  @ViewChild('actionsDropdownList') actionDropdownList:SoftpakDropdownComponent;
  @ViewChild('dateTimeInput') dateTimeInputComponent:jqxDateTimeInputComponent;

  auditTrailGridCols;
  auditTrailGridAdapter;
  keyUp = new Subject<string>();
  private _subscription: Subscription = new Subscription();
  private _subscriptionKeyUP: Subscription = new Subscription();
  orFilterFields: string[] = [];

  selectedName: string = '';
  selectedEntityName: string = '';
  selectedActionName: string = '';
  actions:any= actions;
  isRefreshData: boolean = false;

  filterConditions: string = '';
  filterConditionsList: string[] = [];
  fieldFiltersMap: any;

  tempElementIndex: number;
  private remoteFilter: boolean = false;


  constructor(permissionResolverService: PermissionResolverService,public urebalService: URebalService,
              private route: ActivatedRoute, router: Router,
              public auditService: AuditService,
              public urebalPermissions: UrebalPermissions) {
    super(permissionResolverService,router,auditService);
   this.auditTrailGridAdapter = new jqx.dataAdapter(this.source);
    this.gridInitializer();

  }

  gridInitializer(){
    this.auditTrailGridCols = this.getAuditTrailGridCols(this);
  }

  ngOnInit(): void {
    this._subscriptionKeyUP = this.keyUp.pipe(
      map(value => value),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.applyCustomFilter();
      this.gridfilter = true;
      this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    });

    setTimeout(() => {
      this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
    });

    this._subscription = this.isGridLoadingStatus.subscribe(loadStatus => {
      if (loadStatus === GridLoadingStatus.LOAD || loadStatus === GridLoadingStatus.LOADING) {
        this.jqxGrid.updatebounddata('data');
      } else if (loadStatus == GridLoadingStatus.DONE) {
        if (this.currentRecords.length > 0) {

        var dates = this.currentRecords.map(function (x) {
          return new Date(x['timeStamp']);
        });
        var latest = new Date(Math.max.apply(null, dates));
        var earliest = new Date(Math.min.apply(null, dates));
        this.dateTimeInputComponent.setRange(earliest, latest);
      }
        this.remoteFilter = false;
      }
    });


  }

  ngAfterViewInit(){

    this.dateTimeInputComponent.createComponent();
  }

  triggerFilter(){
    this.keyUp.next(Guid.generateNewGuid())
  }

  applyCustomFilter(){
    this.orFilterFields = [];
    this.jqxGrid.clearfilters();
    let filter_and_operator = 0;
    let filtercondition = 'contains';


    // Name Filter
    if (this.selectedName && this.selectedName.toLowerCase() != '') {
      let nameFilter = new jqx.filter();
      let nameFilterValue = this.selectedName;
      let nameFilter_ = nameFilter.createfilter('stringfilter', nameFilterValue, filtercondition);
      nameFilter.addfilter(filter_and_operator, nameFilter_);
      this.jqxGrid.addfilter("entityId", nameFilter);
    }
    // Entity Type Filter
    if (this.selectedEntityName && this.selectedEntityName.toLowerCase() != '') {
      let entityNameFilter = new jqx.filter();
      let entityNameFilterValue = this.selectedEntityName;
      let entityNameFilter_ = entityNameFilter.createfilter('stringfilter', entityNameFilterValue, filtercondition);
      entityNameFilter.addfilter(filter_and_operator, entityNameFilter_);
      this.jqxGrid.addfilter("entityType", entityNameFilter);
    }


    //Action Filter
    if (this.selectedActionName && this.selectedActionName.toLowerCase() != 'all') {
      let actionFilter = new jqx.filter();
      let actionNameFilterValue = this.selectedActionName;
      let actionNameFilter = actionFilter.createfilter('stringfilter', actionNameFilterValue, filtercondition);
      actionFilter.addfilter(filter_and_operator, actionNameFilter);

      this.jqxGrid.addfilter("action", actionFilter);
    }

    if(this.dateTimeInputComponent){
      let minDate=this.dateTimeInputComponent.getRange().from;
      let maxDate=this.dateTimeInputComponent.getRange().to;

      let dateRangeFilter=new jqx.filter();

      let dateFilter_1=dateRangeFilter.createfilter('datefilter',maxDate,'LESS_THAN_OR_EQUAL');
      let dateFilter_2=dateRangeFilter.createfilter('datefilter',minDate,'GREATER_THAN_OR_EQUAL');
      dateRangeFilter.addfilter(filter_and_operator,dateFilter_1);
      dateRangeFilter.addfilter(filter_and_operator,dateFilter_2);
      this.jqxGrid.addfilter('timeStamp',dateRangeFilter);

    }

    this.jqxGrid.applyfilters();
  }

  onActionChanged() {
    let item=this.actionDropdownList.getSelectedItem().value;
    this.selectedActionName=item==='Rebalance Start/End'?'Rebalance':item;
    this.applyCustomFilter();
  }

  dateOnChange() {
    let minDate=this.dateTimeInputComponent.getMinDate();
    let maxDate=this.dateTimeInputComponent.getMaxDate();
    this.applyCustomFilter();
  }

  source: any = {
    datatype: 'json',
    datafields: [
      {name: 'timeStamp', type: 'date', format: AppConfig.DATETIME_FORMAT}
    ],
    localdata: {},
    sortable: true,
    totalrecords: 0
  };

  renderGridRows = (params: any): any[] => {

    let data = [];
    let {pagesize} = this.jqxGrid.getpaginginformation();
    setTimeout(() => {
      this.jqxGrid.showemptyrow(false);
      this.jqxGrid.showloadelement();

    });

    if (this.isGridLoadingStatus.getValue() == GridLoadingStatus.LOAD) {
      this.DASH_FOR_EMPTY = "";
      this.sort='timeStamp:desc';
      this.loadDataForVirtualPromise( params.startindex, pagesize, this.sort,
        this.filterValue).then(res => {
        this.currentRecords = res;

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

      this.sort = `${sortinformation.sortcolumn}:${sortdirection}`;
    }

    this.startIndex = -1;
    this.endIndex = -1;
    this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);
  };

  onFilter(): void {

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
          if (datafield == "timeStamp") {

            appliedFiltersTemp.set(f, filterValue);

          }//only timeStamp field can send multiple filters right now

        }

        appliedFilters += `${datafield}:ge:${Date.parse(appliedFiltersTemp.get(1))},`;
        appliedFilters += `${datafield}:le:${Date.parse(appliedFiltersTemp.get(0))},`;
        this.filterConditionsList.push(`${filtercolumntext} between ('${new Date(
          appliedFiltersTemp.get(0)).toDateString()}' AND '${new Date(
          appliedFiltersTemp.get(1)).toDateString()}')`);

      } else {
        if (filter.getfilters().length > 0) {
          filterValue = filter.getfilters()[0].value;
          let selectedFilterCondition = filter.getfilters()[0].condition;
          appliedFilters += this.getFilterCriteria(datafield, filterValue, selectedFilterCondition);

        }
      }

      if(datafield!="action" && datafield!="timeStamp"){
        filterMap.set(datafield, filterValue.toString());
      }

    }

    this.filterValue = appliedFilters.replace(/,\s*$/, "");
    this.gridfilter = true;

    this.isRefreshData = false;
    /*To select previous selected items*/
    this.jqxGrid.clearselection();
    this.isGridLoadingStatus.next(GridLoadingStatus.LOAD);


  };

  pageChanged(event: any) {

    if (this.filterValue !== "" && event.args['pagenum'] != 0)
      this.jqxGrid.clearselection();

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

  loadDataForVirtualPromise = async (offset, limit, sort?, filter_value?) => {
    let response = await this.urebalService.get(
      `auditTrail/?offset=${offset}&limit=${limit}&sort=${sort}&filter=${encodeURIComponent(filter_value)}`)
      .toPromise();
    let {code, responsedata} = await response;
    let auditList: AuditList[];

    if (code == 200) {
      auditList = responsedata.items;
    } else {
      //jqxGrid.clear method is used to set 0-0 of 1 at page footer otherwise show 1-1 of 1
      auditList = [];
      setTimeout(() => {
        this.jqxGrid.clear()
      });
    }

    this.source.totalrecords = responsedata.total_records;
    return await auditList;
  };


  getFilterCriteria(dataField: string, filterValue: any, filterCondition?: any) {
    return `${dataField}:like:%${filterValue}%,`;

  }

  dateCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    //Handling for empty string that cause "Invalid Date" exception if empty string passes into Date().
    if (value === "") {
      return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
    }

    let date = new Date(value);
    const formattedDate = jqx.dataFormat.formatdate(date, AppConfig.DATETIME_FORMAT);
    return `<div title="${formattedDate}" style="overflow: hidden; height: 100%; padding-top: 10px;  padding-right: 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ${columnproperties.cellsalign}">${formattedDate}</div>`;
  };


  private getAuditTrailGridCols = (component: AuditTrailComponent): GridColumn[] => {
    let data = [
      {
        text: "Date Time",
        datafield: "timeStamp",
        cellsformat: "dd/MM/yyyy",
        cellsrenderer: this.dateCellsRenderer,
        width: "15%"
      },
      {
        text: "Entity",
        datafield: "entityType",
        width: "15%"
      },
      {
        text: "Name",
        datafield: "entityId",
        width: "25%"
      },
      {
        text: "Action",
        datafield: "action",
        width: "30%"
      },

      {
        text: "Modified By",
        datafield: "userId",
        width: "15%"

      }

    ];

    SoftpakGridHelper.mergeGridColumnProperties(data, auditTrailGridColsMeta);

    return data;
  }

  ngOnDestroy(): void {
    this.currentRecords = null;
    this.keyUp.complete();
    this.jqxGrid.destroy();
    this._subscriptionKeyUP.unsubscribe();
    this._subscription.unsubscribe();
  }
}


