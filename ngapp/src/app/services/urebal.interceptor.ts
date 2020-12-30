/**
 * Created by moazzam.qaisar on 8/27/2018.
 */
import {
    HttpErrorResponse,
    HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from "@angular/common/http";
import {Observable, EMPTY, throwError,} from "rxjs";
import {Router} from '@angular/router';
import {Injectable, Injector} from "@angular/core";
import {catchError} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {URebalUtil} from "../shared/util/URebalUtil";

@Injectable()
export class UrebalInterceptor implements HttpInterceptor {
    constructor(private injector: Injector,
                private router: Router,
                private authService: AuthService) {
    }

    allowedUrl(event) {
        // validateSession is used for redirecting to login page, allowing this will create cycle on login page.
        // Note: All url allowed except validateSession and login
        let notAllowed = ["validateSession", "login"];
        for (let path of notAllowed) {
            if (event.url.includes(path)) {
                return false;
            }
        }
        return true;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((event: HttpEvent<any>) => {
                    if (event instanceof HttpErrorResponse) {
                        if (event.status === 405) {
                            this.router.navigate(['/user/changepassword']);
                            return EMPTY;
                        }
                        else if (this.allowedUrl(event) && event.status === 401 && !this.authService.isSSOLogin()) {
                            // Note: for SSO case it is handled in refresh token interceptor
                            console.log("Redirecting to login (non SSO)", event);
                            this.router.navigate(['/user/login']);
                            return EMPTY;
                        }
                        else {
                            URebalUtil.corsCheck(event);
                            return throwError(event);
                        }
                    }
                })
            )
    }
}
