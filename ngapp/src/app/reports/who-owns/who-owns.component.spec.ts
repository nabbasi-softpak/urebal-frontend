import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoOwnsComponent } from './who-owns.component';

xdescribe('WhoOwnsComponent', () => {
  let component: WhoOwnsComponent;
  let fixture: ComponentFixture<WhoOwnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoOwnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoOwnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
