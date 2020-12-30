import {ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {URebalUtil} from '../../shared/util/URebalUtil';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {UILoader} from '../../shared/util/UILoader';
import {AccountService} from '../../account/account.service';
import {EquivalenceService} from '../../equivalences/equivalence.service';
import {ModelService} from '../../model/model.service';
import {URebalService} from "../../services/urebal.service";

import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import jqxInput = jqwidgets.jqxInput;
import {MessageModalComponent} from "../../shared/components/message-modal/message-modal.component";


@Component({
    selector: 'app-equivalences-create',
    templateUrl: './equivalences-create.component.html',
    styles: []
})
export class EquivalencesCreateComponent extends UrebalPermissions implements OnInit {

    private equivalenceName: string;
    public equivalenceType: string;
    public responseObject: any;
    public responseMsg: string;
    public securityErrMsg: string;
    public equiNameErrMsg: string;
    private accountErrMsg: string;
    public responseCode;
    private equivalenceList: any = [];
    private initialAccountsInEdit: any;
    private equivalenceId: number;


    @ViewChild('equivalenceModalRef') equivalenceModalRef: MessageModalComponent;
    @ViewChild('accountNameInput') accountNameInput: jqxInput;

    constructor(private equivalenceService: EquivalenceService,
                public modelService: ModelService,
                private accountService: AccountService,
                protected route: ActivatedRoute,
                protected router: Router,
                public urebalService: URebalService,
                permissionResolverService: PermissionResolverService
    ) {
        super(permissionResolverService);
    }


    ngOnInit() {
        UILoader.start("Loading...");
        this.route.params.subscribe(params => {
            this.equivalenceType = URebalUtil.decodeparams(params['equivalenceType']);

            if (this.equivalenceType == 'Edit') {
                this.equivalenceId = params['equivalenceId'];
            }
        });

        if (this.equivalenceType == 'Edit') {
            this.getEquivalence(this.equivalenceId);
        } else {
            UILoader.stop();
            this.responseObject = {
                id: -1,
                name: '',
                securities: [],
                assignments: [],
            }
        }
    }

    getEquivalence(equivalenceId) {
        this.equivalenceService.getEquivalence(equivalenceId).subscribe(result => {
            if (result.code == 200) {
                this.responseObject = result.responsedata;
                this.initialAccountsInEdit = JSON.parse(JSON.stringify(this.responseObject.assignments));
            } else if (result.code == 400) {
                this.accountErrMsg = "Failed to fetch equivalence"
            }
            UILoader.stop();
        });
    }

    getEquivalenceList() {
        this.equivalenceService.getEquivalencesList().subscribe(result => {
            if (result.code == 200) {
                this.equivalenceList = result.responsedata;
            } else {
                console.log(result.message);
            }
            //this.urebalAutoComplete.forEach(instance => {
            //    if (instance.inputID == 'equiNameid') {
            //        instance.items = this.equivalenceList;
            //    }
            //});
        });
    }

    selectEquivalence(obj) {
        this.responseObject.name = obj.name;
        this.getEquivalence(obj.id);
    }

    equivalenceNameChanged() {
        this.equiNameErrMsg = '';
    }

    // callback should be called from this method with boolean value representing whether
    // the equivalence name is valid or not
    checkEquivalenceName(callback) {
        if (this.equivalenceType == 'Edit') {
            callback(true);
            return;
        }

        if (typeof this.equivalenceName != 'undefined') {
            this.equivalenceName = this.equivalenceName.replace(/(^\s+|\s+$)/g, '');

            if (this.equivalenceName) {
                this.responseObject.name = this.equivalenceName;
                this.equiNameErrMsg = '';

                UILoader.start('Loading...'); // Start blocking

                UILoader.registerService(this.equivalenceService.checkEquivalenceExists);
                //AF20191211: checkEquivalenceExists now calls a different endpoint.
                // Response from the service has 200 as response code when equivalence is found
                // Response from the service has 404 as response code when equivalence is not found
                this.equivalenceService
                .checkEquivalenceExists(this.equivalenceName)
                .subscribe(result => {
                    UILoader.unregisterService(this.equivalenceService.checkEquivalenceExists);

                    if (result.code === 200) {
                        const equivalenceName = result.responsedata;

                        //AF20191211: Response must contain the equivalence object, status code of 200 would not be enough
                        if (equivalenceName) {
                            UILoader.stop();
                            this.equiNameErrMsg = "Equivalence name already exist.";
                            callback(false);
                            return;
                        }

                    } else if (result.code === 404) {
                        this.equivalenceService.checkEquivalenceNameValid(this.equivalenceName)
                        .subscribe(result => {
                            if (result.code == 200) {
                                UILoader.stop();
                                callback(true);
                            } else if (result.code == -100) {
                                UILoader.stop();
                                this.equiNameErrMsg = "Equivalence name matches a security ticker.";
                                callback(false);
                                return;
                            }
                        }, error => {
                            UILoader.stop();
                            console.log(error);
                        })
                    } else {
                        UILoader.stop();
                        this.equiNameErrMsg = "Error validating equivalence name.";
                        callback(false);
                    }
                }, error => {
                    UILoader.unregisterService(this.equivalenceService.checkEquivalenceExists);
                    UILoader.stop();
                    console.log(error);
                });
            } else {
                this.equiNameErrMsg = "Please enter valid equivalence name";
                callback(false);
            }
        } else {
            this.equiNameErrMsg = "Please enter valid equivalence name";
            callback(false);
        }
    }

    addSecuritiesOnSelect(item) {

        let exists = this.findArrayKey(item.securityId, this.responseObject.securities, 'security');
        if (!exists) {
            this.responseObject.securities.push({ticker: item.securityId});
            this.securityErrMsg = '';
        } else {
            this.securityErrMsg = "Security already exists."
        }
    }

    removeSecurities(event) {
        let index = this.responseObject.securities.indexOf(event);
        this.responseObject.securities.splice(index, 1);
    }

    accountNameSelected(selectedAccount) {
        let found = this.responseObject.assignments.find(function (account) {
            return account.accountNumber == selectedAccount.accountNumber;
        });

        if (!found) {
            this.responseObject.assignments.push({
                accountId: selectedAccount.accountId,
                accountNumber: selectedAccount.accountNumber,
                accountName: selectedAccount.portfolioName
            });
            this.accountErrMsg = '';
        } else {
            this.accountErrMsg = "Account already exists."
        }
    }

    removeAccounts(event) {
        let index = this.responseObject.assignments.indexOf(event);
        this.responseObject.assignments.splice(index, 1);
    }

    saveEquivalence() {
        if (!this.allowSave()) return;

        this.checkEquivalenceName(result => {
            if (result) {
                this.equiNameErrMsg = '';

                UILoader.blockUI.start("Saving Equivalence...");
                this.equivalenceService.createUpdateEquivalence(this.equivalenceId, this.equivalenceType == 'Edit',
                    this.responseObject).subscribe(result => {
                    this.responseCode = result.code;

                    if (result.code == 200) {
                        this.equivalenceModalRef.open();
                    } else if (result.code == 400) {
                        this.accountErrMsg = "Failed to save equivalence"
                    }
                    this.responseMsg = result.message;

                    UILoader.blockUI.stop();
                });
            }
        });
    }

    textValueFromAutoComplete(text: string) {
        this.responseObject.name = text;
    }

    navigateToEquivalenceList() {
        this.router.navigate(['/secure/equivalences/list']);
    }

    findArrayKey(value, arr, arrType) {
        let val;
        let result = false;
        for (let i in arr) {
            if (arrType == 'security') {
                val = arr[i].ticker;
            } else {
                val = arr[i].accountId;
            }
            if (value == val) {
                result = true;
                break;
            } else {
                result = false;
            }

        }
        return result;
    }

    allowSave() {
        if (!this.responseObject || !this.responseObject.securities || this.responseObject.securities.length < 2) {
            return false;
        }

        return true;
    }

    onSaveModalOkButtonClicked() {
        if (this.responseCode > 0) {
            this.navigateToEquivalenceList();
        } else {
            this.equivalenceModalRef.close();
        }
    }
}
