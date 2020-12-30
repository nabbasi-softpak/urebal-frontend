import {Injectable} from "@angular/core";
import {PreloadingStrategy, Route} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {

  constructor() {
  }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Eagerly loading (run as a background process) to minimize flickering on overall application, can customize this strategy in future.
    return load();
  }
}
