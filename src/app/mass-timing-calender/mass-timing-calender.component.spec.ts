import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassTimingCalenderComponent } from './mass-timing-calender.component';

describe('MassTimingCalenderComponent', () => {
  let component: MassTimingCalenderComponent;
  let fixture: ComponentFixture<MassTimingCalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassTimingCalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassTimingCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
