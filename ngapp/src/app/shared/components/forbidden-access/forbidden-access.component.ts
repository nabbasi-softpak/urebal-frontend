import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-forbidden-access',
  templateUrl: './forbidden-access.component.html',
  styleUrls: ['./forbidden-access.component.css']
})
export class ForbiddenAccessComponent implements OnInit {

  constructor(private router : Router, public urebalService: URebalService) { }

  ngOnInit() {
    //$('#urebal_header').css('display', 'none');
    $('.navigation').removeClass('show');
  }

  goToHome() {
    //$('#urebal_header').css('display', 'block');
    $('.navigation').addClass('show');
    this.router.navigate(['/user/login']);
  }

}
