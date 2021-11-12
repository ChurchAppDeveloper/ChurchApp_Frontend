import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassTimingComponent } from './mass-timing.component';

describe('MassTimingComponent', () => {
  let component: MassTimingComponent;
  let fixture: ComponentFixture<MassTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
