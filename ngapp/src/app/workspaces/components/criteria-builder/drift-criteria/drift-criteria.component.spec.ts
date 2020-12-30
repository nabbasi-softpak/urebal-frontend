import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftCriteriaComponent } from './drift-criteria.component';

xdescribe('DriftCriteriaComponent', () => {
  let component: DriftCriteriaComponent;
  let fixture: ComponentFixture<DriftCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
