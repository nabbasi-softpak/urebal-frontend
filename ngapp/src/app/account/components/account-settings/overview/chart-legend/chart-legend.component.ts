import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {sortBySystemPACOrder} from "../../../../../shared/util/HelperUtils";

@Component({
    selector: 'app-chart-legend',
    templateUrl: './chart-legend.component.html',
    styleUrls: ['./chart-legend.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLegendComponent implements OnInit {
    @Input() chartColors: any;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartColors'] && changes['chartColors'].previousValue != changes['chartColors'].currentValue) {
            this.chartColors = sortBySystemPACOrder(this.chartColors, 'name');
        }
    }
}
