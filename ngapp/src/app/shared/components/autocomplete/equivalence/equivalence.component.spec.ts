import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalenceComponent } from './equivalence.component';

xdescribe('EquivalenceComponent', () => {
  let component: EquivalenceComponent;
  let fixture: ComponentFixture<EquivalenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
