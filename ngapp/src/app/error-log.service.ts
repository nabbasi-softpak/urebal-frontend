import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable()
export class ErrorLogService {

  errorMessage: string = 'Unknown error occurred';

  errorOccurred: boolean = false;
  private onError: Subject<boolean> = new Subject();

  constructor() { }

  public getError(): Observable<boolean> {
    return this.onError.asObservable();
  }

  public resetErrorMessage(){
    this.errorMessage = 'Unknown error occurred';
  }


  log(error: any) {

    //console.error(error);
    this.onError.next(true);

   /* const date = new Date().toISOString();

    switch( error ){
      case (error instanceof TypeError):
        console.log(date, 'Type Error:', error.message, 'Stack:', error.stack);
        break;
      case (error instanceof Error) :
        //Syntax Error
        console.log(error.name, '=========');
        console.log(date, 'Error:', error.message);
        console.log(date, 'Stack:', error.stack);
        break;


      /!*
       This 'default' condition catches all errors outside of the JavaScript error type as mentioned above. So when
       the http request error occurs
       *!/

      default :

        console.log('Common Error', error);

        //this trigger Observable method.
        if(this.containCode(error.status)){
          this.onError.next(true);
        }

        break;
    }*/

/*

 /!*
   To hide error message container on the UI
  *!/
    if(this.onError){
      setTimeout( () => {
        this.onError.next(false);
      }, 5000);
    }
*/

  }

  dismissError(){
    this.onError.next(false);
  }


  /*
    This method check the server side errors
   */
  containCode(code: number){
    let statusCodes = [400,401,403,404,405,408,440,444,500,502,503,504];   //constant can be put somewhere.These are all the status code I copied from Wikipedia
    let result = false;
    statusCodes.forEach( (v) => {
      if(code == v){
        result = true;
      }
    });
    return result;
  }


}
