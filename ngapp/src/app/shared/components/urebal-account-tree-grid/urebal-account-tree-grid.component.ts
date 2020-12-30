import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import { jqxTreeGridComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxtreegrid';
import {URebalService} from "../../../services/urebal.service";
import {PercentFormatterPipe} from "../../pipes/NumericFormatterPipe";
import {GridExpand} from "../../classes/GridExpand.class";


@Component({
  selector: 'urebal-account-tree-grid',
  templateUrl: 'urebal-account-tree-grid.component.html'
})
export class URebalAccountTreeGridComponent implements OnInit, AfterViewInit {
  @Input() gridId: string;
  @Input() displayHeader : boolean = true;
  @Input() panelTitle: string;
  @ViewChild('accountTreeGridReference') jqxTreeGrid: jqxTreeGridComponent;

  constructor(public urebalService: URebalService,
              private percentFormatter: PercentFormatterPipe){
  }

  ngOnInit(){
  }


  ngAfterViewInit(): void {
    this.jqxTreeGrid.createComponent(this.treeGridSettings);
    if(!this.displayHeader){
      $('#account-tree-grid-header-'+this.gridId).css('display','none');
    }
  }

  source =
    {
      dataType: "json",
      dataFields: [
        { name: 'workflowId', type: 'number' },
        { name: 'portfolioId', type: 'number' },
        { name: 'accountId', type: 'string' },
        { name: 'accountNumber', type: 'string' },
        { name: 'attributeName', type: 'string' },
        { name: 'attributeType', type: 'string' },
        { name: 'initPercent', type: 'number' },
        { name: 'proposedPercent', type: 'number' },
        { name: 'minPercent', type: 'number' },
        { name: 'max', type: 'number' },
        { name: 'changePercent', type: 'number' },
        { name: 'children', type: 'array' }
      ],
      hierarchy: {
        root: 'children'
      },
      id: 'accountId',
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
        console.log("loading service account grid is ready=");
      },
      rendered: (): void => {
        console.log("loading service account grid rendered=");
        let item = $('#account-tree-'+this.gridId).find("td");
        item.each( function() {
          $(this).attr('style', function(i,s) { return (s || '') + 'text-align: left !important;' });
        });
      },

      columns: [
        { text: 'Account Number', dataField: 'accountNumber', width: '30%', align: 'center',
          cellsRenderer: function (rowKey, dataField, value, data) {
            let item = `<span>${data.accountNumber}</span>`;
            if(data.attributeName != undefined){
              item = `<span style="position: absolute;">${data.attributeName}</span>`;
            }
            return item;
          }
        },
        { text: 'Type', dataField: 'attributeType', cellsFormat: 'd2' , width: '20%', align: 'center', cellsAlign: 'center',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let min = ( data.minPercent != undefined && ( data.minPercent <= 0 || data.minPercent == -777 ) ) ? '' : formattedValue;
            let item = '<div><b>'+min+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+data.attributeType +'</div>';
            }
            return item;
          }
        },
        { text: 'Init %', dataField: 'initPercent', cellsFormat: 'd2', width: '10%',align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+(value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')')+'</div>';
            }
            return item;
          }
        },
        { text: 'Prop %', dataField: 'proposedPercent', cellsFormat: 'd2',  width: '10%',align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+(value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')')+'</div>';
            }
            return item;
          }
        },
        { text: 'Min %', dataField: 'minPercent', cellsFormat: 'd2' , width: '10%',align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let min = ( data.minPercent != undefined && ( data.minPercent <= 0 || data.minPercent == -777 ) ) ? '' : formattedValue;
            let item = '<div><b>'+min+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+(min == '' ? '--' : min)+'</div>';
            }
            return item;
          }
        },
        { text: 'Max %', dataField: 'maxPercent', cellsFormat: 'd2' , width: '10%',align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let max = ( data.maxPercent != undefined && ( data.maxPercent <= 0 || data.maxPercent== -777 ) ) ? '' : formattedValue;
            let item = '<div><b>'+max+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+(max == '' ? '--' : max)+'</div>';
            }
            return item;
          }
        },
        { text: 'Change %', dataField: 'changePercent', cellsFormat: 'd2', width: '10%',align: 'center', cellsAlign: 'right',
          cellsRenderer: function (rowKey, dataField, value, data, formattedValue) {
            let item = '<div><b>'+formattedValue+'</b></div>';
            if(data.attributeName != undefined){
              item = '<div>'+(value >= 0 ? formattedValue : '(' + Math.abs(formattedValue.replace('-', '')) + ')')+'</div>';
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
    this.jqxTreeGrid.refresh();
  }



  getColumns() {
    return this.jqxTreeGrid.columns();
  }
}
