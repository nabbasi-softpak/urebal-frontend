import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {OverviewData} from "./overview-datatypes";


@Injectable()
export class OverviewDataService {

    private dataSource = new BehaviorSubject<OverviewData>(null);
    currentData = this.dataSource.asObservable();

    constructor() { }

    updateData(data: OverviewData) {
        this.dataSource.next(data)
    }

}


