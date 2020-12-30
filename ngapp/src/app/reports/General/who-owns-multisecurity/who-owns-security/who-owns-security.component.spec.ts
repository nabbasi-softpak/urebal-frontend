import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoOwnsSecurityComponent } from './who-owns-security.component';

xdescribe('WhoOwnsSecurityComponent', () => {
  let component: WhoOwnsSecurityComponent;
  let fixture: ComponentFixture<WhoOwnsSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoOwnsSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoOwnsSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
