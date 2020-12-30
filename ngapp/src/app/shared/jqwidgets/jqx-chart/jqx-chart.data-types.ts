export class JqxChartPieData {
    name: string;
    value: number;

    constructor(opts?) {
        if (opts !== undefined) {
            Object.assign(this, opts);
        }
    }
}