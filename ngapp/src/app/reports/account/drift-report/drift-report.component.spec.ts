import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftReportComponent } from './drift-report.component';

xdescribe('DriftReportComponent', () => {
  let component: DriftReportComponent;
  let fixture: ComponentFixture<DriftReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
