import {Component, OnInit, Inject, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {ActivatedRoute, Router} from "@angular/router";
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {DriftService} from '../../drifts/drift.service';
import {UILoader} from '../../shared/util/UILoader';
import {AccountComponent} from "../../account/account-list/account.component";
import {ModelService} from "../../model/model.service";
import {AppConfig} from "../../../app.config";


@Component({
  selector: 'app-drift-detail',
  templateUrl: './drift-details.component.html',
  styles: []
})
export class DriftDetailsComponent implements OnInit {

  public totalMktVal = 0;
  public totalFreeCashVal = 0;
  public totalSecuritiesDrifted = 0;
  public driftSummary: any;
  private actualChartData: any;
  private driftReportResponse: any;
  public driftDate: string;
  private attrTypes: any = ['ALL SECURITIES'];
  private showCount = 10000000;
  public error: string;
  private sortedValue: string = 'initPct';
  public driftStatus:string
  private household;
  private isScopeChanged: boolean = true;
  private scopeName: string = 'ALL SECURITIES';
  private modelDetails: any;
  public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;

  @Input() portfolioId: any;
  @Input() portfolioName: string;
  @Input() inputDriftStatus: string;

  @Output() returnReport: EventEmitter<any> = new EventEmitter();

  @ViewChild(UrebalGridComponent) gridComponent: UrebalGridComponent;

  constructor(private driftService: DriftService,
              private modelService: ModelService,
              protected route: ActivatedRoute, private myRoute: Router) { }


  ngOnInit() {


    if(this.portfolioId && this.portfolioName) {
      this.getAttributeType();
    }else{
      this.route.params.subscribe(params => {
        if(params['portfolioId'] && params['portfolioName'] && params['driftStatus']){
          this.portfolioId = URebalUtil.decodeparams(params['portfolioId']);
          this.portfolioName = URebalUtil.decodeparams(params['portfolioName']);
          this.inputDriftStatus = URebalUtil.decodeparams(params['driftStatus']);
          this.household = URebalUtil.decodeparams(params['isHousehold']);
          if(this.portfolioId && this.portfolioName) {
            this.getAttributeType();
            this.loadForParent(this.inputDriftStatus);
          }
        }
      });
    }

    this.gridComponent.jqxGrid.onBindingcomplete.subscribe( grid =>
    {
      if(this.gridComponent.getRows().length > 0)
      {
        this.gridComponent.setColumn('drift', 'cellsrenderer', (row, colum, value, defaulthtml, columnproperties, rowdata) => {

          let cell = '<span style="text-align:right;width: 45px;float: right;margin-top: 10px;margin-right: 5px;">';
          cell += this.driftService.convertToPercent(value,undefined,2);
          cell += '</span>';
          cell += '<svg class="slds-button__icon drift-arrow-up" aria-hidden="true" style="';
          if(rowdata.initPct < rowdata.modelMinPct){
            cell += 'transform: rotate(180deg);';
          } else if(rowdata.initPct <= rowdata.modelMaxPct && rowdata.initPct >= rowdata.modelMinPct) {
            cell += 'display: none;';
          }
          cell += '">';

          cell += `<use xlink:href="${this.driftService.getAppContext()}/assets/css_framework/assets/icons/utility-sprite/svg/symbols.svg#arrowup"></use>`;
          cell += '</svg>';

          return cell;
        })
      }
    });
  }

  /**
   * This method called by parent component to load drift detail on demand
   */
  loadForParent(driftStatus: string) {
    this.driftStatus = driftStatus;
    this.getDriftSummary();
    this.getDriftReport();

    // open chart view tab on every new call by clicking on chart tab
    //$('ul.filter-options li:first-child button').click();

    //Once data loaded from services refresh chart to show actual data.
    //setTimeout(()=>{$('#jqxChart').jqxChart('refresh');},200)  // TODO: Uncomment and refactor using jqx Angular version. Commented because this is dead page, now 06/11/2018.
  }

  getDriftSummary() {
    UILoader.blockUI.start();
    this.driftService.getDriftSummary(this.portfolioId).subscribe(result =>{
      console.log(result);
      if(result.code == 200){
        this.error = '';
        this.driftSummary = result.responsedata;
        this.getModelDetails(this.driftSummary.modelId);

        let marketDrift = this.driftSummary.summaryMap.marketDrift;
        for (let i=0; i<marketDrift.length; i++) {
          this.totalMktVal +=  marketDrift[i].marketValue;
        }

        this.totalMktVal = Math.trunc(this.totalMktVal);

        let freeCashDrift = this.driftSummary.summaryMap.freeCashDrift;
        for (let j=-0; j<freeCashDrift.length; j++) {
          this.totalFreeCashVal += freeCashDrift[j].freeCashValue;
        }
        UILoader.blockUI.stop();
      } else {
        this.error = 'summary not found';
      }

    });

  }

  getModelDetails(modelId) {
    this.modelService.getModelDistribution(modelId).subscribe(result => {
      this.modelDetails = result.responsedata;
    });
  }

  getDriftReport() {
    UILoader.blockUI.start();
    this.driftService.getDriftReport(this.portfolioId).subscribe(result => {
      if(result.code == 200){
        this.driftReportResponse = result.responsedata;
        this.actualChartData = result.responsedata;
        if(result.responsedata.length > 0){
          this.driftDate = this.driftReportResponse[0].asOfDate;
          this.showFilteredChart(this.showCount);
          this.getTotalSecuritiesDrifted(this.driftReportResponse);
          this.returnReport.emit(true);
          UILoader.blockUI.stop();
        }
      }
      else {
        this.driftReportResponse = [];
        this.gridComponent.refreshGrid(this.driftReportResponse);
        this.gridComponent.jqxGrid.clear();
        this.gridComponent.jqxGrid.showemptyrow(true);
        this.actualChartData = [];
        this.showFilteredChart(this.showCount);
        this.returnReport.emit(false);
        UILoader.blockUI.stop();
      }

    });
  }

  getAttributeType() {
    UILoader.blockUI.start();
    this.driftService.getAttrType().subscribe(result => {
      if(result.code == 200){
        for (let i=0; i<result.responsedata.length; i++) {
          this.attrTypes.push(result.responsedata[i].attributeType);
        }
        UILoader.blockUI.stop();
      }

    });
  }

  getAttributeWithAttrType(event) {
    UILoader.blockUI.start();
    if (event.target.value == 'ALL SECURITIES') {
      this.getDriftReport();
      this.isScopeChanged = true;
    }else {
      this.isScopeChanged = false;
      this.scopeName = event.target.value;
      this.driftService.getAttributeWithAttributeType(event.target.value).subscribe(result => {
        if(result.code == 200){
          this.attrSelection(this.driftReportResponse,result.responsedata);
          UILoader.blockUI.stop();
        }
      });
    }
  }

  setGridData(data: any) {
    this.bindingCompleted();
    this.gridComponent.refreshGrid(data);
  }

  refreshChartView() {
    if ($('#jqxChart').hasClass('slds-hide')) {
      $('#chartViewBtn').addClass('urebal-button-active');
      $('#gridViewBtn').removeClass('urebal-button-active');
      $('#gridView').addClass('slds-hide');
      $('#jqxChart').removeClass('slds-hide');
    }
    this.showFilteredChart(this.showCount);
  }

  refreshGridView() {
    if ($('#gridView').hasClass('slds-hide')) {
      $('#jqxChart').addClass('slds-hide');
      $('#gridView').removeClass('slds-hide');
      $('#gridViewBtn').addClass('urebal-button-active');
      $('#chartViewBtn').removeClass('urebal-button-active');
    }
    this.bindingCompleted();
  }

  bindingCompleted() {
    setTimeout(()=>{
      if(this.gridComponent.getRows().length > 0 && this.gridComponent.jqxGrid.isBindingCompleted()) {
        this.gridComponent.jqxGrid.showcolumn('securityType');
        this.gridComponent.jqxGrid.hidecolumn('modelMinPct');
        this.gridComponent.jqxGrid.hidecolumn('modelMaxPct');
        this.gridComponent.jqxGrid.setcolumnproperty('securityId','text','SECURITY ID');

        if (this.isScopeChanged) {
          this.gridComponent.jqxGrid.showcolumn('modelMinPct');
          this.gridComponent.jqxGrid.showcolumn('modelMaxPct');
        } else {
          this.gridComponent.jqxGrid.setcolumnproperty('securityId','text','ATTRIBUTE NAME');
          this.gridComponent.jqxGrid.hidecolumn('securityType');
        }
      }
    },300);
  }

  loadChart(chartData) {
    let maxPct;
    let minDrift;
    let initPct;
    let maxYAxis;

    let driftArray: any = [];
    let ValsArray: any = [];
    let initPctArray: any = [];
    let maxYaxisArray: any = [];

    for (let i=0; i<chartData.length; i++) {
      driftArray.push(chartData[i].modelMinPct);
      driftArray.push(chartData[i].modelMaxPct);
      ValsArray.push(chartData[i].drift);
      initPctArray.push(chartData[i].initPct);
      maxYaxisArray.push(chartData[i].modelMinPct);
      maxYaxisArray.push(chartData[i].modelMaxPct);
      maxYaxisArray.push(chartData[i].drift);
      maxYaxisArray.push(chartData[i].initPct);
    }

    maxPct = Math.max.apply(null,driftArray);
    minDrift = Math.min.apply(null, ValsArray);
    initPct = Math.max.apply(null, initPctArray);
    maxYAxis = Math.max.apply(null, maxYaxisArray);
    maxYAxis = maxYAxis + 20;

    if (maxYAxis > 100) {
      maxYAxis = 100;
    }

    if (minDrift < 0) {
      maxPct = maxPct - minDrift;
    }
    if(minDrift > maxPct)
    {
      let temp = maxPct;
      maxPct = minDrift;
      minDrift = temp;
    }

    let toolTipCustomFormatFn = function (value, itemIndex) {
      let dataItem = chartData[itemIndex];
      let volume = dataItem.modelTargetPct;

      return `<div style="text-align:left">`+
                `Min: ` + value.low + ` %` +
                `<br />Max: ` + value.high + `%` +
                `<br />Tolerance: ` + volume  + `%` +
            `</div>`;
    };


    let chartSettings = {
      title : "",
      description: "",
      colorScheme : 'scheme17',
      enableAnimations: true,
      showLegend:true,
      padding: {left:10, top: 10, right: 10, bottom: 10},
      borderLineWidth: 0,
      source: chartData,
      xAxis: {
        dataField: 'securityId',
        showGridLines: false,
        gridLinesInterval: 20
      },
      seriesGroups: [
        {
          type: 'candlestick',
          skipOverlappingPoints: false,
          columnsMaxWidth: 10,
          columnsMinWidth: 2,
          toolTipFormatFunction: toolTipCustomFormatFn,
          valueAxis:
            {
              description: 'Tolerance Range',
              visible: false,
              minValue: minDrift,
              maxValue: maxYAxis,
              unitInterval: 10,

            },
          yAxis : {
            dataField : 'modelMaxPct'
          },
          series: [
            {
              dataFieldClose: 'modelTargetPct',
              displayTextClose: '',
              dataFieldOpen: 'modelTargetPct',
              displayTextOpen: '',
              dataFieldHigh: 'modelMaxPct',
              displayTextHigh: 'Max %',
              dataFieldLow: 'modelMinPct',
              displayTextLow: 'Min %',
              displayText: 'Tolerance Range',
              lineWidth: 1
            }
          ]
        },
        {
          type: 'column',
          columnsGapPercent: 40,
          seriesGapPercent:20,
          valueAxis: {
            displayValueAxis: true,
            description: "",
            unitInterval: 10,
            minValue: minDrift,
            maxValue: maxYAxis,
            axisSize:'auto',
            tickMarksColor: '#888888'
          },
          series : [
            {
              dataField: 'initPct', displayText: 'Initial %', labels : {
              visible: true,
              verticalAlignment: 'top',
              offset: { x :0, y: -20}
            }
            },
            {
              dataField: 'modelTargetPct', displayText: 'Target %', labels : {
              visible: true,
              verticalAlignment: 'top',
              offset: { x :0, y: -20}
            }
            },
            {
              dataField: 'drift', displayText: 'Drift %' , labels : {
              visible: true,
              verticalAlignment: 'top',
              offset: { x :0, y: -20}
            }
            }
          ]
        }
      ]

    };
    //$('#jqxChart').jqxChart(chartSettings); // TODO: Uncomment and refactor using jqx Angular version. Commented because this is dead page, now 06/11/2018.
  }

  sortingOptions(property) {
    this.sortedValue = property.target.value;
    this.showFilteredChart(this.showCount);
  }

  dynamicSort(val,freshLoad) {
    if (freshLoad) {
      this.gridComponent.jqxGrid.onBindingcomplete.subscribe(grid => {
          this.gridComponent.jqxGrid.sortby(val, 'desc');
        }
      );
    }else {
      this.gridComponent.jqxGrid.sortby(val, 'desc');
    }
  }

  attrSelection(actualData, attributesData) {

    let matchedSecurities = [];
    let updatedData = [];
    for(let j = 0 ; j < attributesData.length ; j++){
      let attrInit = 0;
      let attrTgt = 0;
      let attrMin = 0;
      let attrMax = 0;
      let attrDrift = 0;
      let isSecMatch = false;

      for(let k = 0 ; k < attributesData[j].securities.length ; k++ ){
        for(let i = 0 ; i < actualData.length; i++){
          if(actualData[i].securityId == attributesData[j].securities[k].securityID){
            isSecMatch = true;
            attrInit = attrInit + (actualData[i].initPct*attributesData[j].securities[k].attributeValue/100);
            attrTgt = attrTgt + (actualData[i].modelTargetPct*attributesData[j].securities[k].attributeValue/100);
            attrMin = attrMin + (actualData[i].modelMinPct*attributesData[j].securities[k].attributeValue/100);
            attrMax = attrMax + (actualData[i].modelMaxPct*attributesData[j].securities[k].attributeValue/100);
            matchedSecurities.push(actualData[i].securityId);
          }
        }
      }

      attrDrift = attrTgt - attrInit;

      if(isSecMatch) {
        updatedData.push({
          accountModelId: "dummy",
          securityId: attributesData[j].attributeName,
          driftId: 1,
          initPct: attrInit,
          drift: attrDrift,
          modelTargetPct: attrTgt,
          modelMinPct: attrMin,
          modelMaxPct: attrMax,
        });
      }
    }

    let othersInit = 0;
    let othersTgt = 0;
    let othersMin = 0;
    let othersMax = 0;

    for(let i = 0 ; i < actualData.length; i++){
      if($.inArray(actualData[i].securityId, matchedSecurities) == -1){
        othersInit = othersInit + actualData[i].initPct;
        othersTgt = othersTgt + actualData[i].modelTargetPct;
        othersMin = othersMin + actualData[i].modelMinPct;
        othersMax = othersMax + actualData[i].modelMaxPct;
      }
    }

    updatedData.push({
      accountModelId: "dummy",
      securityId: "OTHERS",
      driftId: 1,
      initPct: othersInit,
      drift: othersTgt - othersInit,
      modelTargetPct: othersTgt,
      modelMinPct: othersMin,
      modelMaxPct: othersMax,
    });

    this.actualChartData = updatedData;
    this.showFilteredChart(this.showCount);
    this.dynamicSort(this.sortedValue,true);
  }

  getTotalSecuritiesDrifted(driftReport) {
    let threshold = 0;
    this.totalSecuritiesDrifted = 0;
    for (let i=0; i<driftReport.length; i++){
      if (driftReport[i].drift > threshold) {
        this.totalSecuritiesDrifted++;
      }
    }
  }

  showFilteredChart(val) {
    this.showCount = parseInt(val);
    this.actualChartData.sort((a, b) => {
      return b[this.sortedValue] - a[this.sortedValue];
    });

    let tempArr : any = Object.assign({}, this.actualChartData);
    tempArr = this.actualChartData.slice(0,this.showCount);
    this.loadChart(tempArr);
    this.setGridData(tempArr);
    this.dynamicSort(this.sortedValue,true);
  }

  openAccountDetail(portfolioName) {
    this.myRoute.navigate(['/secure/accounts/',URebalUtil.encodeparams(this.portfolioId),URebalUtil.encodeparams(portfolioName),URebalUtil.encodeparams(this.household)]);
  }

  openModelDetails(modelName) {
    this.myRoute.navigate(['/secure/model/detail', this.modelDetails.modelId]); // dead code
  }
}
