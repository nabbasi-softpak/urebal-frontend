import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {EquivalenceService} from "../../equivalences/equivalence.service";
import {AutocompleteEquivalenceComponent} from "../../shared/components/autocomplete/autocomplete-equivalence/autocomplete-equivalence.component";
import {map} from "rxjs/operators";
import {UILoader} from "../../shared/util/UILoader";
import {AccountEquivalenceAssignment, AccountId} from "./apply-equivalence-modal.derivedclass";
import {AutocompleteEquivalenceItem} from "../../shared/components/autocomplete/autocomplete-equivalence/autocomplete-equivalence.derivedclass";

@Component({
    selector: 'app-apply-equivalence-modal',
    templateUrl: './apply-equivalence-modal.component.html',
    styleUrls: ['./apply-equivalence-modal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplyEquivalenceModalComponent implements OnInit {
    @ViewChild('applyEquivalenceModalRef') applyEquivalenceModalRef: ModalComponent;
    @ViewChild('autocompleteEquivalenceRef') autocompleteEquivalenceRef: AutocompleteEquivalenceComponent;
    @Output() onClose = new EventEmitter();

    selectedRows: any;
    accountEquivalenceAssignment: AccountEquivalenceAssignment[] = [];
    errorMessage: string;
    applyAll: any = true;
    title: string = 'Apply Equivalence';
    modalSize: any = 'large';

    constructor(private ref: ChangeDetectorRef, private equivalenceService: EquivalenceService) {
    }

    ngOnInit(): void {
    }

    setTitle(title) {
        this.title = title;
    }

    setModalSize(modalSize) {
        this.modalSize = modalSize;
    }

    equivalenceSelectedItem({item, event}) {
        if (item) {
            this.setErrorMessage("");
        } else {
            this.unselectCombobox();
        }
    }

    unselectCombobox() {
        this.autocompleteEquivalenceRef.input.selectedIndex(-1);
        this.autocompleteEquivalenceRef.input.clearSelection();
    }

    setErrorMessage(message) {
        this.errorMessage = message;
        this.ref.detectChanges();
    }

    setApplyAll(applyAll) {
        this.applyAll = applyAll;

        if (applyAll) {
            this.setTitle("Apply Equivalence to All");
            this.setModalSize('small');
        } else {
            this.setTitle("Apply Equivalence");
            this.setModalSize('large');
        }

        this.ref.detectChanges();
    }

    open(selectedAccounts, applyAll=false) {
        this.clear();
        this.setApplyAll(applyAll);

        selectedAccounts = selectedAccounts.map(x => {
            return new AccountEquivalenceAssignment(x.accountId, null, x.portfolioName);
        });

        if (applyAll == false) {
            UILoader.blockUI.start("Loading...");
            let accountIds: [] = selectedAccounts.map((x) => x['accountId']);
            this.equivalenceService.getAccountEquivalenceAssignment(accountIds)
                .pipe(map(this.equivalenceService.filterResponse))
                .subscribe((accountWithEquivalenceAssignment) => {
                    UILoader.blockUI.stop();
                    this.accountEquivalenceAssignment = this.merge("accountId", selectedAccounts, accountWithEquivalenceAssignment);
                    this.applyEquivalenceModalRef.open();
                    this.ref.detectChanges();
                });
        }
        else {
            this.applyEquivalenceModalRef.open();
        }
    }

    close(message = null) {
        this.clear();
        this.applyEquivalenceModalRef.close();
        this.autocompleteEquivalenceRef.clear();
        this.unselectCombobox();
        this.onClose.emit(message);
    }

    clear() {
        this.accountEquivalenceAssignment = [];
        this.setErrorMessage("");
    }

    save() {
        UILoader.blockUI.start("Applying Equivalence...");

        let equivalenceId = this.autocompleteEquivalenceRef.getSelectedEquivalenceId();

        if (equivalenceId) {
            if (this.applyAll) {
                this.equivalenceService.applyEquivalenceAllAccounts(equivalenceId).subscribe((response) => {
                    if (response.code == 200) {
                        this.close("Equivalence applied to all accounts successfully");
                    } else {
                        this.setErrorMessage("Failed to apply equivalence");
                    }
                    UILoader.blockUI.stop();
                });
            }
            else {
                let accountIds = this.accountEquivalenceAssignment.map(x => new AccountId(x.accountId));
                this.equivalenceService.applyEquivalenceToSelectedAccounts(equivalenceId, accountIds).subscribe((response) => {
                    if (response.code == 200) {
                        this.close("Equivalence applied successfully");
                    } else {
                        this.setErrorMessage("Failed to apply equivalence");
                    }
                    UILoader.blockUI.stop();
                });
            }
        } else {
            this.setErrorMessage("Please select equivalence to assign");
            UILoader.blockUI.stop();
        }
    }

    groupAccountByEquivalence(response: any | any[]): AccountEquivalenceAssignment[] {
        let result = {};
        for (let row of response) {
            if (result[row.accountId]) {
                result[row.accountId].equivalenceName += ", " + row.equivalenceName;
            } else {
                result[row.accountId] = {
                    equivalenceName: row.equivalenceName,
                    accountName: row.accountName
                };
            }
        }

        let result2: AccountEquivalenceAssignment[] = [];
        for (let key in result) {
            if (result.hasOwnProperty(key)) {
                let accountId = key;
                let equivalenceName = result[key].equivalenceName;
                let accountName = result[key].accountName;
                result2.push(new AccountEquivalenceAssignment(accountId, equivalenceName, accountName));
            }
        }

        return result2;
    }

    private merge(key, arr1, arr2) {
        // Merge two array of object
        // eg.
        //  arr1 = [{account: 'a'}, {account: 'b'}]
        //  arr2 = [{account: 'c'}]
        //  return => [{account: 'a'}, {account: 'b'}, {account: 'c'}]

        for (let account of arr1) {
            let merge = true;
            for (let eqAccount of arr2) {
                if (account[key] == eqAccount[key]) {
                    merge = false;
                }
            }

            if (merge) {
                arr2.push(account);
            }

        }
        return arr2;
    }
}
