import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCriteriaComponent } from './model-criteria.component';

xdescribe('ModelCriteriaComponent', () => {
  let component: ModelCriteriaComponent;
  let fixture: ComponentFixture<ModelCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
