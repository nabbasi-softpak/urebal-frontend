import {Component, OnInit, Inject, ViewChild, ViewChildren, QueryList, ChangeDetectorRef} from "@angular/core";
import {Router} from "@angular/router";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';


import {UILoader} from '../../shared/util/UILoader';
import {ModelBuilderComponent} from "../components/model-builder/model-builder.component";
import {jqxChartComponent} from "@jqxSource/angular_jqxchart";

import {ModelService} from '../model.service';
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {DialogModalComponent} from "../../shared/components/dialog-modal/dialog-modal.component";
import {sortBySystemPACOrder} from "../../shared/util/HelperUtils";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {modelListGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";

@Component({
    selector: 'app-model',
    templateUrl: './model.component.html',
    styles: []
})
export class ModelComponent implements OnInit {

    public modelName: string;
    protected modelId: number;
    protected modelErrorMessage: string;
    public invalidModelName: boolean = false;
    protected totalTarget: number = 0;
    public isEdit: boolean = false;
    protected encodedModelName: any;
    public modelAlreadyExist: boolean = false;
    protected model: any;
    protected modelType: number;
    public invalidModel: boolean = false;
    @ViewChild(ModelBuilderComponent, {static: true}) modelBuilder: ModelBuilderComponent;
    @ViewChild(jqxChartComponent, {static: true}) modelPieChart: jqxChartComponent;
    @ViewChild(UrebalGridComponent) modelsList: UrebalGridComponent;
    @ViewChildren(ModalComponent) testModal: QueryList<ModalComponent>;
    @ViewChild('dialogDeleteModal') dialogDeleteModal: DialogModalComponent;
    @ViewChild('dialogDeleteConfirmationModal') dialogDeleteConfirmationModal: DialogModalComponent;
    // @ViewChild('modelListDeleteConfirmModalRef') deleteModelConfirmModal: ModalComponentt;
    public chartWidth: any;
    public chartHeight: any;
    public deleteResposeMsg: string = '';

    //"params": ["modelName","modelTypeNum"]}
    constructor(protected modelService: ModelService, protected router: Router, protected ref: ChangeDetectorRef) {
    }

    ngOnInit() {

    }

    title: string = '';
    public pieData: any = [];
    description: string = '';
    padding: any = {left: 0, top: 5, right: -1, bottom: 5};
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
                type: 'pie',
                showLabels: true,
                useGradient: false, // disable gradient for the entire group
                series: [
                    {
                        dataField: 'value',
                        displayText: 'name',
                        radius: 200
                    }
                ]
            }
        ];

    OnLinkActive(event: GridLinkInfo) {
        // Call the relevant method as per data in event object
        if (event.linkType == "routeToDetail") {
            this.routeToDetail(event.linkParams["modelTypeNum"], event.linkParams["modelName"], event.linkParams["modelAttributeType"], event.linkParams["modelId"]);
        } else if (event.linkType == "routeToAction") {
            this.routeToAction(event.linkParams["modelName"], event.linkParams["modelTypeNum"], event.linkParams["modelId"]);
        } else if (event.linkType == "routeToCopyAction") {
            this.routeToAction("Copy of " + event.linkParams["modelName"], event.linkParams["modelTypeNum"], event.linkParams["modelId"], "copy");
        } else if (event.linkType == "deleteModel") {
            this.deleteModel(event.linkParams["modelName"], event.linkParams["modelTypeNum"], event.linkParams["modelId"], event.linkParams["assignedAccountsCount"]);
        }
    }

    routeToDetail(modelType, modelName, attributeType, modelId) {
        this.router.navigate(['/secure/model/detail', modelId]);
    }

    routeToAction(modelName, modelTypeNum, modelId, action?) {
        if (modelTypeNum == 1) {
            if (action == undefined) {
                this.router.navigate(['/secure/model/securityModel/edit', modelId]);
            } else {
                this.router.navigate(['/secure/model/securityModel', modelId, action]);
            }
        } else if (modelTypeNum == 3) {
            if (action == undefined) {
                this.router.navigate(['/secure/model/attributeModel', URebalUtil.encodeparams(modelName), modelId]);
            } else {
                this.router.navigate(['/secure/model/attributeModel', URebalUtil.encodeparams(modelName), modelId, action]);
            }
        } else if (modelTypeNum == 4) {
            if (action == undefined) {
                this.router.navigate(['/secure/model/compositemodel', URebalUtil.encodeparams(modelName), modelId]);
            } else {
                this.router.navigate(['/secure/model/compositemodel', URebalUtil.encodeparams(modelName), modelId, action]);
            }
        }
    }

    deleteModel(modelName, modelTypeNum, modelId, assignedAccountsCount) {

        let message = "";

        this.getParentInformation(modelId, modelName, message, (message) => {


            if (assignedAccountsCount != '0') {
                message += `Model <b>${modelName}</b> is assigned to <b>${assignedAccountsCount}</b> account(s). Are you sure you want to delete this model?`;
            } else {
                message += `Are you sure you want to delete model <b>${modelName}</b> ?`;
            }

            this.deleteResposeMsg = message;
            this.modelName = modelName;
            this.modelId = modelId;
            this.modelType = modelTypeNum;
            this.dialogDeleteConfirmationModal.content = message;
            this.dialogDeleteConfirmationModal.open();

        });

    }

    getParentInformation(modelId, modelName, message, callback = (message) => {
    }) {
        this.modelService.getParentModels(modelId).subscribe(result => {
            if (result.code == 200) {
                message = `Model <b>${modelName}</b> is assigned as a sub-model for the following model of models:\n`;
                for (let entry of result.responsedata)
                    message += `<b>${entry.toString()}</b> \n`;
                message += `Deleting <b>${modelName}</b> will make these model(s) invalid.\n\n`;
            }

            callback(message);
        });

    }

    deleteModelYes() {
        this.closeModal();

        let model = {name: this.modelName, modelType: this.modelType};

        UILoader.blockUI.start('Deleting Model..'); // Start blocking
        this.modelService.delModel(this.modelId).subscribe(result => {
            UILoader.blockUI.stop();
            if (result.code == 200) {
                this.deleteResposeMsg = result.message;
                this.modelService.getModelsList().subscribe(result => {
                    this.modelsList.refreshGrid(result);
                });
                this.dialogDeleteModal.open();
            } else {
                this.deleteResposeMsg = "An error occurred during model deletion";
                this.dialogDeleteModal.open();
            }
        });

    }

    getModel() {
        if (typeof this.modelName != 'undefined') {
            this.modelName = this.modelName.replace(/(^\s+|\s+$)/g, '');

            if (this.modelName) {
                UILoader.blockUI.start('Loading...'); // Start blocking

                this.invalidModelName = false;
                this.modelAlreadyExist = false;
                this.modelErrorMessage = '';

                this.modelService
                    .checkModelExists(this.modelName)
                    .subscribe(
                        result => {
                            if (result.code == 200) {
                                this.modelId = result.responsedata.id;
                                let modelType = result.responsedata.modelType;

                                if (this.isEdit) {
                                    // It is edit mode, we need to check if given model is a
                                    // security model so that it can be loaded, else we will redirect
                                    // to 404 page.
                                    if (modelType == this.modelType) {
                                        // we can render this model, lets do it.
                                        UILoader.registerService(this.modelService.getModel);
                                        this.modelService.getModel(this.modelId)
                                            .subscribe(
                                                result => {
                                                    if (result.code == 200) {
                                                        this.model = result.responsedata;
                                                        this.modelName = this.model.name;
                                                        this.modelId = this.model.id;
                                                        this.modelType = this.model.modelType;

                                                        if (this.modelBuilder) {
                                                            this.modelBuilder.getSecurities();
                                                            this.modelBuilder.securityModel = this.model;
                                                        }
                                                    } else {

                                                        console.error(result.message);
                                                        this.invalidModelName = true;
                                                        this.modelErrorMessage = result.message;
                                                    }
                                                    UILoader.blockUI.stop();
                                                },
                                                (error) => {
                                                },
                                                () => {
                                                    this.ref.detectChanges();
                                                    UILoader.blockUI.stop();
                                                }
                                            );
                                    } else {
                                        // we cannot render this model type, redirect to 404 page
                                        this.router.navigate(['404']);
                                    }
                                } else {
                                    UILoader.blockUI.stop();
                                    // Not in edit mode, check if we can load this model
                                    if (modelType == this.modelType) {
                                        this.encodedModelName = URebalUtil.encodeparams(this.modelName);
                                        this.modelAlreadyExist = true;
                                    } else {
                                        // we cannot load this model because it is not of supported type
                                        this.invalidModelName = true;
                                        this.modelErrorMessage = "Model exists as another type.";
                                    }
                                }
                            } else {
                                UILoader.blockUI.stop();
                                if (result.code == -100) {
                                    //AF20191216: Allow model creation as model doesn't exist with this name
                                    this.invalidModelName = false;
                                    this.modelErrorMessage = ''
                                } else if (result.code == 404) {
                                    if (this.isEdit) {
                                        // If URL tempered and model not found, 404 page will be displayed
                                        this.router.navigate(['404']);
                                    } else {
                                        // Model does not exist, can create a model with this name
                                        this.invalidModelName = false;
                                        this.modelErrorMessage = '';
                                    }
                                } else {
                                    console.error(result.message);
                                    this.invalidModelName = false;
                                    this.modelErrorMessage = '';
                                }
                            }
                        },
                        err => {
                            console.error(err);
                            UILoader.blockUI.stop();
                            if (err != 200) {
                                this.router.navigate(['404']);
                            }
                        }, () => {
                            this.ref.detectChanges();
                        }
                    );
            } else {
                this.invalidModelName = true;
                this.modelErrorMessage = 'Please enter valid model name';
            }
        } else {
            this.invalidModelName = true;
            this.modelErrorMessage = 'Please enter valid model name';
        }

    }

    redirectToModels() {
        this.router.navigate(['/secure/model/list']);
    }

    createPieChart(data?) {
        this.invalidModel = false;
        this.modelErrorMessage = '';
        if (data != null && data.length != 0 && this.totalTarget <= 100) {
            let oldTarget = 0;
            this.chartWidth = "100%";
            this.chartHeight = 500;

            this.pieData = sortBySystemPACOrder(data, 'name');
            let remainingTarget = this.totalTarget / 100 * 360;
            this.modelPieChart.attrSeriesGroups[0].series[0].endAngle = remainingTarget;
            this.modelPieChart.backgroundImage(`${this.modelService.getAppContext()}/assets/images/circle-405.png`);
            this.modelPieChart.update();
        } else if ((data == null || data.length == 0) && this.pieData.length > 0) {
            this.pieData = [];
            this.modelPieChart.update();
        }
    }

    closeModal() {
        this.testModal.forEach(instance => {
            instance.close();
        })
    }

    modelListGridCols() {
        let data = [
            {
                text: "Status",
                width: "4.3%",
                datafield: "impartial",
                align: "center",
                cellsalign: "left",
                cellsrenderer: "imageRenderer"
            },
            {
                text: "Model ID",
                width: "5.1%",
                datafield: "modelId",
                align: "center",
                cellsalign: "right"
            },
            {
                text: "Model Name",
                width: "22.1%",
                datafield: "modelName",
                align: "center",
                cellsalign: "left",
                cellsrenderer: "linkRenderer"
            },
            {
                text: "Model Type",
                width: "17.1%",
                datafield: "modelType",
                align: "center",
                cellsalign: "left"
            },
            {
                text: "Securities",
                width: "6.1%",
                align: "center",
                cellsalign: "right",
                datafield: "elementsCount"
            },
            {
                text: "Asset Classes",
                width: "13.2%",
                align: "center",
                cellsalign: "right",
                datafield: "subModelsCount"
            },
            {
                text: "Cash Target %",
                width: "11.1%",
                align: "center",
                cellsalign: "right",
                datafield: "cashTargetPctWt",
                "cellsformat": "d2"
            },
            {
                text: "Assigned Account",
                width: "9.9%",
                datafield: "assignedAccountsCount",
                align: "center",
                cellsalign: "right"
            },
            {
                text: "Action",
                width: "11.1%",
                align: "center",
                cellsalign: "right",
                cellsrenderer: "actionRenderer",
                sortable: false
            }

        ]

        SoftpakGridHelper.mergeGridColumnProperties(data, modelListGridColsMeta)

        return data;
    }

}
