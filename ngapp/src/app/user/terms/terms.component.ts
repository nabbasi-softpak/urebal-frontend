import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
    $('#urebal_header').css('display','none');
    $('.navigation').removeClass('show');
    $('#urUserMenuContainer').css({'display': 'none'});
  }

  goToHome() {
    $('#urebal_header').css('display', 'block');
    $('#urUserMenuContainer').css({'display': 'block'});
    this.router.navigate(['']);
  }

}
