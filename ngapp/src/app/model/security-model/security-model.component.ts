import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {ModelComponent} from "../model-list/model.component";
import {ModelService} from '../model.service';
import {UILoader} from "../../shared/util/UILoader";
import {ModelBuilderComponent} from "../components/model-builder/model-builder.component";
import {columnsModelEdit,} from "./security-model.datasource";
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {
    SOFTPAK_CHART_COLOR_SCHEME,
    SoftpakChartComponent
} from "../../shared/jqwidgets/jqx-chart/softpak-chart.component";
import {JqxChartFactory} from "../../shared/jqwidgets/jqx-chart/jqx-chart.factory";
import {DialogModalComponent} from "../../shared/components/dialog-modal/dialog-modal.component";
import {ModelGridSecurities, ModelSaveSecurities, ModelType} from "../model.data-types";
import {JqxChartPieData} from "../../shared/jqwidgets/jqx-chart/jqx-chart.data-types";
import {MessageModalComponent} from "../../shared/components/message-modal/message-modal.component";
import {map} from "rxjs/operators";
import {forkJoin} from "rxjs";
import {formatNumberOrNull, isNumeric, sortByKey, sortBySystemPACOrder} from "../../shared/util/HelperUtils";
import {calculateTotalTarget, handleGridKeyboardNavigation, sourceModelEdit} from "../model.datasource";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

