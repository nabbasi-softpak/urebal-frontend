import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../../../app.config';
import {URebalService} from "../../services/urebal.service";
import {LocalStorageService} from "angular-2-local-storage";


@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent {
  show: boolean = false;

  public pageContent = {
    code: "",
    heading: "",
    description: ""
  };

  constructor(public urebalService: URebalService, private router : Router, private localStorage: LocalStorageService) {
    if(this.router.url == '/secure/404' || this.router.url == '/404') {
      this.pageContent = AppConfig.ERROR_PAGE_CONTENT["notfound"];
    } else {
      this.pageContent = AppConfig.ERROR_PAGE_CONTENT["forbidden"];
    }
    $('#urUserMenuContainer').css({'display': 'none'});

    this.show = true;
  }

  goToHome() {
    this.router.navigate(['/user/login']);
  }
}
