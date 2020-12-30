import {TestBed, inject, async, ComponentFixture } from '@angular/core/testing';
import { Router, RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login.component';
import { URebalService } from '../../services/urebal.service';


xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ LoginComponent ],
        imports: [HttpClientModule],
        providers: [
            { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); }},
            URebalService, {provide: 'urebalService', useClass: URebalService},
          ]
      });
  }));

  beforeEach(inject([URebalService],(urebalService) => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  }));

  it('should create login component', () => {

  });
});
