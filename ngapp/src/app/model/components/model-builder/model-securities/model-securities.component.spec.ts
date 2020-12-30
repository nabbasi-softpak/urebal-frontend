import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSecuritiesComponent } from './model-securities.component';

xdescribe('ModelSecuritiesComponent', () => {
  let component: ModelSecuritiesComponent;
  let fixture: ComponentFixture<ModelSecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelSecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
