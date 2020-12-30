import {Component, Input, OnInit} from '@angular/core';
import {EquivalenceService} from "../../equivalence.service";

@Component({
    selector: 'app-equivalence-detail',
    templateUrl: './equivalence-detail.component.html',
    styleUrls: ['./equivalence-detail.component.css']
})
export class EquivalenceDetailComponent implements OnInit {
    @Input() id: string;

    equivalence = {
        id: null,
        securities: [],
        accounts: []
    };

    constructor(private equivalenceService: EquivalenceService) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.equivalenceService.getEquivalence(this.id).subscribe(result => {
            if (result.code == 200) {
                let data = result.responsedata;
                if (data.securities != undefined && data.securities.length != 0) {
                    this.equivalence.securities = data.securities;
                } else {
                    this.equivalence.securities = [];
                }

                if (data.assignments != undefined && data.assignments.length != 0) {
                    this.equivalence.accounts = data.assignments;
                } else {
                    this.equivalence.accounts = [];
                    this.equivalence.accounts.push({accountId: 'No account assigned  ...'});
                }
            }
        });
    }
}
