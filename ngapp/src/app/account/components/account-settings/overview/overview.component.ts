import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {AccountOverviewComponent} from "./overview-tabs/account-overview/account-overview.component";
import {RestrictionOverviewComponent} from "./overview-tabs/restriction-overview/restriction-overview.component";
import {HouseholdOverviewComponent} from "./overview-tabs/household-overview/household-overview.component";
import {OverviewDataService} from "./overview.dataservice";
import {OverviewData} from "./overview-datatypes";
import {OverviewService} from "./overview.service";

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit, OnDestroy {
    @ViewChild('householdOverview') householdOverview: HouseholdOverviewComponent;
    @ViewChild('restrictionOverview') restrictionOverview: RestrictionOverviewComponent;
    @ViewChild('accountOverview') accountOverview: AccountOverviewComponent;

    @Input() model: number;
    @Input() accountList: any;
    @Input() householdName: any;
    @Input() portfolioId: any;
    @Input() isHouseHold: any;

    constructor(private overviewService: OverviewService, private overviewDataService: OverviewDataService, private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    refresh() {
        this.overviewService.reset(); // clear service cache.

        if (this.householdOverview) this.householdOverview.refresh();
        if (this.restrictionOverview) this.restrictionOverview.refresh();
        if (this.accountOverview) this.accountOverview.refresh();
    }

    ngOnChanges(changes: SimpleChanges[]): void {
        let overviewData: OverviewData = new OverviewData({
            model: this.model,
            accountList: this.accountList,
            householdName: this.householdName,
            portfolioId: this.portfolioId,
            isHouseHold: this.isHouseHold
        });

        if (!overviewData.isEmpty()) {
            this.overviewDataService.updateData(overviewData);
        }

        this.ref.detectChanges();
    }

    ngOnDestroy() {
        this.overviewService.reset();
    }
}
