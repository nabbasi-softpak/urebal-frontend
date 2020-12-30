import {AfterViewInit, Component, Output, EventEmitter, HostListener} from '@angular/core';
import {AccountService} from '../../../account.service';
import {ModelService} from '../../../../model/model.service';
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";

export enum AttributeRestrictionEnum {
    CUSTOM_WEIGHT = "Custom weights %",
    DO_NOT_BUY_NEW = "DNBN",
    DO_NOT_HOLD = "DNH",
    DO_NOT_SELL = "DNS",
    DO_NOT_BUY = "DNB"
}

@Component({
    selector: 'app-attribute-restriction',
    templateUrl: './attribute-restriction.component.html'
})
export class AttributeRestrictionComponent implements AfterViewInit {
    public messages = {
        compareMinMax: 'Min % should be less than Max %',
        emptyMinMax: 'Min/Max % cannot be empty.',
        emptyMin: 'Min % cannot be empty.',
        emptyMax: 'Max % cannot be empty.',
        exist: 'Attribute Restriction already exist.',
        failed: 'Attribute Restrictions not updated'
    };
    private accountID: string;
    public attributeTypes: any;
    public attributeNames = [];
    public addRestriction = {
        account: {id: ''},
        restrictionType: AttributeRestrictionEnum.CUSTOM_WEIGHT,
        min: "",
        max: "",
        attributes: {attributeID: "", attributeName: "", attributeType: ""}
    };
    public attributeRestrictions = [];
    public checkAttributeRestrictions = [];
    public restrictions = [
        {value: AttributeRestrictionEnum.CUSTOM_WEIGHT, name: "Custom weights %"},
        {value: AttributeRestrictionEnum.DO_NOT_BUY_NEW, name: "Do not buy new"},
        {value: AttributeRestrictionEnum.DO_NOT_HOLD, name: "Do not hold"},
        {value: AttributeRestrictionEnum.DO_NOT_SELL, name: "Do not sell"},
        {value: AttributeRestrictionEnum.DO_NOT_BUY, name: "Do not buy"}
    ];
    public errors = [];
    public saveErrors = [];
    public success: string = '';
    public attributesExist = false;
    isSaved: boolean = false;

    @Output() applyChange: EventEmitter<boolean> = new EventEmitter();
    @Output() successMsg = new EventEmitter();

    constructor(public modelService: ModelService, private accountService: AccountService) {
    }

    @HostListener("window:beforeunload")
    onBeforeUnload(): Observable<boolean> | boolean {
        return !this.restrictionsChange();
    }

    ngAfterViewInit() {
        this.modelService.getAttributes()
            .subscribe((result) => {
                if (result.code == 200) {
                    this.attributesExist = true;
                    this.attributeTypes = result.responsedata;
                }
            });
    }

    loadAccountAttributes(id) {
        this.accountID = id;
        this.success = '';
        this.errors = [];
        this.saveErrors = [];
        this.resetToDefaultState();
        if (this.attributesExist) {
            this.addRestriction.attributes.attributeType = this.attributeTypes[0].attributeType;
            this.loadAttributes(-1);
            this.accountService.getAccountAttributes(id).subscribe((result) => {
                if (result.code == 200) {
                    for (let count = 0; count < result.responsedata.length; count++) {
                        let restrictionType = result.responsedata[count].restrictionType;

                        this.attributeRestrictions.push({
                            account: {id: id},
                            restrictionType: restrictionType,
                            min: this.isNonParametricRestriction(restrictionType) ? "N/A": result.responsedata[count].min,
                            max: this.isNonParametricRestriction(restrictionType) ? "N/A": result.responsedata[count].max,
                            attributes: result.responsedata[count].attributes
                        });
                    }

                    this.checkAttributeRestrictions = JSON.parse(JSON.stringify(this.attributeRestrictions));

                    if (this.attributeRestrictions.length > 0) {
                        for (let loop = 0; loop < this.attributeRestrictions.length; loop++) {
                            this.loadAttributes(loop);
                        }
                    }
                } else {
                    this.attributeRestrictions = [];
                }
            });

        }
    }

