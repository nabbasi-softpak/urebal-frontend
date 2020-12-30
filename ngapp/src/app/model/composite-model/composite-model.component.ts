import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Directive,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {AutocompleteComponent} from '../../shared/components/autocomplete/autocomplete.component';
import {UILoader} from '../../shared/util/UILoader';
import {NgModel} from "@angular/forms";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {ModelService} from "../model.service";
import {ModelComponent} from "../model-list/model.component";
import {ActivatedRoute, Router} from "@angular/router";
import {URebalService} from "../../services/urebal.service";

import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {
    SOFTPAK_CHART_COLOR_SCHEME,
    SoftpakChartComponent
} from "../../shared/jqwidgets/jqx-chart/softpak-chart.component";
import {JqxChartFactory} from "../../shared/jqwidgets/jqx-chart/jqx-chart.factory";
import {JqxChartPieData} from "../../shared/jqwidgets/jqx-chart/jqx-chart.data-types";
import {
    columnsModelEdit,
    showModelDetailColumns
} from "./composite-model.datasource";
import {MMGridItem, MMItemType, ModelGridSecurities, ModelType} from "../model.data-types";
import {DialogModalComponent} from "../../shared/components/dialog-modal/dialog-modal.component";
import {MessageModalComponent} from "../../shared/components/message-modal/message-modal.component";
import {formatNumberOrNull, isNumeric, sortByKey, sortBySystemPACOrder} from "../../shared/util/HelperUtils";
import {map} from "rxjs/operators";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {forkJoin} from "rxjs";
import {calculateTotalTarget, handleGridKeyboardNavigation, sourceModelEdit} from "../model.datasource";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";


@Directive({
    selector: '[ngModel][integerVal]',
    providers: [NgModel],
    host: {
        "(ngModelChange)": 'stringToInteger($event)'
    }
})

export class StringToIntegerConversionDirective {
    constructor(private myModel: NgModel) {
    }

    stringToInteger(event) {
        if (isNaN(event)) {
            this.myModel.valueAccessor.writeValue(0.0);
        }
    }
}


