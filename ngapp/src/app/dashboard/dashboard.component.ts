import { Component, OnInit, AfterViewInit, Inject, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { UrebalGridComponent } from '../shared/components/urebal-grid/urebal-grid.component';
import { UrebalDropdownComponent } from '../shared/components/urebal-dropdown/urebal-dropdown.component';
import {NgBlockUI, BlockUI} from 'ng-block-ui';

import { DashboardService } from './dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren(UrebalGridComponent) grids : QueryList <UrebalGridComponent>;
  @ViewChildren(UrebalDropdownComponent) dropdowns : QueryList <UrebalDropdownComponent>;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private dashboardService: DashboardService) { }

  private accountsByMarketValueData : any;
  private value: string;
  private source: any;
  private widgetPreferences: any = new Array();
  private numberOfRowsSource: Array<String> = [ "5", "10", "15" ];
  private sortOrderSource: Array<String> = [
      "Ascending",
      "Descending"
  ];

  ngOnInit() {
/*    this.dashboardService.get("dashboard/getDashboardWidgets").subscribe(response => {
      if(response.code == 200){
          let result = response.responsedata;
          let layouts = result.widgets;

          for(let widget of layouts.firstLayout){
            this.widgetPreferences.push(widget);
          }

          for(let widget of layouts.secondLayout){
            this.widgetPreferences.push(widget);
          }
      }
    });*/
  }

  ngAfterViewInit(){
    $('.slds-dropdown-trigger--click').on('click', function(){
      $(this).toggleClass('slds-is-open');
    });

/*    setTimeout(()=>{
      this.defaultWidgetSettings();
    },200);*/
  }

  showSettings(widgetId) {
    if(widgetId === "widget-1") {
      $("#widget-1, #widget-1-settings").toggle();
    } else if(widgetId === "topAssignedbyMarketValue") {
      $("#topAssignedbyMarketValue, #topAssignedbyMarketValueSettings").toggle();
    }
  }

  saveSettings(widgetId) {
    let numberOfRecords:number;
    let sortOrder : string;
    this.dropdowns.forEach(dropdownObject => {
      if(widgetId === "widget-1") {
        if(dropdownObject.id === "widget-1-showrecords"){
          let dropdown = dropdownObject.dropdownList;
          numberOfRecords = dropdown.getSelectedItem().value;
        }

        if(dropdownObject.id === "widget-1-sortby"){
          let dropdown = dropdownObject.dropdownList;
          sortOrder = dropdown.getSelectedItem().value;
        }

        return;
      }
    });

    for(let widget of this.widgetPreferences){
      if(widgetId == widget.widgetId){
        widget.numberOfRecords = numberOfRecords;
        widget.sortOrder = sortOrder;
        delete widget.blobAsWidget
        this.updateWidgetSettings(widget);
        return;
      }
    }

    this.showSettings(widgetId);
  }

  defaultWidgetSettings() {
    for(let widget of this.widgetPreferences){
      this.dropdowns.forEach(dropdownObject => {
      if("widget-1" === widget.widgetId) {
          if(dropdownObject.id === "widget-1-showrecords"){
            let dropdown = dropdownObject.dropdownList;
            let numberOfRecords = widget.numberOfRecords == null ? 10 : widget.numberOfRecords ;
            dropdown.selectItem(numberOfRecords);
          }

          if(dropdownObject.id === "widget-1-sortby"){
            let dropdown = dropdownObject.dropdownList;
            let sortorder = widget.sortOrder == null ? "Descending" : widget.sortOrder;
            dropdown.selectItem(sortorder);
          }
        }
      });
    }

    this.loadWidgetsData();
  }

  loadWidgetsData() {
  }

  updateWidgetSettings(widget) {


    this.dashboardService.post('dashboard/updateWidgetSettings',widget).subscribe(
      response => {
        if(response.code == 200){
          this.showSettings(widget.widgetId);
          this.loadWidgetsData();
        }
      }
    );
  }
}
