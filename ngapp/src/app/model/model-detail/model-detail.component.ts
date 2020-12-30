import {
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UrebalGridComponent} from '../../shared/components/urebal-grid/urebal-grid.component';
import {UILoader} from '../../shared/util/UILoader';
import {URebalUtil} from '../../shared/util/URebalUtil';
import {jqxChartComponent} from '@jqxSource/angular_jqxchart';

import {URebalService} from '../../services/urebal.service';
import {ModelService} from '../model.service';
import {sortByKey, sortBySystemPACOrder} from "../../shared/util/HelperUtils";
import {modelTypePermissions} from "../model.datasource";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {modelDetailGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import {ModelType} from "../../shared/enums/ModelType.enum";


@Component({
    selector: 'app-model-detail',
    templateUrl: './model-detail.component.html',
    styleUrls: ['./model-detail.component.css']
})
export class ModelDetailComponent extends UrebalPermissions {
    ModelType = ModelType;

    @ViewChildren('modelGridRefs') modelGrids: QueryList<UrebalGridComponent>;
    @ViewChild('chartReference') pieChart: jqxChartComponent;

    public attributes: any;
    public attributeType: string = "N/A";
    private attributeParam: string = "";
    private gridHeader = false;
    public modelName: string;
    public modelType: number;
    public gridData: any = [];
    private tickers: any = [];
    public isFlattened = false;
    public isPie = false;
    public isDrillDown = false;
    public pieData: any = [];
    private modelId: number;


    title: string = '';
    description: string = '';
    padding: any = {left: 0, top: 5, right: 5, bottom: 5};
    legendLayout: any = {
        left: 650,
        top: 30,
        width: 300,
        height: 200,
        flow: 'vertical'
    };

    seriesGroups: any[] =
        [
            {
                type: 'donut',
                useGradient: false, // disable gradient for the entire group
                series: [
                    {
                        useGradient: false,
                        dataField: 'value',
                        displayText: 'name',
                        radius: 200,
                        innerRadius: 100
                    },
                ]
            }
        ];

    constructor(private modelService: ModelService,
                public urebalService: URebalService,
                public urebalPermissions: UrebalPermissions,
                permissionResolverService: PermissionResolverService,
                private route: ActivatedRoute, private router: Router,
                private ref: ChangeDetectorRef
    ) {
      super(permissionResolverService);
        UILoader.start('Loading model...');

        this.route.params.subscribe(params => {
            this.modelId = params['modelId'];

            this.modelService.getModel(this.modelId).subscribe((result) => {
                if (result.code == 200) {
                    const model = result.responsedata;
                    this.modelName = model.name;
                    this.modelType = model.modelType;
                    this.attributeType = model.attributeType;

                    this.isFlattened = this.modelType != ModelType.Security_Model;

                    const hasViewModelPermission = modelTypePermissions.find((m) => m.modelType == this.modelType);
                    if (hasViewModelPermission && this.urebalPermissions.isAllowed(hasViewModelPermission.permissionName)) {
                        if (this.modelType == ModelType.Security_Model) {
                            this.gridData = [model];
                        } else {
                            this.getAttributeSummaryBySecurities();
                        }
                    } else {
                        this.router.navigate(['/user/forbiddenaccess']);
                    }

                    ref.detectChanges();
                } else {
                    this.router.navigate(['404']);
                }
            }, (error) => UILoader.blockUI.stop(),
            () => UILoader.blockUI.stop());
        });
    }

    switchPanels(name) {
        if (name == 'pie') {
            // TODO: Need to revisit.
            this.modelService.getAttributes()
                .subscribe((result) => {
                    if (result.code == 200) {
                        this.attributes = result.responsedata;

                        this.isPie = true;
                        this.isDrillDown = false;

                        if (this.attributeType == 'N/A' && this.attributes) {
                            this.attributeType = this.attributes[0].attributeType;

                            for (let attribute of this.attributes) {
                                if (attribute.attributeType === "Primary Asset Class") {
                                    this.attributeType = attribute.attributeType;
                                }
                            }
                        }

                        this.loadChartData((data) => {
                            this.pieData = sortBySystemPACOrder(data, 'name');
                            this.pieChart.update();
                        });

                        $('.collapsible-panel').hide();
                        $('.piechart').show();
                        $('#' + name).addClass('slds-button-active');
                        $('#' + name).prev().removeClass('slds-button-active');

                    } else {
                        console.error(result.message);
                    }
                });
        } else if (name == 'stack') {
            this.isPie = false;
            $('.collapsible-panel').show();
            $('.piechart').hide();
            $('#' + name).addClass('slds-button-active');
            $('#' + name).next().removeClass('slds-button-active');
        }
    }

    loadData(callback) {

        let data = [];
        UILoader.registerService(this.modelService.getModelDistribution);
        this.modelService.getModelDistribution(this.modelId)
            .subscribe((result) => {
                UILoader.unregisterService(this.modelService.getModelDistribution)
                if (result.code == 200) {
                    let modelDetails = result.responsedata;

                    if (this.modelType == 1) {
                        let modelElements = modelDetails[0]['modelElements'];
                        let childPie = [];

                        for (let modelElement of modelElements) {
                            childPie.push({
                                name: modelElement['ticker'],
                                value: +modelElement['target'],
                                min: +modelElement['min'],
                                max: +modelElement['max']
                            });
                        }

                        data.push({
                            id: modelDetails[0]['attributeID'],
                            name: modelDetails[0]['attributeName'],
                            value: modelDetails[0]['percentage'],
                            securities: childPie,
                            isSecurity: true
                        });
                    } else {
                        let subModels = modelDetails['subModels'];
                        for (let subModel of subModels) {
                            let childPie = new Array();
                            let modelElements = subModel['modelElements'];

                            for (let modelElement of modelElements) {
                                childPie.push({
                                    ticker: modelElement['ticker'],
                                    target: +modelElement['target'],
                                    min: +modelElement['min'],
                                    max: +modelElement['max']
                                });
                            }

                            data.push({
                                id: subModel['attributeID'],
                                name: subModel['attributeName'],
                                value: subModel['percentage'],
                                elements: childPie,
                                isSecurity: (!subModel.subModelId)
                            });
                        }
                    }

                    callback(data);
                    UILoader.stop();
                }

            });
    }

    loadChartData(callback) {

        let data = [];
        UILoader.blockUI.start('Loading Model...');
        this.modelService.getModelDistributionForAttributeType(this.modelId, encodeURIComponent(this.attributeType))
            .subscribe((result) => {
                if (result.code == 200) {
                    let modelDetails = result.responsedata;

                    let subModels = modelDetails['subModels'];
                    for (let subModel of subModels) {
                        let childPie = [];
                        let modelElements = subModel['modelElements'];

                        for (let modelElement of modelElements) {
                            childPie.push({
                                name: modelElement['ticker'],
                                value: +modelElement['target'],
                                min: +modelElement['min'],
                                max: +modelElement['max']
                            });
                        }

                        data.push({
                            id: subModel['attributeID'],
                            name: subModel['attributeName'],
                            value: subModel['percentage'],
                            securities: childPie
                        });
                    }

                    callback(data);
                    UILoader.blockUI.stop();
                }

            });

    }

    onAttributeChange() {
        if (this.attributeType != 'N/A') {
            this.isDrillDown = false;
            this.loadChartData((data) => {
                this.pieData = sortBySystemPACOrder(data, 'name');
                this.pieChart.update();
            });
        }
    }

    drillDown(event: any) {

        if (event.args && event.args.elementIndex !== undefined && this.pieData[event.args.elementIndex].securities !== undefined) {
            this.pieData = sortByKey(this.pieData[event.args.elementIndex].securities, 'name');
            this.pieChart.update();
            this.isDrillDown = true;
        }
    }

    getFlattenValue(modelPercentage: number, value: number, shouldFlatten: boolean) : number {
        if (shouldFlatten) {
            return (modelPercentage * value) / 100;
        } else {
            return (value / modelPercentage) * 100;
        }
    }

    isFlattenedChanged(flatten: boolean) {
        for (let i = 0; i < this.gridData.length; i++) {
            if (this.gridData[i].isSecurity)
                continue;
            for (let j = 0; j < this.gridData[i].elements.length; j++) {
                const target = this.gridData[i].elements[j].target;
                const min = this.gridData[i].elements[j].min;
                const max = this.gridData[i].elements[j].max;
                const modelPercentage = this.gridData[i].value;

                this.gridData[i].elements[j].target = this.getFlattenValue(modelPercentage, target, flatten);
                this.gridData[i].elements[j].min = this.getFlattenValue(modelPercentage, min, flatten);
                this.gridData[i].elements[j].max = this.getFlattenValue(modelPercentage, max, flatten);
            }
        }
        this.modelGrids.forEach(gridInstance => gridInstance.refreshGrid());
    }

    collapse(id) {

        if ($('.ur-collapsible').find('.urebal-collapsible-body-nostyle').length < 2) {
            return false;
        }

        var collapsible_body = $('#' + id).next();

        //close all other opened collapsible divs
        /*$('.ur-collapsible').find('.urebal-collapsible-body-nostyle').each(function(i){

          $(this).not(collapsible_body).removeClass('ur-is-open').hide('fast');
        });*/

        if (collapsible_body.hasClass('ur-is-open')) {
            collapsible_body.removeClass('ur-is-open').hide('fast');
            $('#' + id).find('.chevronDown').show();
            $('#' + id).find('.chevronUp').hide();
        } else {
            // this.grid.forEach((gridInstance,index) => {gridInstance.refreshGrid()});
            collapsible_body.addClass('ur-is-open ur-is-active').show('fast');
            $('#' + id).find('.chevronDown').hide();
            $('#' + id).find('.chevronUp').show();
        }
    }

    gotoEdit() {
        if (this.modelType == 1) {
            this.router.navigate(
                ['/secure/model/securityModel/edit', this.modelId]);
        } else if (this.modelType == 3) {
            this.router.navigate(
                ['/secure/model/attributeModel', URebalUtil.encodeparams(this.modelName), this.modelId]);
        } else if (this.modelType == 4) {
            this.router.navigate(
                ['/secure/model/compositemodel', URebalUtil.encodeparams(this.modelName), this.modelId]);
        }
    }

    getSelectedTickerName(array, security, modelSec) {
        let index = array.findIndex(sec => sec.securityId == security);
        if (index >= 0) {
            modelSec.tickerName = array[index].securityDescription;
        }
    }

    getAttrSummary(item, modelSec, dataArray) {
        this.modelService.getAttributeSummarybySecurity(item).subscribe(result => {
            if (result.code == 200) {
                for (let i = 0; i < result.responsedata.length; i++) {
                    if (result.responsedata[i].attributeType == 'Size') {
                        modelSec.size = result.responsedata[i].attributeName;
                    } else if (result.responsedata[i].attributeType == 'Style') {
                        modelSec.style = result.responsedata[i].attributeName;
                    } else {
                        modelSec.sector = result.responsedata[i].attributeName;
                    }
                }

                let index = dataArray.findIndex(data => data.name == item);
                if (index >= 0) {
                    dataArray[index] = modelSec;
                }
            } else {
                modelSec.size = '';
                modelSec.sector = '';
                modelSec.sector = '';
            }
        });
    }

    getAttributeSummaryBySecurities() {
        let securitiesArr: any = [];
        this.loadData(data => {

            if (this.modelType == 1) {
                this.getAllSecurities(data[0].elements, securitiesArr);
            } else {
                for (let i = 0; i < data.length; i++) {
                    this.getAllSecurities(data[i].elements, securitiesArr);
                }
            }

            let params = '';
            securitiesArr.forEach(security => {
                params += "securityID=" + security + "&";
            });

            UILoader.start("Loading model details...");
            UILoader.registerService(this.modelService.getAttribyteSummaryByAllSecurities);
            this.modelService.getAttribyteSummaryByAllSecurities(params.slice(0, -1)).subscribe(result => {
                UILoader.unregisterService(this.modelService.getAttribyteSummaryByAllSecurities);
                if (result.code == 200) {
                    for (let j = 0; j < data.length; j++) {
                        for (let k = 0; k < result.responsedata.length; k++) {
                            let index = data[j].elements.findIndex(
                                row => row.ticker == result.responsedata[k].SECURITY_ID);
                            if (index >= 0) {
                                data[j].elements[index].securityName =
                                    result.responsedata[k].SECURITY_DESCRIPTION;
                                data[j].elements[index].size = result.responsedata[k].SIZE;
                                data[j].elements[index].sector = result.responsedata[k].SECTOR;
                                data[j].elements[index].style = result.responsedata[k].STYLE;
                            }
                        }
                    }
                }

                this.gridData = data;
                UILoader.stop();
            });
        });
    }

    getAllSecurities(data, arr) {
        for (let i = 0; i < data.length; i++) {
            arr.push(data[i].ticker);
        }
        return arr;
    }

    modelDetailsGridCols() {
        let data = [
            {
                text: "Security ID",
                align: "center",
                datafield: "ticker",
                width: "15%",
                cellsrenderer: "cellsRenderer"
            },
            {
                text: "Security Name",
                align: "center",
                datafield: "securityName",
                width: "25%",
                cellsrenderer: "cellsRenderer"
            },
            {
                text: "Size",
                align: "center",
                datafield: "size",
                width: "8%",
                cellsrenderer: "cellsRenderer"
            },
            {
                text: "Style",
                align: "center",
                datafield: "style",
                width: "8%",
                cellsrenderer: "cellsRenderer"
            },
            {
                text: "Sector",
                align: "center",
                datafield: "sector",
                width: "8%",
                cellsrenderer: "cellsRenderer"
            },
            {
                text: "Min %",
                align: "center",
                cellsalign: "right",
                datafield: "min",
                width: "12%",
                cellsrenderer: "cellsRenderer",
                cellsformat: "d2"
            },
            {
                text: "Target %",
                align: "center",
                cellsalign: "right",
                datafield: "target",
                width: "12%",
                cellsrenderer: "cellsRenderer",
                cellsformat: "d2"
            },
            {
                text: "Max %",
                align: "center",
                cellsalign: "right",
                datafield: "max",
                width: "12%",
                cellsrenderer: "cellsRenderer",
                cellsformat: "d2"
            }
        ];

        SoftpakGridHelper.mergeGridColumnProperties(data, modelDetailGridColsMeta);

        return data;
    }

    getModelTitle(model) {
        if (this.modelType == ModelType.Security_Model) {
            return model.name;
        }
        else {
            return model.name + ' | ' + model.value + '%'
        }
    }
}
