import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ReCaptchaComponent} from 'angular2-recaptcha';

import {UILoader} from '../../shared/util/UILoader';

import {UserService} from '../user.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {PermissionResolverService} from '../../services/permission-resolver.service';
import {URebalUtil} from "../../shared/util/URebalUtil";
import {URebalService} from "../../services/urebal.service";
import {AppConfig} from "../../../app.config";

@Component({
    selector: 'urebal-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit {

    private showHeader: boolean = true;
    public static loginStatus: any;
    public companyName: string;
    public username: string;
    public password: string;
    public captchaResponse: string;

    returnUrl: string;

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    oauthErrorMessage: any;

    constructor(
        public urebalService: URebalService,
        private userService: UserService,
        private router: Router,
        private localStorage: LocalStorageService,
        private permissionResolverService: PermissionResolverService,
        private route: ActivatedRoute,
        private ref: ChangeDetectorRef
    ) {
        this.route.queryParams.subscribe((params: Params) => {
            if (params['l'] !== undefined) {
                this.clientName(params['l']);
            }
        });
    }


    ngOnInit() {
        const copyrightYear: HTMLElement = document.getElementById('copyright-year');
        if (copyrightYear) {
            copyrightYear.innerText = new Date().getFullYear().toString();
        }

        // Note: Delete OIDC token if user land on login page. User will never land here is OIDC token is valid, see LoginGuardService.
        this.urebalService.removeToken();

        //$('#urebal_header').css('display','none');
        $('.navigation').addClass('show');
        $('.drawer').css({'display': 'none'});
        this.captchaResponse = '';

        setTimeout(() => {
            $('.loginBox').addClass('animScaleUp');
        }, 300);

        // get returnUrl from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || URebalUtil.encodeparams('/secure/dashboard');
    }

    private redirectToLandingPageIfLoggedIn() {
        this.userService.validateSession().subscribe(
            result => {
                if (result.code === 200) {
                    //$('#urebal_header').css('display','block');
                    $('.navigation').removeClass('show');
                    $('.drawer').css({'display': 'flex'});
                     this.router.navigate(['/secure/dashboard']);
                }
            },
            error => {
                UILoader.blockUI.stop();
                console.error(error);
            }
        );
    }

    onLogin(): void {
        this.oauthErrorMessage = "";
        let errorCount = 0;

        UILoader.blockUI.start("Logging you in, please wait...");

        $('#companyName').css('border-color', '#696969');
        $('#username').css('border-color', '#696969');
        $('#password').css('border-color', '#696969');

        if (this.password == '' || typeof this.password == 'undefined') {
            errorCount++;
            $('#password').css('border-color', '#f70202');
            $("#lblMsg").text("Please enter password.");
            UILoader.blockUI.stop();
        }

        if (this.username == '' || typeof this.username == 'undefined') {
            errorCount++;
            $('#username').css('border-color', '#f70202');
            $("#lblMsg").text("Please enter username.");
            UILoader.blockUI.stop();
        }

        if (this.companyName == '' || typeof this.companyName == 'undefined') {
            errorCount++;
            $('#companyName').css('border-color', '#f70202');
            $("#lblMsg").text("Please enter company name.");
            UILoader.blockUI.stop();
        }

        if (errorCount === 0) {
            this.userService.login(this.companyName, this.username, this.password, this.captchaResponse).subscribe(
                result => {
                    LoginComponent.loginStatus = result; //** suspected as an unwanted code since not using anywhere in Front-End

                    if (result.code === 200) //login successful
                    {
                        this.transferUser();
                    } else if (result.code == 301 && result.message == 'Password has been expired') //password expired
                    {
                        UILoader.blockUI.stop();
                        this.navigateToChangePassword(result.responsedata.firstName);
                    } else if (result.code === 401 && result.message !== 'Captcha failed') // login failed
                    {
                        UILoader.blockUI.stop();
                        $("#lblMsg").text("The login credentials are invalid. Please provide valid credentials to continue."); //Your Company name or username/password is incorrect.
                    } else // fallback
                    {
                        UILoader.blockUI.stop();
                        this.resetCaptcha(result.message);
                    }
                },
                error => {
                    UILoader.blockUI.stop();
                    $("#lblMsg").text("This login failed. Attempt to log in again or contact your system administrator.");
                    console.error(error);
                }
            );
        }


        if (errorCount == 3) {
            $('#companyName').css('border-color', '#f70202');
            $('#username').css('border-color', '#f70202');
            $('#password').css('border-color', '#f70202');
            $("#lblMsg").text("Please enter company name/username/password.");
            UILoader.blockUI.stop();
        }

    }

    navigateToChangePassword(userFirstName: string) {
        this.localStorage.set("userFirstName", userFirstName);
        //$('#urebal_header').css('display','block');
        $('.navigation').addClass('show');
        $('#navigation-links').css('visibility', 'hidden');
        this.router.navigate(['/secure/user/changepassword']);
    }

    resetCaptcha(loginResponseMessage: string) {
        if (loginResponseMessage === 'showCaptcha' || loginResponseMessage === 'Captcha failed') {
            if (this.captchaResponse != '') {
                this.captcha.reset();
            }
            $('#captchaContainer').removeClass('slds-hide');
            $('#loginButton').prop('disabled', true);
        }
    }

    handleCaptcha(captchaResponse) {
        this.captchaResponse = captchaResponse;
        $('#loginButton').prop('disabled', false);

    }

    transferUser() {
        this.userService.loadInitData().subscribe((result) => {
            const userInfo = result[2].responsedata;
            this.localStorage.set('userFirstName', userInfo.firstName);

            // login successful so redirect to return url
            let decodedURL: string = '404';
            try {
                decodedURL = URebalUtil.decodeparams(this.returnUrl);
            } catch (error) {
                console.log(error);
            }

            this.router.navigateByUrl(decodedURL).then(() => {
                UILoader.blockUI.stop();
            })
        },
        (error) => {
            if (this.localStorage.get('accessToken') != null) {
                this.router.navigate(["/user/forbiddenaccess"]);
            }
            else {
                this.router.navigate(["/user/login"]);
            }
            UILoader.blockUI.stop();
        });
    }

    loginOauth() {
        let clientName = this.clientName().charAt(0).toUpperCase() + this.clientName().slice(1); // capitalize first character eg. google => Google, microsoft => Microsoft
        UILoader.blockUI.start(`Redirecting to ${clientName} consent page...`);
        this.oauthErrorMessage = "";
        window.location.href = this.userService.getOIDCSignInURL(clientName);
    }

    clientName(name?) {
        if (name === undefined) {
            name = this.localStorage.get("clientName");
        }
        else {
            if (AppConfig.OAUTH_SUPPORTED_PROVIDER.indexOf(name) == -1) {
                name = null;
            }

            this.localStorage.set("clientName", name);
        }

        return name;
    }
}
