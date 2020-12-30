import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureComponent } from './secure.component';

xdescribe('SecureComponent', () => {
  let component: SecureComponent;
  let fixture: ComponentFixture<SecureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
