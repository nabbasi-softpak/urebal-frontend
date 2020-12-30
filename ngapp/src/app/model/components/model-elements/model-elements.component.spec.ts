import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelElementsComponent } from './model-elements.component';

xdescribe('ModelElementsComponent', () => {
  let component: ModelElementsComponent;
  let fixture: ComponentFixture<ModelElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
