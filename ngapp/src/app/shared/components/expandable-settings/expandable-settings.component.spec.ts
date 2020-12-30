import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ExpandableSettingsComponent } from './expandable-settings.component';





xdescribe('ExpandableSettingsComponent', () => {
  let component: ExpandableSettingsComponent;
  let fixture: ComponentFixture<ExpandableSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableSettingsComponent ],
      providers: [],
      imports: [BrowserAnimationsModule]


    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});


