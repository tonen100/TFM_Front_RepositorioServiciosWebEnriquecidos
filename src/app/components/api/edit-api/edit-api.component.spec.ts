import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAPIComponent } from './edit-api.component';

describe('EditAPIComponent', () => {
  let component: EditAPIComponent;
  let fixture: ComponentFixture<EditAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
