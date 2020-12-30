import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import { jqxTreeGridComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxtreegrid';
import {URebalService} from "../../../services/urebal.service";
import {PercentFormatterPipe} from "../../pipes/NumericFormatterPipe";
import {GridExpand} from "../../classes/GridExpand.class";


@Component({
  selector: 'urebal-tree-grid',
  templateUrl: 'urebal-tree-grid.component.html'
})
export class URebalTreeGridComponent implements OnInit, AfterViewInit {
  @Input() gridId: string;
  @Input() displayHeader : boolean = true;
  @Input() panelTitle: string;
  @ViewChild('treeGridReference') jqxTreeGrid: jqxTreeGridComponent;
  public txtSearch: string = "";

  constructor(public urebalService: URebalService,
              private percentFormatter: PercentFormatterPipe){
  }

  ngOnInit(){
  }

  ngAfterViewInit(): void {
    this.jqxTreeGrid.createComponent(this.treeGridSettings);
    if(!this.displayHeader){
      $('#tree-grid-header-'+this.gridId).css('display','none');
    }
  }

  source =
    {
      dataType: "json",
      dataFields: [
        { name: 'workflowId', type: 'number' },
        { name: 'portfolioId', type: 'number' },
        { name: 'attributeName', type: 'string' },
        { name: 'attributeType', type: 'string' },
        { name: 'initPercent', type: 'number' },
        { name: 'proposedPercent', type: 'number' },
        { name: 'minPercent', type: 'number' },
        { name: 'maxPercent', type: 'number' },
        { name: 'targetPercent', type: 'number' },
        { name: 'changePercent', type: 'number' },
        { name: 'children', type: 'array' }
      ],
      hierarchy: {
        root: 'children'
      },
      id: 'attributeName',
      url: null,
      localdata: null
    };
  dataAdapter = new jqx.dataAdapter(this.source);
  treeGridSettings: jqwidgets.TreeGridOptions =
    {
      height: 'auto',
      width: '100%',
      source: this.dataAdapter,
      pageable: false,
      exportSettings: {fileName: null},
      theme: 'blueleaf',
      ready: (): void => {
        this.jqxTreeGrid.expandAll();
        console.log("loading service grid attribute is ready=");
      },
      rendered: (): void => {
        let item = $('#tree-'+this.gridId).find("td");
        item.each( function() {
          $(this).attr('style', function(i,s) { return (s || '') + 'text-align: left !important;' });
        });
      },
      columns: [
        { text: 'Attribute Name', dataField: 'attributeName', width: '30%', align: 'center',
          cellsRenderer: function (rowKey, dataField, value, data) {
            let item = `<span>${data.attributeName}</span>`;
            if(data.accountNumber != undefined){
              item = `<span style="position: absolute;">${data.accountNumber}</span>`;
            }
            return item;
          }
        },
        { text: 'Type',  dataField: 'attributeType', width: '10%', align: 'center', cellsAlign: 'center',
          cellsRenderer: function (rowKey, dataField, value, data) {
            let item = '<div><b>'+data.attributeType+'</b></div>';
            if(data.accountId != undefined){
              item = '<div></div>';
            }
            return item;
          }
        },
        { text: 'Target %', dataField: 'targetPercent', cellsFormat: 'd2', width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            formattedValue =  value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')';
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+formattedValue+'</div>';
            }
            return item;
          }
        },
        { text: 'Init %', dataField: 'initPercent', cellsFormat: 'd2', width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            formattedValue =  value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')';
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+formattedValue+'</div>';
            }
            return item;
          }
        },
        { text: 'Prop %', dataField: 'proposedPercent', cellsFormat: 'd2',  width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            formattedValue =  value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')';
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+formattedValue+'</div>';
            }
            return item;
          }
        },
        { text: 'Min %', dataField: 'minPercent', cellsFormat: 'd2' , width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let min = ( data.minPercent != undefined && ( data.minPercent <= 0 || data.minPercent == -777 ) ) ? '' : formattedValue;
            let item = '<div><b>'+min+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+(min == '' ? '--' : min)+'</div>';
            }
            return item;
          }
        },
        { text: 'Max %', dataField: 'maxPercent', cellsFormat: 'd2' , width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let max = ( data.maxPercent != undefined && ( data.maxPercent <= 0 || data.maxPercent == -777 ) ) ? '' : formattedValue;
            let item = '<div><b>'+max+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+(max == '' ? '--' : max)+'</div>';
            }
            return item;
          }
        },
        { text: 'Change %', dataField: 'changePercent', cellsFormat: 'd2', width: '10%', align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            formattedValue =  value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')';
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.accountId != undefined){
              item = '<div>'+formattedValue+'</div>';
            }
            return item;
          }
        }
      ]
    };

  refreshGrid(data?:any, expandOption?: number ) : void {

    this.source.url = undefined;
    this.source.localdata = data;
    this.jqxTreeGrid.updateBoundData();

    if(expandOption == GridExpand.TREE_GRID_EXPAND_ALL)
      this.jqxTreeGrid.expandAll();
    else if(expandOption == GridExpand.TREE_GRID_COLAPSE_ALL)
      this.jqxTreeGrid.collapseAll();
  }


  getColumns() {
    return this.jqxTreeGrid.columns();
  }
}