@Component({
    selector: 'app-composite-model',
    templateUrl: './composite-model.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompositeModelComponent extends ModelComponent {
    MMItemType = MMItemType;

    @ViewChild('modelGridRef', {static: true}) modelGrid: SoftpakGridComponent;
    @ViewChild('pieChartRef') modelPieChart: SoftpakChartComponent;
    @ViewChild('AutocompleteRef') autoComplete: AutocompleteComponent;
    @ViewChildren(ModalComponent) compositeModal: QueryList<ModalComponent>;
    @ViewChild(UrebalGridComponent) gridComponent: UrebalGridComponent;
    @ViewChild('saveModalRef') saveModal: MessageModalComponent;
    @ViewChild('showModelSecuritiesRef') showModelSecurities: MessageModalComponent;
    @ViewChild('saveAsSecurityModelModalRef') saveAsSecurityModelModal: DialogModalComponent;
    @ViewChild("removeSecurityModalRef") removeSecurityModal: DialogModalComponent;
    @ViewChild("modelSecuritiesGridRef") showModelSecuritiesGrid: SoftpakGridComponent;

    securityErrMsg: string;
    modelsArray: any = [];
    modelIdsArray: any = [];
    isSecurity: boolean;
    isModel: boolean;
    isBoth: boolean;
    modelSuccessMessage: string;
    columnsModelEdit: any;
    errorMessage: string = '';

    showModelDetailSource: any = sourceModelEdit;
    showModelDetailColumns: any = showModelDetailColumns();
    sourceModelEdit: any = sourceModelEdit;
    dataAdapterModelEdit: any = new jqx.dataAdapter(this.sourceModelEdit);
    showModelDetailsDataAdapter: any = new jqx.dataAdapter(this.showModelDetailSource);

    title: string = '';
    description: string = '';
    seriesGroups: any[];
    action: boolean;

    private currentState: MMItemType = MMItemType.MODEL;
    private selectedRowIdx: number = -1;
    private models: any[] = [];
    private modelSecurities: any[] = [];

    constructor(modelService: ModelService, router: Router, private route: ActivatedRoute, public urebalService: URebalService, protected ref: ChangeDetectorRef) {
        super(modelService, router, ref);

        // Update Pie chart dimensions to fit on screen
        this.chartWidth = "100%";
        this.chartHeight = 350;
        this.seriesGroups = JqxChartFactory.getChartSeriesGroup({
            type: 'pie',
            colorScheme: SOFTPAK_CHART_COLOR_SCHEME,
            series: [{
                radius: "90%"
            }]
        });
    }

    ngOnInit() {
        this.initLoading([
            this.getModelList()
        ]);

        this.columnsModelEdit = columnsModelEdit.call(null, this, this.modelGrid);

        this.modelGrid.handlekeyboardnavigation(
            handleGridKeyboardNavigation.bind(null, this, this.modelGrid)
        );

        SoftpakGridHelper.rearrangeGridColumns(this.columnsModelEdit);
    }

    initLoading(requests: any[]) {
        this.route.params.subscribe(params => {
            if (params['modelName'] && params['modelId']) {
              this.modelId = params['modelId'];
              this.modelName = URebalUtil.decodeparams(params['modelName']);
              this.action = params['action'] == "copy";
              console.log(this.action)
              if(this.action){
                this.isEdit = false;
              } else {
                this.isEdit = true;
              }

                requests.push(this.loadModelData(this.modelId));
            }

            UILoader.blockUI.start("Loading...");
            forkJoin(requests).subscribe(
                (result) => {
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    UILoader.blockUI.stop();
                })
        });
    }

    selectSecurity() {
        this.isSecurity = true;
        this.isModel = false;
        this.isBoth = false;
        this.currentState = MMItemType.SECURITY;
    }

    getModelList() {
        return this.modelService.getModelsList().pipe(map(result => {
            if (result.code == 200) {
                for (let i = 0; i < result.responsedata.length; i++) {
                    if (result.responsedata[i].modelType == "Security Model") {
                        this.models.push(result.responsedata[i]);

                        this.modelIdsArray.push(result.responsedata[i].modelId);
                        this.modelsArray.push(result.responsedata[i].modelName);
                    }
                }

                // TODO: Place this in right place. This function need to be call on page ngOnInit but depend on this service.
                this.selectModel();
            }
        }));
    }

    getModelSecurities(modelId) {
        return this.modelService.getModel(modelId).pipe(map((response) => {
            if (response.code == 200) {
                const modelData = response.responsedata;

                return modelData.elements.map((security) => {
                    return new ModelGridSecurities({
                        securityId: security.ticker,
                        target: security.target,
                        min: security.min,
                        max: security.max,
                        isPriceMiss: security.isPriceMiss,
                        tickerName: security.securityName,
                        primaryAssetClass: security.primaryAssetClass,
                        securityType: security.securityType
                    })
                });
            }

            return null;
        }));
    }

    selectModel() {
        this.autoComplete.placeholder = "Enter Model Name";
        this.autoComplete.template = "none";
        this.autoComplete.item = "";
        this.autoComplete.items = this.modelsArray;
        this.isSecurity = false;
        this.isModel = true;
        this.isBoth = false;
        this.currentState = MMItemType.MODEL;
    }

    haveValidSecurities() {
        const items: MMGridItem[] = this.modelGrid.getrows();
        if (items.length == 0) return false;

        for (let item of items) {
            if (item.type == MMItemType.SECURITY &&
                !(
                    isNumeric(item.target) &&
                    isNumeric(item.min) &&
                    isNumeric(item.max) &&
                    parseFloat(item.min) <= parseFloat(item.target) &&
                    parseFloat(item.target) <= parseFloat(item.max)
                )
            ) {
                return false;
            } else if (item.type == MMItemType.SECURITY &&
                !isNumeric(item.target)
            ) {
                return false;
            }
        }

        return true;
    }

    allowSave() {
        this.totalTarget = calculateTotalTarget(this.modelGrid);
        if (!(this.totalTarget >= 99.999 && this.totalTarget < 100.0001)) {
            return false;
        }

        if (!this.isEdit) {
            if (!this.modelName || this.invalidModelName || this.modelAlreadyExist) {

                if (!this.modelErrorMessage && !this.modelName) {
                    this.invalidModelName = true;
                    this.modelErrorMessage = 'Please enter model name';
                    this.ref.detectChanges();
                }
                return false;
            }
        }

        return this.haveValidSecurities();
    }

    getModelsFromGrid() {
        return this.modelGrid
            .getrows()
            .filter(value => value.type == MMItemType.MODEL)
            .map(value => {
                return {
                    "modelTarget": formatNumberOrNull(value.target),
                    "model": {
                        "id": value.modelId,
                        "name": value.name,
                        "modelType": 1
                    }
                }
            });
    }

    getSecuritiesFromGrid() {
        return this.modelGrid
            .getrows()
            .filter(value => value.type == MMItemType.SECURITY)
            .map(value => {
                return {
                    "ticker": value.securityId,
                    "target": formatNumberOrNull(value.target),
                    "min": formatNumberOrNull(value.min),
                    "max": formatNumberOrNull(value.max),
                    "tickerName": value.name,
                }
            });
    }

    saveModel(model, isEdit = false, modelId = null) {
        UILoader.blockUI.start('Saving Model...'); // Start blocking

        this.modelService.createEditModel(model, isEdit, modelId).subscribe(result => {
                if (result.code == 200) {
                    this.invalidModel = false;
                    this.modelSuccessMessage = result.message;
                    this.saveModal.open();
                } else {
                    this.invalidModel = true;
                    this.modelErrorMessage = result.message;
                }
                this.ref.detectChanges();
            },
            err => {
                console.log(err);
            }, () => {
                UILoader.blockUI.stop();
            }
        );
    }

    saveModelOfModel() {

        if (!this.allowSave()) return;

        this.modelErrorMessage = "";

        const models = this.getModelsFromGrid();
        const securities = this.getSecuritiesFromGrid();

        if (models.length == 0) {
            this.saveAsSecurityModelModal.content = `Model <i>${this.modelName}</i> contain securities only and no sub-models. Save Model <i>${this.modelName}</i> as a Security Model instead of a Model of Models?`;
            this.saveAsSecurityModelModal.open();
            return;
        }

        let model = {
            "type": ModelType.AssetModel,
            "compositeModelDTO": {
                "modelName": this.modelName,
                "models": models,
                "securities": securities
            }
        };

        this.saveModel(model, this.isEdit, this.modelId);
    }

    saveAsSecurityModel() {
        this.saveAsSecurityModelModal.close();

        const securities = this.getSecuritiesFromGrid();
        let model = {
            "type": ModelType.SecurityModel,
            "model": {"name": this.modelName, "modelType": ModelType.SecurityModel, "elements": securities}
        };

        this.saveModel(model, this.isEdit, this.modelId);
    }

    selectModelType(event) {
        if (event.target) {
            const value = event.target.value;
            if (value == 'security') {
                this.selectSecurity();
            } else if (value == 'model') {
                this.selectModel();
            }
        }
        this.ref.detectChanges();
    }

    private alreadyExist(grid: SoftpakGridComponent, value, key) {
        return grid.getrows().findIndex(row => {
            return row[key] == value
        }) >= 0;
    }

    private isItemType(item: MMItemType) {
        return this.currentState == item;
    }

    addItemsOnSelect(item) {
        this.errorMessage = '';
        UILoader.blockUI.start('Adding Item...');

        if (item) {
            const itemType = this.autoComplete.template; // security or model

            const key = this.isItemType(MMItemType.MODEL) ? 'name' : 'securityId';
            const value = this.isItemType(MMItemType.MODEL) ? item : item.securityId;

            if (this.alreadyExist(this.modelGrid, value, key)) {
                this.errorMessage = '';
                if (this.isItemType(MMItemType.SECURITY)) {
                    this.errorMessage = "Security has already been added."
                } else {
                    this.errorMessage = "Model has already been added."
                }
                UILoader.blockUI.stop();
            } else if (this.isItemType(MMItemType.SECURITY)) {
                const security = item;

                let gridItem = new MMGridItem({
                    type: MMItemType.SECURITY,
                    securityId: security.securityId,
                    name: security.securityDescription,
                    primaryAssetClass: security.primaryAssetClass,
                    securityType: security.securityType
                });

                this.addRowToGrid(gridItem);
                this.ref.detectChanges();
                UILoader.blockUI.stop();
            } else if (this.isItemType(MMItemType.MODEL)) {
                const modelName = item;
                const modelIdx = this.models.findIndex((model) => model.modelName == modelName);
                const modelDetail = this.models[modelIdx];

                this.getModelSecurities(modelDetail.modelId).subscribe(securities => {
                    if (securities) {
                        let item = new MMGridItem({
                            type: MMItemType.MODEL,
                            name: modelName,
                            modelId: modelDetail.modelId
                        });

                        this.modelSecurities.push({
                            modelName: modelName,
                            modelId: modelDetail.modelId,
                            securities: securities
                        });

                        this.addRowToGrid(item);
                    }
                }, error => {
                    console.log(error);
                }, () => {
                    UILoader.blockUI.stop();
                });
            }
        }
    }

    setGridData(data: any) {
        this.gridComponent.refreshGrid(data);
    }

    navigateToModelList() {
        this.router.navigate(['/secure/model/list']);
    }

    ngAfterViewInit() {
        this.createPieChart(true);
    }

    createPieChart(drawEmpty: boolean = false) {
        if (!drawEmpty) {
            let gridItems = this.modelGrid.getrows();

            let chartData = {};

            // TODO: Clean this code

            // Adding Sub-Model Securities
            for (let model of this.modelSecurities) {

                let modelTarget = gridItems.filter((item) => item.modelId == model.modelId)[0].target;
                modelTarget = parseFloat(modelTarget) || 0;
                modelTarget = modelTarget / 100;

                for (let security of model.securities) {
                    const key = security['primaryAssetClass'] || "N/A";

                    if (!chartData[key]) chartData[key] = 0;

                    if (security.target) chartData[key] += security.target * modelTarget;
                }
            }

            // Adding Model Securities
            for (let item of gridItems) {

                if (item.type == MMItemType.MODEL) continue; // skip model item

                const key = item['primaryAssetClass'] || "N/A";

                if (!chartData[key]) chartData[key] = 0;

                if (item.target) chartData[key] += item.target;
            }

            let pieData: JqxChartPieData[] = [];

            for (const key in chartData) {
                pieData.push(new JqxChartPieData({
                    name: key,
                    value: parseFloat(chartData[key])
                }));
            }

            pieData = sortByKey(pieData, 'name');

            this.totalTarget = calculateTotalTarget(this.modelGrid);

            const remainingTarget = 100 - this.totalTarget;

            if (remainingTarget > 0) {
                pieData.push(new JqxChartPieData({
                    name: "",
                    value: remainingTarget
                }));
                const emptyPieIdx = pieData.length - 1;
                this.modelPieChart.setSoftpakColorScheme(emptyPieIdx);
            } else {
                this.modelPieChart.setSoftpakColorScheme();
            }

            this.modelPieChart.showToolTips(true);

            this.pieData = sortBySystemPACOrder(pieData, 'name');
        } else {
            // Draw empty pie char
            this.modelPieChart.setSoftpakColorScheme(0);
            this.modelPieChart.showToolTips(false);
            this.pieData = [new JqxChartPieData({
                name: "",
                value: 100
            })];
        }

        this.modelPieChart.update();
        this.ref.detectChanges();
    }

    onSelectSearchSecurities(selectedSecurities) {
        selectedSecurities.forEach((security) => {
            const securityId = security.securityId;

            const modelSec = new ModelGridSecurities({
                securityId: securityId,
                name: security.securityName,
                type: MMItemType.SECURITY,
                primaryAssetClass: security.primaryAssetClass,
                securityType: security.securityType
            });

            if (!this.alreadyExist(this.modelGrid, securityId, 'securityId')) {
                this.addRowToGrid(modelSec);
            }
        });
    }

    deleteSecurity(rowIdx: number) {
        let rowItem = this.modelGrid.getrowdata(rowIdx);

        let message = '';
        if (rowItem.type == MMItemType.SECURITY) {
            message = `Do you want to remove security <b>${rowItem.name}</b> (${rowItem.securityId})?`;
        } else {
            message = `Do you want to remove model <b>${rowItem.name}</b>?`;
        }

        this.removeSecurityModal.content = message;

        this.removeSecurityModal.open();
        this.selectedRowIdx = rowIdx;
    }

    removeSecurityGridRow() {
        const rowData = this.modelGrid.getrowdata(this.selectedRowIdx);
        const rowId = this.modelGrid.getrowid(this.selectedRowIdx);
        this.modelGrid.deleterow(rowId);
        this.removeSecurityModal.close();

        if (rowData.type == MMItemType.MODEL) {
            this.modelSecurities = this.modelSecurities.filter((item) => item.modelName != rowData.name );
        }

        this.createPieChart();
    }

    endSecurityCellEdit(event: any) {
        this.createPieChart();
    }

    onCellSelect(event: any) {
        const {datafield, rowindex} = event.args;

        // Set selected cell to editable (no need to click)
        const columnEditable = this.modelGrid.getcolumnproperty(datafield, 'editable');
        if (columnEditable) {
            this.modelGrid.begincelledit(rowindex, datafield);
        }
    }

    onCellClick(event: any) {
        const rowIndex = event.args.rowindex;
        const rowData = this.modelGrid.getrowdata(rowIndex);

        if (event.args.datafield == 'name' && rowData.type == MMItemType.MODEL) {
            this.openShowSecuritiesModel(rowData); // Open model detail modal
        }
    }

    openShowSecuritiesModel(rowData) {
        const modelName = rowData.name;
        const modelId = rowData.modelId;

        let modelSecurities = this.modelSecurities.filter((model) => model.modelId == modelId);
        modelSecurities = modelSecurities[0].securities;

        for (let security of modelSecurities) {
            this.showModelSecuritiesGrid.addrow(null, security);
        }

        this.showModelSecurities.title = `Model Details (${modelName})`;
        this.showModelSecurities.open();
    }

    closeShowSecuritiesModal() {
        this.showModelSecuritiesGrid.clear();
        this.showModelSecurities.close();
    }

    private loadModelData(modelId: number) {
        return this.modelService.getModel(modelId).pipe(map((response) => {
            if (response.code == 200) {
                const modelData = response.responsedata;
                const modelSecurities = modelData.elements;
                const modelSubModels = modelData.submodels;

                let gridItem = [];

                for (let subModel of modelSubModels) {
                    const item = new MMGridItem({
                        type: MMItemType.MODEL,
                        name: subModel.sleeve.name,
                        modelId: subModel.sleeve.id,
                        target: subModel.ratio,
                    });

                    gridItem.push(item);

                    // TODO: Generalize this because this.modeSecurities is loaded from two places.
                    this.modelSecurities.push({
                        modelName: subModel.sleeve.name,
                        modelId: subModel.sleeve.id,
                        securities: subModel.sleeve.elements.map(security => {
                                return {
                                    tickerName: security.securityName,
                                    securityId: security.ticker,
                                    securityType: security.securityType,
                                    primaryAssetClass: security.primaryAssetClass,
                                    target: security.target,
                                    min: security.min,
                                    max: security.max
                                };
                            }
                        )
                    });

                }

                gridItem = sortByKey(gridItem, 'name');
                this.addRowToGrid(gridItem);

                gridItem = [];

                for (let security of modelSecurities) {
                    const item = new MMGridItem({
                        type: MMItemType.SECURITY,
                        name: security.securityName,
                        securityId: security.ticker,
                        primaryAssetClass: security.primaryAssetClass,
                        securityType: security.securityType,
                        target: security.target,
                        min: security.min,
                        max: security.max
                    });

                    gridItem.push(item);
                }

                gridItem = sortByKey(gridItem, 'name');
                this.addRowToGrid(gridItem);

                this.createPieChart();
            }
        }));
    }

    addRowToGrid(security) {
        this.modelGrid.addrow(null, security);

        const lastRowIdx = parseInt(this.modelGrid.getdatainformation().rowscount) - 1;
        this.modelGrid.ensurerowvisible(lastRowIdx);
    }
}
