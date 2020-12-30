import {OVERVIEW_DEFAULT_OTHERS} from "./overview.datasource";
import {pieChartColors} from "../../../../shared/jqwidgets/jqx-chart/softpak-chart.component";

export class OverviewHelper {
    sortPattern = [];

    constructor() {
    }

    static union(arr1, arr2) {
        return arr1.concat(arr2.filter((item) => {
            return arr1.lastIndexOf(item) < 0
        }));
    }

    sortPieData(records, sortBy = 'name') {
        let tempSortPattern = records.map((record) => record[sortBy]);
        let returnData = [];

        this.sortPattern = OverviewHelper.union(this.sortPattern, tempSortPattern);

        // Sort Pie Data by this.sortPattern
        for (let value of this.sortPattern) {
            let angle = records.find((record) => {
                return record[sortBy] == value
            });
            if (angle) returnData.push(angle); // Added existing entries in the beginning based of sortPattern value.
            else returnData.push({name: value, value: 0});
        }

        return returnData;
    }

    getChartColor() {
        let result = this.sortPattern.map((color, idx) => {
            return {
                name: this.sortPattern[idx],
                color: pieChartColors[idx]
            }
        });
        return result;
    }

    static reduceAccountData(records) {
        return records.map((record) => {
            return {name: record.attributes.attributeName, value: record.min};
        });
    }

    static fillRemaining(attrDistribution) {
        // @param attrDistribution = {
        //   "attr1": 33.33,
        //   "attr2": 33.33
        // }
        // @return {
        //   "attr1": 33.33,
        //   "attr2": 33.33,
        //   "Others": 33.34
        // }

        let total: number = 0;
        let returnValue = [];
        for (let attr in attrDistribution) {
            if (attrDistribution.hasOwnProperty(attr)) {
                let value = attrDistribution[attr];
                total += value;
                returnValue.push({
                    name: attr,
                    value: value
                })
            }
        }

        let remainingValue: number = 100 - total;
        remainingValue = parseFloat(remainingValue.toFixed(2)); // Truncate remainingValue to 2 decimals
        
        if (remainingValue > 0) {
            returnValue.push({
                name: OVERVIEW_DEFAULT_OTHERS,
                value: remainingValue
            })
        }

        return returnValue;
    }
}