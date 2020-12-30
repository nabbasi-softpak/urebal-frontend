import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHouseHoldComponent } from './create-household.component';

xdescribe('CreateHouseHoldComponent', () => {
  let component: CreateHouseHoldComponent;
  let fixture: ComponentFixture<CreateHouseHoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHouseHoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHouseHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
