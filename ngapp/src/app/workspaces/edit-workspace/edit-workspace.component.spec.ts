import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkspaceComponent } from './edit-workspace.component';

xdescribe('EditWorkspaceComponent', () => {
  let component: EditWorkspaceComponent;
  let fixture: ComponentFixture<EditWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
