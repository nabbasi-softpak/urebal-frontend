import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyEquivalenceModalComponent } from './apply-equivalence-modal.component';

xdescribe('ApplyEquivalenceModalComponent', () => {
  let component: ApplyEquivalenceModalComponent;
  let fixture: ComponentFixture<ApplyEquivalenceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyEquivalenceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyEquivalenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
