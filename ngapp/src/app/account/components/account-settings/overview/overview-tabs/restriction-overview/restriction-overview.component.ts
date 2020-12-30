import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {UrebalCytoscapeComponent} from "../../../../../../shared/components/urebal-cytoscape/urebal-cytoscape.component";
import {ModelType, OverviewSharedClass} from "../../overview.shared.class";
import {ModelService} from "../../../../../../model/model.service";
import {AccountService} from "../../../../../account.service";
import {OverviewDataService} from "../../overview.dataservice";
import {
    accountDistributionSeriesGroups,
    accountRestrictionDistributionSeriesGroups
} from "./restriction-overview.datasource";
import {jqxChartComponent} from "../../../../../../../assets/jqwidgets-ts/angular_jqxchart";
import {OverviewService} from "../../overview.service";
import {forkJoin} from "rxjs";
import {UILoader} from "../../../../../../shared/util/UILoader";
import {OVERVIEW_DEFAULT_MODEL} from "../../overview.datasource";
import {SoftpakChartComponent} from "../../../../../../shared/jqwidgets/jqx-chart/softpak-chart.component";

@Component({
    selector: 'app-restriction-overview',
    templateUrl: './restriction-overview.component.html',
    styleUrls: ['./restriction-overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestrictionOverviewComponent extends OverviewSharedClass implements OnInit, OnDestroy {
    @ViewChild('householdAccountDistributionChart') householdAccountDistributionChart: UrebalCytoscapeComponent;
    @ViewChild('restrictionDistributionChart') restrictionDistributionChart: UrebalCytoscapeComponent;
    @ViewChild('accountDistributionChart') accountDistributionChart: SoftpakChartComponent;
    @ViewChild('accountRestrictionDistributionChart') accountRestrictionDistributionChart: SoftpakChartComponent;

    public accountDistributionPieData: any = [];
    public accountDistributionSeriesGroups: any[] = accountDistributionSeriesGroups;

    public accountRestrictionDistributionPieData: any = [];
    public accountRestrictionDistributionSeriesGroups: any[] = accountRestrictionDistributionSeriesGroups;

    public assetAllocationMessage = '';
    public targetDistributionMessage = '';

    constructor(public modelService: ModelService, public accountService: AccountService, public overviewService: OverviewService, protected overviewDataService: OverviewDataService, protected ref: ChangeDetectorRef) {
        super(overviewDataService, ref);
    }

    refresh() {
        UILoader.blockUI.start('Loading Overview...');

        if (this.overviewData.isHouseHold) {
            this.householdRestrictions();
        } else {
            this.accountRestrictions();
        }
    }

    householdRestrictions() {
        const data = {
            householdName: this.overviewData.householdName,
            accountList: this.overviewData.accountList,
            portfolioId: this.overviewData.portfolioId,
            attributeType: this.overviewData.model.attributeType
        };

        forkJoin([
            this.overviewService.getAccountDistribution(data),
            this.overviewService.getRestrictionDistribution(this.overviewData.householdName, this.overviewData.accountList)
        ]).subscribe((data) => {
            this.householdAccountDistributionChart.elements = data[0];
            this.householdAccountDistributionChart.render();

            this.restrictionDistributionChart.elements = data[1];
            this.restrictionDistributionChart.render();

            UILoader.blockUI.stop();
        })
    }

    accountRestrictions() {
        this.targetDistributionMessage = '';

        if (this.overviewData.model.modelType == ModelType.SecurityModel) {
            this.assetAllocationMessage = this.ASSET_ALLOCATION_ERROR_MESSAGE;
        }

        let attributeType = this.overviewData.model.attributeType ? this.overviewData.model.attributeType : OVERVIEW_DEFAULT_MODEL;

        forkJoin([
            this.overviewService.getAssetAllocation(this.overviewData.portfolioId, attributeType),
            this.overviewService.getAccountAttributesPieFormat(this.overviewData.householdName)
        ]).subscribe((data) => {
            this.accountDistributionPieData = data[0];
            this.accountDistributionChart.update();

            const accountRestrictions = data[1];
            if (accountRestrictions == null) {
                this.targetDistributionMessage = this.ACCOUNT_RESTRICTION_UNDEFINED;
            } else {
                this.accountRestrictionDistributionPieData = accountRestrictions;
                this.accountRestrictionDistributionChart.update();
            }

            this.ref.detectChanges();

            UILoader.blockUI.stop();
        })
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        if (this.accountDistributionChart) this.accountDistributionChart.destroy();
        if (this.accountRestrictionDistributionChart) this.accountRestrictionDistributionChart.destroy();
        if (this.householdAccountDistributionChart) this.householdAccountDistributionChart.destroy();
        if (this.restrictionDistributionChart) this.restrictionDistributionChart.destroy();
    }
}
