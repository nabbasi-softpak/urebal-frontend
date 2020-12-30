import {OverviewData} from "./overview-datatypes";
import {Subscription} from "rxjs";
import {legendLayout, OVERVIEW_DEFAULT_MODEL, padding} from "./overview.datasource";
import {OverviewDataService} from "./overview.dataservice";
import {ChangeDetectorRef, OnDestroy, OnInit} from "@angular/core";

export abstract class OverviewSharedClass implements OnInit, OnDestroy {
    ASSET_ALLOCATION_ERROR_MESSAGE = `The assigned model is not based on any attribute type. The current and target allocations are being shown as per the default attribute type "${OVERVIEW_DEFAULT_MODEL}"`;
    ACCOUNT_RESTRICTION_UNDEFINED = "Account target distribution undefined. To set target distribution, configure attribute restrictions on account."

    public padding: any = padding;
    public legendLayout: any = legendLayout;

    public overviewData: OverviewData = null;
    protected overviewDataSubscriber: Subscription;

    protected constructor(protected overviewDataService: OverviewDataService, protected ref: ChangeDetectorRef) {}

    ngOnInit() {
        this.overviewDataSubscriber = this.overviewDataService.currentData.subscribe((data: OverviewData) => {
            this.overviewData = data;
            this.ref.detectChanges();

            this.refresh();
        })
    }

    getTitle() {
        return this.overviewData.isHouseHold ? "Household" : "Account";
    }

    ngOnDestroy() {
        this.overviewDataSubscriber.unsubscribe();
    }

    abstract refresh();
}

export enum ModelType {
    SecurityModel = 1,
    AssetAllocationMode = 3
}