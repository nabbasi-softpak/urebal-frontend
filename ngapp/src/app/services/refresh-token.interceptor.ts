import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, filter, map, switchMap, take, tap} from "rxjs/operators";
import {CustomResponse} from "../shared/classes/CustomResponse.class";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {OidcClientName} from "../shared/enums/ClientName.enum";

// Source: https://itnext.io/angular-tutorial-implement-refresh-token-with-httpinterceptor-bfa27b966f57
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            // We don't want to refresh token for some requests like login or refresh token itself
            // So we verify url and we throw an error if it's the case
            if (
                !this.authService.isSSOLogin() ||
                request.url.includes("refresh") ||
                request.url.includes("refreshSSO") ||
                request.url.includes("login")
            ) {
                return throwError(error);
            }

            // If error status is different than 401 we want to skip refresh token
            // So we check that and throw the error if it's the case
            if (error instanceof HttpErrorResponse && error.status !== 401) {
                return throwError(error);
            }

            if (this.refreshTokenInProgress) {
                // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                // – which means the new token is ready and we can retry the request again
                return this.refreshTokenSubject.pipe(
                    filter(result => result != null),
                    take(1),
                    switchMap(() => next.handle(this.addAuthenticationToken(request)))
                )
            } else {
                this.refreshTokenInProgress = true;

                // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                this.refreshTokenSubject.next(null);

                // Call auth.refreshAccessToken(this is an Observable that will be returned)
                return this.authService.refreshSSO().pipe(
                    switchMap((response: CustomResponse) => {
                        let accessToken;
                        if (this.authService.getClientName() == OidcClientName.BLUELEAF) {
                            accessToken = response['access_token'];
                        } else {
                            accessToken = response.responsedata['access_token'];
                        }
                        this.authService.setToken(accessToken, this.authService.getClientName());

                        //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                        // for the next time the token needs to be refreshed
                        this.refreshTokenInProgress = false;
                        this.refreshTokenSubject.next(accessToken);

                        return next.handle(this.addAuthenticationToken(request));
                    }),
                    catchError((error: any) => {
                        this.refreshTokenInProgress = false;
                        console.log("Redirecting to login (SSO)", error);

                        this.authService.logout();
                        this.router.navigate(['/user/login']).then(() => {});

                        return throwError(error);
                    })
                );
            }
        }));
    }

    addAuthenticationToken(request) {
        // Get access token from Local Storage
        const accessToken = this.authService.getAccessToken();

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }

        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                Authorization: "Bearer " + accessToken
            }
        });
    }
}