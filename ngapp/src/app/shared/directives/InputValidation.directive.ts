import {Directive, Output, EventEmitter, Input, HostListener} from "@angular/core";
import {NgModel} from "@angular/forms";
import {
    allowDollarThreeDecimal,
    allowFloatingNumberThreeDecimal,
    allowFloatingNumberTwoDecimal, allowPercentNoDecimal,
    allowPercentThreeDecimal, allowPercentTwoDecimal, numericalEventHandler
} from "../util/URebalUtil";
import {Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Directive({
    selector: '[ngModel][InputValidation]',
    providers: [NgModel],
})
export class InputValidationDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    @Input('validationType') validationType: string | {};
    @Input('validationRegEx') validationRegEx: string = "";
    @Input('empty') empty: string = ""; // replace empty value with e.g. 0

    // private eventOccurred = new Subject();
    // private subscription: Subscription;

    supportedValidations: {} = {
        'floating-number-three-decimals': allowFloatingNumberThreeDecimal,
        'floating-number-two-decimal': allowFloatingNumberTwoDecimal,
        'percent-no-decimals': allowPercentNoDecimal,
        'percent-two-decimals': allowPercentTwoDecimal,
        'percent-three-decimals': allowPercentThreeDecimal,
        'dollar-three-decimals': allowDollarThreeDecimal,
    };

    ngOnInit() {
        //this.subscription = this.eventOccurred.pipe(
        //    debounceTime(0)
        //).subscribe(e => this.runValidation(e));
    }

    @HostListener('input', ['$event'])
    @HostListener('keydown', ['$event'])
    @HostListener('keyup', ['$event'])
    @HostListener('mousedown', ['$event'])
    @HostListener('mouseup', ['$event'])
    @HostListener('select', ['$event'])
    @HostListener('contextmenu', ['$event'])
    @HostListener('drop', ['$event'])
    changeEvent(event: any) {
        //this.eventOccurred.next(event);
        this.runValidation(event);
    }

    runValidation(event) {
        let validationType = this.getValidationType(); // Use better name
        if (validationType in this.supportedValidations) {
            this.supportedValidations[validationType]
                .call(null, event)
                .then(() => {
                    this.applyChange(event.target.value);
                });
        } else if (this.validationRegEx && this.validationRegEx.length > 0) {
            numericalEventHandler(event, (value) => {
                return new RegExp(this.validationRegEx).test(value);
            }).then(() => {
                this.applyChange(event.target.value);
            });
        }
    }

    applyChange(value) {
        console.log('Empty: ', this.empty, "Value:", value);
        if (this.empty != "" && value == "") {
            this.ngModelChange.emit(this.empty);
        }
        else {
            this.ngModelChange.emit(value);
        }
    }

    getValidationType() {
        if (typeof this.validationType == 'string') {
            return this.validationType;
        } else {
            for (let key in this.validationType) {
                if (this.validationType[key]) return key;
            }
        }
        return null;
    }

    //ngOnDestroy() {
    //    this.subscription.unsubscribe();
    //}
}