    addAttributeRestriction() {
        this.addRestriction.account.id = this.accountID;

        let newRestriction: any = Object.assign({}, this.addRestriction);
        newRestriction.attributes = Object.assign({}, this.addRestriction.attributes);

        this.removeError();
        $('.slds-form-element__row :input').removeClass('error-input');

        if (newRestriction.attributes.attributeType == 'Type' || newRestriction.attributes.attributeType == '') {
            console.log("Type cannot be empty");
        }

        if (newRestriction.attributes.attributeName == 'Attribute' || newRestriction.attributes.attributeName == '') {
            console.log("Attribute cannot be empty");
        }

        if (newRestriction.restrictionType == AttributeRestrictionEnum.CUSTOM_WEIGHT) {
            if (newRestriction.min === '' || newRestriction.min == null || newRestriction.min == 'N/A') {
                $("#attMin").addClass('error-input');
                this.addError(this.messages.emptyMin);
            }

            if (newRestriction.max === '' || newRestriction.max == null || newRestriction.max == 'N/A') {
                $("#attMax").addClass('error-input');
                this.addError(this.messages.emptyMax);
            } else {
                if (+newRestriction.min > +newRestriction.max) {
                    $("#attMax").addClass('error-input');
                    this.addError(this.messages.compareMinMax);
                }
            }
        } else {
            newRestriction.min = 'N/A';
            newRestriction.max = 'N/A';
        }


        if (this.attributeRestrictions.length > 0) {
            this.attributeRestrictions.forEach((item, index) => {
                if (item.attributes.attributeType == newRestriction.attributes.attributeType
                    && item.attributes.attributeName == newRestriction.attributes.attributeName
                    && item.restrictionType == newRestriction.restrictionType) {
                    this.addError(this.messages.exist);
                }
            });
        }

        if (this.errors.length < 1) {
            this.attributeRestrictions.push(newRestriction);
            this.loadAttributes(this.attributeRestrictions.length - 1);
            $('#attMin').val('');
            $('#attMax').val('');
            this.addRestriction.min = "";
            this.addRestriction.max = "";
            this.applyChange.emit(!this.restrictionsChange());
        }
    }

    removeAttributeRestriction(index) {
        if (index >= 0) {
            this.attributeRestrictions.splice(index, 1);
            this.applyChange.emit(!this.restrictionsChange());
        }
    }

