import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFinishComponent } from './review-finish.component';

xdescribe('ReviewFinishComponent', () => {
  let component: ReviewFinishComponent;
  let fixture: ComponentFixture<ReviewFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
