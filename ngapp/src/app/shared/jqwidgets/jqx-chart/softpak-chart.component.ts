import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {jqxChartComponent} from "@jqxSource/angular_jqxchart";

export const SOFTPAK_CHART_COLOR_SCHEME = 'softpak-pie-chart';

export const pieChartColors: string[] = [
    '#1CA3E3', '#2BA043', '#8EBC00',
    '#FF7515', '#FFAE00', '#073C4D',
    '#146979', '#2DABB8', '#9DCF2F',
    '#D6EE43', '#D4692A', '#FFAB48',
    '#FFE7AD', '#A5CBAD', '#8A8C61',
];

@Component({
    selector: 'softpak-chart',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakChartComponent extends jqxChartComponent implements OnInit {

    constructor(containerElement: ElementRef) {
        super(containerElement);
    }

    ngOnInit() {
        super.ngOnInit();

        // Note: SoftpakChartComponent have been assigned custom color scheme by default, which is an requirement for overview screen charts.
        this.setSoftpakColorScheme();
    }

    setSoftpakColorScheme(emptyIdx?) {
        let softpakPieChart = [...pieChartColors];

        if (emptyIdx !== undefined) {
            softpakPieChart[emptyIdx] = '#dedede';
        }

        this.colorScheme(SOFTPAK_CHART_COLOR_SCHEME);
        this.removeColorScheme(SOFTPAK_CHART_COLOR_SCHEME);
        this.addColorScheme(SOFTPAK_CHART_COLOR_SCHEME, softpakPieChart);
    }

    getSoftpakColorScheme(idx?) {
        const colorScheme = this.getColorScheme(SOFTPAK_CHART_COLOR_SCHEME);
        if (idx !== undefined) return colorScheme[idx];
        return colorScheme;
    }
}
