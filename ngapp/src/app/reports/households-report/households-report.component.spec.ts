import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdsReportComponent } from './households-report.component';

xdescribe('HouseholdsReportComponent', () => {
  let component: HouseholdsReportComponent;
  let fixture: ComponentFixture<HouseholdsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
