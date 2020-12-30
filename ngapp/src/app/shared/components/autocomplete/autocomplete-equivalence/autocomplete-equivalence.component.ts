import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SoftpakComboBoxComponent} from "../../../jqwidgets/jqx-combobox/softpak-combobox.component";
import {EquivalenceService} from "../../../../equivalences/equivalence.service";
import {map} from "rxjs/operators";
import {AutocompleteEquivalenceItem} from "./autocomplete-equivalence.derivedclass";

@Component({
    selector: 'app-autocomplete-equivalence',
    templateUrl: './autocomplete-equivalence.component.html',
    styleUrls: ['./autocomplete-equivalence.component.css']
})
export class AutocompleteEquivalenceComponent implements OnInit {

    @ViewChild('InputRef', {static: true}) input: SoftpakComboBoxComponent;

    @Input('width') width: string = '100%';
    @Input('attributeType') attributeType: string = null;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    constructor(public equivalenceService: EquivalenceService) {
    }

    ngOnInit(): void {
        this.input.width(this.width);
        this.equivalenceService.getEquivalencesList()
            .pipe(map(this.equivalenceService.filterResponse))
            .subscribe((equivalenceList) => {
                let equivalenceItemArray: AutocompleteEquivalenceItem[] = equivalenceList.map((x) => {
                    return {
                        "equivalenceId": x.id,
                        "equivalenceName": x.name
                    }
                });
                this.input.source(equivalenceItemArray);
            });
    }

    ngAfterViewInit() {
        this.input.selectedIndex(-1);
    }

    clear() {
        this.input.clearSelection();
        this.input.val("");
        this.input.focus();
        this.input.selectedIndex(-1);
        this.input.close();
    }

    onChange(event) {
        let item: AutocompleteEquivalenceItem = event.args?.item?.originalItem;
        this.onSelect.emit({item: item, event: event});
    }

    getSelectedItem() {
        return this.input.getSelectedItem();
    }

    getSelectedEquivalenceId() {
        return this.getSelectedItem()?.originalItem?.equivalenceId;
    }
}
