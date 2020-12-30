import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {EquivalenceService} from "../../equivalence.service";
import {SoftpakGridComponent} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {equivalencesGridCols, equivalencesGridDataSource} from "./equivalences.datasource";
import GridColumn = jqwidgets.GridColumn;

@Component({
    selector: 'app-equivalences',
    templateUrl: './equivalences.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquivalencesComponent implements AfterViewInit, OnInit {
    @ViewChild("equivalencesGrid") equivalencesGrid: SoftpakGridComponent;
    private accountId: String;

    source: any;
    equivalencesGridCols: GridColumn[];
    equivalencesGridAdapter: any;
    localizationObj = {
        emptydatastring: "No equivalence associated with account"
    };

    constructor(private equivalenceService: EquivalenceService) {
    }

    ngOnInit() {
        this.source = equivalencesGridDataSource();
        this.equivalencesGridCols = equivalencesGridCols.call(null, this);
        this.equivalencesGridAdapter = new jqx.dataAdapter(this.source);
    }

    ngAfterViewInit(): void {
        this.equivalencesGrid.localizestrings(this.localizationObj);
    }

    loadEquivalences(accountId: String) {
        this.accountId = accountId;
        this.equivalenceService.getEquivalencesByAccount(accountId).subscribe(result => {
            if (result.code == 200) {
                this.source.localdata = result.responsedata;
                this.equivalencesGrid.updatebounddata();
                this.equivalencesGrid.groups(["equivalenceName"]);
            } else {
                console.log(result.message);
            }
        });
    }

    refresh() {
        this.equivalencesGrid.refresh();
    }

    countUnique(iterable) {
        return new Set(iterable).size || 0;
    }

    getEquivalenceCount() {
        let equivalenceNames = this.equivalencesGrid.getrows().map(x => x.equivalenceName);
        return this.countUnique(equivalenceNames);
    }
}
