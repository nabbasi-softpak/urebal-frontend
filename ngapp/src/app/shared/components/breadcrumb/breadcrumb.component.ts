import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import { filter } from 'rxjs/operators';

interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    //subscribe to the NavigationEnd event

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
      //set breadcrumbs
      console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')

      let root: ActivatedRoute = this.activatedRoute.root;
      let url = '';
      let isExist = false;
      do {
        let children: ActivatedRoute[] = root.children;
        root = null;
        children.forEach(route => {
          if(route.outlet === 'primary') {
            let routeSnapshot = route.snapshot;
            if(this.breadcrumbs.length > 0) {
              this.breadcrumbs.forEach((value,index)=>{
                if(value.label == route.snapshot.data.breadcrumb) {
                  isExist = true;
                  this.breadcrumbs.splice(index+1,this.breadcrumbs.length-(index+1))
                }
              })
            }
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
              if(typeof route.snapshot.data.breadcrumb != 'undefined' && !isExist) {
                if(typeof route.snapshot.data.parent == 'undefined') {
                  this.breadcrumbs = [];
                }
                this.breadcrumbs.push({
                  label: route.snapshot.data.breadcrumb,
                  url: url
                });
              }
              root = route;
          }
        })
      } while(root);

    });
  }

}
