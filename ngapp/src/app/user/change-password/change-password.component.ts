import {Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';
import {UserService} from '../user.service';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {Router} from "@angular/router";
import {LocalStorageService} from 'angular-2-local-storage';
import {UILoader} from "../../shared/util/UILoader";


@Component({
    selector: 'app-change-password',
    templateUrl: 'change-password.component.html',
    styles: []
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

    public currentPwd: string;
    public newPwd: string;
    public confirmNewPwd: string;
    public errMsg: string;
    public successMsg: string;
    public passwordConfig: any = {
        "lowerCaseRegEx": "(?=(.*[a-z]){1})",
        "upperCaseRegEx": "(?=(.*[A-Z]){1})",
        "minNumberRegEx": "(?=(.*\\d){1})",
        "minSpecialRegEx": "(?=(.*?[#?!@$%^&*-]){1})",
        "minLower": 1,
        "minUpper": 1,
        "minNumber": 1,
        "minSpcial": 1,
        "minLength": 8
    };
    public disableChangePassword: boolean = true;
    @ViewChild('loginModalRef') modalRef: ModalComponent;

    constructor(private userService: UserService,
                private router: Router,
                private localStorage: LocalStorageService) {
    }


    ngOnInit() {

    }

    ngAfterViewInit() {
        // UILoader.blockUI.start('Loading...');
        // this.errMsg = '';
        // this.userService.getPasswordConfiguration().subscribe(result => {
        //   UILoader.blockUI.stop();
        //   this.passwordConfig = result.responsedata;
        //   $('#lower > span').html("at least contain <b>" + this.passwordConfig.minLower + " lowercase </b>letters(s).");
        //   $('#capital > span').html("at least contain <b>" + this.passwordConfig.minUpper + " uppercase </b>letters(s).");
        //   $('#number > span').html("at least contain <b>" + this.passwordConfig.minNumber + " digit(s)</b>.");
        //   $('#special > span').html("at least contain <b>" + this.passwordConfig.minSpcial + " special </b>character(s).");
        //   $('#length > span').html("at least contain <b>" + this.passwordConfig.minLength + " </b>character(s).");
        //
        // });

    }

    changePassword() {
        if (typeof (this.currentPwd) == "undefined" || this.currentPwd == '') {
            this.errMsg = "Please enter current password.";
            return;
        }

        if (typeof (this.newPwd) == "undefined" || this.newPwd == '') {
            this.errMsg = "Please enter new password.";
            return;
        }

        if (typeof (this.confirmNewPwd) == "undefined" || this.confirmNewPwd == '') {
            this.errMsg = "Please confirm new password.";
            return;
        }


        if (this.newPwd == this.confirmNewPwd) {
            this.errMsg = '';

            // Note: Commented because is abandoned service.
            //this.userService.checkOldPassword(this.currentPwd).subscribe(result => {
            //  console.log(result);
            //if (result.code == 200) {
            this.userService.changePassword(this.confirmNewPwd).subscribe(result => {
                if (result.message == "Password changed successfully") {

                    /*
                      Clear userFirstName from localStorage since changePassword call
                      will invalidate the Session internally and hence userFirstName in localStorage must be cleared
                    */
                    this.localStorage.set("userFirstName", null);

                    this.errMsg = '';
                    this.modalRef.open();
                    this.successMsg = result.message;
                } else {
                    this.errMsg = 'Password does not meet all requirements. Please try using a stronger password';
                }

            });
            // }else {
            //   this.errMsg = 'Password does not meet all requirements. Please try using a stronger password';
            // }
            //});
        } else {
            this.errMsg = "New Password and Confirm Password should be same."
        }
    }

    navigateToDashboard() {
        this.modalRef.close();
        $('#navigation-links').css('visibility', 'visible');
        this.router.navigate(['/secure/dashboard']);
    }

    navigateToLoginPage() {
        this.modalRef.close();
        $('#navigation-links').css('visibility', 'visible');
        this.router.navigate(['/user/login']);
    }

    newPasswordKeyUp() {

        var isInValidNewPassword = false;

        if ((<string>$('#newPassword').val()).match(this.passwordConfig.lowerCaseRegEx)) {
            $('#lower').removeClass("password-invalid");
            $('#lower').addClass("password-valid");
        } else {
            $('#lower').removeClass("password-valid");
            $('#lower').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        // Validate $('#capital'). $('#letter').s
        if ((<string>$('#newPassword').val()).match(this.passwordConfig.upperCaseRegEx)) {
            $('#capital').removeClass("password-invalid");
            $('#capital').addClass("password-valid");
        } else {
            $('#capital').removeClass("password-valid");
            $('#capital').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        // Validate numbers
        if ((<string>$('#newPassword').val()).match(this.passwordConfig.minNumberRegEx)) {
            $('#number').removeClass("password-invalid");
            $('#number').addClass("password-valid");
        } else {
            $('#number').removeClass("password-valid");
            $('#number').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        // Validate special characters
        if ((<string>$('#newPassword').val()).match(this.passwordConfig.minSpecialRegEx)) {
            $('#special').removeClass("password-invalid");
            $('#special').addClass("password-valid");
        } else {
            $('#special').removeClass("password-valid");
            $('#special').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        // Validate length
        if ((<string>$('#newPassword').val()).length >= this.passwordConfig.minLength) {
            $('#length').removeClass("password-invalid");
            $('#length').addClass("password-valid");
        } else {
            $('#length').removeClass("password-valid");
            $('#length').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        if ($('#newPassword').val() == $('#confirmNewPassword').val() && ($('#confirmNewPassword').val() != '' && $('#newPassword').val() != '')) {
            $('#confirm').removeClass("password-invalid");
            $('#confirm').addClass("password-valid");
        } else {
            $('#confirm').removeClass("password-valid");
            $('#confirm').addClass("password-invalid");
            isInValidNewPassword = true;
        }

        this.disableChangePassword = isInValidNewPassword;
    }

    newConfirmPasswordKeyUp() {
        var isInValidNewPassword = false;
        if ($('#newPassword').val() == $('#confirmNewPassword').val() && ($('#confirmNewPassword').val() != '' && $('#newPassword').val() != '')) {
            $('#confirm').removeClass("password-invalid");
            $('#confirm').addClass("password-valid");
        } else {
            $('#confirm').removeClass("password-valid");
            $('#confirm').addClass("password-invalid");
            isInValidNewPassword = true;
        }
        this.disableChangePassword = isInValidNewPassword;

    }
}
