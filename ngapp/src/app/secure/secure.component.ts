import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {URebalService} from '../services/urebal.service';
import {UserService} from '../user/user.service';

import {LocalStorageService} from 'angular-2-local-storage';
import {AppConfig} from '../../app.config';

import {PermissionResolverService} from '../services/permission-resolver.service';
import {MessageModalComponent} from "../shared/components/message-modal/message-modal.component";
import {ErrorModalComponent} from "../shared/components/error-modal/error-modal.component";
import {ErrorLogService} from "../error-log.service";
import {GlobalErrorClass} from "../shared/classes/GlobalError.class";
import {Subscription} from "rxjs";
import {BlockUI} from "ng-block-ui";
import {UILoader} from "../shared/util/UILoader";


@Component({
    selector: 'urebal-app-secure',
    templateUrl: 'secure.component.html',
})

export class SecureComponent implements AfterViewInit {

    private versionInfo: any = {dbVersion: "", restServicesVersion: "", uiVersion: ""};
    @ViewChild('dataNotExistModal') dataNotExistModal: MessageModalComponent;
    @ViewChild('sessionTimeoutModal') sessionTimeoutModal: MessageModalComponent;
    @ViewChild('errorModal') errorModal: ErrorModalComponent;

    public dataNotExistMessage;
    public sessionTimeoutMessage: string;
    private tomsURL: string;

    private previousRouteURL: string = '';
    private _subscription: Subscription;

    constructor(private errorLogService: ErrorLogService,
                private urebalService: URebalService,
                private userService: UserService,
                private permissionResolverService: PermissionResolverService,
                private router: Router,
                private localStorage: LocalStorageService) {

        this.tomsURL = AppConfig.TOMS_URL;
        urebalService.notifyObservableAppComponent$.subscribe((res) => {
            this.dataNotExistMessage = res;
            this.dataNotExistModal.open();
        });

        if (AppConfig.NOTIFY_ERROR) {
            this.initializeErrorNotification();
        }

    }

    initializeErrorNotification() {
        this._subscription = this.errorLogService.getError().subscribe((value) => {
            this.errorModal.show(GlobalErrorClass.errorMessage);
            GlobalErrorClass.setToDefault();
        });

        /*this.router.events.subscribe(() => {
          if(this.previousRouteURL.toLowerCase() != this.router.url.toLowerCase()){
            this.errorModal.closeAll();
            GlobalErrorClass.setToDefault();
            this.previousRouteURL = this.router.url;
          }
        });*/

    }

    ngAfterViewInit(): void {

        $('#dashBoardLink').click(function () {
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
        })
    }

    /** This method serves the requirement to logout current user from every opened and active browser tab.
     * (i.e. on logout and passwordchange) **/
    @HostListener('window:focus', ['$event'])
    onFocus() {
        // Check if userFirstName is null in localStorage and current url is not 'user/login'.
        if (this.localStorage.get("userFirstName") === null &&
            this.router.url.match('user/login') === null &&
            this.localStorage.get('accessToken') === null &&
            this.router.url.match('terms') === null &&
            this.router.url.match('user/forbiddenaccess') === null &&
            this.router.url.match('404') === null) {
            this.userService.logout(); // make user Logout if userFirstName localStorage is removed (i.e. explicitly from browser etc);

            // Displays popup/Modal window to inform user that current session is expired.
            this.sessionTimeoutMessage = 'Current User Session has been expired/timed out.';
            this.sessionTimeoutModal.open();
            //In this scenario after login app loads dashboard but menu highlighted previously selected item.
            $('.menu-active').removeClass('menu-active');
            $('#dashBoardLink').addClass('dashboard_icon_style');
        }
    };

    private static accessTokenChanged(e) {
        return e && e.key && e.key.includes("accessToken") && e.oldValue != e.newValue;
    }

    private static userNameChanged(e) {
        return e && e.key && e.key.includes("userFirstName") && e.oldValue != e.newValue;
    }

    @HostListener('window:storage', ['$event'])
    onStorage(e) {
        if (SecureComponent.accessTokenChanged(e) || SecureComponent.userNameChanged(e)) {
            UILoader.start("Updating context...");
            window.location.reload();
        }
    };

    redirect() {
        this.router.navigate(['dashboard']);
        this.dataNotExistModal.close();
        $('.menu-active').removeClass('menu-active');
        $('#dashBoardLink').addClass('dashboard_icon_style');
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
