import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModelService} from '../../../model/model.service';
import {UILoader} from '../../../shared/util/UILoader';
import {jqxChartComponent} from '../../../../../src/assets/jqwidgets-ts/angular_jqxchart';


@Component({
  selector: 'asset-widget',
  templateUrl: './asset-widget.component.html',
  styleUrls: ['./asset-widget.component.css']
})
export class AssetWidgetComponent implements OnInit {

  @ViewChild('barChartReference') barChart: jqxChartComponent;
  @ViewChild('pieChartReference') pieChart: jqxChartComponent;

  private models:any[];
  private attributes:any;
  private attributeType:string="none";
  private modelId: number;
  private modelName:string;
  private modelType:any;
  private chartData: any = [];
  isPie : boolean = true;
  loadingMsg : string = '';

  title: string = '';
  description: string = '';
  pieChartpadding: any = { left: 0, top: 5, right: 5, bottom: 5 };
  barChartPadding: any = { left: 20, top: 5, right: 20, bottom: 5 };
  titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  legendLayout: any = {
    left: 350,
    top: 30,
    width: 300,
    height: 200,
    flow: 'vertical'
  };

  xAxis: any =
    {
      dataField: 'name',
      unitInterval: 1,
      displayText: 'Security',
      gridLines: { visible: false },
      flip: false
    };

  valueAxis: any =
    {
      minValue: 0,
      maxValue: 100,
      unitInterval: 10,
      flip: false,
      labels: {
        visible: true
      }
    };

  pieChartSeriesGroups: any[] =
    [
      {
        type: 'donut',
        useGradient: false, // disable gradient for the entire group
        series: [
          { useGradient: false,
            dataField: 'value',
            displayText: 'name',
            radius: 100,
            innerRadius: 50
          },
        ]
      }
    ];

  barChartSeriesGroups: any[] =
    [
      {
        type: 'column',
        orientation: 'vertical',
        useGradient: false, // disable gradient for the entire group
        columnsGapPercent: 50,
        columnsMaxWidth: 40,
        columnsMinWidth: 1,
        toolTipFormatSettings: { thousandsSeparator: ',' },
        series: [
          { useGradient: false, dataField: 'value', displayText: 'Percentage (%)'}
        ]
      }
    ];

  constructor(private modelService: ModelService) {
  }

  ngOnInit() {
    //this.blockUI.start("Loading data please wait...");
    this.loadingMsg = "Loading data please wait...";
    this.modelService.getModelsList()
      .subscribe((result) => {
        if(result.code == 200) {
          this.models = result.responsedata;
          this.modelId = this.models[0].modelId; // first item selected
          this.switchPanels('pie'); // show/bind  piechart data as default
        }
        else{
          this.loadingMsg = "";
          console.error(result.message);
        }
      });

    this.modelService.getAttributes()
      .subscribe((result) => {
        if(result.code == 200) {
          this.attributes = result.responsedata;
          this.attributeType = this.attributes[0].attributeType; //first item selected
        }
        else{
          this.loadingMsg = "";
          console.error(result.message);
        }
      });
  }

  switchPanels(name) {
    this.loadingMsg = "Loading data please wait...";
    $('.barchart').hide();
    $('.piechart').hide();
    this.loadData((data)=>{
      this.chartData = data;
      this.updateChart(name);
    });
  }

  updateChart(name)
  {
    $('#pie').removeClass('slds-button-active');
    $('#bar').removeClass('slds-button-active');

    if(name == 'pie')
    {
      this.isPie = true;
      this.pieChart.update();
      $('.barchart').hide();
      $('.piechart').show();
      $('#pie').addClass('slds-button-active');
    }
    else if(name == 'bar')
    {
      this.isPie = false;
      this.barChart.update();
      $('.piechart').hide();
      $('.barchart').show();
      $('#bar').addClass('slds-button-active');
    }
  }

  loadData(callback) {
    let data = [];
    let modelIndex = this.models.findIndex( m => m.modelId == this.modelId);

    this.modelName = this.models[modelIndex].modelName;
    this.modelType = this.models[modelIndex].modelTypeNum;

    this.modelService.getModelDistribution(this.modelId)
      .subscribe((result) => {
        if(result.code == 200) {

          for (let index = 0; index < result.responsedata.length; index++) {
            let childPie = [];
            let modelElements = result.responsedata[index].modelElements;
            if (modelElements.length > 0) {
              for (let modelElementIndex = 0; modelElementIndex < modelElements.length; modelElementIndex++) {
                if (modelElements[modelElementIndex].target !== null) {
                  childPie[modelElementIndex] = {
                    name: modelElements[modelElementIndex].ticker,
                    value: +modelElements[modelElementIndex].target,
                    min: +modelElements[modelElementIndex].min,
                    max: +modelElements[modelElementIndex].max
                  };
                }
              }
            }
            if (result.responsedata[index].percentage > 0) {
              data[index] = {
                name: result.responsedata[index].attributeName,
                value: result.responsedata[index].percentage,
                id: result.responsedata[index].attributeID,
                securities: childPie
              }
            }
          }
          callback(data);
          this.loadingMsg = "";
        } else {
          console.error(result.message);
          callback([]);
          this.loadingMsg = "";
        }
      });
  }

  drillDown(event: any) {

    if(event.args && event.args.elementIndex !== undefined && this.chartData[event.args.elementIndex].securities !== undefined) {
      this.chartData = this.chartData[event.args.elementIndex].securities;
      if(this.isPie){
        this.pieChart.update();
      }
      else {
        this.pieChart.update();
      }

     }
  }

}
