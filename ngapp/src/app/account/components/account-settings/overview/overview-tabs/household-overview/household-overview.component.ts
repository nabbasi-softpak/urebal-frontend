import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModelType, OverviewSharedClass} from "../../overview.shared.class";
import {assetAllocationSeriesGroups} from "./household-overview.datasource";
import {accountModelSeriesGroups, OVERVIEW_DEFAULT_MODEL} from "../../overview.datasource";
import {OverviewDataService} from "../../overview.dataservice";
import {jqxChartComponent} from "../../../../../../../assets/jqwidgets-ts/angular_jqxchart";
import {OverviewService} from "../../overview.service";
import {forkJoin} from "rxjs";
import {UILoader} from "../../../../../../shared/util/UILoader";
import {SoftpakChartComponent} from "../../../../../../shared/jqwidgets/jqx-chart/softpak-chart.component";

@Component({
    selector: 'app-household-overview',
    templateUrl: './household-overview.component.html',
    styleUrls: ['./household-overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseholdOverviewComponent extends OverviewSharedClass implements OnInit, OnDestroy {
    @ViewChild('assetAllocationModelChart') assetAllocationModelChart: SoftpakChartComponent;
    @ViewChild('accountModelChart') accountModelChart: SoftpakChartComponent;

    public assetAllocationPieData: any = [];
    public assetAllocationSeriesGroups: any[] = assetAllocationSeriesGroups;

    public accountModelPieData: any = [];
    public accountModelSeriesGroups: any[] = accountModelSeriesGroups;

    public assetAllocationMessage = '';

    constructor(protected overviewDataService: OverviewDataService, protected ref: ChangeDetectorRef, public overviewService: OverviewService) {
        super(overviewDataService, ref);
    }

    refresh() {

        if (this.overviewData.model.modelType == ModelType.SecurityModel) {
            this.assetAllocationMessage = this.ASSET_ALLOCATION_ERROR_MESSAGE;
        }

        let attributeType = this.overviewData.model.attributeType ? this.overviewData.model.attributeType : OVERVIEW_DEFAULT_MODEL;

        UILoader.blockUI.start('Loading Overview...');

        forkJoin([
            this.overviewService.getAssetAllocation(this.overviewData.portfolioId, attributeType),
            this.overviewService.getAccountModel(this.overviewData.model.id, this.overviewData.model.attributeType)
        ]).subscribe((data) => {
            this.assetAllocationPieData = data[0];
            this.assetAllocationModelChart.update();

            this.accountModelPieData = data[1];
            this.accountModelChart.update();

            this.ref.detectChanges();

            UILoader.blockUI.stop();
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        if (this.assetAllocationModelChart) this.assetAllocationModelChart.destroy();
        if (this.accountModelChart) this.accountModelChart.destroy();
    }
}

