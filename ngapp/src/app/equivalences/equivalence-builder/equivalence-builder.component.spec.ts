import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalenceBuilderComponent } from './equivalence-builder.component';

xdescribe('EquivalenceBuilderComponent', () => {
  let component: EquivalenceBuilderComponent;
  let fixture: ComponentFixture<EquivalenceBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalenceBuilderComponent ]
    })
    .compileComponents();
  }));




  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalenceBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
