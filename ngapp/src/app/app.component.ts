import {AfterViewInit, Component} from '@angular/core';
import {URebalService} from './services/urebal.service';
import {UserService} from './user/user.service';
import {AppConfig} from '../app.config';
import {interval} from 'rxjs';
import {PermissionResolverService} from './services/permission-resolver.service';
import {URebalUtil} from "./shared/util/URebalUtil";
import {OidcClientName} from "./shared/enums/ClientName.enum";

declare var pendo: any;

@Component({
    selector: 'urebal-app',
    templateUrl: 'app.component.html',
})

export class AppComponent implements AfterViewInit {

    public versionInfo: any = {dbVersion: "", restServicesVersion: "", uiVersion: ""};
    private tomsURL: string;
    private onLoginEvent;

    constructor(private urebalService: URebalService,
                private userService: UserService,
                private permissionResolverService: PermissionResolverService) {

        this.tomsURL = AppConfig.TOMS_URL;

        URebalUtil.numberOnlyEvent();

        this.onLoginEvent = this.userService.onLogin.subscribe(this.initPendo.bind(this));
    }

    initPendo(userInfo) {
        if (this.userService.getClientName() == OidcClientName.BLUELEAF) {
            console.log("Initializing Pendo for ", this.userService.getClientName());
            pendo.initialize({
                "visitor": {
                    "id": userInfo['userId'],
                    "email": userInfo['email']
                }, "account": {
                    "id": userInfo['userId']
                }
            });
        } else {
            console.log("Initializing Pendo skipped because it is only supported for Blueleaf");
        }

        this.onLoginEvent.unsubscribe();
    }

    ngAfterViewInit(): void {

        $('#dashBoardLink').on("click", function () {
            $('.menu-active').removeClass('menu-active');
            $(this).addClass('dashboard_icon_style');
        });


        $(".slds-dropdown__list li").click(function () {
            $('#dashBoardLink').removeClass('dashboard_icon_style');
            $('.menu-active').removeClass('menu-active');
            $('.slds-dropdown__list li').removeClass('menu-active');
            $(this).closest('.slds-dropdown-trigger').find('a:first').addClass("menu-active");
            $(this).addClass("menu-active");
        });

        $('#logOut').click(function () {
            $('.menu-active').removeClass('menu-active');
            $('#dashBoardLink').addClass('dashboard_icon_style');
        });

        this.urebalService.getUnauthorized("version/aboutAppVersion").subscribe(result => {
            if (result.code == 200) {
                let data = result.responsedata;
                this.versionInfo.uiVersion = this.urebalService.getApplicationVersion();
                this.versionInfo.restServicesVersion = data.restServicesVersion;
                this.versionInfo.dbVersion = data.dbVersion;
                console.log("urebal service->application version: " + this.urebalService.getApplicationVersion());
            }
        });
    }

    startPollingServices() {
        //1:: Permission Service Call (i.e. get current user latest permission set)
        /** === polling code starts here === **/
        let j = 0;
        interval(AppConfig.POLLING_INTERVAL).subscribe(() => {
            console.log('j: ' + j++);
            this.permissionResolverService.getLoggedInUserPermissions().subscribe(
                (result) => {
                    if (result.code == 200) {
                        /** initialize user permissions **/
                        this.permissionResolverService.initializeCurrentUserPermission(result.responsedata);
                    }
                },
                error => {
                    console.error(error);
                }
            );
        });
        /** ==== polling code ends here === **/
    }
}
