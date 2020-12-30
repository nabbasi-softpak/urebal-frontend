import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoOwnsMultisecurityComponent } from './who-owns-multisecurity.component';

xdescribe('WhoOwnsMultisecurityComponent', () => {
  let component: WhoOwnsMultisecurityComponent;
  let fixture: ComponentFixture<WhoOwnsMultisecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoOwnsMultisecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoOwnsMultisecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
