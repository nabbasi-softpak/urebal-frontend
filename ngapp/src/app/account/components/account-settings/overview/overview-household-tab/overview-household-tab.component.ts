import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OverviewType} from "../overview-datatypes";
import {OverviewService} from "../overview.service";

@Component({
    selector: 'app-overview-household-tab',
    templateUrl: './overview-household-tab.component.html',
    styleUrls: ['./overview-household-tab.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewHouseholdTabComponent implements OnInit, OnDestroy {
    OverviewType = OverviewType;

    @Input() currentOverviewType: OverviewType = null;

    currentOverview: OverviewType = OverviewType.household;
    overviewOptions = [
        OverviewType.household,
        OverviewType.restrictions,
        OverviewType.account,
    ];

    constructor(private overviewService: OverviewService){}

    ngOnInit() {
        this.currentOverview = this.overviewService.selectedOverview();

        if (!this.currentOverview) {
            this.currentOverview = OverviewType.household;
        }
    }

    isType(overview: OverviewType) {
        return this.currentOverview == overview;
    }

    ngOnDestroy(): void {
        this.overviewService.selectedOverview(this.currentOverview);
    }
}
