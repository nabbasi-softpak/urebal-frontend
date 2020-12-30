import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {URebalService} from "../services/urebal.service";
import {UserService} from "../user/user.service";
import {LocalStorageService} from "angular-2-local-storage";
import {URebalUtil} from "../shared/util/URebalUtil";
import {UILoader} from "../shared/util/UILoader";

@Component({
    templateUrl: './redirect.component.html',
    styleUrls: []
})
export class RedirectComponent implements OnInit {
    errorMessage: string = "";

    constructor(private route: ActivatedRoute,
                public urebalService: URebalService,
                private userService: UserService,
                private router: Router,
                private localStorage: LocalStorageService,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            let token = this.route.snapshot.paramMap.get('token');
            if (token) {
                this.handleTokenRedirection(token)
            }
            else if (params['oauthLogin'])  {
                // oauthLogin is attached in url when redirecting after oauth verification from /services/user/oauth/redirect
                this.handleOAuthRedirection(params)
            }
            else {
                this.urebalService.oidcLoginRedirect();
            }
        });
    }

    handleTokenRedirection(token) {
        // Example:
        // token = {
        //  clientName: "google"
        //  accessToken: "1234",
        //  redirectTo: 'dashboard',
        // }
        token = JSON.parse(URebalUtil.decodeparams(token));

        const clientName = token['clientName'];
        const accessToken = token['accessToken'];
        const redirectTo = '/secure/' + token['redirectTo'];

        let redirectCommand = redirectTo;

        this.urebalService.removeToken(); // Remove old tokens
        this.urebalService.setToken(accessToken, clientName);

        this.transferUser(redirectCommand)
    }

    handleOAuthRedirection(params) {
        this.userService.removeToken();

        if (!params['oauthLogin']) return;

        window.history.replaceState({}, document.title, window.location.pathname);
        if (params['errorMessage']) {
            this.errorMessage = params['errorMessage'];
            this.ref.detectChanges();
        }
        else {
            UILoader.blockUI.start("Redirecting to dashboard...");

            this.localStorage.set('accessToken', params['accessToken']);
            this.localStorage.set('userFirstName', params['userFirstName']);

            this.urebalService.setToken(params['accessToken'], params['clientName']);

            this.transferUser();
        }
    }

    transferUser(redirectCommand="/secure/dashboard") {
        this.userService.loadInitData().subscribe((result) => {
            const userInfo = result[2].responsedata;
            this.localStorage.set('userFirstName', userInfo.firstName);

            this.router.navigateByUrl(redirectCommand).then(() => {
                console.log("Redirecting...");
                UILoader.blockUI.stop();

            });
        }, (error) => {
            this.router.navigate(["/user/forbiddenaccess"]);
        });
    }
}
