import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OverviewType} from "../overview-datatypes";
import {OverviewService} from "../overview.service";

@Component({
    selector: 'app-overview-account-tab',
    templateUrl: './overview-account-tab.component.html',
    styleUrls: ['./overview-account-tab.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewAccountTabComponent implements OnInit {
    OverviewType = OverviewType;

    @Input() currentOverviewType: OverviewType = null;

    currentOverview: OverviewType = OverviewType.account;
    overviewOptions = [
        OverviewType.account,
        OverviewType.restrictions,
    ];

    constructor(private overviewService: OverviewService) {
    }

    ngOnInit() {
        this.currentOverview = this.overviewService.selectedOverview();

        if (!this.currentOverview) {
            this.currentOverview = OverviewType.account;
        }
    }

    isType(overview: OverviewType) {
        return this.currentOverview == overview;
    }

    ngOnDestroy(): void {
        this.overviewService.selectedOverview(this.currentOverview);
    }
}
