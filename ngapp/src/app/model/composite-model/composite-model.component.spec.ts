import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeModelComponent } from './composite-model.component';

xdescribe('CompositeModelComponent', () => {
  let component: CompositeModelComponent;
  let fixture: ComponentFixture<CompositeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
