import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifieldComponent } from './classifield.component';

describe('ClassifieldComponent', () => {
  let component: ClassifieldComponent;
  let fixture: ComponentFixture<ClassifieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
