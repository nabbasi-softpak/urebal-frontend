import { Injectable,ErrorHandler, Injector } from '@angular/core';
import { ErrorLogService } from './error-log.service';
import {HttpErrorResponse} from "@angular/common/http";
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {UILoader} from "./shared/util/UILoader";

/*
  This a custom error handler wrapper class for Angular ErrorHandler. provide in app.module.ts
 */

@Injectable()
export class CustomErrorHandler implements ErrorHandler{

  constructor(private injector: Injector) { }

  handleError(error: Error | HttpErrorResponse) {

   /*
   const errorLogService = this.injector.get(ErrorLogService);
    //errorLogService.log(error);


   if (error instanceof HttpErrorResponse) {
     console.log(error.url);
    }
    else{
     console.log(error);
    }

    console.log(error);
    errorLogService.log(error);
    UILoader.blockUI.stop();

    */

    const errorLogService = this.injector.get(ErrorLogService);
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        console.error(error);
      } else {
        // Handle Http Error (error.status === 403, 404...)
        console.error(error);
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      console.error(error);
    }
    // Log the error anyway
    //console.error('It happens: ', error);
    errorLogService.log(error);
    UILoader.blockUI.stop();
  }

}
