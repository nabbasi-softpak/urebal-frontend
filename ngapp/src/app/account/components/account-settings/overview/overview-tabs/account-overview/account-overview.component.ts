import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UrebalCytoscapeComponent} from "../../../../../../shared/components/urebal-cytoscape/urebal-cytoscape.component";
import {OverviewSharedClass} from "../../overview.shared.class";
import {OverviewDataService} from "../../overview.dataservice";
import {accountModelSeriesGroups} from "../../overview.datasource";
import {OverviewService} from "../../overview.service";
import {forkJoin} from "rxjs";
import {UILoader} from "../../../../../../shared/util/UILoader";
import {SoftpakChartComponent} from "../../../../../../shared/jqwidgets/jqx-chart/softpak-chart.component";

@Component({
    selector: 'app-account-overview',
    templateUrl: './account-overview.component.html',
    styleUrls: ['./account-overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOverviewComponent extends OverviewSharedClass implements OnDestroy {
    @ViewChild('accountDistributionChart') accountDistributionChart: UrebalCytoscapeComponent;
    @ViewChild('accountModelChart') accountModelChart: SoftpakChartComponent;

    public accountModelPieData: any = [];
    public accountModelSeriesGroups: any[] = accountModelSeriesGroups;

    constructor(public overviewService: OverviewService, protected overviewDataService: OverviewDataService, protected ref: ChangeDetectorRef) {
        super(overviewDataService, ref);
    }

    refresh() {
        const data = {
            householdName: this.overviewData.householdName,
            accountList: this.overviewData.accountList,
            portfolioId: this.overviewData.portfolioId,
            attributeType: this.overviewData.model.attributeType
        };

        UILoader.blockUI.start('Loading Overview...');

        forkJoin([
            this.overviewService.getAccountDistribution(data),
            this.overviewService.getAccountModel(this.overviewData.model.id, this.overviewData.model.attributeType)
        ]).subscribe((data) => {
            this.accountDistributionChart.elements = data[0];
            this.accountDistributionChart.render();

            this.accountModelPieData = data[1];
            this.accountModelChart.update();

            this.ref.detectChanges();

            UILoader.blockUI.stop();
        })
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        if (this.accountDistributionChart) this.accountDistributionChart.destroy();
        if (this.accountModelChart) this.accountModelChart.destroy();
    }
}
