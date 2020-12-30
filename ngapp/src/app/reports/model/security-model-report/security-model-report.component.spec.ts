import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityModelReportComponent } from './security-model-report.component';

xdescribe('SecurityModelReportComponent', () => {
  let component: SecurityModelReportComponent;
  let fixture: ComponentFixture<SecurityModelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityModelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityModelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
