import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeModelReportComponent } from './attribute-model-report.component';

xdescribe('AttributeModelReportComponent', () => {
  let component: AttributeModelReportComponent;
  let fixture: ComponentFixture<AttributeModelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeModelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeModelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
