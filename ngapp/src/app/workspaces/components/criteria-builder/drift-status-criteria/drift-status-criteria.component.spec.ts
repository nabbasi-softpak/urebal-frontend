import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftStatusCriteriaComponent } from './drift-status-criteria.component';

xdescribe('DriftStatusCriteriaComponent', () => {
  let component: DriftStatusCriteriaComponent;
  let fixture: ComponentFixture<DriftStatusCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftStatusCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftStatusCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
