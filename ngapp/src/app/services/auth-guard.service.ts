import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {UserService} from './../user/user.service';
import {UrebalPermissions} from './permission-resolver.service';
import {URebalUtil} from "../shared/util/URebalUtil";
import {FirmConfigService} from "./firm-config.service";


@Injectable() //emit the needed metadata
//CanActivate is a guard to decide if a route can be activated
export class AuthGuardService implements CanActivate {

    constructor(private userService: UserService,
                private router: Router,
                private urebalPermissions: UrebalPermissions,
                private firmConfigService : FirmConfigService) {
    }


    checkForPermissions(route: ActivatedRouteSnapshot): boolean {
        let permissionName: string = '';
        let bypassPermission: boolean = false;

        if (route.data.checkParamPermission === true) // if permission need to be checked on route path "parameter"
        {
            let permissionIndex = route.data.paramValuePermissions.findIndex(p => p.paramValue === route.params[route.data.paramName]);
            permissionName = route.data.paramValuePermissions[permissionIndex].permissionName; // get permission name from route path "parameter"
        } else if (route.data.permissionName !== null && route.data.permissionName !== undefined) // if permission need to be checked on route path
        {
            permissionName = route.data.permissionName;
        } else {
            bypassPermission = true;
        }

        const isPermitted = (bypassPermission == true) ? bypassPermission : this.urebalPermissions.isAllowed(permissionName);

        if (!isPermitted) {
            this.router.navigate(['/user/forbiddenaccess']);
        }

        return isPermitted;
    }

    /**
     * method called from routing-module
     * canActivate method checks if session not exist navigate user to login screen.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let activate: Observable<boolean>;
        activate = this.checkForValidSession(route, state.url);
        return activate;
    }

    checkForValidSession(route: ActivatedRouteSnapshot, url: string): Observable<boolean> {
        return this.userService.validateSession()
            .pipe(
                switchMap((result) => {
                    if (result.code === 200) {
                        return this.urebalPermissions.loadPermission().pipe(map(() => {
                            this.firmConfigService.loadFirmConfiguration();
                            return this.checkForPermissions(route);
                        }));
                    } else {
                        if (url == '/' || !url) {
                            this.router.navigate(['/user/login']).then();
                        } else {
                            // not logged in so redirect to login page with the return url and return false
                            this.router.navigate(['/user/login'], {queryParams: {returnUrl: URebalUtil.encodeparams(url)}}).then();
                        }
                        return of(false);
                    }
                }),
                map(result => result),
                catchError((error) => {
                    this.router.navigate(['/user/login']).then();
                    return of (false)
                })
            );
    }

}
