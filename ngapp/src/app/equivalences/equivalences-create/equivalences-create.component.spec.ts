import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalencesCreateComponent } from './equivalences-create.component';

xdescribe('EquivalencesCreateComponent', () => {
  let component: EquivalencesCreateComponent;
  let fixture: ComponentFixture<EquivalencesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalencesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalencesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
