import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftsReportComponent } from './drifts-report.component';

xdescribe('DriftsReportComponent', () => {
  let component: DriftsReportComponent;
  let fixture: ComponentFixture<DriftsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