@Component({
    selector: 'app-security-model',
    templateUrl: './security-model.component.html',
    styleUrls: ['./security-model.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SecurityModelComponent extends ModelComponent {
    @ViewChild('secModelBuilder') secModelBuilder: ModelBuilderComponent;
    @ViewChild('saveModelRef') saveModelRef: MessageModalComponent;
    @ViewChild('secModelChartRef') modelPieChart: SoftpakChartComponent;
    @ViewChild("secModelGridRef", {static: true}) secModelGrid: SoftpakGridComponent;
    @ViewChild("removeSecurityModalRef") removeSecurityModal: DialogModalComponent;

    modelSuccessMessage: string = '';
    sourceModelEdit: any = sourceModelEdit;
    dataAdapterModelEdit: any = new jqx.dataAdapter(this.sourceModelEdit);
    columnsModelEdit: any[];
    securityExist: string;
    isCopyAction: boolean;

    private selectedRowIdx: number;

    constructor(public modelService: ModelService, protected router: Router,
                private route: ActivatedRoute, protected ref: ChangeDetectorRef) {
        super(modelService, router, ref);

        this.chartWidth = 350;
        this.chartHeight = 350;
        this.seriesGroups = JqxChartFactory.getChartSeriesGroup({
            type: 'pie',
            colorScheme: SOFTPAK_CHART_COLOR_SCHEME,
            series: [{
                radius: 150
            }]
        });
    }

    ngOnInit() {
        setTimeout(()=>{
          $('#input-01').focus();
        },1000);

        this.initLoading();

        this.modelType = ModelType.SecurityModel;

        this.columnsModelEdit = columnsModelEdit.call(null, this, this.secModelGrid);

        this.secModelGrid.handlekeyboardnavigation(
            handleGridKeyboardNavigation.bind(null, this, this.secModelGrid)
        )

        SoftpakGridHelper.rearrangeGridColumns(this.columnsModelEdit);
    }

    initLoading(requests: any[] = []) {
        this.route.params.subscribe(params => {
            if (params['modelId']) {
                this.modelId = params['modelId'];
                this.isCopyAction = params['isCopyAction'] == "copy";
                this.isEdit = !this.isCopyAction;

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

    ngAfterViewInit() {
        this.createPieChart(true);
    }

    saveSecurityModel() {
        if (!this.allowSave()) return;

        this.getModel();
        this.ref.detectChanges();

        if(!this.isModelNameValid()) return;

        this.getExistingModel().then(result => {
          this.ref.detectChanges();

          if(result){
            const modelSecurities: ModelSaveSecurities[] = this.getModelSecurities();
            let modelSave = {
              "type": ModelType.SecurityModel,
              "model": {"name": this.modelName, "modelType": ModelType.SecurityModel, "elements": modelSecurities}
            };

            UILoader.blockUI.start('Saving Model...'); // Start blocking
            this.modelService
              .createEditModel(modelSave, this.isEdit, this.modelId)
              .subscribe(
                result => {
                  if (result.code == 200) {
                    this.invalidModel = false;
                    this.modelSuccessMessage = result.message;
                    this.saveModelRef.open();
                  } else {
                    this.invalidModel = true;
                    this.modelErrorMessage = result.message;
                  }
                  this.ref.detectChanges();
                },
                err => {
                  console.error(err);
                },
                () => {
                  UILoader.blockUI.stop();
                }
              );
          }
        });
    }

    navigateToModelDetail() {
        if (this.isEdit) {
            const attributeType = "N/A";
            this.routeToDetail(
                ModelType.SecurityModel,
                this.modelName,
                attributeType,
                this.modelId
            );
        } else {
            this.router.navigate(['/secure/model/list']);
        }
    }

    private securityAlreadyExists(securityId) {
        return this.secModelGrid.getrows().findIndex(security => {
            return security.securityId == securityId
        }) >= 0;
    }

    onSecuritySelect(security) {
        UILoader.blockUI.start("Adding security...");

        this.securityExist = '';
        if (security && security.securityId != null) {
            if (this.securityAlreadyExists(security.securityId)) {
                this.securityExist = 'Security already exists';
                UILoader.blockUI.stop();
            } else {
                let modelSec = new ModelGridSecurities({
                    tickerName: security.securityDescription,
                    primaryAssetClass: security.primaryAssetClass,
                    securityType: security.securityType,
                    securityId: security.securityId,
                    isPriceMiss: !security.price,
                });

                this.addRowToGrid(modelSec);
                this.ref.detectChanges();
                UILoader.blockUI.stop();
            }
        }
    }

    addRowToGrid(security) {
        this.secModelGrid.addrow(null, security);

        const lastRowIdx = parseInt(this.secModelGrid.getdatainformation().rowscount) - 1;
        this.secModelGrid.ensurerowvisible(lastRowIdx);
    }

    haveValidSecurities() {
        const securities: ModelSaveSecurities[] = this.getModelSecurities();
        if (securities.length == 0) return false;

        for (let security of securities) {
            if (!(
                isNumeric(security.target) &&
                isNumeric(security.min) &&
                isNumeric(security.max) &&
                parseFloat(security.min) <= parseFloat(security.target) &&
                parseFloat(security.target) <= parseFloat(security.max)
            )) return false;
        }

        return true;
    }

    endSecurityCellEdit(event) {
        this.createPieChart();
    }

    deleteSecurity(rowIdx: number) {
        let security = this.secModelGrid.getrowdata(rowIdx);
        let {tickerName, securityId} = security;

        this.removeSecurityModal.content = `Do you want to remove security <b>${tickerName}</b> (${securityId})?`;

        this.removeSecurityModal.open();
        this.selectedRowIdx = rowIdx;
    }

    removeSecurityGridRow() {
        const rowId = this.secModelGrid.getrowid(this.selectedRowIdx);
        this.secModelGrid.deleterow(rowId);
        this.removeSecurityModal.close();
        this.createPieChart();
    }

    allowSave() {
        this.totalTarget = calculateTotalTarget(this.secModelGrid);
        if (!(this.totalTarget >= 99.999 && this.totalTarget < 100.0001)) {
            return false;
        }

        return this.haveValidSecurities();
    }

    isModelNameValid() {
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

      return true;
    }

    createPieChart(drawEmpty: boolean = false) {
        if (!drawEmpty) {
            let securities = this.secModelGrid.getrows();

            let chartData = {};
            for (let security of securities) {
                const key = security['primaryAssetClass'] || "N/A";

                if (!chartData[key]) chartData[key] = 0;

                if (security.target) chartData[key] += parseFloat(security.target) || 0;
            }

            let pieData: JqxChartPieData[] = [];

            for (const key in chartData) {
                pieData.push(new JqxChartPieData({
                    name: key,
                    value: chartData[key]
                }));
            }

            pieData = sortByKey(pieData, 'name');

            this.totalTarget = calculateTotalTarget(this.secModelGrid);

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

    getModelSecurities() {
        return this.secModelGrid.getrows().map((security) => {
            return new ModelSaveSecurities({
                error: security.error,
                isEdit: this.isEdit,
                max: formatNumberOrNull(security.max),
                min: formatNumberOrNull(security.min),
                target: formatNumberOrNull(security.target),
                ticker: security.securityId,
            });
        });
    }

    onSelectSearchSecurities(selectedSecurities) {
        selectedSecurities.forEach((security) => {
            const securityId = security.securityId;

            const modelSec = new ModelGridSecurities({
                securityId: securityId,
                isPriceMiss: !security.price,
                tickerName: security.securityName,
                primaryAssetClass: security.primaryAssetClass,
                securityType: security.securityType
            });

            if (!this.securityAlreadyExists(securityId)) {
                this.addRowToGrid(modelSec);
            }
        });
    }

    modelNameChanged() {
        // this.getModel();
        // this.ref.detectChanges();

        this.invalidModelName = false;
        this.modelAlreadyExist = false;
        this.modelErrorMessage = '';
        this.ref.detectChanges();
    }

    private loadModelData(modelId) {
        return this.modelService.getModel(modelId).pipe(map((response) => {
            if (response.code == 200) {
                const modelData = response.responsedata;

                this.modelName = modelData.name;

                if (this.isCopyAction) {
                    this.modelName = "Copy of " + this.modelName;
                }

                let modelSecurities: ModelGridSecurities[] = modelData.elements.map((security) => {
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
                modelSecurities = sortByKey(modelSecurities, 'securityId');
                this.addRowToGrid(modelSecurities);
                this.createPieChart()
            }
            else if (response.code == 404 || response.code == 0) {
                this.router.navigate(['404']);
            }
        }));
    }

    onCellSelect(event) {
        const {datafield, rowindex} = event.args;

        // Set selected cell to editable (no need to click)
        const columnEditable = this.secModelGrid.getcolumnproperty(datafield, 'editable');
        if (columnEditable) {
            this.secModelGrid.begincelledit(rowindex, datafield);
        }
    }

  async getExistingModel() {
    if (typeof this.modelName != 'undefined') {
      this.modelName = this.modelName.replace(/(^\s+|\s+$)/g,'');

      if(this.modelName) {
        UILoader.blockUI.start('Loading...'); // Start blocking

        this.invalidModelName = false;
        this.modelAlreadyExist = false;
        this.modelErrorMessage = '';

        if(this.isEdit){
          return true;
        }

        let modelExists = await this.modelService.checkModelExists(this.modelName).toPromise();
        let {code, message, responsedata} = modelExists;

        if(code == 200){
          this.modelId = responsedata.id;
          let modelType = responsedata.modelType;
          UILoader.blockUI.stop();
          // Not in edit mode, check if we can load this model
          if(modelType == this.modelType){
            this.encodedModelName = URebalUtil.encodeparams(this.modelName);
            this.modelAlreadyExist = true;
          } else {
            // we cannot load this model because it is not of supported type
            this.invalidModelName = true;
            this.modelErrorMessage = "Model exists as another type.";
          }

          return false;
        } else{
          UILoader.blockUI.stop();
          if(code == -100){
            //AF20191216: Allow model creation as model doesn't exist with this name
            this.invalidModelName = false;
            this.modelErrorMessage = '';
            //return false;
          } else if(code == 404) {
            if(this.isEdit){
              // If URL tempered and model not found, 404 page will be displayed
              this.router.navigate(['404']);
            } else {
              // Model does not exist, can create a model with this name
              this.invalidModelName = false;
              this.modelErrorMessage = '';
              return true;
            }
          }
          else{
            console.error(message);
            this.invalidModelName = false;
            this.modelErrorMessage='';
            return false;
          }
        }
      }else{
        this.invalidModelName = true;
        this.modelErrorMessage = 'Please enter valid model name';
        return false;
      }
    }else{
      this.invalidModelName = true;
      this.modelErrorMessage = 'Please enter valid model name';
      return false;
    }

    return true;
  }

    ngOnDestroy() {
        this.secModelGrid.destroy();
    }
}
