import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashsaleReportComponent } from './washsale-report.component';

xdescribe('WashsaleReportComponent', () => {
  let component: WashsaleReportComponent;
  let fixture: ComponentFixture<WashsaleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashsaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashsaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