    loadAttributes(index) {
        let type;
        let newIndex;

        if (index < 0) {
            newIndex = 0;
            type = this.addRestriction.attributes.attributeType;
        } else {
            newIndex = index + 1;
            type = this.attributeRestrictions[index].attributes.attributeType;
        }

        this.modelService.getAttributesByType(type, false).subscribe(
            result => {
                let match = 0;
                let name;
                let id;
                if (result.code == 200) {
                    this.attributeNames[newIndex] = result.responsedata;
                    if (index < 0) {
                        this.addRestriction.attributes.attributeName = this.attributeNames[newIndex][0].attributeName;
                        this.addRestriction.attributes.attributeID = this.attributeNames[newIndex][0].attributeID;
                    } else {
                        for (let count = 0; count < this.attributeNames[newIndex].length; count++) {
                            if (this.attributeRestrictions[index].attributes.attributeName == this.attributeNames[newIndex][count].attributeName) {
                                match = 1;
                                name = this.attributeNames[newIndex][count].attributeName;
                                id = this.attributeNames[newIndex][count].attributeID;
                            }
                        }

                        if (match) {
                            this.attributeRestrictions[index].attributes.attributeName = name;
                            this.attributeRestrictions[index].attributes.attributeID = id;
                        } else {
                            this.attributeRestrictions[index].attributes.attributeName = this.attributeNames[newIndex][0].attributeName;
                            this.attributeRestrictions[index].attributes.attributeID = this.attributeNames[newIndex][0].attributeID;
                        }
                    }

                    this.applyChange.emit(!this.restrictionsChange());
                } else {
                    console.log(result.message);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    setAttributeID(index, e) {
        if (index < 0) {
            this.addRestriction.attributes.attributeID = e.target.selectedOptions[0].id;
        } else {
            this.attributeRestrictions[index].attributes.attributeID = e.target.selectedOptions[0].id;
            this.applyChange.emit(!this.restrictionsChange());
        }
    }

    addError(message) {
        if (this.errors.indexOf(message) < 0) {
            this.errors.push(message);
        }
    }

    addSaveError(message) {
        if (this.saveErrors.indexOf(message) < 0) {
            this.saveErrors.push(message);
        }
    }

    removeError() {
        this.errors = [];
    }

    setAttrRestrictions() {
        if (this.addRestriction.restrictionType != AttributeRestrictionEnum.CUSTOM_WEIGHT) {
            this.addRestriction.min = 'N/A';
            this.addRestriction.max = 'N/A';
        }
    }

    setAddedAttrRestrictions(index) {
        if (this.attributeRestrictions[index].restrictionType == AttributeRestrictionEnum.CUSTOM_WEIGHT) {
            this.attributeRestrictions[index].min = 0;
            this.attributeRestrictions[index].max = 0;
        } else {
            this.attributeRestrictions[index].min = 'N/A';
            this.attributeRestrictions[index].max = 'N/A';
        }
        this.applyChange.emit(!this.restrictionsChange());
    }

    save(): Observable<any> {
        this.saveErrors = [];
        this.errors = [];
        $('.slds-table :input').removeClass('error-input');
        if (this.attributeRestrictions.length > 0) {
            this.attributeRestrictions.forEach((item, index) => {
                if (item.min == 'N/A' || item.max == 'N/A') {
                    item.min = 0;
                    item.max = 0;
                }
                if (index + 1 < this.attributeRestrictions.length) {
                    for (let count = index + 1; count < this.attributeRestrictions.length; count++) {
                        if (item.attributes.attributeType == this.attributeRestrictions[count].attributes.attributeType
                            && item.attributes.attributeName == this.attributeRestrictions[count].attributes.attributeName
                            && String(item.restrictionType) == String(this.attributeRestrictions[count].restrictionType)) {
                            this.addSaveError(this.messages.exist);
                        }
                    }
                }

                if (item.restrictionType == AttributeRestrictionEnum.CUSTOM_WEIGHT) {
                    if (item.min === '' || item.min == null) {
                        this.addSaveError(this.messages.emptyMin);
                        $('#editAttMin-' + index).addClass('error-input');
                    }

                    if (item.max === '' || item.max == null) {
                        this.addSaveError(this.messages.emptyMax);
                        $('#editAttMax-' + index).addClass('error-input');
                    }

                    if (+item.min > +item.max) {
                        this.addSaveError(this.messages.compareMinMax);
                        $('#editAttMin-' + index).addClass('error-input');
                        $('#editAttMax-' + index).addClass('error-input');
                    }
                }
            });
        }

        if (this.saveErrors.length >= 1) {
            this.attributeRestrictions = this.showNotApplicable(this.attributeRestrictions);
            return of(this.saveErrors);
        }

        if (this.attributeRestrictions.length > 0) {
            return this.accountService.saveAccountAttributes(this.attributeRestrictions).pipe(map(result => {
                if (result.code == -100) {
                    this.isSaved = false;
                    this.addSaveError(this.messages.failed);
                } else {
                    // this.success = result.message;
                    this.successMsg.emit('Attribute Restrictions');
                    this.isSaved = true;
                    this.errors = [];
                    this.checkAttributeRestrictions = [];
                    this.attributeRestrictions.forEach((value, index) => {
                        if (this.isNonParametricRestriction(this.attributeRestrictions[index].restrictionType)) {
                            this.attributeRestrictions[index].min = 'N/A';
                            this.attributeRestrictions[index].max = 'N/A';
                        }

                        this.checkAttributeRestrictions.push(
                            {
                                account: {id: value.account.id},
                                restrictionType: value.restrictionType,
                                min: value.min,
                                max: value.max,
                                attributes: Object.assign({}, value.attributes),
                            }
                        );
                    });

                    this.applyChange.emit(!this.restrictionsChange());
                }
            }));
        } else {
            return this.accountService.saveAccountAttributes([{accountID: this.accountID}]).pipe(map(result => {
                if (result.code == -100) {
                    this.isSaved = false;
                    this.addSaveError(this.messages.failed);
                } else {
                    // this.success = result.message;
                    this.successMsg.emit('Attribute Restrictions');
                    this.isSaved = true;
                    this.errors = [];
                    this.checkAttributeRestrictions = [];
                    this.attributeRestrictions.forEach((value, index) => {
                        this.checkAttributeRestrictions.push(
                            {
                                account: {id: value.account.id},
                                restrictionType: value.restrictionType,
                                min: value.min,
                                max: value.max,
                                attributes: Object.assign({}, value.attributes),
                            }
                        );
                    });
                    this.applyChange.emit(!this.restrictionsChange());
                }
            }));
        }
    }

    cancelBtn() {
        this.resetToDefaultState();
    }

    resetToDefaultState() {
        this.attributeRestrictions = [];
        this.checkAttributeRestrictions = [];
        this.addRestriction = {
            account: {id: ''},
            restrictionType: AttributeRestrictionEnum.CUSTOM_WEIGHT,
            min: "",
            max: "",
            attributes: {attributeID: "", attributeName: "", attributeType: ""}
        };
    }

    restrictionsChange() {
        if (this.attributeRestrictions.length === this.checkAttributeRestrictions.length) {
            if (JSON.stringify(this.attributeRestrictions) === JSON.stringify(this.checkAttributeRestrictions)) {
                return false;
            }
        }
        return true;
    }

    showNotApplicable(array) {
        array.forEach((item, index) => {
            if (item.restrictionType != AttributeRestrictionEnum.CUSTOM_WEIGHT) {
                if (item.min == 0 || item.max == 0) {
                    item.min = 'N/A';
                    item.max = 'N/A';
                }
            }
        });

        return array;
    }

    isNonParametricRestriction(restrictionType) {
        return ["DNS", "DNB", "DNBN", "DNH"].includes(restrictionType);
    }

}
