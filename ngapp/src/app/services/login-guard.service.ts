import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';

import {AppConfig} from "../../app.config";
import {URebalService} from "./urebal.service";
import {UserService} from "../user/user.service";
import {catchError, map, switchMap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable() //emit the needed metadata
//CanActivate is a guard to decide if a route can be activated
export class LoginGuardService implements CanActivate {

    constructor(private urebalService: URebalService, private userService: UserService, private router: Router) {
    }

    /**
     * method called from routing-module
     * canActivate method checks if session not exist navigate user to login screen.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.validateSession().pipe(
            map((result) => {
                if (result['code'] === 200) {
                    this.router.navigate(['/secure/dashboard']);
                }
                return false;
            }),
            catchError((error: HttpErrorResponse) => {
                if (AppConfig.OIDC_MODE == true) {
                    this.urebalService.oidcLoginRedirect();
                    return of(false);
                } else if (error instanceof HttpErrorResponse && error.status != 401) {
                    return throwError(error);
                }
                return of(true); // Simple login enabled.
            })
        );
    }
}
