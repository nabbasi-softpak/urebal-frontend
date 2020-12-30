import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalencesListComponent } from './equivalences-list.component';

xdescribe('EquivalencesListComponent', () => {
  let component: EquivalencesListComponent;
  let fixture: ComponentFixture<EquivalencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalencesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
